package com.examly.springapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.repository.FoodOrderRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Service

public class FoodOrderService {

   
    @org.springframework.beans.factory.annotation.Autowired
    private FoodOrderRepository foodOrderRepository;

    public FoodOrder saveOrder(FoodOrder order) {
        if (order != null) {
            order.setId(null);
        }
        return foodOrderRepository.save(order);
    }

    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    public FoodOrder getOrderById(Long id) {
        return foodOrderRepository.findById(id).orElse(null);
    }

    public FoodOrder updateOrder(Long id, FoodOrder updatedOrder) {

        FoodOrder order = foodOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return null;
        }

        order.setRestaurantName(updatedOrder.getRestaurantName());
        order.setCuisineType(updatedOrder.getCuisineType());
        order.setMenuItemName(updatedOrder.getMenuItemName());
        order.setMenuItemDescription(updatedOrder.getMenuItemDescription());
        order.setMenuItemPrice(updatedOrder.getMenuItemPrice());
        order.setQuantity(updatedOrder.getQuantity());
        order.setOrderStatus(updatedOrder.getOrderStatus());

        return foodOrderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        foodOrderRepository.deleteById(id);
    }
}