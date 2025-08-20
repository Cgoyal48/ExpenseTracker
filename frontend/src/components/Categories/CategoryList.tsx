// Category list component for displaying and managing categories

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
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
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import type { Category } from "../../types";

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onRefresh?: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onEdit, onRefresh }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { data: categoriesResponse, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesResponse?.data || [];

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    category: Category
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    if (selectedCategory && onEdit) {
      onEdit(selectedCategory);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory.mutateAsync(selectedCategory.id);
        onRefresh?.();
      } catch {
        // Error is already handled by the hook
      }
    }
    handleMenuClose();
  };

  const handleCardClick = (category: Category) => {
    if (onEdit) {
      onEdit(category);
    }
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
      <Alert severity="error">
        Failed to load categories. Please try again.
      </Alert>
    );
  }

  if (categories.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        textAlign="center"
        p={3}
      >
        <CategoryIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No categories found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your first category to organize your expenses
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexWrap="wrap" gap={3}>
        {categories.map((category) => {
          return (
            <Box key={category.id} sx={{ width: 300 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleCardClick(category)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: category.color || "#9E9E9E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </Box>

                    <Tooltip title="More actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, category)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="h6" gutterBottom noWrap>
                    {category.name}
                  </Typography>

                  <Box mt={2}>
                    <Typography variant="caption" color="textSecondary">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

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

        <MenuItem onClick={handleDelete} disabled={deleteCategory.isPending}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default CategoryList;
