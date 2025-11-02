package com.inventory.service;

import com.inventory.model.Order;
import com.inventory.model.Product;
import com.inventory.repository.OrderRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Transactional
    public Order create(Order order) {
        if (order.getProduct() == null || order.getProduct().getId() == null) {
            throw new RuntimeException("Product is required");
        }
        Product product = productRepository.findById(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        order.setProduct(product);

        if (order.getOrderNumber() == null) {
            order.setOrderNumber(generateOrderNumber());
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        // Enforce unit price from stock (product price)
        order.setUnitPrice(product.getPrice());
        order.setTotalAmount(order.getUnitPrice().multiply(BigDecimal.valueOf(order.getQuantity())));
        if (order.getStatus() == null) {
            order.setStatus(Order.OrderStatus.PENDING);
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order update(Long id, Order updates) {
        Order order = getById(id);
        if (updates.getQuantity() != null) order.setQuantity(updates.getQuantity());
        if (updates.getExpectedDeliveryDate() != null) order.setExpectedDeliveryDate(updates.getExpectedDeliveryDate());
        if (updates.getActualDeliveryDate() != null) order.setActualDeliveryDate(updates.getActualDeliveryDate());
        if (updates.getNotes() != null) order.setNotes(updates.getNotes());
        if (updates.getStatus() != null) order.setStatus(updates.getStatus());

        // Always reflect current product unit price from stock
        Product product = order.getProduct();
        order.setUnitPrice(product.getPrice());
        order.setTotalAmount(order.getUnitPrice().multiply(BigDecimal.valueOf(order.getQuantity())));
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
        if (status == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryDate(LocalDateTime.now());
            Product product = order.getProduct();
            product.setQuantity(product.getQuantity() + order.getQuantity());
            productRepository.save(product);
        }
        return orderRepository.save(order);
    }

    @Transactional
    public void delete(Long id) {
        Order order = getById(id);
        orderRepository.delete(order);
    }

    private String generateOrderNumber() {
        return "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
}
