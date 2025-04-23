# Customer API Reference

This document provides detailed information about the customer-related API endpoints available in our E-Commerce API.

**Base URL**: [https://ecom-store-ebon.vercel.app/](https://ecom-store-ebon.vercel.app/)

## Authentication

All API requests require authentication using one of the following methods:
- Basic Auth with admin credentials (`admin:admin123`)
- Bearer Token obtained via OTP authentication
- API Key in the header (`X-API-Key: your_api_key`)

## Customer Orders

### Get Customer Orders

Retrieves order history for a specific customer.

**Endpoint**: `GET /api/customers/:id/orders`

**Parameters**:
- `id` (path parameter): Customer ID
- `status` (optional query parameter): Filter by order status (e.g., PENDING, SHIPPED, DELIVERED)
- `date_from` (optional query parameter): Filter orders after this date (ISO format)
- `date_to` (optional query parameter): Filter orders before this date (ISO format)
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all orders for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/orders" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "order_001",
      "status": "SHIPPED",
      "created_at": "2024-04-20T10:00:00Z",
      "total_amount": {"amount": 609.97, "currency": "USD"},
      "items_count": 3,
      "tracking_number": "TRK123456"
    },
    {
      "id": "order_002",
      "status": "DELIVERED",
      "created_at": "2024-04-10T14:30:00Z",
      "total_amount": {"amount": 89.99, "currency": "USD"},
      "items_count": 1
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Cart

### Get Customer Cart

Retrieves the current cart for a specific customer.

**Endpoint**: `GET /api/customers/:id/cart`

**Parameters**:
- `id` (path parameter): Customer ID

**Example Request**:
```bash
# Get cart for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/cart" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": {
    "id": "cart_001",
    "items": [
      {
        "id": "item_001",
        "product_id": "prod_001",
        "product": {
          "name": "Premium Wireless Headphones",
          "image": "https://example.com/images/headphones-1.jpg"
        },
        "quantity": 3,
        "price": {"amount": 199.99, "currency": "USD"}
      }
    ],
    "subtotal": {"amount": 599.97, "currency": "USD"},
    "shipping_cost": {"amount": 10.00, "currency": "USD"},
    "total_amount": {"amount": 609.97, "currency": "USD"},
    "updated_at": "2024-04-22T15:20:00Z"
  }
}
```

## Customer Wishlist

### Get Customer Wishlist

Retrieves the wishlist for a specific customer.

**Endpoint**: `GET /api/customers/:id/wishlist`

**Parameters**:
- `id` (path parameter): Customer ID
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get wishlist for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/wishlist" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": {
    "id": "wish_001",
    "items": [
      {
        "id": "item_001",
        "product_id": "prod_002",
        "product": {
          "name": "Smart Fitness Watch",
          "price": {"amount": 149.99, "currency": "USD"},
          "image": "https://example.com/images/watch-1.jpg",
          "in_stock": true
        },
        "added_at": "2024-04-22T15:30:00Z"
      }
    ]
  },
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Reviews

### Get Customer Reviews

Retrieves all reviews written by a specific customer.

**Endpoint**: `GET /api/customers/:id/reviews`

**Parameters**:
- `id` (path parameter): Customer ID
- `rating` (optional query parameter): Filter by rating (1-5)
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all reviews by customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/reviews" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "review_001",
      "product_id": "prod_001",
      "product": {
        "name": "Premium Wireless Headphones"
      },
      "rating": 5,
      "title": "Amazing sound quality",
      "content": "These headphones have the best sound I've ever experienced",
      "created_at": "2024-04-10T12:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Support Tickets

### Get Customer Support Tickets

Retrieves all support tickets created by a specific customer.

**Endpoint**: `GET /api/customers/:id/support-tickets`

**Parameters**:
- `id` (path parameter): Customer ID
- `status` (optional query parameter): Filter by ticket status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `category` (optional query parameter): Filter by ticket category
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all support tickets for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/support-tickets" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "ticket_001",
      "subject": "Missing Item",
      "category": "ORDER_ISSUES",
      "status": "OPEN",
      "priority": "HIGH",
      "created_at": "2024-04-22T14:45:00Z",
      "last_updated": "2024-04-22T14:45:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Returns

### Get Customer Returns

Retrieves return requests made by a specific customer.

**Endpoint**: `GET /api/customers/:id/returns`

**Parameters**:
- `id` (path parameter): Customer ID
- `status` (optional query parameter): Filter by return status (REQUESTED, APPROVED, RECEIVED, REFUNDED, REJECTED)
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all returns for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/returns" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "return_001",
      "order_id": "order_001",
      "items": [
        {
          "product_id": "prod_001",
          "quantity": 1,
          "reason": "DEFECTIVE",
          "description": "Item arrived damaged"
        }
      ],
      "status": "APPROVED",
      "created_at": "2024-04-23T09:00:00Z",
      "refund_amount": {"amount": 199.99, "currency": "USD"}
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Notifications

### Get Customer Notifications

Retrieves notifications for a specific customer.

**Endpoint**: `GET /api/customers/:id/notifications`

**Parameters**:
- `id` (path parameter): Customer ID
- `read` (optional query parameter): Filter by read status (true/false)
- `type` (optional query parameter): Filter by notification type
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all notifications for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/notifications" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "notif_001",
      "type": "ORDER_CONFIRMATION",
      "title": "Order Confirmed",
      "message": "Your order #order_001 has been confirmed",
      "read": false,
      "created_at": "2024-04-22T16:10:00Z"
    },
    {
      "id": "notif_002",
      "type": "SHIPMENT_UPDATE",
      "title": "Order Shipped",
      "message": "Your order #order_001 has been shipped",
      "read": true,
      "created_at": "2024-04-22T18:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

## Customer Loyalty

### Get Customer Loyalty Information

Retrieves loyalty program information for a specific customer.

**Endpoint**: `GET /api/customers/:id/loyalty`

**Parameters**:
- `id` (path parameter): Customer ID

**Example Request**:
```bash
# Get loyalty information for customer cust_001
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/loyalty" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": {
    "tier": "GOLD",
    "points": 1250,
    "points_to_next_tier": 750,
    "benefits": [
      "Free shipping on all orders",
      "10% discount on all purchases",
      "Early access to sales"
    ],
    "upcoming_expiration": {
      "points": 200,
      "date": "2024-06-30T23:59:59Z"
    },
    "history": [
      {
        "transaction_id": "trans_001",
        "points": 300,
        "type": "EARNED",
        "description": "Order #order_001",
        "date": "2024-04-22T16:00:00Z"
      }
    ]
  }
}
```

## Customer Addresses

### Get All Customer Addresses

Retrieves all addresses associated with a specific customer.

**Endpoint**: `GET /api/customers/:id/addresses`

**Parameters**:
- `id` (path parameter): Customer ID
- `type` (optional query parameter): Filter by address type (SHIPPING, BILLING)
- `page` (optional query parameter): Page number for pagination (default: 1)
- `limit` (optional query parameter): Number of results per page (default: 20)

**Example Request**:
```bash
# Get all addresses for customer cust_002
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_002/addresses" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "addr_001",
      "type": "SHIPPING",
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "US",
      "is_default": true
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

### Add New Customer Address

Adds a new address for a specific customer.

**Endpoint**: `POST /api/customers/:id/addresses`

**Parameters**:
- `id` (path parameter): Customer ID

**Request Body**:
```json
{
  "type": "SHIPPING",
  "line1": "456 Market St",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94105",
  "country": "US",
  "is_default": true
}
```

**Example Request**:
```bash
# Add new address for customer cust_002
curl -X POST "https://ecom-store-ebon.vercel.app/api/customers/cust_002/addresses" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SHIPPING",
    "line1": "456 Market St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "is_default": true
  }'
