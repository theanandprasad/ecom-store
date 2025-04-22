# E-Commerce Store API Specification

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Example Requests & Responses](#example-requests--responses)

## Introduction

This document specifies the API for an e-commerce store platform. The API provides endpoints for managing products, orders, customers, and various e-commerce operations.

### Base URL
```
https://api.ecomstore.com/v1
```

### Authentication
All API requests must include Basic Authentication credentials in the Authorization header:
```
Authorization: Basic <base64(username:password)>
```

### Rate Limiting
- 100 requests per minute per API key
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time until rate limit resets (UTC timestamp)

## Error Handling

### Error Response Format
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

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## API Endpoints

### 1. FAQ & Static Knowledge

#### FAQ Lookup
```
GET /faq/lookup
```

**Query Parameters:**
- `query`: string (required) - Search query

**Response:**
```json
{
    "answer": "Found answer to the query",
    "confidence": 0.95,
    "source": "FAQ Document v1.2"
}
```

### 2. Authentication & User Context

#### Send OTP
```
POST /auth/send-otp
```

**Request Body:**
```json
{
    "phone_or_email": "user@example.com"
}
```

**Response:**
```json
{
    "otp_session_id": "session_123",
    "expires_in": 300
}
```

#### Verify OTP
```
POST /auth/verify-otp
```

**Request Body:**
```json
{
    "otp_session_id": "session_123",
    "code": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "token": "jwt_token_here"
}
```

### 3. Order Management

#### Get Order Status
```
GET /orders/{order_id}/status
```

**Response:**
```json
{
    "order_id": "order_123",
    "status": "SHIPPED",
    "last_updated": "2024-03-20T10:30:00Z",
    "tracking_number": "TRK123456"
}
```

#### List Orders
```
GET /customers/{customer_id}/orders
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `status`: string (optional) - Filter by status

**Response:**
```json
{
    "orders": [
        {
            "order_id": "order_123",
            "status": "COMPLETED",
            "total_amount": 99.99,
            "created_at": "2024-03-20T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 100,
        "page": 1,
        "limit": 20
    }
}
```

### 4. Shipping & Tracking

#### Get Shipping Options
```
POST /shipping/options
```

**Request Body:**
```json
{
    "destination": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
    }
}
```

**Response:**
```json
{
    "options": [
        {
            "id": "standard",
            "name": "Standard Shipping",
            "estimated_days": "3-5",
            "cost": 5.99
        }
    ]
}
```

### 5. Returns, Exchanges & Refunds

#### Initiate Return
```
POST /orders/{order_id}/returns
```

**Request Body:**
```json
{
    "items": [
        {
            "item_id": "item_123",
            "quantity": 1,
            "reason": "DEFECTIVE"
        }
    ]
}
```

**Response:**
```json
{
    "return_id": "return_123",
    "status": "PENDING",
    "return_label_url": "https://example.com/label.pdf"
}
```

### 6. Payments & Billing

#### List Payment Methods
```
GET /customers/{customer_id}/payment-methods
```

**Response:**
```json
{
    "payment_methods": [
        {
            "id": "pm_123",
            "type": "CREDIT_CARD",
            "last_four": "4242",
            "expiry_month": 12,
            "expiry_year": 2025
        }
    ]
}
```

### 7. Product Information & Availability

#### Get Product Details
```
GET /products/{product_id}
```

**Response:**
```json
{
    "id": "prod_123",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "currency": "USD",
    "in_stock": true,
    "images": [
        "https://example.com/image1.jpg"
    ],
    "attributes": {
        "color": "red",
        "size": "M"
    }
}
```

### 8. Pricing, Discounts & Promotions

#### Get Current Promotions
```
GET /products/{product_id}/promotions
```

**Response:**
```json
{
    "promotions": [
        {
            "id": "promo_123",
            "name": "Spring Sale",
            "discount_percent": 20,
            "valid_until": "2024-04-30T23:59:59Z"
        }
    ]
}
```

### 9. Recommendations & Cross-Sells

#### Get Similar Products
```
GET /products/{product_id}/similar
```

**Query Parameters:**
- `limit`: number (default: 5)

**Response:**
```json
{
    "products": [
        {
            "id": "prod_456",
            "name": "Similar Product",
            "price": 89.99,
            "similarity_score": 0.85
        }
    ]
}
```

### 10. Account & Profile Management

#### Get Customer Profile
```
GET /customers/{customer_id}
```

**Response:**
```json
{
    "id": "cust_123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "preferences": {
        "language": "en",
        "currency": "USD"
    }
}
```

### 11. Loyalty, Rewards & Subscriptions

#### Get Loyalty Balance
```
GET /customers/{customer_id}/loyalty
```

**Response:**
```json
{
    "points_balance": 1000,
    "tier": "GOLD",
    "next_tier_points": 500
}
```

### 12. Technical & Miscellaneous

#### Report Issue
```
POST /support/issues
```

**Request Body:**
```json
{
    "customer_id": "cust_123",
    "error_details": "Error description",
    "context": {
        "page": "checkout",
        "action": "payment"
    }
}
```

**Response:**
```json
{
    "ticket_id": "ticket_123",
    "status": "OPEN",
    "priority": "HIGH"
}
```

### 13. Cart Management

#### Create Cart
```
POST /carts
```

**Response:**
```json
{
    "cart_id": "cart_123",
    "items": [],
    "total": 0
}
```

#### Add to Cart
```
POST /carts/{cart_id}/items
```

**Request Body:**
```json
{
    "product_id": "prod_123",
    "quantity": 2
}
```

**Response:**
```json
{
    "cart_id": "cart_123",
    "items": [
        {
            "item_id": "item_123",
            "product_id": "prod_123",
            "quantity": 2,
            "price": 99.99
        }
    ],
    "total": 199.98
}
```

### 14. Wishlist Management

#### Add to Wishlist
```
POST /customers/{customer_id}/wishlist
```

**Request Body:**
```json
{
    "product_id": "prod_123"
}
```

**Response:**
```json
{
    "wishlist_id": "wish_123",
    "items": [
        {
            "product_id": "prod_123",
            "added_at": "2024-03-20T10:30:00Z"
        }
    ]
}
```

### 15. Reviews & Ratings

#### Submit Review
```
POST /products/{product_id}/reviews
```

**Request Body:**
```json
{
    "customer_id": "cust_123",
    "rating": 5,
    "title": "Great Product",
    "review": "Detailed review text",
    "images": ["https://example.com/review1.jpg"]
}
```

**Response:**
```json
{
    "review_id": "rev_123",
    "status": "PENDING",
    "moderation_required": true
}
```

### 16. Search & Filtering

#### Search Products
```
GET /search/products
```

**Query Parameters:**
- `query`: string (required)
- `category`: string (optional)
- `price_min`: number (optional)
- `price_max`: number (optional)
- `sort`: string (optional) - "price_asc", "price_desc", "newest"
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
    "results": [
        {
            "id": "prod_123",
            "name": "Product Name",
            "price": 99.99,
            "image": "https://example.com/image.jpg"
        }
    ],
    "filters": {
        "categories": ["Category 1", "Category 2"],
        "price_ranges": ["0-50", "51-100"]
    },
    "pagination": {
        "total": 100,
        "page": 1,
        "limit": 20
    }
}
```

