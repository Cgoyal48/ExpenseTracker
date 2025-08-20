// Expense form component for adding/editing expenses

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
} from "@mui/material";
import { useCategories } from "../../hooks/useCategories";
import { useCreateExpense, useUpdateExpense } from "../../hooks/useExpenses";
import type { ExpenseFormData, Expense } from "../../types";
import { formatDateForInput } from "../../utils/date";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null; // For editing
  onSuccess?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  open,
  onClose,
  expense,
  onSuccess,
}) => {
  const isEditing = !!expense;
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: 0,
      date: formatDateForInput(new Date()),
      categoryId: "",
      description: "",
    },
  });

  // Reset form when expense changes or dialog opens
  useEffect(() => {
    if (open) {
      if (expense) {
        reset({
          amount: expense.amount,
          date: formatDateForInput(expense.date),
          categoryId: expense.categoryId,
          description: expense.description || "",
        });
      } else {
        reset({
          amount: 0,
          date: formatDateForInput(new Date()),
          categoryId: "",
          description: "",
        });
      }
    }
  }, [expense, open, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({ id: expense.id, data });
      } else {
        await createExpense.mutateAsync(data);
      }

      onSuccess?.();
      onClose();
    } catch {
      // Error is already handled by the hook
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const categories = categoriesResponse?.data || [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { width: 600 } }}
    >
      <DialogTitle>
        {isEditing ? "Edit Expense" : "Add New Expense"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  type="number"
                  inputProps={{
                    step: "0.01",
                    min: "0",
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  fullWidth
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              )}
            />

            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                    disabled={categoriesLoading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || categoriesLoading}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isEditing ? "Update" : "Add"} Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm;
