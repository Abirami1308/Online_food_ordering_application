package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

}