```

**Example Response**:
```json
{
  "data": {
    "id": "addr_002",
    "type": "SHIPPING",
    "line1": "456 Market St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "is_default": true,
    "created_at": "2024-04-24T10:15:00Z"
  }
}
```

### Get Specific Customer Address

Retrieves a specific address for a customer by address ID.

**Endpoint**: `GET /api/customers/:id/addresses/:addressId`

**Parameters**:
- `id` (path parameter): Customer ID
- `addressId` (path parameter): Address ID

**Example Request**:
```bash
# Get specific address for customer cust_002
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_002/addresses/addr_001" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": {
    "id": "addr_001",
    "type": "SHIPPING",
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "is_default": false
  }
}
```

### Update Customer Address

Updates a specific address for a customer.

**Endpoint**: `PUT /api/customers/:id/addresses/:addressId`

**Parameters**:
- `id` (path parameter): Customer ID
- `addressId` (path parameter): Address ID

**Request Body**:
```json
{
  "line1": "789 Oak St",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94105",
  "country": "US",
  "is_default": true
}
```

**Example Request**:
```bash
# Update address for customer cust_002
curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/cust_002/addresses/addr_001" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "789 Oak St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "is_default": true
  }'
```

**Example Response**:
```json
{
  "data": {
    "id": "addr_001",
    "type": "SHIPPING",
    "line1": "789 Oak St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "is_default": true,
    "updated_at": "2024-04-24T10:30:00Z"
  }
}
```

### Delete Customer Address

Deletes a specific address for a customer.

**Endpoint**: `DELETE /api/customers/:id/addresses/:addressId`

**Parameters**:
- `id` (path parameter): Customer ID
- `addressId` (path parameter): Address ID

**Example Request**:
```bash
# Delete address for customer cust_002
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/customers/cust_002/addresses/addr_002" \
  -u admin:admin123
```

**Example Response**:
```json
{
  "data": {
    "success": true,
    "message": "Address deleted successfully"
  }
}
```

## Error Responses

All API endpoints will return appropriate HTTP status codes and error messages in case of errors.

**Example Error Response** (404 Not Found):
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Customer address not found"
  }
}
```

**Example Error Response** (401 Unauthorized):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  }
}
```

**Example Error Response** (403 Forbidden):
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource"
  }
}
```

**Example Error Response** (400 Bad Request):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "postal_code",
        "message": "Postal code is required"
      }
    ]
  }
}
``` 