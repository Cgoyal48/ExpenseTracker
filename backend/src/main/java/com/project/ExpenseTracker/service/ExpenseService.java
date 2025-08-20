package com.project.ExpenseTracker.service;

import com.project.ExpenseTracker.model.Expense;
import com.project.ExpenseTracker.repo.ExpenseRepo;
import com.project.ExpenseTracker.specification.ExpenseSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepo expenseRepo;

    public List<Expense> getFilteredExpenses(
            LocalDate startDate,
            LocalDate endDate,
            String categoryId,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String description) {

        // Create specification with all filters
        Specification<Expense> spec = ExpenseSpecification.withFilters(
                startDate, endDate, categoryId, minAmount, maxAmount, description);

        return expenseRepo.findAll(spec);
    }

    public Optional<Expense> getExpenseById(String id) {
        return expenseRepo.findById(id);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepo.save(expense);
    }

    public Expense updateExpense(String id, Expense expenseDetails) {
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        expense.setCategoryId(expenseDetails.getCategoryId());
        expense.setDescription(expenseDetails.getDescription());

        return expenseRepo.save(expense);
    }

    public void deleteExpense(String id) {
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        expenseRepo.delete(expense);
    }
}
