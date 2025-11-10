package com.inventory.service;

import com.inventory.model.Order;
import com.inventory.model.Product;
import com.inventory.repository.OrderRepository;
import com.inventory.repository.ProductRepository;
<<<<<<< HEAD
=======
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
>>>>>>> backend
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
<<<<<<< HEAD
=======
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
>>>>>>> backend

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }
<<<<<<< HEAD
=======
    
    public List<Order> getCustomerOrders() {
        return orderRepository.findByOrderTypeOrderByOrderDateDesc("CUSTOMER_ORDER");
    }
    
    public List<Order> getPendingCustomerOrders() {
        return orderRepository.findByOrderTypeAndStatus("CUSTOMER_ORDER", Order.OrderStatus.PENDING);
    }
    
    public List<Order> getSupplierOrders() {
        return orderRepository.findByOrderTypeOrderByOrderDateDesc("SUPPLIER_ORDER");
    }
>>>>>>> backend

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Transactional
    public Order create(Order order) {
<<<<<<< HEAD
=======
    logger.debug("OrderService.create() called with productId={}, quantity={}",
        order.getProduct() != null ? order.getProduct().getId() : null,
        order.getQuantity());
>>>>>>> backend
        if (order.getProduct() == null || order.getProduct().getId() == null) {
            throw new RuntimeException("Product is required");
        }
        Product product = productRepository.findById(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        order.setProduct(product);

<<<<<<< HEAD
        if (order.getOrderNumber() == null) {
            order.setOrderNumber(generateOrderNumber());
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        // Enforce unit price from stock (product price)
        order.setUnitPrice(product.getPrice());
=======
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        // Set order type if not provided
        if (order.getOrderType() == null) {
            order.setOrderType("SUPPLIER_ORDER"); // Default to supplier order
        }
        // Generate different order numbers based on order type
        if (order.getOrderNumber() == null) {
            if ("CUSTOMER_ORDER".equals(order.getOrderType())) {
                order.setOrderNumber(generateCustomerOrderNumber());
            } else {
                order.setOrderNumber(generateOrderNumber());
            }
        }
        // Enforce unit price from stock (product price)
        order.setUnitPrice(product.getPrice());
        // keep backwards-compatible `unit_cost` column in DB populated
        order.setUnitCost(product.getPrice());
>>>>>>> backend
        order.setTotalAmount(order.getUnitPrice().multiply(BigDecimal.valueOf(order.getQuantity())));
        if (order.getStatus() == null) {
            order.setStatus(Order.OrderStatus.PENDING);
        }
<<<<<<< HEAD
        return orderRepository.save(order);
=======
        Order saved = orderRepository.save(order);
        logger.debug("Order saved with id={} orderNumber={} orderType={}", saved.getId(), saved.getOrderNumber(), saved.getOrderType());
        return saved;
>>>>>>> backend
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
<<<<<<< HEAD
        order.setUnitPrice(product.getPrice());
=======
    order.setUnitPrice(product.getPrice());
    order.setUnitCost(product.getPrice());
>>>>>>> backend
        order.setTotalAmount(order.getUnitPrice().multiply(BigDecimal.valueOf(order.getQuantity())));
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
<<<<<<< HEAD
        if (status == Order.OrderStatus.DELIVERED) {
=======
        
        // Handle supplier order delivery - restock inventory
        if (status == Order.OrderStatus.DELIVERED && "SUPPLIER_ORDER".equals(order.getOrderType())) {
>>>>>>> backend
            order.setActualDeliveryDate(LocalDateTime.now());
            Product product = order.getProduct();
            product.setQuantity(product.getQuantity() + order.getQuantity());
            productRepository.save(product);
        }
<<<<<<< HEAD
=======
        
        // Handle customer order completion
        if (status == Order.OrderStatus.COMPLETED && "CUSTOMER_ORDER".equals(order.getOrderType())) {
            order.setActualDeliveryDate(LocalDateTime.now());
        }
        
>>>>>>> backend
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
<<<<<<< HEAD
=======
    
    private String generateCustomerOrderNumber() {
        return "CUST-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
>>>>>>> backend
}
