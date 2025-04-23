# Customer API Examples

This document provides example curl requests and sample responses for all customer-related API endpoints.

## Authentication

All examples use Basic Authentication with the following credentials:
- Username: `admin`
- Password: `admin123`

## GET /api/customers - List all customers

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers?page=1&limit=10" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "cust_001",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "+1 555-123-4567",
      "tier": "GOLD",
      "created_at": "2023-06-15T08:30:00Z"
    },
    {
      "id": "cust_002",
      "name": "Emily Johnson",
      "email": "emily.johnson@example.com",
      "phone": "+1 555-987-6543",
      "tier": "SILVER",
      "created_at": "2023-07-21T14:45:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "total_pages": 5
  }
}
```

## GET /api/customers/:id - Get a specific customer

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "id": "cust_001",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1 555-123-4567",
    "tier": "GOLD",
    "loyalty_points": 1250,
    "addresses": [
      {
        "id": "addr_001",
        "type": "SHIPPING",
        "line1": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94105",
        "country": "US",
        "is_default": true
      },
      {
        "id": "addr_002",
        "type": "BILLING",
        "line1": "456 Market St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "US",
        "is_default": true
      }
    ],
    "preferences": {
      "language": "en",
      "currency": "USD",
      "marketing_emails": true
    },
    "created_at": "2023-06-15T08:30:00Z",
    "updated_at": "2023-09-02T16:15:00Z"
  }
}
```

## POST /api/customers - Create a new customer

**Request:**

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/customers" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Wilson",
    "email": "sarah.wilson@example.com",
    "phone": "+1 555-234-5678",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "marketing_emails": true
    }
  }'
```

**Sample Response:**

```json
{
  "data": {
    "id": "cust_049",
    "name": "Sarah Wilson",
    "email": "sarah.wilson@example.com",
    "phone": "+1 555-234-5678",
    "tier": "BRONZE",
    "loyalty_points": 0,
    "preferences": {
      "language": "en",
      "currency": "USD",
      "marketing_emails": true
    },
    "created_at": "2023-09-25T10:30:00Z",
    "updated_at": "2023-09-25T10:30:00Z"
  }
}
```

## PUT /api/customers/:id - Update a customer

**Request:**

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/cust_001" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John A. Smith",
    "phone": "+1 555-123-8901",
    "preferences": {
      "marketing_emails": false
    }
  }'
```

**Sample Response:**

```json
{
  "data": {
    "id": "cust_001",
    "name": "John A. Smith",
    "email": "john.smith@example.com",
    "phone": "+1 555-123-8901",
    "tier": "GOLD",
    "loyalty_points": 1250,
    "preferences": {
      "language": "en",
      "currency": "USD",
      "marketing_emails": false
    },
    "updated_at": "2023-09-25T11:45:00Z"
  }
}
```

## DELETE /api/customers/:id - Delete a customer

**Request:**

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/customers/cust_049" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "success": true,
    "message": "Customer deleted successfully"
  }
}
```

## GET /api/customers/:id/orders - Get customer orders

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/orders?page=1&limit=10&status=SHIPPED" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "order_101",
      "status": "SHIPPED",
      "created_at": "2023-09-15T10:00:00Z",
      "total_amount": {"amount": 329.97, "currency": "USD"},
      "items_count": 3,
      "tracking_number": "TRACK9876543",
      "estimated_delivery": "2023-09-22"
    },
    {
      "id": "order_089",
      "status": "SHIPPED",
      "created_at": "2023-08-27T16:30:00Z",
      "total_amount": {"amount": 149.99, "currency": "USD"},
      "items_count": 1,
      "tracking_number": "TRACK8765432",
      "estimated_delivery": "2023-09-04"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/cart - Get customer cart

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/cart" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "id": "cart_054",
    "items": [
      {
        "id": "item_123",
        "product_id": "prod_056",
        "product": {
          "name": "Wireless Noise-Cancelling Headphones",
          "image": "https://example.com/images/headphones-bc35.jpg"
        },
        "quantity": 1,
        "price": {"amount": 249.99, "currency": "USD"}
      },
      {
        "id": "item_124",
        "product_id": "prod_089",
        "product": {
          "name": "Smartphone Fast Charger",
          "image": "https://example.com/images/charger-fg78.jpg"
        },
        "quantity": 2,
        "price": {"amount": 29.99, "currency": "USD"}
      }
    ],
    "subtotal": {"amount": 309.97, "currency": "USD"},
    "shipping_cost": {"amount": 9.99, "currency": "USD"},
    "total_amount": {"amount": 319.96, "currency": "USD"},
    "updated_at": "2023-09-25T09:20:00Z"
  }
}
```

