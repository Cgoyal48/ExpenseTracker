// Core data types for the expense tracker application

export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  amount: number;
  date: Date;
  categoryId: string;
  category?: Category;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  id: string;
  amount: number;
  date: Date;
  source: string; // salary, freelance, gift, etc.
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface ExpenseFormData {
  amount: number;
  date: string; // ISO string for form compatibility
  categoryId: string;
  description?: string;
}

export interface IncomeFormData {
  amount: number;
  date: string;
  source: string;
  description?: string;
}

export interface CategoryFormData {
  name: string;
  color?: string;
}

// Filter types
export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface IncomeFilters {
  startDate?: Date;
  endDate?: Date;
  source?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

// Analytics types
export interface MonthlyAnalytics {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  expensesByCategory: CategoryExpense[];
}

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface YearlyAnalytics {
  year: number;
  months: MonthlyAnalytics[];
  totalExpenses: number;
  totalIncome: number;
  totalBalance: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Removed PaginatedResponse - no longer using pagination

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Query parameter types - simplified without pagination and sorting
export interface GetExpensesParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface GetIncomeParams {
  startDate?: string;
  endDate?: string;
  source?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}
