package com.project.ExpenseTracker.repo;

import com.project.ExpenseTracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;;

public interface CategoryRepo extends JpaRepository<Category, String> {
}
