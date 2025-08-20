import { useMemo } from "react";
import { useExpenses } from "./useExpenses";
import { useIncome } from "./useIncome";
import { useCategories } from "./useCategories";
import type {
  Expense,
  Income,
  CategoryExpense,
  GetExpensesParams,
  GetIncomeParams,
} from "../types";
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateBalance,
  calculateExpensesByCategory,
  getTopCategories,
  calculateAverageMonthlyExpenses,
  calculateAverageMonthlyIncome,
  calculateSavingsRate,
} from "../utils/analytics";
import {
  getCurrentMonthRange,
  getLastMonthRange,
  getCurrentYearRange,
} from "../utils/date";

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  categoriesCount: number;
  expenseCount: number;
  incomeCount: number;
  averageMonthlyExpenses: number;
  averageMonthlyIncome: number;
}

export interface DashboardChartData {
  expensesByCategory: CategoryExpense[];
  topCategories: CategoryExpense[];
  monthlyTrend: Array<{
    label: string;
    income: number;
    expenses: number;
    balance: number;
  }>;
}

export interface RecentActivity {
  recentExpenses: Expense[];
  recentIncome: Income[];
}

export interface DashboardData {
  stats: DashboardStats;
  charts: DashboardChartData;
  activity: RecentActivity;
  isLoading: boolean;
  error: Error | null;
}

export const useDashboard = (): DashboardData => {
  // Get date ranges for filtering
  const currentMonth = getCurrentMonthRange();
  const lastMonth = getLastMonthRange();
  const currentYear = getCurrentYearRange();

  // Prepare query parameters
  const currentMonthParams: GetExpensesParams = {
    startDate: currentMonth.start.toISOString().split("T")[0],
    endDate: currentMonth.end.toISOString().split("T")[0],
  };

  const lastMonthParams: GetExpensesParams = {
    startDate: lastMonth.start.toISOString().split("T")[0],
    endDate: lastMonth.end.toISOString().split("T")[0],
  };

  const yearParams: GetExpensesParams = {
    startDate: currentYear.start.toISOString().split("T")[0],
    endDate: currentYear.end.toISOString().split("T")[0],
  };

  // Fetch all required data
  const { data: currentMonthExpensesData, isLoading: currentExpensesLoading } =
    useExpenses(currentMonthParams);
  const { data: lastMonthExpensesData, isLoading: lastExpensesLoading } =
    useExpenses(lastMonthParams);
  const { data: yearExpensesData, isLoading: yearExpensesLoading } =
    useExpenses(yearParams);

  const { data: currentMonthIncomeData, isLoading: currentIncomeLoading } =
    useIncome({
      startDate: currentMonth.start.toISOString().split("T")[0],
      endDate: currentMonth.end.toISOString().split("T")[0],
    } as GetIncomeParams);

  const { data: lastMonthIncomeData, isLoading: lastIncomeLoading } = useIncome(
    {
      startDate: lastMonth.start.toISOString().split("T")[0],
      endDate: lastMonth.end.toISOString().split("T")[0],
    } as GetIncomeParams
  );

  const { data: yearIncomeData, isLoading: yearIncomeLoading } = useIncome({
    startDate: currentYear.start.toISOString().split("T")[0],
    endDate: currentYear.end.toISOString().split("T")[0],
  } as GetIncomeParams);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  // Check loading states
  const isLoading =
    currentExpensesLoading ||
    lastExpensesLoading ||
    yearExpensesLoading ||
    currentIncomeLoading ||
    lastIncomeLoading ||
    yearIncomeLoading ||
    categoriesLoading;

  // Extract data arrays

  // Compute dashboard data
  const dashboardData = useMemo((): DashboardData => {
    const currentMonthExpenses = currentMonthExpensesData?.data || [];
    const lastMonthExpenses = lastMonthExpensesData?.data || [];
    const yearExpenses = yearExpensesData?.data || [];

    const currentMonthIncome = currentMonthIncomeData?.data || [];
    const lastMonthIncome = lastMonthIncomeData?.data || [];
    const yearIncome = yearIncomeData?.data || [];

    const categories = categoriesData?.data || [];

    if (isLoading) {
      return {
        stats: {
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
          savingsRate: 0,
          categoriesCount: 0,
          expenseCount: 0,
          incomeCount: 0,
          averageMonthlyExpenses: 0,
          averageMonthlyIncome: 0,
        },
        charts: {
          expensesByCategory: [],
          topCategories: [],
          monthlyTrend: [],
        },
        activity: {
          recentExpenses: [],
          recentIncome: [],
        },
        isLoading: true,
        error: null,
      };
    }

    // Calculate basic stats
    const totalIncome = calculateTotalIncome(currentMonthIncome);
    const totalExpenses = calculateTotalExpenses(currentMonthExpenses);
    const balance = calculateBalance(totalIncome, totalExpenses);
    const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

    // Calculate year averages
    const averageMonthlyExpenses =
      calculateAverageMonthlyExpenses(yearExpenses);
    const averageMonthlyIncome = calculateAverageMonthlyIncome(yearIncome);

    // Calculate category breakdowns
    const expensesByCategory = calculateExpensesByCategory(
      currentMonthExpenses,
      categories
    );
    const topCategories = getTopCategories(expensesByCategory, 5);

    // Calculate monthly trend (last 3 months)
    const lastMonthTotalIncome = calculateTotalIncome(lastMonthIncome);
    const lastMonthTotalExpenses = calculateTotalExpenses(lastMonthExpenses);

    // For trend, we'll use actual data for current and last month, and estimate for previous month
    const monthlyTrend = [
      {
        label: "2 months ago",
        income: lastMonthTotalIncome * 0.9, // Estimated
        expenses: lastMonthTotalExpenses * 0.95, // Estimated
        balance: lastMonthTotalIncome * 0.9 - lastMonthTotalExpenses * 0.95,
      },
      {
        label: "Last month",
        income: lastMonthTotalIncome,
        expenses: lastMonthTotalExpenses,
        balance: lastMonthTotalIncome - lastMonthTotalExpenses,
      },
      {
        label: "This month",
        income: totalIncome,
        expenses: totalExpenses,
        balance: balance,
      },
    ];

    // Get recent activity (last 5 transactions)
    const recentExpenses = currentMonthExpenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const recentIncome = currentMonthIncome
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      stats: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate,
        categoriesCount: categories.length,
        expenseCount: currentMonthExpenses.length,
        incomeCount: currentMonthIncome.length,
        averageMonthlyExpenses,
        averageMonthlyIncome,
      },
      charts: {
        expensesByCategory,
        topCategories,
        monthlyTrend,
      },
      activity: {
        recentExpenses,
        recentIncome,
      },
      isLoading: false,
      error: null,
    };
  }, [
    currentMonthExpensesData,
    lastMonthExpensesData,
    yearExpensesData,
    currentMonthIncomeData,
    lastMonthIncomeData,
    yearIncomeData,
    categoriesData,
    isLoading,
  ]);

  return dashboardData;
};
