package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Cart;
import com.examly.springapp.repository.CartRepository;
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
public class CartService {

    @org.springframework.beans.factory.annotation.Autowired
    private CartRepository cartRepository;

    public Cart saveCart(Cart cart) {
        if (cart != null) {
            cart.setId(null);
        }
        return cartRepository.save(cart);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart updateCart(Long id, Cart updatedCart) {
        Cart cart = cartRepository.findById(id).orElse(null);
        if (cart == null) {
            return null;
        }
        cart.setUserId(updatedCart.getUserId());
        cart.setMenuItemId(updatedCart.getMenuItemId());
        cart.setQuantity(updatedCart.getQuantity());
        cart.setSpecialInstructions(updatedCart.getSpecialInstructions());
        return cartRepository.save(cart);
    }

    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }
}
