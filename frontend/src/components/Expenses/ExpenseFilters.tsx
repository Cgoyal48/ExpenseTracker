// Expense filters component

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
  Divider,
} from "@mui/material";
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useCategories } from "../../hooks/useCategories";
import type { GetExpensesParams } from "../../types";
import { formatDateForInput, getDatePresets } from "../../utils/date";

interface ExpenseFiltersProps {
  filters: GetExpensesParams;
  onFiltersChange: (filters: GetExpensesParams) => void;
  onClear: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,  
}) => {
  const { data: categoriesResponse } = useCategories();
  const [localFilters, setLocalFilters] = useState<GetExpensesParams>(filters);

  const categories = categoriesResponse?.data || [];
  const datePresets = getDatePresets();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof GetExpensesParams, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: GetExpensesParams = {};
    setLocalFilters(emptyFilters);
    onClear();
  };

  const handleDatePreset = (preset: {
    start: Date;
    end: Date;
    label: string;
  }) => {
    const newFilters = {
      ...localFilters,
      startDate: formatDateForInput(preset.start),
      endDate: formatDateForInput(preset.end),
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getSelectedCategory = () => {
    if (!localFilters.categoryId) return "";
    const category = categories.find(
      (cat) => cat.id === localFilters.categoryId
    );
    return category?.name || "";
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof GetExpensesParams] !== undefined &&
      filters[key as keyof GetExpensesParams] !== ""
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FilterIcon color="primary" />
        <Typography variant="h6">Filters</Typography>
        {hasActiveFilters && (
          <Chip
            label="Active"
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <Box sx={{ width: 250 }}>
          <TextField
            label="Start Date"
            type="date"
            value={localFilters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
        </Box>

        <Box sx={{ width: 250 }}>
          <TextField
            label="End Date"
            type="date"
            value={localFilters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
        </Box>

        <Box sx={{ width: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={localFilters.categoryId || ""}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Date Presets */}
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Quick Date Filters:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {Object.values(datePresets).map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              size="small"
              onClick={() => handleDatePreset(preset)}
              clickable
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear
        </Button>
        <Button variant="contained" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {filters.startDate && (
              <Chip
                label={`From: ${filters.startDate}`}
                size="small"
                onDelete={() => handleFilterChange("startDate", "")}
              />
            )}
            {filters.endDate && (
              <Chip
                label={`To: ${filters.endDate}`}
                size="small"
                onDelete={() => handleFilterChange("endDate", "")}
              />
            )}
            {filters.categoryId && (
              <Chip
                label={`Category: ${getSelectedCategory()}`}
                size="small"
                onDelete={() => handleFilterChange("categoryId", "")}
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ExpenseFilters;
