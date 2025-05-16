import { useState, useCallback } from "react";
// import { useAuth } from "../contexts/AuthContext";
import useAuthStore from "@/stores/auth";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  status: number;
}

const api_base = "https://athena.i-am-jay.com";

export function useApi() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(api_base + "/api/accounts/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  };

  const apiCall = useCallback(
    async <T>(
      url: string,
      method: string,
      body: object | null = null
    ): Promise<ApiResponse<T>> => {
      setIsLoading(true);
      try {
        let accessToken = localStorage.getItem("accessToken");
        const makeRequest = async (
          token: string | null
        ): Promise<ApiResponse<T>> => {
          const response = await fetch(api_base + url, {
            method, // 여기서 전달받은 method를 사용합니다.
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
          });

          if (response.status === 204) {
            return { data: null, error: null, isLoading: false, status: 204 };
          }

          const responseData = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized");
            }
            return {
              data: responseData,
              error: responseData.message || "API request failed",
              isLoading: false,
              status: response.status,
            };
          }

          return {
            data: responseData,
            error: null,
            isLoading: false,
            status: response.status,
          };
        };

        try {
          const result = await makeRequest(accessToken);
          setIsLoading(false);
          return result;
        } catch (error) {
          if (error instanceof Error && error.message === "Unauthorized") {
            // Token might be expired, try to refresh
            try {
              accessToken = await refreshAccessToken();
              const result = await makeRequest(accessToken);
              setIsLoading(false);
              return result;
            } catch (refreshError) {
              if (
                refreshError instanceof Error &&
                refreshError.message === "Failed to refresh token"
              ) {
                logout();
                setIsLoading(false);
                return {
                  data: null,
                  error: "Authentication failed. Please log in again.",
                  isLoading: false,
                  status: 401,
                };
              }
              throw refreshError;
            }
          }
          throw error;
        }
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          return {
            data: null,
            error: error.message,
            isLoading: false,
            status: 500,
          };
        }
        return {
          data: null,
          error: "An unknown error occurred",
          isLoading: false,
          status: 500,
        };
      }
    },
    [logout]
  );

  return { apiCall, isLoading };
}