## GET /api/customers/:id/wishlist - Get customer wishlist

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/wishlist?page=1&limit=10" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "id": "wish_023",
    "name": "Birthday Wishlist",
    "items": [
      {
        "id": "item_056",
        "product_id": "prod_117",
        "product": {
          "name": "Smart Fitness Watch",
          "price": {"amount": 199.99, "currency": "USD"},
          "image": "https://example.com/images/watch-bc12.jpg",
          "in_stock": true
        },
        "added_at": "2023-09-18T15:30:00Z",
        "notes": "In black color please"
      },
      {
        "id": "item_057",
        "product_id": "prod_235",
        "product": {
          "name": "Portable Bluetooth Speaker",
          "price": {"amount": 89.99, "currency": "USD"},
          "image": "https://example.com/images/speaker-df45.jpg",
          "in_stock": true
        },
        "added_at": "2023-09-20T11:45:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/reviews - Get customer reviews

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/reviews?page=1&limit=10&rating=5" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "review_045",
      "product_id": "prod_056",
      "product": {
        "name": "Wireless Noise-Cancelling Headphones"
      },
      "rating": 5,
      "title": "Best headphones I've ever owned",
      "content": "Amazing sound quality and the noise cancellation is outstanding. Battery life exceeds expectations!",
      "verified_purchase": true,
      "helpful_votes": 12,
      "created_at": "2023-08-14T10:30:00Z"
    },
    {
      "id": "review_067",
      "product_id": "prod_089",
      "product": {
        "name": "Smartphone Fast Charger"
      },
      "rating": 5,
      "title": "Super fast charging",
      "content": "This charger is incredibly fast. My phone charges from 0 to 50% in just 20 minutes!",
      "verified_purchase": true,
      "helpful_votes": 7,
      "created_at": "2023-09-05T16:15:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/support-tickets - Get customer support tickets

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/support-tickets?page=1&limit=10&status=OPEN" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "ticket_034",
      "subject": "Missing Item in Order",
      "category": "ORDER_ISSUES",
      "status": "OPEN",
      "priority": "HIGH",
      "created_at": "2023-09-22T14:45:00Z",
      "last_updated": "2023-09-22T16:30:00Z",
      "order_id": "order_101"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/returns - Get customer returns

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/returns?page=1&limit=10&status=APPROVED" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "return_023",
      "order_id": "order_089",
      "items": [
        {
          "product_id": "prod_073",
          "quantity": 1,
          "reason": "DEFECTIVE",
          "description": "Product arrived damaged with a cracked screen."
        }
      ],
      "status": "APPROVED",
      "created_at": "2023-09-02T10:15:00Z",
      "refund_amount": {"amount": 149.99, "currency": "USD"}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/notifications - Get customer notifications

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/notifications?page=1&limit=10&read=false" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": "notif_078",
      "type": "ORDER_SHIPPED",
      "title": "Your Order Has Shipped",
      "message": "Your order #order_101 has been shipped and is on its way!",
      "read": false,
      "created_at": "2023-09-18T09:30:00Z"
    },
    {
      "id": "notif_082",
      "type": "RETURN_APPROVED",
      "title": "Return Request Approved",
      "message": "Your return request #return_023 has been approved. Expect your refund in 3-5 business days.",
      "read": false,
      "created_at": "2023-09-03T15:45:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

## GET /api/customers/:id/loyalty - Get customer loyalty info

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/loyalty" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "tier": "GOLD",
    "points": 1250,
    "points_to_next_tier": 750,
    "benefits": [
      "Free shipping on all orders",
      "10% discount on all purchases",
      "Early access to sales",
      "Priority customer support"
    ],
    "upcoming_expiration": {
      "points": 200,
      "date": "2023-12-31T23:59:59Z"
    },
    "history": [
      {
        "transaction_id": "trans_112",
        "points": 300,
        "type": "EARNED",
        "description": "Order #order_101",
        "date": "2023-09-15T10:00:00Z"
      },
      {
        "transaction_id": "trans_098",
        "points": 150,
        "type": "EARNED",
        "description": "Order #order_089",
        "date": "2023-08-27T16:30:00Z"
      }
    ]
  }
}
```

## GET /api/customers/:id/addresses - Get customer addresses

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/addresses?page=1&limit=10&type=SHIPPING" \
  -u admin:admin123
```

**Sample Response:**

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
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

## POST /api/customers/:id/addresses - Add new customer address

**Request:**

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/customers/cust_001/addresses" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SHIPPING",
    "line1": "789 Park Avenue",
    "city": "New York",
    "state": "NY",
    "postal_code": "10021",
    "country": "US",
    "is_default": false
  }'
```

**Sample Response:**

```json
{
  "data": {
    "id": "addr_003",
    "type": "SHIPPING",
    "line1": "789 Park Avenue",
    "city": "New York",
    "state": "NY",
    "postal_code": "10021",
    "country": "US",
    "is_default": false,
    "created_at": "2023-09-25T14:30:00Z"
  }
}
```

## GET /api/customers/:id/addresses/:addressId - Get specific customer address

**Request:**

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/addresses/addr_001" \
  -u admin:admin123
```

**Sample Response:**

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
    "is_default": true,
    "created_at": "2023-06-15T09:00:00Z",
    "updated_at": "2023-06-15T09:00:00Z"
  }
}
```

## PUT /api/customers/:id/addresses/:addressId - Update customer address

**Request:**

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/cust_001/addresses/addr_001" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "125 Main St",
    "postal_code": "94106",
    "is_default": true
  }'
```

**Sample Response:**

```json
{
  "data": {
    "id": "addr_001",
    "type": "SHIPPING",
    "line1": "125 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94106",
    "country": "US",
    "is_default": true,
    "updated_at": "2023-09-25T15:20:00Z"
  }
}
```

## DELETE /api/customers/:id/addresses/:addressId - Delete customer address

**Request:**

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/customers/cust_001/addresses/addr_003" \
  -u admin:admin123
```

**Sample Response:**

```json
{
  "data": {
    "success": true,
    "message": "Address deleted successfully"
  }
}
``` 