// API service configuration and base client

import axios, { type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Generic API methods
export const api = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, config);

    // If the response is already in ApiResponse format, return it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data as ApiResponse<T>;
    }

    // If the response is direct data, wrap it in ApiResponse format
    return {
      data: response.data as T,
      success: true,
    } as ApiResponse<T>;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data, config);

    // If the response is already in ApiResponse format, return it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data as ApiResponse<T>;
    }

    // If the response is direct data, wrap it in ApiResponse format
    return {
      data: response.data as T,
      success: true,
    } as ApiResponse<T>;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data, config);

    // If the response is already in ApiResponse format, return it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data as ApiResponse<T>;
    }

    // If the response is direct data, wrap it in ApiResponse format
    return {
      data: response.data as T,
      success: true,
    } as ApiResponse<T>;
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data, config);

    // If the response is already in ApiResponse format, return it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data as ApiResponse<T>;
    }

    // If the response is direct data, wrap it in ApiResponse format
    return {
      data: response.data as T,
      success: true,
    } as ApiResponse<T>;
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url, config);

    // If the response is already in ApiResponse format, return it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data as ApiResponse<T>;
    }

    // If the response is direct data, wrap it in ApiResponse format
    return {
      data: response.data as T,
      success: true,
    } as ApiResponse<T>;
  },
};
