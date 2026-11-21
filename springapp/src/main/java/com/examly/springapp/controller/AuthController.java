package com.examly.springapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.LoginResponse;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.exception.UserAlreadyExistsException;

import com.examly.springapp.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "Authentication APIs")
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Operation(summary = "Register a new user", description = "Registers a new user and returns a token")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role("CUSTOMER") // Public registration always defaults to CUSTOMER
                .build();

        userRepository.save(user);

        org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().toUpperCase())
                .build();

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .restaurantId(user.getRestaurantId())
                .message("User registered successfully")
                .build());
    }

    @io.swagger.v3.oas.annotations.Hidden
    @PostMapping("/api/register")
    public ResponseEntity<AuthResponse> registerApi(@RequestBody RegisterRequest request) {
        return register(request);
    }

    @Operation(summary = "Login user", description = "Authenticates a user and returns a JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().toUpperCase())
                .build();

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .restaurantId(user.getRestaurantId())
                .build());
    }

    @io.swagger.v3.oas.annotations.Hidden
    @PostMapping("/api/login")
    public ResponseEntity<?> loginApi(@RequestBody LoginRequest request) {
        return login(request);
    }
}
