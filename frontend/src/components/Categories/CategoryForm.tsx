// Category form component for adding/editing categories

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import type { CategoryFormData, Category } from "../../types";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null; // For editing
  onSuccess?: () => void;
}

const predefinedColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#82E0AA",
  "#F8C471",
  "#EC7063",
  "#AF7AC5",
  "#5DADE2",
  "#58D68D",
  "#F5B041",
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  category,
  onSuccess,
}) => {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      color: predefinedColors[0],
    },
  });

  const selectedColor = watch("color");

  // Reset form when category changes or dialog opens
  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          color: category.color || predefinedColors[0],
        });
      } else {
        reset({
          name: "",
          color: predefinedColors[0],
        });
      }
    }
  }, [category, open, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
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
      sx={{ "& .MuiDialog-paper": { width: 800 } }}
    >
      <DialogTitle>
        {isEditing ? "Edit Category" : "Add New Category"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Category name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be less than 50 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  autoFocus
                />
              )}
            />

            {/* Color Selection */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Choose Color
              </Typography>
              <Grid container spacing={1}>
                {predefinedColors.map((color) => (
                  <Grid key={color}>
                    <Paper
                      elevation={selectedColor === color ? 3 : 1}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: color,
                        cursor: "pointer",
                        border:
                          selectedColor === color
                            ? "3px solid #1976d2"
                            : "none",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s",
                      }}
                      onClick={() => setValue("color", color)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Custom Color Input */}
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Custom Color (Hex)"
                    size="small"
                    sx={{ mt: 2, maxWidth: 200 }}
                    inputProps={{ pattern: "^#[0-9A-Fa-f]{6}$" }}
                    helperText="Enter hex color code (e.g., #FF6B6B)"
                  />
                )}
              />
            </Box>

            {/* Preview */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Preview
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  maxWidth: 300,
                  backgroundColor: selectedColor,
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {(watch("name") || "C").charAt(0).toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {watch("name") || "Category Name"}
                </Typography>
              </Paper>
            </Box>
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
            {isEditing ? "Update" : "Create"} Category
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
