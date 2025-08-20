package com.project.ExpenseTracker.repo;

import com.project.ExpenseTracker.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IncomeRepo extends JpaRepository<Income, String>, JpaSpecificationExecutor<Income> {

}
