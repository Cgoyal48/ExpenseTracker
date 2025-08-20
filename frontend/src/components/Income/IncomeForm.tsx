// Income form component for adding/editing income

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
import { useCreateIncome, useUpdateIncome } from "../../hooks/useIncome";
import type { IncomeFormData, Income } from "../../types";
import { formatDateForInput } from "../../utils/date";

interface IncomeFormProps {
  open: boolean;
  onClose: () => void;
  income?: Income | null; // For editing
  onSuccess?: () => void;
}

const incomeSourceOptions = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "business", label: "Business" },
  { value: "investment", label: "Investment" },
  { value: "rental", label: "Rental" },
  { value: "gift", label: "Gift" },
  { value: "bonus", label: "Bonus" },
  { value: "refund", label: "Refund" },
  { value: "other", label: "Other" },
];

const IncomeForm: React.FC<IncomeFormProps> = ({
  open,
  onClose,
  income,
  onSuccess,
}) => {
  const isEditing = !!income;
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormData>({
    defaultValues: {
      amount: 0,
      date: formatDateForInput(new Date()),
      source: "",
      description: "",
    },
  });

  // Reset form when income changes or dialog opens
  useEffect(() => {
    if (open) {
      if (income) {
        reset({
          amount: income.amount,
          date: formatDateForInput(income.date),
          source: income.source,
          description: income.description || "",
        });
      } else {
        reset({
          amount: 0,
          date: formatDateForInput(new Date()),
          source: "",
          description: "",
        });
      }
    }
  }, [income, open, reset]);

  const onSubmit = async (data: IncomeFormData) => {
    try {
      if (isEditing && income) {
        await updateIncome.mutateAsync({ id: income.id, data });
      } else {
        await createIncome.mutateAsync(data);
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { width: 600 } }}
    >
      <DialogTitle>{isEditing ? "Edit Income" : "Add New Income"}</DialogTitle>

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
              name="source"
              control={control}
              rules={{ required: "Source is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.source}>
                  <InputLabel>Source</InputLabel>
                  <Select {...field} label="Source">
                    {incomeSourceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.source && (
                    <FormHelperText>{errors.source.message}</FormHelperText>
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
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isEditing ? "Update" : "Add"} Income
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncomeForm;
