# Inventory Management System - Setup Guide

## Prerequisites

1. **MySQL** running on `localhost:3306`
   - Database: `inventory_db` (auto-created)
   - Username: `root`
   - Password: `root1234`
   
2. **Java 17** or higher
3. **Maven 3.6+**
4. **Node.js 16+** and npm

## Quick Start

### 1. Start MySQL
Make sure MySQL is running and accessible with the credentials in `backend/src/main/resources/application.properties`.

### 2. Start Backend (Spring Boot on port 8080)

```powershell
# Navigate to backend folder
cd D:\react\Invent\backend

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will be available at: **http://localhost:8080**

### 3. Start Frontend (React + Vite on port 5175)

Open a **new terminal** and run:

```powershell
# Navigate to project root
cd D:\react\Invent

# Start Vite dev server
npm run dev
```

The frontend will be available at: **http://localhost:5175**

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user

### Products (Inventory)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `PATCH /api/products/{id}/stock?quantity={qty}` - Update stock quantity
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/{id}` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Stats (Overview)
- `GET /api/stats` - Get dashboard statistics
  - Returns: `{ products, categories, suppliers, lowStock }`

## Features

### Inventory Management
- ✅ Add/Edit/Delete inventory items
- ✅ Track stock levels with reorder thresholds
- ✅ Quick "Order" action to replenish stock
- ✅ Low stock alerts
- ✅ Price tracking per item

### Overview Dashboard
- ✅ Real-time statistics from backend
- ✅ Product count
- ✅ Category count
- ✅ Supplier count
- ✅ Low stock count

### Menu Management
- ✅ Add/Edit menu items
- ✅ Toggle availability
- ✅ Track pricing

### Categories & Suppliers
- ✅ Manage product categories
- ✅ Manage supplier information

## Troubleshooting

### Backend won't start
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `backend/src/main/resources/application.properties`
3. Check port 8080 is not in use: `netstat -ano | findstr :8080`

### CORS errors
The backend allows origins: `3000`, `5173`, `5174`, `5175`. If your dev server runs on a different port, update:
- `backend/src/main/java/com/inventory/config/WebConfig.java`
- `backend/src/main/resources/application.properties`
- All `@CrossOrigin` annotations in controllers

### Frontend won't connect
1. Ensure backend is running on `http://localhost:8080`
2. Check `src/services/api.js` has correct `baseURL`
3. Open browser console (F12) for detailed error messages

### Edit/Order not working
1. Open browser DevTools → Network tab
2. Try editing an item or clicking "Order"
3. Check for failed API calls (red entries)
4. Click the failed request to see error details
5. Common issues:
   - Missing price field → now fixed with price input in modal
   - Backend validation errors → check console for details
   - Network timeout → ensure backend is running

## Database Schema

### Products Table
- `id` (PK)
- `name` (required)
- `description`
- `sku` (required, unique)
- `price` (required, decimal)
- `quantity` (required, integer)
- `reorder_level` (integer)
- `category_id` (FK → categories)
- `supplier_id` (FK → suppliers)
- `image_url`
- `active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Categories Table
- `id` (PK)
- `name` (required, unique)
- `description`
- `created_at`
- `updated_at`

### Suppliers Table
- `id` (PK)
- `name` (required)
- `contact_person` (required)
- `email` (required)
- `phone` (required)
- `address`
- `active` (boolean)
- `created_at`
- `updated_at`

### Users Table
- `id` (PK)
- `first_name` (required)
- `last_name` (required)
- `email` (required, unique)
- `password` (required, hashed)
- `role` (default: USER)
- `active` (boolean)
- `created_at`
- `updated_at`

## Development Notes

- Backend uses Spring Boot 3.2.0 with Java 17
- Frontend uses React 19 with Vite 7
- Database: MySQL 8 (production) or H2 (dev/testing)
- REST API with JSON payloads
- CORS enabled for local development
- DevTools enabled for hot reload

## Next Steps / TODOs

- [ ] Add Orders module (track customer orders)
- [ ] Add user authentication UI (currently backend-only)
- [ ] Add role-based access control
- [ ] Add charts/graphs to Analytics tab
- [ ] Add export functionality (CSV/PDF)
- [ ] Add email notifications for low stock
- [ ] Add image upload for products
- [ ] Add search/filter to all tables
- [ ] Add pagination for large datasets
