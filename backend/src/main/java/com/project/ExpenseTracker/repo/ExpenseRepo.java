package com.project.ExpenseTracker.repo;

import com.project.ExpenseTracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExpenseRepo extends JpaRepository<Expense, String>, JpaSpecificationExecutor<Expense> {
}
