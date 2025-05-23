import { useState, useCallback } from "react";
import useAuthStore from "@/stores/auth";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  status: number;
}

const api_base = "https://athena-local.i-am-jay.com";

export function useApi() {
  const logout = useAuthStore(s => s.logout);
  const [isLoading, setIsLoading] = useState(false);

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

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized");
            }
            return {
              data: null,
              error: await response.text() || "API request failed",
              isLoading: false,
              status: response.status,
            };
          }

          const responseData = await response.json();

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
            // 바로 logout 실행
            logout();
            setIsLoading(false);
            return {
              data: null,
              error: "Authentication failed. Please log in again.",
              isLoading: false,
              status: 401,
            };
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