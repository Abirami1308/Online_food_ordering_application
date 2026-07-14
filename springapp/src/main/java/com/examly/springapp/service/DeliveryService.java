package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Delivery;
import com.examly.springapp.repository.DeliveryRepository;
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
public class DeliveryService {

    @org.springframework.beans.factory.annotation.Autowired
    private DeliveryRepository deliveryRepository;

    public Delivery saveDelivery(Delivery delivery) {
        if (delivery != null) {
            delivery.setId(null);
        }
        return deliveryRepository.save(delivery);
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id).orElse(null);
    }

    public Delivery updateDelivery(Long id, Delivery updatedDelivery) {
        Delivery delivery = deliveryRepository.findById(id).orElse(null);
        if (delivery == null) {
            return null;
        }
        delivery.setOrderId(updatedDelivery.getOrderId());
        delivery.setDeliveryPartnerName(updatedDelivery.getDeliveryPartnerName());
        delivery.setDeliveryAddress(updatedDelivery.getDeliveryAddress());
        delivery.setDeliveryStatus(updatedDelivery.getDeliveryStatus());
        delivery.setEstimatedTimeMinutes(updatedDelivery.getEstimatedTimeMinutes());
        return deliveryRepository.save(delivery);
    }

    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }
}
