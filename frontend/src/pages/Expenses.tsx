// Expenses page component

import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseList from "../components/Expenses/ExpenseList";
import ExpenseFilters from "../components/Expenses/ExpenseFilters";
import type { Expense, GetExpensesParams } from "../types";

const Expenses: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<GetExpensesParams>({});

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleFiltersChange = (newFilters: GetExpensesParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Expenses
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your expenses and track your spending
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
          size="large"
        >
          Add Expense
        </Button>
      </Box>

      {/* Filters */}
      <ExpenseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {/* Expense List */}
      <Paper>
        <ExpenseList filters={filters} onEdit={handleEditExpense} />
      </Paper>

      {/* Expense Form Dialog */}
      <ExpenseForm
        open={isFormOpen}
        onClose={handleCloseForm}
        expense={editingExpense}
      />
    </Box>
  );
};

export default Expenses;
