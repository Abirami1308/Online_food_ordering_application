package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Review;
import com.examly.springapp.model.User;
import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.service.ReviewService;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.FoodOrderRepository;
import com.examly.springapp.repository.ReviewRepository;
import com.examly.springapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Reviews", description = "Review APIs")
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final FoodOrderRepository foodOrderRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    private User getAuthenticatedUser() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    @Operation(summary = "Get all reviews", description = "Returns reviews submitted by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Review> reviews;
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "";
        if ("ADMIN".equals(role)) {
            reviews = reviewService.getAllReviews();
        } else if ("RESTAURANT".equals(role)) {
            if (user.getRestaurantId() == null) {
                reviews = java.util.Collections.emptyList();
            } else {
                reviews = reviewRepository.findByRestaurantId(user.getRestaurantId());
            }
        } else {
            reviews = reviewRepository.findByUserId(user.getId());
        }
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get review by ID", description = "Returns a review using its ID if owned by the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }
            if (!review.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get reviews by restaurant ID", description = "Returns all public reviews for a restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    })
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getReviewsByRestaurantId(@PathVariable Long restaurantId) {
        User user = getAuthenticatedUser();
        if (user != null && "RESTAURANT".equalsIgnoreCase(user.getRole())) {
            if (user.getRestaurantId() == null || !user.getRestaurantId().equals(restaurantId)) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }
        }
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get review status for an order", description = "Checks if a review has already been submitted for an order")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Review> getReviewByOrderId(@PathVariable Long orderId) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        java.util.Optional<Review> existing = reviewRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a review", description = "Creates a new review associated with a delivered order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body or validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Order ownership check failed"),
            @ApiResponse(responseCode = "409", description = "Review already exists for this order")
    })
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody(required = false) Review review) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        if (review == null || review.getOrderId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Validate rating range
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().build();
        }

        // Validate comment
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        review.setComment(review.getComment().trim());

        // Find the associated FoodOrder
        FoodOrder order = foodOrderRepository.findById(review.getOrderId()).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        // Validate order ownership
        if (order.getUserId() == null || !order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden: You do not own this order
        }

        // Validate order status is Delivered or Completed
        String status = order.getOrderStatus();
        if (status == null || (!status.equalsIgnoreCase("Delivered") && !status.equalsIgnoreCase("Completed"))) {
            return ResponseEntity.badRequest().build(); // Order is not delivered yet
        }

        // Check if review already exists for this order
        if (reviewRepository.existsByOrderId(review.getOrderId())) {
            return ResponseEntity.status(409).build(); // Conflict: already reviewed
        }

        // Resolve restaurant ID from restaurant name
        Restaurant restaurant = restaurantRepository.findByName(order.getRestaurantName()).orElse(null);
        if (restaurant == null && order.getRestaurantName() != null) {
            String nameToMatch = order.getRestaurantName().trim();
            restaurant = restaurantRepository.findAll().stream()
                .filter(r -> r.getName() != null && r.getName().trim().equalsIgnoreCase(nameToMatch))
                .findFirst()
                .orElse(null);
        }
        if (restaurant != null) {
            review.setRestaurantId(restaurant.getId());
        }

        // Set system properties
        review.setUserId(user.getId());
        review.setReviewDate(java.time.LocalDateTime.now());

        Review savedReview = reviewService.saveReview(review);
        return ResponseEntity.ok(savedReview);
    }

    @Operation(summary = "Update a review", description = "Updates an existing review owned by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        if (review == null || review.getRating() == null || review.getRating() < 1 || review.getRating() > 5 || review.getComment() == null || review.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Review existing = reviewService.getReviewById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            review.setUserId(user.getId());
            review.setOrderId(existing.getOrderId());
            review.setRestaurantId(existing.getRestaurantId());
            review.setReviewDate(java.time.LocalDateTime.now());
            Review updatedReview = reviewService.updateReview(id, review);
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a review", description = "Deletes a review by ID if owned by the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Review existing = reviewService.getReviewById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            reviewService.deleteReview(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
