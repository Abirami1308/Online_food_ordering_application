package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Restaurants", description = "Restaurant APIs")
@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final com.examly.springapp.repository.UserRepository userRepository;

    private com.examly.springapp.model.User getAuthenticatedUser() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    private boolean isAuthorized(Long targetRestaurantId) {
        com.examly.springapp.model.User user = getAuthenticatedUser();
        if (user == null) return false;
        String role = user.getRole();
        if ("ADMIN".equalsIgnoreCase(role)) {
            return true;
        }
        if ("RESTAURANT".equalsIgnoreCase(role)) {
            return targetRestaurantId != null && targetRestaurantId.equals(user.getRestaurantId());
        }
        return false;
    }

    @Operation(summary = "Get all restaurants", description = "Returns all restaurants from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurants retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @Operation(summary = "Get restaurant by ID", description = "Returns a restaurant using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant found"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(restaurant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a restaurant", description = "Creates a new restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody(required = false) Restaurant restaurant) {
        com.examly.springapp.model.User user = getAuthenticatedUser();
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Only admin can create a restaurant.");
        }
        if (restaurant == null) {
            return ResponseEntity.badRequest().build();
        }
        Restaurant savedRestaurant = restaurantService.saveRestaurant(restaurant);
        return ResponseEntity.ok(savedRestaurant);
    }

    @Operation(summary = "Update a restaurant", description = "Updates an existing restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant updated successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurant) {
        if (!isAuthorized(id)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access denied to modify this restaurant.");
        }
        try {
            Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurant);
            if (updatedRestaurant == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedRestaurant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a restaurant", description = "Deletes a restaurant by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) {
        com.examly.springapp.model.User user = getAuthenticatedUser();
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Only admin can delete a restaurant.");
        }
        try {
            restaurantService.deleteRestaurant(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
