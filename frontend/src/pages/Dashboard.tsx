// Dashboard page component

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
} from "@mui/icons-material";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";
import PieChart from "../components/Charts/PieChart";
import LineChart from "../components/Charts/LineChart";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const { stats, charts, activity, isLoading } = useDashboard();

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Overview of your finances for this month
      </Typography>

      <Box display="flex" gap={3} sx={{ mt: 2 }} flexWrap="wrap">
        <Box sx={{ width: 300 }}>
          <StatCard
            title="Total Income"
            value={formatCurrency(stats.totalIncome)}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="success.main"
            subtitle={`${stats.incomeCount} entries`}
          />
        </Box>

        <Box sx={{ width: 300 }}>
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon={<TrendingDown sx={{ fontSize: 40 }} />}
            color="error.main"
            subtitle={`${stats.expenseCount} entries`}
          />
        </Box>

        <Box sx={{ width: 300 }}>
          <StatCard
            title="Balance"
            value={formatCurrency(stats.balance)}
            icon={<AccountBalance sx={{ fontSize: 40 }} />}
            color={stats.balance >= 0 ? "success.main" : "error.main"}
            subtitle={stats.balance >= 0 ? "Surplus" : "Deficit"}
          />
        </Box>

        <Box sx={{ width: 300 }}>
          <StatCard
            title="Savings Rate"
            value={`${stats.savingsRate.toFixed(1)}%`}
            icon={<Savings sx={{ fontSize: 40 }} />}
            color={
              stats.savingsRate >= 20
                ? "success.main"
                : stats.savingsRate >= 10
                ? "warning.main"
                : "error.main"
            }
            subtitle={`${stats.categoriesCount} categories`}
          />
        </Box>
      </Box>

      <Box display="flex" gap={3} sx={{ mt: 3 }} flexWrap="wrap">
        <Box sx={{ width: 600 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <LineChart
              data={charts.monthlyTrend}
              title="3-Month Trend"
              height={300}
            />
          </Paper>
        </Box>

        <Box sx={{ width: 600 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <PieChart
              data={charts.expensesByCategory}
              title="Expense Categories"
              height={300}
            />
          </Paper>
        </Box>
      </Box>

      <Box display="flex" gap={3} sx={{ mt: 3 }} flexWrap="wrap">
        <Box sx={{ flex: 1, minWidth: 400 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            {activity.recentExpenses.length > 0 ? (
              <List>
                {activity.recentExpenses.map((expense) => (
                  <ListItem key={expense.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={expense.description || "Expense"}
                      secondary={formatDate(expense.date)}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={formatCurrency(expense.amount)}
                        color="error"
                        size="small"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="150px"
                color="textSecondary"
              >
                No recent expenses
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 400 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Income
            </Typography>
            {activity.recentIncome.length > 0 ? (
              <List>
                {activity.recentIncome.map((income) => (
                  <ListItem key={income.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={income.source}
                      secondary={formatDate(income.date)}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={formatCurrency(income.amount)}
                        color="success"
                        size="small"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="150px"
                color="textSecondary"
              >
                No recent income
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
