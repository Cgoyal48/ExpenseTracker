// Category API service

import type { Category, CategoryFormData, ApiResponse } from "../types";
import { api } from "./api";

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return api.get<Category[]>("/categories");
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    return api.get<Category>(`/categories/${id}`);
  },

  // Create new category
  createCategory: async (
    categoryData: CategoryFormData
  ): Promise<ApiResponse<Category>> => {
    return api.post<Category>("/categories", categoryData);
  },

  // Update category
  updateCategory: async (
    id: string,
    categoryData: Partial<CategoryFormData>
  ): Promise<ApiResponse<Category>> => {
    return api.put<Category>(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/categories/${id}`);
  },
};
