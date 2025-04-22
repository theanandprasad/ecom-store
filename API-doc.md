# E-Commerce Store API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
   - [Products](#products)
   - [Customers](#customers)
   - [Orders](#orders)
   - [Carts](#carts)
   - [Wishlists](#wishlists)
   - [Reviews](#reviews)
   - [Promotions](#promotions)
   - [Support](#support)
   - [FAQ](#faq)
   - [Returns](#returns)
   - [Search](#search)
   - [Authentication](#authentication-endpoints)

## Introduction

This API provides endpoints for managing an e-commerce store, including products, customers, orders, carts, reviews, and more. All endpoints support filtering, pagination, and proper error handling.

**Base URL:** `http://localhost:3000/api`

## Authentication

The API supports two authentication methods:

### 1. Basic Authentication

Most API endpoints require Basic Authentication:

```
Authorization: Basic base64(username:password)
```

Default credentials: `admin:admin123`

### 2. OTP-based Authentication

For client applications, use the OTP (One-Time Password) flow:

1. **Request OTP**: Send a request to `POST /api/auth/send-otp` with:
   ```json
   {
     "phone_or_email": "user@example.com"
   }
   ```

2. **Verify OTP**: Send the received code to `POST /api/auth/verify-otp` with:
   ```json
   {
     "otp_session_id": "session_id",
     "code": "123456"
   }
   ```

3. **Use JWT Token**: Include the returned JWT token in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Additional error details if applicable"
    }
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## API Endpoints

### Products

#### List all products
```
GET /products
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `brand`: Filter by brand
- `in_stock`: Filter by availability (true/false)
- `min_price`: Filter by minimum price
- `max_price`: Filter by maximum price
- `sort`: Sort field (name, price, created_at)
- `order`: Sort order (asc, desc)

#### Get a specific product
```
GET /products/:id
```

#### Create a new product
```
POST /products
```
Request body: Product object

#### Update a product
```
PUT /products/:id
```
Request body: Product object

#### Delete a product
```
DELETE /products/:id
```

### Customers

#### List all customers
```
GET /customers
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `tier`: Filter by loyalty tier
- `sort`: Sort field (name, created_at, loyalty_points)
- `order`: Sort order (asc, desc)

#### Get a specific customer
```
GET /customers/:id
```

#### Create a new customer
```
POST /customers
```
Request body: Customer object

#### Update a customer
```
PUT /customers/:id
```
Request body: Customer object

#### Delete a customer
```
DELETE /customers/:id
```

#### Get customer orders
```
GET /customers/:id/orders
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by order status

#### Get customer cart
```
GET /customers/:id/cart
```

#### Get customer wishlist
```
GET /customers/:id/wishlist
```

#### Get customer reviews
```
GET /customers/:id/reviews
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `rating`: Filter by rating
- `status`: Filter by review status

#### Get customer support tickets
```
GET /customers/:id/support-tickets
```

#### Get customer returns
```
GET /customers/:id/returns
```

#### Get customer notifications
```
GET /customers/:id/notifications
```

#### Get customer loyalty info
```
GET /customers/:id/loyalty
```

#### Get customer addresses
```
GET /customers/:id/addresses
```

#### Add new customer address
```
POST /customers/:id/addresses
```
Request body: Address object

#### Get specific customer address
```
GET /customers/:id/addresses/:addressId
```

#### Update customer address
```
PUT /customers/:id/addresses/:addressId
```
Request body: Address object

#### Delete customer address
```
DELETE /customers/:id/addresses/:addressId
```

### Orders

#### List all orders
```
GET /orders
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by order status
- `customer_id`: Filter by customer
- `min_total`: Filter by minimum total
- `max_total`: Filter by maximum total
- `sort`: Sort field (created_at, total_amount)
- `order`: Sort order (asc, desc)

#### Get a specific order
```
GET /orders/:id
```

#### Create a new order
```
POST /orders
```
Request body: Order object

#### Update an order
```
PUT /orders/:id
```
Request body: Order object

#### Delete an order
```
DELETE /orders/:id
```

### Carts

#### List all carts
```
GET /carts
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `customer_id`: Filter by customer
- `status`: Filter by cart status

#### Create a new cart
```
POST /carts
```
Request body: Cart object (customer_id optional)

#### Get a specific cart
```
GET /carts/:id
```

#### Update a cart
```
PUT /carts/:id
```
Request body: Cart object

#### Delete a cart
```
DELETE /carts/:id
```

#### Add item to cart
```
POST /carts/:id/items
```
Request body:
```json
{
  "product_id": "prod_123",
  "quantity": 2
}
```

#### Remove item from cart
```
DELETE /carts/:id/items/:itemId
```

### Wishlists

#### List all wishlists
```
GET /wishlists
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `customer_id`: Filter by customer

#### Create a new wishlist
```
POST /wishlists
```
Request body: Wishlist object

#### Get wishlist details
```
GET /wishlists/:id
```

#### Update a wishlist
```
PUT /wishlists/:id
```
Request body: Wishlist object

#### Delete a wishlist
```
DELETE /wishlists/:id
```

#### Add item to wishlist
```
POST /wishlists/:id/items
```
Request body:
```json
{
  "product_id": "prod_123",
  "notes": "Maybe for birthday"
}
```

#### Remove item from wishlist
```
DELETE /wishlists/:id/items/:itemId
```

### Reviews

#### Get reviews for a product
```
GET /products/:productId/reviews
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `rating`: Filter by rating (1-5)
- `status`: Filter by review status
- `sort`: Sort field (helpful_votes, created_at)
- `order`: Sort order (asc, desc)

#### Create a review for a product
```
POST /products/:productId/reviews
```
Request body:
```json
{
  "customer_id": "cust_123",
  "rating": 5,
  "title": "Great product",
  "content": "This product exceeded my expectations",
  "images": ["https://example.com/image1.jpg"],
  "verified_purchase": true
}
```

#### Get reviews by a customer
```
GET /customers/:customerId/reviews
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `rating`: Filter by rating (1-5)
- `status`: Filter by review status

### Promotions

#### List all promotions
```
GET /promotions
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by promotion type
- `active`: Filter active promotions (true/false)

#### Create a new promotion
```
POST /promotions
```
Request body: Promotion object

#### Get promotion details
```
GET /promotions/:id
```

#### Update a promotion
```
PUT /promotions/:id
```
Request body: Promotion object

#### Delete a promotion
```
DELETE /promotions/:id
```

### Support

#### List all support tickets
```
GET /support/tickets
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by ticket status
- `priority`: Filter by priority
- `customer_id`: Filter by customer

#### Create a new support ticket
```
POST /support/tickets
```
Request body:
```json
{
  "customer_id": "cust_123",
  "subject": "Order Issue",
  "message": "My order hasn't arrived yet",
  "category": "ORDER_ISSUES",
  "priority": "MEDIUM",
  "order_id": "order_456"
}
```

#### Get ticket details
```
GET /support/tickets/:id
```

#### Update a ticket
```
PUT /support/tickets/:id
```
Request body: Support ticket object

#### Delete a ticket
```
DELETE /support/tickets/:id
```

### FAQ

#### List all FAQ items
```
GET /faq
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category

#### Find answer to a query
```
GET /faq/lookup
```
Query parameters:
- `query`: Search query (required)

### Returns

#### List all returns
```
GET /returns
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by return status
- `customer_id`: Filter by customer
- `order_id`: Filter by order

#### Create a new return request
```
POST /returns
```
Request body:
```json
{
  "order_id": "order_123",
  "customer_id": "cust_456",
  "items": [
    {
      "product_id": "prod_789",
      "quantity": 1,
      "reason": "DEFECTIVE"
    }
  ]
}
```

### Search

#### Search products
```
GET /search/products
```
Query parameters:
- `query`: Search query (required)
- `category`: Filter by category
- `price_min`: Minimum price
- `price_max`: Maximum price
- `sort`: Sort field (relevance, price, created_at)
- `order`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Authentication Endpoints

#### Send one-time password
```
POST /auth/send-otp
```
Request body:
```json
{
  "phone_or_email": "user@example.com"
}
```
Response:
```json
{
  "data": {
    "otp_session_id": "session_1234567890_abcdef",
    "expires_in": 300
  }
}
```

#### Verify one-time password
```
POST /auth/verify-otp
```
Request body:
```json
{
  "otp_session_id": "session_1234567890_abcdef",
  "code": "123456"
}
```
Response:
```json
{
  "data": {
    "success": true,
    "token": "mock_jwt_1234567890_abcdef"
  }
}
```

## Data Models

### Product
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": {
    "amount": "number",
    "currency": "string"
  },
  "in_stock": "boolean",
  "stock_quantity": "number",
  "images": ["string"],
  "attributes": {
    "color": "string",
    "size": "string",
    "material": "string",
    "weight": "string"
  },
  "category": "string",
  "brand": "string",
  "rating": "number",
  "review_count": "number",
  "tags": ["string"],
  "specifications": {
    "key": "string"
  },
  "created_at": "string",
  "updated_at": "string"
}
```

### Customer
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "addresses": [
    {
      "id": "string",
      "type": "SHIPPING | BILLING",
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "is_default": "boolean"
    }
  ],
  "preferences": {
    "language": "string",
    "currency": "string",
    "marketing_emails": "boolean"
  },
  "loyalty_points": "number",
  "tier": "BRONZE | SILVER | GOLD | PLATINUM",
  "created_at": "string",
  "updated_at": "string"
}
```

### Order
```json
{
  "id": "string",
  "customer_id": "string",
  "status": "PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED",
  "items": [
    {
      "product_id": "string",
      "quantity": "number",
      "price": {
        "amount": "number",
        "currency": "string"
      }
    }
  ],
  "shipping_address": {
    "id": "string",
    "type": "SHIPPING",
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "billing_address": {
    "id": "string",
    "type": "BILLING",
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "payment": {
    "method": "string",
    "status": "string",
    "amount": {
      "subtotal": "number",
      "shipping": "number",
      "tax": "number",
      "total": "number",
      "currency": "string"
    }
  },
  "shipping": {
    "carrier": "string",
    "tracking_number": "string",
    "estimated_delivery": "string",
    "actual_delivery": "string"
  },
  "created_at": "string",
  "updated_at": "string"
}
```

### Review
```json
{
  "id": "string",
  "product_id": "string",
  "customer_id": "string",
  "order_id": "string",
  "rating": "number",
  "title": "string",
  "content": "string",
  "verified_purchase": "boolean",
  "helpful_votes": "number",
  "images": ["string"],
  "status": "PENDING | APPROVED | REJECTED",
  "created_at": "string",
  "updated_at": "string"
}
``` 