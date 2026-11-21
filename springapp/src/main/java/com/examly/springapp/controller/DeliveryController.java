package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Delivery;
import com.examly.springapp.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Deliveries", description = "Delivery APIs")
@RestController
@RequestMapping("/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @Operation(summary = "Get all deliveries", description = "Returns all deliveries from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deliveries retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    @Operation(summary = "Get delivery by ID", description = "Returns a delivery using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Delivery found"),
            @ApiResponse(responseCode = "404", description = "Delivery not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        try {
            Delivery delivery = deliveryService.getDeliveryById(id);
            if (delivery == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(delivery);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a delivery record", description = "Creates a new delivery record")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Delivery created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody(required = false) Delivery delivery) {
        if (delivery == null) {
            return ResponseEntity.badRequest().build();
        }
        Delivery savedDelivery = deliveryService.saveDelivery(delivery);
        return ResponseEntity.ok(savedDelivery);
    }

    @Operation(summary = "Update a delivery record", description = "Updates an existing delivery record")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Delivery updated successfully"),
            @ApiResponse(responseCode = "404", description = "Delivery not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(@PathVariable Long id, @RequestBody Delivery delivery) {
        try {
            Delivery updatedDelivery = deliveryService.updateDelivery(id, delivery);
            if (updatedDelivery == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedDelivery);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a delivery record", description = "Deletes a delivery record by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Delivery deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Delivery not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        try {
            deliveryService.deleteDelivery(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
