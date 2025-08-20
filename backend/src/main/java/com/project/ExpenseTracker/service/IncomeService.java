package com.project.ExpenseTracker.service;

import com.project.ExpenseTracker.model.Income;
import com.project.ExpenseTracker.repo.IncomeRepo;
import com.project.ExpenseTracker.specification.IncomeSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepo incomeRepo;

    public List<Income> getFilteredIncome(
            LocalDate startDate,
            LocalDate endDate,
            String source,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String description) {

        // Create specification with all filters
        Specification<Income> spec = IncomeSpecification.withFilters(
                startDate, endDate, source, minAmount, maxAmount, description);

        return incomeRepo.findAll(spec);
    }

    public Optional<Income> getIncomeById(String id) {
        return incomeRepo.findById(id);
    }

    public Income createIncome(Income income) {
        return incomeRepo.save(income);
    }

    public Income updateIncome(String id, Income incomeDetails) {
        Income income = incomeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));

        income.setAmount(incomeDetails.getAmount());
        income.setDate(incomeDetails.getDate());
        income.setSource(incomeDetails.getSource());
        income.setDescription(incomeDetails.getDescription());

        return incomeRepo.save(income);
    }

    public void deleteIncome(String id) {
        Income income = incomeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));

        incomeRepo.delete(income);
    }
}
