// Custom hooks for category management using React Query

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import type { CategoryFormData, ApiError } from "../types";
import { expenseKeys } from "./useExpenses";

// Query keys for React Query cache management
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    retry: 2,
  });
};

// Hook to get a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

// Hook to create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CategoryFormData) =>
      categoryService.createCategory(categoryData),
    onSuccess: () => {
      // Invalidate and refetch category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create category:", error.message);
    },
  });
};

// Hook to update an existing category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CategoryFormData>;
    }) => categoryService.updateCategory(id, data),
    onSuccess: (response, variables) => {
      const { id } = variables;

      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), response);

      // Since category names/colors might be used in expenses, invalidate expense lists
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update category:", error.message);
    },
  });
};

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });

      // Invalidate expense lists since they might reference this category
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete category:", error.message);
    },
  });
};
