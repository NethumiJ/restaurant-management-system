package com.inventory.service;

import com.inventory.dto.StatsResponse;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;

@Service
public class StatsService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public StatsService(ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    public StatsResponse getStats() {
        long products = productRepository.count();
        long categories = categoryRepository.count();
        long suppliers = supplierRepository.count();
        long lowStock = productRepository.countByQuantityLessThanEqual(5);
        return new StatsResponse(products, categories, suppliers, lowStock);
    }
}
