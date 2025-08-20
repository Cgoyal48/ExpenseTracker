package com.project.ExpenseTracker.specification;

import com.project.ExpenseTracker.model.Income;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class IncomeSpecification {

    public static Specification<Income> withFilters(
            LocalDate startDate,
            LocalDate endDate,
            String source,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String description) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Date range filter
            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate));
            }

            // Source filter (case-insensitive)
            if (source != null && !source.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("source")),
                        "%" + source.toLowerCase() + "%"));
            }

            // Amount range filter
            if (minAmount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }

            if (maxAmount != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }

            // Description filter (case-insensitive contains)
            if (description != null && !description.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        "%" + description.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Income> byDateRange(LocalDate startDate, LocalDate endDate) {
        return withFilters(startDate, endDate, null, null, null, null);
    }

    public static Specification<Income> bySource(String source) {
        return withFilters(null, null, source, null, null, null);
    }

    public static Specification<Income> byAmountRange(BigDecimal minAmount, BigDecimal maxAmount) {
        return withFilters(null, null, null, minAmount, maxAmount, null);
    }

    public static Specification<Income> byDescription(String description) {
        return withFilters(null, null, null, null, null, description);
    }
}
