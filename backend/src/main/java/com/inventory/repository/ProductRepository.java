package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    List<Product> findByActive(Boolean active);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySupplierId(Long supplierId);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByQuantityLessThanEqual(Integer quantity);
    long countByQuantityLessThanEqual(Integer quantity);
    List<Product> findByType(String type);
    List<Product> findByTypeAndActive(String type, Boolean active);
}
