package com.inventory.controller;

import com.inventory.model.Order;
import com.inventory.service.OrderService;
<<<<<<< HEAD
=======
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
>>>>>>> backend
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class OrderController {

    private final OrderService orderService;
<<<<<<< HEAD
=======
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
>>>>>>> backend

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
<<<<<<< HEAD
    public List<Order> getAll() {
        return orderService.getAll();
    }
=======
    public List<Order> getAll(@RequestParam(required = false) String type) {
        if (type != null && "CUSTOMER".equalsIgnoreCase(type)) {
            return orderService.getCustomerOrders();
        } else if (type != null && "SUPPLIER".equalsIgnoreCase(type)) {
            return orderService.getSupplierOrders();
        }
        return orderService.getAll();
    }
    
    @GetMapping("/customer-orders")
    public List<Order> getCustomerOrders() {
        return orderService.getCustomerOrders();
    }
    
    @GetMapping("/customer-orders/pending")
    public List<Order> getPendingCustomerOrders() {
        return orderService.getPendingCustomerOrders();
    }
>>>>>>> backend

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
<<<<<<< HEAD
        Order created = orderService.create(order);
=======
        logger.debug("Create order request: productId={}, quantity={}, supplierId={}",
                order.getProduct() != null ? order.getProduct().getId() : null,
                order.getQuantity(),
                order.getSupplier() != null ? order.getSupplier().getId() : null);
        Order created = orderService.create(order);
        logger.debug("Order created with id={}", created != null ? created.getId() : null);
>>>>>>> backend
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @RequestBody Order order) {
        return orderService.update(id, order);
    }

    @PatchMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order.OrderStatus s = Order.OrderStatus.valueOf(status.toUpperCase());
        return orderService.updateStatus(id, s);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
