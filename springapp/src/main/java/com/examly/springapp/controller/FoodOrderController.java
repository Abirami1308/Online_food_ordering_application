package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.service.FoodOrderService;

@RestController
@RequestMapping("/orders")
public class FoodOrderController {

    private FoodOrderService service;

    @PostMapping
    public ResponseEntity<FoodOrder> addOrder(@RequestBody FoodOrder order) {

        if (order == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(service.saveOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable Long id) {

        FoodOrder order = service.getOrderById(id);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodOrder> updateOrder(@PathVariable Long id,
                                                 @RequestBody FoodOrder order) {

        if (order == null) {
            return ResponseEntity.badRequest().build();
        }

        FoodOrder updatedOrder = service.updateOrder(id, order);

        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {

        service.deleteOrder(id);

        return ResponseEntity.ok().build();
    }
}