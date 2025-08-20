// Custom hooks for expense management using React Query

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../services/expenseService";
import type { ExpenseFormData, GetExpensesParams, ApiError } from "../types";

// Query keys for React Query cache management
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (params?: GetExpensesParams) =>
    [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Hook to get expenses with optional filters and pagination
export const useExpenses = (params?: GetExpensesParams) => {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expenseService.getExpenses(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Hook to get a single expense by ID
export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// Hook to create a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: ExpenseFormData) =>
      expenseService.createExpense(expenseData),
    onSuccess: () => {
      // Invalidate and refetch expense lists to show the new expense
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create expense:", error.message);
    },
  });
};

// Hook to update an existing expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ExpenseFormData>;
    }) => expenseService.updateExpense(id, data),
    onSuccess: (response, variables) => {
      const { id } = variables;

      // Update the specific expense in cache
      queryClient.setQueryData(expenseKeys.detail(id), response);

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update expense:", error.message);
    },
  });
};

// Hook to delete an expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: (_, deletedId) => {
      // Remove the expense from cache
      queryClient.removeQueries({ queryKey: expenseKeys.detail(deletedId) });

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete expense:", error.message);
    },
  });
};
