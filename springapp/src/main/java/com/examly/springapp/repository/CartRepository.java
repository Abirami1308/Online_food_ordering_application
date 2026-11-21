package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Cart;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    Optional<Cart> findByUserIdAndMenuItemId(Long userId, Long menuItemId);
}
