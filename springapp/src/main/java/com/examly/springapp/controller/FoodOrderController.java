
package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.service.FoodOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class FoodOrderController {

    private final FoodOrderService foodOrderService;

    @GetMapping
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        List<FoodOrder> orders = foodOrderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable Long id) {
        try {
            FoodOrder order = foodOrderService.getOrderById(id);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<FoodOrder> createOrder(@RequestBody FoodOrder order) {

        if (order == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        FoodOrder savedOrder = foodOrderService.saveOrder(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodOrder> updateOrder(@PathVariable Long id,
                                                 @RequestBody FoodOrder order) {
        try {
            FoodOrder updatedOrder = foodOrderService.updateOrder(id, order);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            foodOrderService.deleteOrder(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}