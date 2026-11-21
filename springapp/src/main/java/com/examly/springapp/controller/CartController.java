package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Cart;
import com.examly.springapp.model.User;
import com.examly.springapp.service.CartService;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Carts", description = "Cart APIs")
@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    private User getAuthenticatedUser() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    @Operation(summary = "Get all cart items", description = "Returns all cart items for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Carts retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<Cart>> getAllCarts() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Cart> carts = cartRepository.findByUserId(user.getId());
        return ResponseEntity.ok(carts);
    }

    @Operation(summary = "Get cart item by ID", description = "Returns a cart item using its ID if it belongs to the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart item found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Cart cart = cartService.getCartById(id);
            if (cart == null) {
                return ResponseEntity.notFound().build();
            }
            if (!cart.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a cart item", description = "Creates a new cart item or updates quantity if it already exists")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart created successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestBody(required = false) Cart cart) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        if (cart == null) {
            return ResponseEntity.badRequest().build();
        }
        
        cart.setUserId(user.getId());
        
        java.util.Optional<Cart> existing = cartRepository.findByUserIdAndMenuItemId(user.getId(), cart.getMenuItemId());
        if (existing.isPresent()) {
            Cart ec = existing.get();
            ec.setQuantity(ec.getQuantity() + cart.getQuantity());
            Cart saved = cartRepository.save(ec);
            return ResponseEntity.ok(saved);
        }

        Cart savedCart = cartService.saveCart(cart);
        return ResponseEntity.ok(savedCart);
    }

    @Operation(summary = "Update a cart item", description = "Updates quantity of an existing cart item owned by the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long id, @RequestBody Cart cart) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Cart existing = cartService.getCartById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            cart.setUserId(user.getId());
            Cart updatedCart = cartService.updateCart(id, cart);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a cart item", description = "Deletes a cart item by ID if owned by the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Cart existing = cartService.getCartById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            cartService.deleteCart(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
