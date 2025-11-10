package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "order_number", unique = true, nullable = false)
	private String orderNumber;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier_id")
	private Supplier supplier;

	@NotNull
	@Min(1)
	@Column(nullable = false)
	private Integer quantity;

	@NotNull
	@Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal unitPrice;

<<<<<<< HEAD
=======
	// Backwards-compatible column: some DBs have 'unit_cost' column from older schema.
	// Persist the same value as `unitPrice` to satisfy existing schema constraints.
	@NotNull
	@Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
	private BigDecimal unitCost;

>>>>>>> backend
	@NotNull
	@Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
	private BigDecimal totalAmount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 16)
	private OrderStatus status = OrderStatus.PENDING;

	@Column(name = "order_date", nullable = false)
	private LocalDateTime orderDate = LocalDateTime.now();

	@Column(name = "expected_delivery_date")
	private LocalDateTime expectedDeliveryDate;

	@Column(name = "actual_delivery_date")
	private LocalDateTime actualDeliveryDate;

	@Column(length = 1000)
	private String notes;

<<<<<<< HEAD
=======
	@Column(name = "order_type", nullable = false, length = 20)
	private String orderType = "SUPPLIER_ORDER"; // CUSTOMER_ORDER or SUPPLIER_ORDER

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by_user_id")
	private User createdBy; // User who created the order (cashier for customer orders)

>>>>>>> backend
	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public enum OrderStatus {
<<<<<<< HEAD
		PENDING,
		CONFIRMED,
		SHIPPED,
		DELIVERED,
		CANCELLED
=======
		PENDING,      // Initial status for both order types
		CONFIRMED,    // Supplier orders
		SHIPPED,      // Supplier orders
		DELIVERED,    // Supplier orders
		PREPARING,    // Customer orders - chef is preparing
		READY,        // Customer orders - ready for pickup/delivery
		COMPLETED,    // Customer orders - completed
		CANCELLED     // Both order types
>>>>>>> backend
	}

	public Order() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getOrderNumber() { return orderNumber; }
	public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

	public Product getProduct() { return product; }
	public void setProduct(Product product) { this.product = product; }

	public Supplier getSupplier() { return supplier; }
	public void setSupplier(Supplier supplier) { this.supplier = supplier; }

	public Integer getQuantity() { return quantity; }
	public void setQuantity(Integer quantity) { this.quantity = quantity; }

	public BigDecimal getUnitPrice() { return unitPrice; }
	public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

<<<<<<< HEAD
=======
	public BigDecimal getUnitCost() { return unitCost; }
	public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

>>>>>>> backend
	public BigDecimal getTotalAmount() { return totalAmount; }
	public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

	public OrderStatus getStatus() { return status; }
	public void setStatus(OrderStatus status) { this.status = status; }

	public LocalDateTime getOrderDate() { return orderDate; }
	public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

	public LocalDateTime getExpectedDeliveryDate() { return expectedDeliveryDate; }
	public void setExpectedDeliveryDate(LocalDateTime expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

	public LocalDateTime getActualDeliveryDate() { return actualDeliveryDate; }
	public void setActualDeliveryDate(LocalDateTime actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }

	public String getNotes() { return notes; }
	public void setNotes(String notes) { this.notes = notes; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public LocalDateTime getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
<<<<<<< HEAD
=======

	public String getOrderType() { return orderType; }
	public void setOrderType(String orderType) { this.orderType = orderType != null ? orderType : "SUPPLIER_ORDER"; }

	public User getCreatedBy() { return createdBy; }
	public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
>>>>>>> backend
}
