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
@Table(name = "admins")
@Schema(description = "Represents an administrator user")
public class Admin {
    @Schema(description = "Unique identifier of the admin", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Username of the admin", example = "admin")
    private String username;

    @Schema(description = "Email of the admin", example = "admin@examly.com")
    private String email;

    @Schema(description = "Password of the admin", example = "admin123")
    private String password;

    @Schema(description = "Role of the admin", example = "ADMIN")
    private String role;
}
