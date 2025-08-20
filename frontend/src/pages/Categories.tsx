// Categories page component

import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CategoryForm from "../components/Categories/CategoryForm";
import CategoryList from "../components/Categories/CategoryList";
import type { Category } from "../types";

const Categories: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
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
            Categories
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your expense categories and organize your spending
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
          size="large"
        >
          Add Category
        </Button>
      </Box>

      {/* Category List */}
      <Paper sx={{ p: 3 }}>
        <CategoryList onEdit={handleEditCategory} />
      </Paper>

      {/* Category Form Dialog */}
      <CategoryForm
        open={isFormOpen}
        onClose={handleCloseForm}
        category={editingCategory}
      />
    </Box>
  );
};

export default Categories;
