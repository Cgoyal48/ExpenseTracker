// Income API service

import type {
  Income,
  IncomeFormData,
  GetIncomeParams,
  ApiResponse,
} from "../types";
import { api } from "./api";

export const incomeService = {
  // Get all income with optional filtering
  getIncome: async (
    params?: GetIncomeParams
  ): Promise<ApiResponse<Income[]>> => {
    return api.get<Income[]>("/income", { params });
  },

  // Get income by ID
  getIncomeById: async (id: string): Promise<ApiResponse<Income>> => {
    return api.get<Income>(`/income/${id}`);
  },

  // Create new income
  createIncome: async (
    incomeData: IncomeFormData
  ): Promise<ApiResponse<Income>> => {
    return api.post<Income>("/income", incomeData);
  },

  // Update income
  updateIncome: async (
    id: string,
    incomeData: Partial<IncomeFormData>
  ): Promise<ApiResponse<Income>> => {
    return api.put<Income>(`/income/${id}`, incomeData);
  },

  // Delete income
  deleteIncome: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/income/${id}`);
  },
};
