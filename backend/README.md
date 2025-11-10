# Inventory Management System - Backend

A Spring Boot backend application for inventory management with MySQL database integration.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products into categories
- **Supplier Management**: Manage supplier information
- **Low Stock Alerts**: Track products with low inventory
- **Search & Filter**: Search products by name, category, or supplier
- **RESTful API**: Complete REST API for frontend integration
- **Data Validation**: Input validation using Bean Validation
- **Exception Handling**: Global exception handling
- **CORS Support**: Configured for React frontend

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **Lombok**
- **Hibernate**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or use Docker)
- Docker (optional, for running MySQL in container)

## Database Setup

### Option 1: Using Docker (Recommended)

1. Start MySQL container:
```bash
docker-compose up -d
```

This will create a MySQL container with:
- Database: `inventory_db`
- Username: `root`
- Password: `root`
- Port: `3306`

### Option 2: Using XAMPP MySQL (Current Configuration)

1. Start XAMPP and ensure MySQL is running
2. The database `inventory_db` will be created automatically
3. Current credentials configured:
   - Username: `root`
   - Password: `root1234`
   - Port: `3306`

If you need to change credentials, update `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Installation & Running

1. **Clone the repository**
```bash
cd d:\react\Invent\backend
```

2. **Build the project**
```bash
mvn clean install
```

3. **Run the application**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?active=true` - Get active products only
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/sku/{sku}` - Get product by SKU
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/supplier/{supplierId}` - Get products by supplier
- `GET /api/products/search?name={name}` - Search products by name
- `GET /api/products/low-stock` - Get low stock products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `PATCH /api/products/{id}/stock?quantity={qty}` - Update stock
- `DELETE /api/products/{id}` - Delete product

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/name/{name}` - Get category by name
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers?active=true` - Get active suppliers only
- `GET /api/suppliers/{id}` - Get supplier by ID
- `GET /api/suppliers/search?name={name}` - Search suppliers by name
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

## Sample API Requests

### Create a Category
```json
POST /api/categories
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### Create a Supplier
```json
POST /api/suppliers
{
  "name": "Tech Supplies Inc.",
  "contactPerson": "John Doe",
  "email": "john@techsupplies.com",
  "phone": "+1-234-567-8900",
  "address": "123 Tech Street, Silicon Valley, CA",
  "active": true
}
```

### Create a Product
```json
POST /api/products
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "sku": "LAPTOP-001",
  "price": 1299.99,
  "quantity": 50,
  "reorderLevel": 10,
  "category": {
    "id": 1
  },
  "supplier": {
    "id": 1
  },
  "imageUrl": "https://example.com/laptop.jpg",
  "active": true
}
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── inventory/
│   │   │           ├── InventoryApplication.java
│   │   │           ├── config/
│   │   │           │   └── WebConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── ProductController.java
│   │   │           │   ├── CategoryController.java
│   │   │           │   └── SupplierController.java
│   │   │           ├── model/
│   │   │           │   ├── Product.java
│   │   │           │   ├── Category.java
│   │   │           │   └── Supplier.java
│   │   │           ├── repository/
│   │   │           │   ├── ProductRepository.java
│   │   │           │   ├── CategoryRepository.java
│   │   │           │   └── SupplierRepository.java
│   │   │           ├── service/
│   │   │           │   ├── ProductService.java
│   │   │           │   ├── CategoryService.java
│   │   │           │   └── SupplierService.java
│   │   │           └── exception/
│   │   │               ├── ErrorResponse.java
│   │   │               └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── docker-compose.yml
├── pom.xml
└── README.md
```

## Configuration

The application configuration is in `src/main/resources/application.properties`:

- **Server Port**: 8080
- **Database URL**: jdbc:mysql://localhost:3306/inventory_db
- **JPA**: Auto-create/update tables
- **CORS**: Enabled for localhost:3000 and localhost:5173

## Development

### Enable Hot Reload
The project includes Spring Boot DevTools for automatic restart during development.

### Logging
- Application logs are set to DEBUG level
- SQL queries are logged with parameters

## Stopping the Application

1. Stop the Spring Boot application: `Ctrl + C`
2. Stop Docker containers:
```bash
docker-compose down
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify port 3306 is not in use by another service

### Port Already in Use
If port 8080 is in use, change it in `application.properties`:
```properties
server.port=8081
```

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
