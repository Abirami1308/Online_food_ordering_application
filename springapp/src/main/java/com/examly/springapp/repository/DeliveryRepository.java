package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

}
