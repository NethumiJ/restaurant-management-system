package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getActiveProducts() {
        return productRepository.findByActive(true);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }
    
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> getProductsBySupplier(Long supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }
    
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getReorderLevel() != null && p.getQuantity() <= p.getReorderLevel())
                .toList();
    }
    
<<<<<<< HEAD
=======
    public List<Product> getInventoryItems() {
        return productRepository.findByType("INVENTORY_ITEM");
    }
    
    public List<Product> getMenuItems() {
        return productRepository.findByType("MENU_ITEM");
    }
    
    public List<Product> getActiveMenuItems() {
        return productRepository.findByTypeAndActive("MENU_ITEM", true);
    }
    
    public List<Product> getLowStockInventoryItems() {
        return productRepository.findByType("INVENTORY_ITEM").stream()
                .filter(p -> p.getReorderLevel() != null && p.getQuantity() <= p.getReorderLevel())
                .toList();
    }
    
>>>>>>> backend
    @Transactional
    public Product createProduct(Product product) {
        if (productRepository.findBySku(product.getSku()).isPresent()) {
            throw new RuntimeException("Product with SKU " + product.getSku() + " already exists");
        }
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        // Only overwrite fields that are explicitly provided to avoid nulling existing values
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        if (productDetails.getQuantity() != null) {
            product.setQuantity(productDetails.getQuantity());
        }
        if (productDetails.getReorderLevel() != null) {
            product.setReorderLevel(productDetails.getReorderLevel());
        }
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }
        if (productDetails.getSupplier() != null) {
            product.setSupplier(productDetails.getSupplier());
        }
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        if (productDetails.getActive() != null) {
            product.setActive(productDetails.getActive());
        }
<<<<<<< HEAD
=======
        if (productDetails.getType() != null) {
            product.setType(productDetails.getType());
        }
>>>>>>> backend

        return productRepository.save(product);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    @Transactional
    public Product updateStock(Long id, Integer quantity) {
        Product product = getProductById(id);
        product.setQuantity(quantity);
        return productRepository.save(product);
    }
}
