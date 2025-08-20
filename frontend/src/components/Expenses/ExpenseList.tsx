// Expense list component for displaying and managing expenses

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useExpenses, useDeleteExpense } from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";
import type { Expense, GetExpensesParams } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

interface ExpenseListProps {
  filters?: GetExpensesParams;
  onEdit?: (expense: Expense) => void;
  onRefresh?: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  filters,
  onEdit,
  onRefresh,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const { data: expensesResponse, isLoading, error } = useExpenses(filters);
  const { data: categoriesResponse } = useCategories();
  const deleteExpense = useDeleteExpense();

  const expenses = expensesResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || "#9E9E9E";
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    expense: Expense
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const handleEdit = () => {
    if (selectedExpense && onEdit) {
      onEdit(selectedExpense);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedExpense) {
      try {
        await deleteExpense.mutateAsync(selectedExpense.id);
        onRefresh?.();
      } catch {
        // Error is already handled by the hook
      }
    }
    handleMenuClose();
  };

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

  if (error) {
    return (
      <Alert severity="error">Failed to load expenses. Please try again.</Alert>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        textAlign="center"
      >
        <Typography variant="body1" color="textSecondary">
          No expenses found. Add your first expense to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(expense.date)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(expense.amount)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={getCategoryName(expense.categoryId)}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(expense.categoryId),
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {expense.description || "—"}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="More actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, expense)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete} disabled={deleteExpense.isPending}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExpenseList;
