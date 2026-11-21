package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.PaymentRepository;
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
public class PaymentService {

    @org.springframework.beans.factory.annotation.Autowired
 private PaymentRepository paymentRepository;

    public Payment savePayment(Payment payment) {
        if (payment != null) {
            payment.setId(null);
        }
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public Payment updatePayment(Long id, Payment updatedPayment) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            return null;
        }
        payment.setOrderId(updatedPayment.getOrderId());
        payment.setAmount(updatedPayment.getAmount());
        payment.setPaymentMode(updatedPayment.getPaymentMode());
        payment.setPaymentStatus(updatedPayment.getPaymentStatus());
        payment.setTransactionId(updatedPayment.getTransactionId());
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
