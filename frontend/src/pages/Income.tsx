// Income page component

import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import IncomeForm from "../components/Income/IncomeForm";
import IncomeList from "../components/Income/IncomeList";
import type { Income, GetIncomeParams } from "../types";

const IncomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [filters] = useState<GetIncomeParams>({});

  const handleAddIncome = () => {
    setEditingIncome(null);
    setIsFormOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIncome(null);
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
            Income
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your income sources and earnings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddIncome}
          size="large"
        >
          Add Income
        </Button>
      </Box>

      {/* Income List */}
      <Paper>
        <IncomeList filters={filters} onEdit={handleEditIncome} />
      </Paper>

      {/* Income Form Dialog */}
      <IncomeForm
        open={isFormOpen}
        onClose={handleCloseForm}
        income={editingIncome}
      />
    </Box>
  );
};

export default IncomePage;
