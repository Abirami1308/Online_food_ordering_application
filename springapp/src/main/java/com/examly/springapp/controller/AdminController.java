package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Admin;
import com.examly.springapp.service.AdminService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Admins", description = "Admin APIs")
@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Get all admins", description = "Returns all admins from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admins retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @Operation(summary = "Get admin by ID", description = "Returns an admin using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin found"),
            @ApiResponse(responseCode = "404", description = "Admin not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        try {
            Admin admin = adminService.getAdminById(id);
            if (admin == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create an admin", description = "Creates a new admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody(required = false) Admin admin) {
        if (admin == null) {
            return ResponseEntity.badRequest().build();
        }
        Admin savedAdmin = adminService.saveAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @Operation(summary = "Update an admin", description = "Updates an existing admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin updated successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        try {
            Admin updatedAdmin = adminService.updateAdmin(id, admin);
            if (updatedAdmin == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete an admin", description = "Deletes an admin by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        try {
            adminService.deleteAdmin(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
