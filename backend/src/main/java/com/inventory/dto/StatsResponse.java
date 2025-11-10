package com.inventory.dto;

public class StatsResponse {
    private long products;
    private long categories;
    private long suppliers;
    private long lowStock;

    public StatsResponse() {}

    public StatsResponse(long products, long categories, long suppliers, long lowStock) {
        this.products = products;
        this.categories = categories;
        this.suppliers = suppliers;
        this.lowStock = lowStock;
    }

    public long getProducts() { return products; }
    public void setProducts(long products) { this.products = products; }

    public long getCategories() { return categories; }
    public void setCategories(long categories) { this.categories = categories; }

    public long getSuppliers() { return suppliers; }
    public void setSuppliers(long suppliers) { this.suppliers = suppliers; }

    public long getLowStock() { return lowStock; }
    public void setLowStock(long lowStock) { this.lowStock = lowStock; }
}
