// Date formatting and manipulation utilities using date-fns

import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subYears,
} from "date-fns";

// Format dates for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd");
};

export const formatMonth = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM yyyy");
};

// Date range utilities
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

export const getLastMonthRange = () => {
  const lastMonth = subMonths(new Date(), 1);
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
  };
};

export const getCurrentYearRange = () => {
  const now = new Date();
  return {
    start: startOfYear(now),
    end: endOfYear(now),
  };
};

export const getLastYearRange = () => {
  const lastYear = subYears(new Date(), 1);
  return {
    start: startOfYear(lastYear),
    end: endOfYear(lastYear),
  };
};

// Common date presets for filters
export const getDatePresets = () => {
  const now = new Date();

  return {
    today: {
      start: now,
      end: now,
      label: "Today",
    },
    thisMonth: {
      ...getCurrentMonthRange(),
      label: "This Month",
    },
    lastMonth: {
      ...getLastMonthRange(),
      label: "Last Month",
    },
    thisYear: {
      ...getCurrentYearRange(),
      label: "This Year",
    },
    lastYear: {
      ...getLastYearRange(),
      label: "Last Year",
    },
  };
};
