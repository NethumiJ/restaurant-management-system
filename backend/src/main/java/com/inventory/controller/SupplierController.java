package com.inventory.controller;

import com.inventory.model.Supplier;
import com.inventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class SupplierController {
    
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }
    
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers(@RequestParam(required = false) Boolean active) {
        if (active != null && active) {
            return ResponseEntity.ok(supplierService.getActiveSuppliers());
        }
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliers(@RequestParam String name) {
        return ResponseEntity.ok(supplierService.searchSuppliersByName(name));
    }
    
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierService.createSupplier(supplier));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}

