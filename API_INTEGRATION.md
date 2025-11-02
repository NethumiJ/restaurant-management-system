# API Integration Documentation

## Backend-Frontend Connection

Your React frontend is now connected to the Spring Boot backend through REST APIs!

### Architecture

```
Frontend (React)  →  API Service Layer  →  Backend (Spring Boot)  →  MySQL Database
Port: 5173            axios HTTP client      Port: 8080              inventory_db
```

### API Endpoints

All API endpoints are available at: `http://localhost:8080/api`

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/{id}` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Service Layer

The frontend uses service files to communicate with the backend:

- **api.js** - Base axios configuration with interceptors
- **productService.js** - Product-related API calls
- **categoryService.js** - Category-related API calls
- **supplierService.js** - Supplier-related API calls

### How It Works

1. **Dashboard Component** fetches data on mount using `fetchAllData()`
2. When you add/edit/delete items, it calls the appropriate service method
3. Service methods make HTTP requests to the backend
4. Backend processes the request and updates MySQL database
5. Response is sent back to frontend
6. Dashboard refreshes to show updated data

### Testing the Connection

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **Start Frontend**: `npm run dev`
3. **Open Browser**: http://localhost:5173
4. **Test API**: Open `test-api.html` in browser to manually test endpoints

### Data Flow Example

When you add a new inventory item:

1. User fills form and clicks "Add"
2. `handleSaveInventory()` is called
3. Calls `productService.createProduct(productData)`
4. axios sends POST request to `http://localhost:8080/api/products`
5. Backend controller receives request
6. ProductService saves to MySQL database
7. Backend returns created product with ID
8. Frontend receives response
9. `fetchAllData()` refreshes the display
10. User sees new item in the table

### CORS Configuration

CORS is configured in the backend (`WebConfig.java`) to allow requests from:
- http://localhost:3000
- http://localhost:5173

### Error Handling

- Network errors are caught and displayed as notifications
- If backend is down, an error banner appears
- All API errors are logged to browser console

### Next Steps

To fully integrate:
1. ✅ Install axios
2. ✅ Create API service layer
3. ✅ Update Dashboard to use APIs
4. 🔄 Add sample data to database
5. 🔄 Test all CRUD operations
6. 🔄 Add authentication (optional)
