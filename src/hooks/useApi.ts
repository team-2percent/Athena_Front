import { useState, useCallback } from "react";
import useAuthStore from "@/stores/auth";
import axios from '@/lib/customAxios';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  status: number;
}

type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

const getResponse = {
  "GET": async (url: string) => {
    return await axios.get(url);
  },
  "POST": async (url: string, body: object | null) => {
    return await axios.post(url, body);
  },
  "PUT": async (url: string, body: object | null) => {
    return await axios.put(url, body);
  },
  "DELETE": async (url: string) => {
    return await axios.delete(url);
  },
  "PATCH": async (url: string, body: object | null) => {
    return await axios.patch(url, body)
  }
}

export function useApi() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // refreshToken 관련 로직. 구현, 수정 후 주석 풀어주세요. 
  // const refreshAccessToken = async () => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   if (!refreshToken) {
  //     throw new Error("No refresh token available");
  //   }

  //   const response = await fetch(api_base + "/api/accounts/token/refresh/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ refresh: refreshToken }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to refresh token");
  //   }

  //   const data = await response.json();
  //   localStorage.setItem("accessToken", data.access);
  //   return data.access;
  // };

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
          // const response = await fetch(api_base + url, {
          //   method, // 여기서 전달받은 method를 사용합니다.
          //   headers: {
          //     "Content-Type": "application/json",
          //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
          //   },
          //   ...(body ? { body: JSON.stringify(body) } : {}),
          // });

          try {
            const response = await getResponse[method as MethodType](url, body);

            if (response.status === 204) {
              return { data: null, error: null, isLoading: false, status: 204 };
            }

            return {
              data: response.data,
              error: null,
              isLoading: false,
              status: response.status,
            };
          } catch (err: any) {
            if (err.response) {
              if (err.response.status === 401) {
                throw new Error("Unauthorized");
              }
  
              return {
                data: null,
                error: err.response.data.message || "API request failed",
                isLoading: false,
                status: err.response.status,
              };
            }
            throw err;
          }
        };

        try {
          const result = await makeRequest(accessToken);
          setIsLoading(false);
          return result;
        } catch (error) {
          // refresh 관련 로직, 추후 수정 및 주석 해제 해주세요.
          // if (error instanceof Error && error.message === "Unauthorized") {
          //   // Token might be expired, try to refresh
          //   try {
          //     accessToken = await refreshAccessToken();
          //     const result = await makeRequest(accessToken);
          //     setIsLoading(false);
          //     return result;
          //   } catch (refreshError) {
          //     if (
          //       refreshError instanceof Error &&
          //       refreshError.message === "Failed to refresh token"
          //     ) {
          //       logout();
          //       setIsLoading(false);
          //       return {
          //         data: null,
          //         error: "Authentication failed. Please log in again.",
          //         isLoading: false,
          //         status: 401,
          //       };
          //     }
          //     throw refreshError;
          //   }
          // }
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
