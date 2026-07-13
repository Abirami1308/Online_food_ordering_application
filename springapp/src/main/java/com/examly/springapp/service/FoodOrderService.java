package com.examly.springapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.repository.FoodOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodOrderService {

    private FoodOrderRepository foodOrderRepository;

    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    public FoodOrder getOrderById(Long id) {
        return foodOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order with ID " + id + " not found."));
    }

    public FoodOrder saveOrder(FoodOrder order) {
        return foodOrderRepository.save(order);
    }

    public FoodOrder updateOrder(Long id, FoodOrder request) {
        FoodOrder order = foodOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order with ID " + id + " not found."));

        order.setRestaurantName(request.getRestaurantName());
        order.setCuisineType(request.getCuisineType());
        order.setMenuItemName(request.getMenuItemName());
        order.setMenuItemDescription(request.getMenuItemDescription());
        order.setMenuItemPrice(request.getMenuItemPrice());
        order.setQuantity(request.getQuantity());
        order.setOrderStatus(request.getOrderStatus());

        return foodOrderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        if (!foodOrderRepository.existsById(id)) {
            throw new RuntimeException("Order with ID " + id + " not found.");
        }
        foodOrderRepository.deleteById(id);
    }
}