### 17. Address Management

#### Add Address
```
POST /customers/{customer_id}/addresses
```

**Request Body:**
```json
{
    "type": "SHIPPING",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US",
    "is_default": true
}
```

**Response:**
```json
{
    "address_id": "addr_123",
    "type": "SHIPPING",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US",
    "is_default": true
}
```

### 18. Customer Support

#### Create Support Ticket
```
POST /support/tickets
```

**Request Body:**
```json
{
    "customer_id": "cust_123",
    "subject": "Order Issue",
    "message": "Detailed description of the issue",
    "order_id": "order_123",
    "priority": "HIGH"
}
```

**Response:**
```json
{
    "ticket_id": "ticket_123",
    "status": "OPEN",
    "priority": "HIGH",
    "created_at": "2024-03-20T10:30:00Z"
}
```

## Data Models

### Address
```json
{
    "id": "string",
    "type": "enum(SHIPPING, BILLING)",
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "is_default": "boolean"
}
```

### Order
```json
{
    "id": "string",
    "customer_id": "string",
    "status": "enum(PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)",
    "items": [
        {
            "id": "string",
            "product_id": "string",
            "quantity": "number",
            "price": "number"
        }
    ],
    "total_amount": "number",
    "shipping_address": "Address",
    "billing_address": "Address",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Product
```json
{
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "currency": "string",
    "in_stock": "boolean",
    "images": ["string"],
    "attributes": {
        "color": "string",
        "size": "string"
    },
    "category": "string",
    "brand": "string"
}
```

## Example Requests & Responses

### Example: Creating an Order

**Request:**
```http
POST /orders
Authorization: Basic base64(username:password)
Content-Type: application/json

{
    "customer_id": "cust_123",
    "items": [
        {
            "product_id": "prod_123",
            "quantity": 2
        }
    ],
    "shipping_address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
    }
}
```

**Response:**
```json
{
    "order_id": "order_123",
    "status": "PENDING",
    "total_amount": 199.98,
    "items": [
        {
            "product_id": "prod_123",
            "quantity": 2,
            "price": 99.99
        }
    ],
    "created_at": "2024-03-20T10:30:00Z"
}
```

### Example: Error Response

**Request:**
```http
GET /products/invalid_id
Authorization: Basic base64(username:password)
```

**Response:**
```json
{
    "error": {
        "code": "PRODUCT_NOT_FOUND",
        "message": "Product with ID 'invalid_id' not found",
        "details": {
            "product_id": "invalid_id"
        }
    }
}
``` 