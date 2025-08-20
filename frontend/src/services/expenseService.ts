// Expense API service

import type {
  Expense,
  ExpenseFormData,
  GetExpensesParams,
  ApiResponse,
} from "../types";
import { api } from "./api";

export const expenseService = {
  // Get all expenses with optional filtering
  getExpenses: async (
    params?: GetExpensesParams
  ): Promise<ApiResponse<Expense[]>> => {
    return api.get<Expense[]>("/expenses", { params });
  },

  // Get expense by ID
  getExpenseById: async (id: string): Promise<ApiResponse<Expense>> => {
    return api.get<Expense>(`/expenses/${id}`);
  },

  // Create new expense
  createExpense: async (
    expenseData: ExpenseFormData
  ): Promise<ApiResponse<Expense>> => {
    return api.post<Expense>("/expenses", expenseData);
  },

  // Update expense
  updateExpense: async (
    id: string,
    expenseData: Partial<ExpenseFormData>
  ): Promise<ApiResponse<Expense>> => {
    return api.put<Expense>(`/expenses/${id}`, expenseData);
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/expenses/${id}`);
  },
};
