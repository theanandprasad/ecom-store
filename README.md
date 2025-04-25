# E-Commerce Store API

A comprehensive RESTful API for an e-commerce platform with complete customer, product, and order management capabilities.

## Overview

This project implements a feature-rich e-commerce API that supports all essential operations for an online store. The API follows RESTful principles and provides robust endpoints for managing products, customers, orders, carts, wishlists, and more.

## Features

- **Products Management**: Create, retrieve, update and delete products, including reviews
- **Customer Management**: Complete customer lifecycle with addresses, wishlists, and loyalty information
- **Order Processing**: Order creation, status updates, and retrieval
- **Cart Operations**: Shopping cart management with item addition and removal
- **Wishlist Management**: Customer wishlists with personalized notes
- **Review System**: Product reviews with ratings and helpful vote tracking
- **Promotions Engine**: Customizable promotions with various discount types
- **Support Ticket System**: Customer support ticket creation and management
- **Returns Processing**: Handle product returns and refunds
- **Authentication**: Basic auth and OTP-based authentication
- **Comprehensive Filtering**: Filter, sort, and paginate results across all resources
- **Category Management**: Browse products by category with full categorization support

## API Endpoints

The API provides numerous endpoints grouped by resource:

### Authentication
- `POST /api/auth/send-otp`: Send one-time password
- `POST /api/auth/verify-otp`: Verify one-time password

### Products
- `GET /api/products`: List all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product
- `GET /api/products/:id/reviews`: Get product reviews
- `POST /api/products/:id/reviews`: Add a review to a product

### Categories
- `GET /api/categories`: List all categories
- `GET /api/categories/:id`: Get a specific category
- `POST /api/categories`: Create a new category
- `PUT /api/categories/:id`: Update a category
- `DELETE /api/categories/:id`: Delete a category
- `GET /api/categories/:id/products`: Get products in a category (recommended way to filter products by category)
- `GET /api/search/categories?q=query`: Search categories

### Customers
- `GET /api/customers`: List all customers
- `GET /api/customers/:id`: Get a specific customer
- `POST /api/customers`: Create a new customer
- `PUT /api/customers/:id`: Update a customer
- `DELETE /api/customers/:id`: Delete a customer
- `GET /api/customers/:id/orders`: Get customer orders
- `GET /api/customers/:id/cart`: Get customer cart
- `GET /api/customers/:id/wishlist`: Get customer wishlist
- `GET /api/customers/:id/reviews`: Get customer reviews
- `GET /api/customers/:id/support-tickets`: Get customer support tickets
- `GET /api/customers/:id/returns`: Get customer returns
- `GET /api/customers/:id/notifications`: Get customer notifications
- `GET /api/customers/:id/loyalty`: Get customer loyalty info
- `GET /api/customers/:id/addresses`: Get customer addresses
- `POST /api/customers/:id/addresses`: Add new customer address
- `GET /api/customers/:id/addresses/:addressId`: Get specific customer address
- `PUT /api/customers/:id/addresses/:addressId`: Update customer address
- `DELETE /api/customers/:id/addresses/:addressId`: Delete customer address

### Additional endpoint groups include:
- Orders
- Carts
- Wishlists
- Promotions
- Support
- FAQ
- Returns
- Search

For full documentation of all available endpoints, see [customer-api-examples.md](customer-api-examples.md) and [ecommerce-api-doc.md](ecommerce-api-doc.md).

### FAQ
- `GET /api/faq`: List all FAQ items, optionally filtered by category
  ```bash
  # Get all shipping-related FAQs
  curl -X GET "https://ecom-store-ebon.vercel.app/api/faq?category=SHIPPING" -u admin:admin123
  ```
- `GET /api/faq/lookup`: Search for answers to specific questions
  ```bash
  # Find FAQ answers related to shipping
  curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=shipping" -u admin:admin123
  ```

## Authentication

The API supports two authentication methods:

1. **Basic Authentication**:
   ```
   Authorization: Basic base64(username:password)
   ```
   Default credentials: `admin:admin123`

2. **OTP-based Authentication**:
   - Request OTP via `POST /api/auth/send-otp`
   - Verify OTP via `POST /api/auth/verify-otp`
   - Use JWT token in subsequent requests

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecom-store.git
   cd ecom-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `https://ecom-store-ebon.vercel.app/api`

## Database Configuration

The API supports two data persistence modes:

1. **Static JSON** (read-only mode): Default for quick setup and demos
2. **NeDB** (read-write mode): For full functionality including writes

To enable NeDB mode, set the environment variable:
```
USE_NEDB=true
```

## Deployment

The API is deployed on Vercel and available at:
```
https://ecom-store-ebon.vercel.app/api
```

## Documentation

Comprehensive API documentation is available in the following files:
- [customer-api-examples.md](customer-api-examples.md): Examples for customer endpoints with request and response formats
- [ecommerce-api-doc.md](ecommerce-api-doc.md): Detailed API reference with parameters for all endpoints

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
 
