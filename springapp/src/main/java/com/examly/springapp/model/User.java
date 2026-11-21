package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
@Schema(description = "Represents a user in the system")
public class User {
    @Schema(description = "Unique identifier of the user", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Username of the user", example = "john_doe")
    private String username;

    @Schema(description = "Email of the user", example = "john@example.com")
    private String email;

    @Schema(description = "Password of the user", example = "password123")
    private String password;

    @Schema(description = "Phone number of the user", example = "1234567890")
    private String phoneNumber;

    @Schema(description = "Address of the user", example = "123 Main St")
    private String address;

    @Schema(description = "Role of the user", example = "CUSTOMER")
    private String role;

    @Schema(description = "Associated restaurant ID for RESTAURANT role users", example = "1")
    private Long restaurantId;
}
