package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByRestaurantId(Long restaurantId);
    Optional<Review> findByOrderId(Long orderId);
    boolean existsByOrderId(Long orderId);
}
