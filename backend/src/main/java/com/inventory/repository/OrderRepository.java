package com.inventory.repository;

import com.inventory.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	Optional<Order> findByOrderNumber(String orderNumber);
	List<Order> findByStatus(Order.OrderStatus status);
	List<Order> findByProductId(Long productId);
	List<Order> findAllByOrderByOrderDateDesc();
<<<<<<< HEAD
=======
	List<Order> findByOrderType(String orderType);
	List<Order> findByOrderTypeAndStatus(String orderType, Order.OrderStatus status);
	List<Order> findByOrderTypeOrderByOrderDateDesc(String orderType);
>>>>>>> backend
}
