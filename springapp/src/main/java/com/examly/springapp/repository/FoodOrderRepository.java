package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.FoodOrder;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {

}