// Analytics and calculation utilities

import type { Expense, Income, Category, CategoryExpense } from "../types";
import { calculatePercentage } from "./currency";
import { formatMonth } from "./date";

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTotalIncome = (income: Income[]): number => {
  return income.reduce((total, inc) => total + inc.amount, 0);
};

export const calculateBalance = (
  totalIncome: number,
  totalExpenses: number
): number => {
  return totalIncome - totalExpenses;
};

export const calculateExpensesByCategory = (
  expenses: Expense[],
  categories: Category[]
): CategoryExpense[] => {
  const totalExpenses = calculateTotalExpenses(expenses);

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to CategoryExpense objects
  return Object.entries(categoryTotals)
    .map(([categoryId, amount]) => {
      const category = categories.find((cat) => cat.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || "Unknown",
        amount,
        percentage: calculatePercentage(amount, totalExpenses),
        color: category?.color,
      };
    })
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending
};

export const getTopCategories = (
  categoryExpenses: CategoryExpense[],
  limit: number = 5
): CategoryExpense[] => {
  return categoryExpenses.sort((a, b) => b.amount - a.amount).slice(0, limit);
};

export const calculateAverageMonthlyExpenses = (
  expenses: Expense[]
): number => {
  if (expenses.length === 0) return 0;

  // Group expenses by month
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const monthKey = formatMonth(expense.date);
    acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const months = Object.keys(monthlyTotals);
  if (months.length === 0) return 0;

  const totalExpenses = Object.values(monthlyTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );
  return totalExpenses / months.length;
};

export const calculateAverageMonthlyIncome = (income: Income[]): number => {
  if (income.length === 0) return 0;

  // Group income by month
  const monthlyTotals = income.reduce((acc, inc) => {
    const monthKey = formatMonth(inc.date);
    acc[monthKey] = (acc[monthKey] || 0) + inc.amount;
    return acc;
  }, {} as Record<string, number>);

  const months = Object.keys(monthlyTotals);
  if (months.length === 0) return 0;

  const totalIncome = Object.values(monthlyTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );
  return totalIncome / months.length;
};

export const calculateSavingsRate = (
  totalIncome: number,
  totalExpenses: number
): number => {
  if (totalIncome === 0) return 0;
  const savings = totalIncome - totalExpenses;
  return calculatePercentage(savings, totalIncome);
};
