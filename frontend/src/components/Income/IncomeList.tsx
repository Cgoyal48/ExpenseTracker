// Income list component for displaying and managing income

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
import { useIncome, useDeleteIncome } from "../../hooks/useIncome";
import type { Income, GetIncomeParams } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

interface IncomeListProps {
  filters?: GetIncomeParams;
  onEdit?: (income: Income) => void;
  onRefresh?: () => void;
}

const sourceColorMap: Record<string, string> = {
  salary: "#4CAF50",
  freelance: "#2196F3",
  business: "#FF9800",
  investment: "#9C27B0",
  rental: "#00BCD4",
  gift: "#E91E63",
  bonus: "#8BC34A",
  refund: "#607D8B",
  other: "#9E9E9E",
};

const IncomeList: React.FC<IncomeListProps> = ({
  filters,
  onEdit,
  onRefresh,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const { data: incomeResponse, isLoading, error } = useIncome(filters);
  const deleteIncome = useDeleteIncome();

  const incomeEntries = incomeResponse?.data || [];

  const getSourceColor = (source: string) => {
    return sourceColorMap[source] || sourceColorMap.other;
  };

  const formatSource = (source: string) => {
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    income: Income
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedIncome(income);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIncome(null);
  };

  const handleEdit = () => {
    if (selectedIncome && onEdit) {
      onEdit(selectedIncome);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedIncome) {
      try {
        await deleteIncome.mutateAsync(selectedIncome.id);
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
      <Alert severity="error">Failed to load income. Please try again.</Alert>
    );
  }

  if (incomeEntries.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        textAlign="center"
      >
        <Typography variant="body1" color="textSecondary">
          No income entries found. Add your first income to get started!
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
              <TableCell>Source</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeEntries.map((income) => (
              <TableRow key={income.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(income.date)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="success.main"
                  >
                    {formatCurrency(income.amount)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={formatSource(income.source)}
                    size="small"
                    sx={{
                      backgroundColor: getSourceColor(income.source),
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
                    {income.description || "—"}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="More actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, income)}
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

        <MenuItem onClick={handleDelete} disabled={deleteIncome.isPending}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default IncomeList;
