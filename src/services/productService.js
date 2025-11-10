import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      console.log(`[productService] Updating product ${id} with data:`, productData);
      const response = await api.put(`/products/${id}`, productData);
      console.log(`[productService] Update response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[productService] Error updating product ${id}:`, error);
      console.error(`[productService] Error response:`, error.response?.data);
      throw error;
    }
  },

  // Update stock quantity (absolute quantity)
  updateStock: async (id, quantity) => {
    try {
      const response = await api.patch(`/products/${id}/stock`, null, { params: { quantity } });
      return response.data;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Get inventory items (ingredients)
  getInventoryItems: async () => {
    try {
      const response = await api.get('/products/inventory-items');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  // Get menu items (food items for sale)
  getMenuItems: async (activeOnly = false) => {
    try {
      const response = await api.get('/products/menu-items', {
        params: activeOnly ? { active: true } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Get low stock inventory items
  getLowStockInventoryItems: async () => {
    try {
      const response = await api.get('/products/inventory-items/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock inventory items:', error);
      throw error;
    }
  },
};

export default productService;
