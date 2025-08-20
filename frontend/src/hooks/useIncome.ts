// Custom hooks for income management using React Query

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { incomeService } from "../services/incomeService";
import type { IncomeFormData, GetIncomeParams, ApiError } from "../types";

// Query keys for React Query cache management
export const incomeKeys = {
  all: ["income"] as const,
  lists: () => [...incomeKeys.all, "list"] as const,
  list: (params?: GetIncomeParams) => [...incomeKeys.lists(), params] as const,
  details: () => [...incomeKeys.all, "detail"] as const,
  detail: (id: string) => [...incomeKeys.details(), id] as const,
};

// Hook to get income with optional filters and pagination
export const useIncome = (params?: GetIncomeParams) => {
  return useQuery({
    queryKey: incomeKeys.list(params),
    queryFn: () => incomeService.getIncome(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Hook to get a single income entry by ID
export const useIncomeById = (id: string) => {
  return useQuery({
    queryKey: incomeKeys.detail(id),
    queryFn: () => incomeService.getIncomeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// Hook to create a new income entry
export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incomeData: IncomeFormData) =>
      incomeService.createIncome(incomeData),
    onSuccess: () => {
      // Invalidate and refetch income lists to show the new entry
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create income:", error.message);
    },
  });
};

// Hook to update an existing income entry
export const useUpdateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomeFormData> }) =>
      incomeService.updateIncome(id, data),
    onSuccess: (response, variables) => {
      const { id } = variables;

      // Update the specific income in cache
      queryClient.setQueryData(incomeKeys.detail(id), response);

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update income:", error.message);
    },
  });
};

// Hook to delete an income entry
export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incomeService.deleteIncome(id),
    onSuccess: (_, deletedId) => {
      // Remove the income from cache
      queryClient.removeQueries({ queryKey: incomeKeys.detail(deletedId) });

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete income:", error.message);
    },
  });
};
