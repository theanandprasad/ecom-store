# Supported Use Cases

This document outlines the use cases currently supported by our E-Commerce Store API and the specific API endpoints to use for each.

**Base URL**: [https://ecom-store-ebon.vercel.app/](https://ecom-store-ebon.vercel.app/)

## How to Use This Guide

Each use case includes:
- The API endpoint(s) to use
- Example request (including headers, params, body)
- Expected response data

For brevity, all examples:
- Assume Basic Auth with `admin:admin123` credentials
- Use `curl` for HTTP requests
- Show abbreviated responses (full responses may contain more fields)

## Order Management

### Order Status & Tracking
- View order status (pending, processing, shipped, delivered)
  - `GET /api/orders/:id`
  - Example:
    ```bash
    # Get order status for order_001
    curl -X GET "https://ecom-store-ebon.vercel.app/api/orders/order_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "order_001",
        "status": "SHIPPED",
        "tracking_number": "TRK123456",
        "estimated_delivery": "2024-03-25T10:00:00Z",
        "items": [
          {"id": "item_001", "product_id": "prod_001", "status": "SHIPPED"}
        ]
      }
    }
    ```
- Track specific order by ID
  - `GET /api/orders/:id`
  - Example: (same as above)
- Get delivery updates
  - `GET /api/orders/:id`
  - Example: (same as above, check `tracking_number` and `estimated_delivery`)

### Order History
- View past orders
  - `GET /api/orders`
  - Example:
    ```bash
    # Get all orders
    curl -X GET "https://ecom-store-ebon.vercel.app/api/orders" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "id": "order_001",
          "customer_id": "cust_001",
          "status": "SHIPPED",
          "created_at": "2024-03-15T10:00:00Z"
        },
        {
          "id": "order_002",
          "customer_id": "cust_001",
          "status": "DELIVERED",
          "created_at": "2024-02-10T14:30:00Z"
        }
      ],
      "meta": {
        "total": 2,
        "page": 1,
        "limit": 20,
        "totalPages": 1
      }
    }
    ```
  - `GET /api/customers/:id/orders`
  - Example:
    ```bash
    # Get orders for customer cust_001
    curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/orders" \
      -u admin:admin123
    ```
    ```json
    # Response - similar to the previous example
    {
      "data": [
        {"id": "order_001", "status": "SHIPPED", "created_at": "2024-03-15T10:00:00Z"},
        {"id": "order_002", "status": "DELIVERED", "created_at": "2024-02-10T14:30:00Z"}
      ],
      "meta": {"total": 2, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```
- Filter orders by date/status
  - `GET /api/orders?status=SHIPPED&date=2024-01-01`
  - Example:
    ```bash
    # Get all shipped orders since Jan 1, 2024
    curl -X GET "https://ecom-store-ebon.vercel.app/api/orders?status=SHIPPED&date_after=2024-01-01" \
      -u admin:admin123
    ```
    ```json
    # Response - filtered orders
    {
      "data": [
        {"id": "order_001", "status": "SHIPPED", "created_at": "2024-03-15T10:00:00Z"}
      ],
      "meta": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```
- Search for specific order
  - `GET /api/orders?search=keyword`
  - Example:
    ```bash
    # Search for order by tracking number
    curl -X GET "https://ecom-store-ebon.vercel.app/api/orders?search=TRK123456" \
      -u admin:admin123
    ```
    ```json
    # Response - matched orders
    {
      "data": [
        {
          "id": "order_001",
          "tracking_number": "TRK123456",
          "status": "SHIPPED"
        }
      ],
      "meta": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```

### Order Modification
- Cancel pending order
  - `PUT /api/orders/:id` (update status to CANCELLED)
  - Example:
    ```bash
    # Cancel order_001
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/orders/order_001" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{"status": "CANCELLED"}'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "order_001",
        "status": "CANCELLED",
        "updated_at": "2024-04-22T14:30:00Z"
      }
    }
    ```
- Change shipping address
  - `PUT /api/orders/:id`
  - Example:
    ```bash
    # Update shipping address for order_001
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/orders/order_001" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "shipping_address": {
          "street": "456 New Street",
          "city": "New York",
          "state": "NY",
          "zip": "10001",
          "country": "US"
        }
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "order_001",
        "shipping_address": {
          "street": "456 New Street",
          "city": "New York",
          "state": "NY",
          "zip": "10001",
          "country": "US"
        },
        "updated_at": "2024-04-22T14:35:00Z"
      }
    }
    ```
- Update delivery instructions
  - `PUT /api/orders/:id`
  - Example:
    ```bash
    # Add delivery instructions
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/orders/order_001" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{"delivery_instructions": "Leave at front door"}'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "order_001",
        "delivery_instructions": "Leave at front door",
        "updated_at": "2024-04-22T14:40:00Z"
      }
    }
    ```

### Order Issues
- Report missing items via support tickets
  - `POST /api/support/tickets`
  - Example:
    ```bash
    # Create support ticket for missing item
    curl -X POST "https://ecom-store-ebon.vercel.app/api/support/tickets" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "customer_id": "cust_001",
        "subject": "Missing Item",
        "message": "My order (order_001) is missing one of the items I ordered",
        "category": "ORDER_ISSUES",
        "priority": "HIGH",
        "order_id": "order_001"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "ticket_001",
        "status": "OPEN",
        "category": "ORDER_ISSUES",
        "priority": "HIGH",
        "created_at": "2024-04-22T14:45:00Z"
      }
    }
    ```
- Report damaged items via support tickets
  - `POST /api/support/tickets`
  - Example: (similar to above, with different subject/message)

## Product Discovery

### Product Search
- Search by product name
  - `GET /api/products?search=keyword`
  - Example:
    ```bash
    # Search for headphones
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products?search=headphones" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "id": "prod_001",
          "name": "Premium Wireless Headphones",
          "price": {"amount": 199.99, "currency": "USD"},
          "in_stock": true
        }
      ],
      "meta": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```
  - `GET /api/search/products?query=keyword`
  - Example:
    ```bash
    # Search for products using search endpoint
    curl -X GET "https://ecom-store-ebon.vercel.app/api/search/products?query=wireless" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "id": "prod_001",
          "name": "Premium Wireless Headphones",
          "description": "High-quality wireless headphones with noise cancellation",
          "relevance_score": 0.95
        }
      ],
      "meta": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```
- Use advanced search filters (category, price, etc.)
  - `GET /api/products?category=Electronics&min_price=100&max_price=500`
  - Example:
    ```bash
    # Find electronics between $100-$500
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products?category=Electronics&min_price=100&max_price=500" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "id": "prod_001",
          "name": "Premium Wireless Headphones",
          "price": {"amount": 199.99, "currency": "USD"},
          "category": "Electronics"
        },
        {
          "id": "prod_002",
          "name": "Smart Fitness Watch",
          "price": {"amount": 149.99, "currency": "USD"},
          "category": "Electronics"
        }
      ],
      "meta": {"total": 2, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```

### Product Availability
- Check stock status
  - `GET /api/products/:id` (check in_stock field)
  - Example:
    ```bash
    # Check if product is in stock
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products/prod_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "prod_001",
        "name": "Premium Wireless Headphones",
        "in_stock": true,
        "stock_quantity": 50
      }
    }
    ```
- View in-stock indicators
  - `GET /api/products?in_stock=true`
  - Example:
    ```bash
    # Get only in-stock products
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products?in_stock=true" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {"id": "prod_001", "name": "Premium Wireless Headphones", "in_stock": true},
        {"id": "prod_002", "name": "Smart Fitness Watch", "in_stock": true}
      ],
      "meta": {"total": 2, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```

### Product Information
- View detailed product information
  - `GET /api/products/:id`
  - Example:
    ```bash
    # Get detailed product info
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products/prod_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "prod_001",
        "name": "Premium Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation and 30-hour battery life",
        "price": {"amount": 199.99, "currency": "USD"},
        "in_stock": true,
        "stock_quantity": 50,
        "images": [
          "https://example.com/images/headphones-1.jpg",
          "https://example.com/images/headphones-2.jpg"
        ],
        "attributes": {
          "color": "Black",
          "weight": "250g",
          "battery_life": "30 hours"
        },
        "specifications": {
          "Bluetooth": "5.0",
          "Charging": "USB-C",
          "Water Resistance": "IPX4"
        }
      }
    }
    ```
- Read product reviews
  - `GET /api/products/:id/reviews`
  - Example:
    ```bash
    # Get reviews for a product
    curl -X GET "https://ecom-store-ebon.vercel.app/api/products/prod_001/reviews" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "id": "review_001",
          "customer_id": "cust_001",
          "rating": 5,
          "title": "Amazing sound quality",
          "content": "These headphones have the best sound I've ever experienced",
          "created_at": "2024-03-10T12:30:00Z"
        }
      ],
      "meta": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}
    }
    ```

## Shopping Experience

### Cart Management
- Add items to cart
  - `POST /api/carts/:id/items`
  - Example:
    ```bash
    # Add item to cart
    curl -X POST "https://ecom-store-ebon.vercel.app/api/carts/cart_001/items" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "product_id": "prod_001",
        "quantity": 2
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cart_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_001",
            "quantity": 2,
            "price": {"amount": 199.99, "currency": "USD"}
          }
        ],
        "total_amount": {"amount": 399.98, "currency": "USD"},
        "updated_at": "2024-04-22T15:10:00Z"
      }
    }
    ```
- Remove items from cart
  - `DELETE /api/carts/:id/items/:itemId`
  - Example:
    ```bash
    # Remove item from cart
    curl -X DELETE "https://ecom-store-ebon.vercel.app/api/carts/cart_001/items/item_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cart_001",
        "items": [],
        "total_amount": {"amount": 0, "currency": "USD"},
        "updated_at": "2024-04-22T15:15:00Z"
      }
    }
    ```
- Update quantities
  - `PUT /api/carts/:id`
  - Example:
    ```bash
    # Update cart with new quantities
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/carts/cart_001" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "items": [
          {
            "id": "item_001",
            "quantity": 3
          }
        ]
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cart_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_001",
            "quantity": 3,
            "price": {"amount": 199.99, "currency": "USD"}
          }
        ],
        "total_amount": {"amount": 599.97, "currency": "USD"},
        "updated_at": "2024-04-22T15:20:00Z"
      }
    }
    ```

### Cart Optimization
- Apply promotion codes
  - `PUT /api/carts/:id`
  - Example:
    ```bash
    # Apply promotion code to cart
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/carts/cart_001" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "promotion_codes": ["SPRING20"]
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cart_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_001",
            "quantity": 3,
            "price": {"amount": 199.99, "currency": "USD"}
          }
        ],
        "promotion_codes": ["SPRING20"],
        "discounts": [
          {
            "code": "SPRING20",
            "amount": {"amount": 119.99, "currency": "USD"},
            "description": "20% off your order"
          }
        ],
        "subtotal": {"amount": 599.97, "currency": "USD"},
        "total_amount": {"amount": 479.98, "currency": "USD"},
        "updated_at": "2024-04-22T15:25:00Z"
      }
    }
    ```
- Check shipping costs
  - `GET /api/carts/:id`
  - Example:
    ```bash
    # Get cart with shipping costs
    curl -X GET "https://ecom-store-ebon.vercel.app/api/carts/cart_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cart_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_001",
            "quantity": 3,
            "price": {"amount": 199.99, "currency": "USD"}
          }
        ],
        "subtotal": {"amount": 599.97, "currency": "USD"},
        "shipping_cost": {"amount": 10.00, "currency": "USD"},
        "total_amount": {"amount": 609.97, "currency": "USD"}
      }
    }
    ```

### Wishlist Management
- Add items to wishlist
  - `POST /api/wishlists/:id/items`
  - Example:
    ```bash
    # Add item to wishlist
    curl -X POST "https://ecom-store-ebon.vercel.app/api/wishlists/wish_001/items" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "product_id": "prod_002"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "wish_001",
        "customer_id": "cust_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_002",
            "added_at": "2024-04-22T15:30:00Z"
          }
        ],
        "updated_at": "2024-04-22T15:30:00Z"
      }
    }
    ```
- View saved wishlist items
  - `GET /api/wishlists/:id`
  - Example:
    ```bash
    # Get wishlist
    curl -X GET "https://ecom-store-ebon.vercel.app/api/wishlists/wish_001" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": {
        "id": "wish_001",
        "customer_id": "cust_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_002",
            "product": {
              "id": "prod_002",
              "name": "Smart Fitness Watch",
              "price": {"amount": 149.99, "currency": "USD"},
              "in_stock": true
            },
            "added_at": "2024-04-22T15:30:00Z"
          }
        ]
      }
    }
    ```
  - `GET /api/customers/:id/wishlist`
  - Example:
    ```bash
    # Get customer's wishlist
    curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/wishlist" \
      -u admin:admin123
    ```
    ```json
    # Response - similar to previous example
    {
      "data": {
        "id": "wish_001",
        "items": [
          {
            "id": "item_001",
            "product_id": "prod_002",
            "product": {
              "name": "Smart Fitness Watch",
              "price": {"amount": 149.99, "currency": "USD"}
            }
          }
        ]
      }
    }
    ```

## Customer Support

### Support Requests
- Submit support ticket
  - `POST /api/support/tickets`
- Track ticket status
  - `GET /api/support/tickets/:id`
- Add comments to existing ticket
  - `PUT /api/support/tickets/:id`

### Product Support
- Ask product questions via support tickets
  - `POST /api/support/tickets` (with category=PRODUCT_INQUIRY)
- Report product issues via support tickets
  - `POST /api/support/tickets` (with category=PRODUCT_ISSUES)

### Technical Support
- Report website issues via support tickets
  - `POST /api/support/tickets` (with category=TECHNICAL_ISSUE)
- Submit general technical inquiries
  - `POST /api/support/tickets` (with category=TECHNICAL_INQUIRY)

## Account Management

### Profile Management
- Update personal information
  - `PUT /api/customers/:id`
- Change contact details
  - `PUT /api/customers/:id`
- Update preferences
  - `PUT /api/customers/:id` (update preferences field)
- Manage communication settings
  - `PUT /api/customers/:id` (update preferences.marketing_emails field)

### Address Management
- Add new address
  - `POST /api/customers/:id/addresses`
- Update existing address
  - `PUT /api/customers/:id/addresses/:addressId`
- Set default address
  - `PUT /api/customers/:id/addresses/:addressId` (set is_default=true)
- Remove address
  - `DELETE /api/customers/:id/addresses/:addressId`

## Returns & Refunds

### Return Process
- Initiate return process
  - `POST /api/returns`
- Select return reason
  - `POST /api/returns` (include reason field)
- Track return status
  - `GET /api/returns?order_id=order_123`
  - `GET /api/customers/:id/returns`

## Reviews & Feedback

### Product Reviews
- Submit product review
  - `POST /api/products/:productId/reviews`
- Rate products
  - `POST /api/products/:productId/reviews` (include rating field)
- Read existing reviews
  - `GET /api/products/:productId/reviews`
- Filter reviews by rating
  - `GET /api/products/:productId/reviews?rating=5`

### Review Management
- Edit own reviews
  - `PUT /api/products/:productId/reviews/:reviewId`
- Delete own reviews
  - `DELETE /api/products/:productId/reviews/:reviewId`

## Loyalty & Rewards

### Basic Loyalty Features
- View loyalty tier status
  - `GET /api/customers/:id/loyalty`
  - `GET /api/customers/:id` (check tier field)
- Check loyalty points balance
  - `GET /api/customers/:id/loyalty`
  - `GET /api/customers/:id` (check loyalty_points field)
- View tier benefits
  - `GET /api/customers/:id/loyalty`

## Additional Features

### Authentication
- Basic authentication (username/password)
  - Include in request headers: `Authorization: Basic base64(username:password)`
  - Default credentials: `admin:admin123`
- OTP-based authentication
  - `POST /api/auth/send-otp`
  - `POST /api/auth/verify-otp`
- Get JWT tokens for secure access
  - `POST /api/auth/verify-otp` (returns token in response)

### FAQ
- Browse frequently asked questions
  - `GET /api/faq`
- Search for answers to common questions
  - `GET /api/faq/lookup?query=shipping`

#### Example Use Cases
- Get category-specific FAQs
  ```bash
  # Get all shipping-related FAQs
  curl -X GET "https://ecom-store-ebon.vercel.app/api/faq?category=SHIPPING" -u admin:admin123
  ```
  ```json
  # Response
  {
    "data": [
      {
        "id": "faq_007",
        "category": "SHIPPING",
        "question": "What are your shipping options?",
        "answer": "We offer several shipping options: Standard (3-5 business days), Express (2-3 business days), and Overnight (next business day). Shipping costs vary based on the option selected and your location. Free shipping is available for orders over $50.",
        "tags": ["shipping", "delivery", "options"],
        "last_updated": "2024-03-20T10:00:00Z"
      },
      {
        "id": "faq_008",
        "category": "SHIPPING",
        "question": "Do you ship internationally?",
        "answer": "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Some items may be restricted from international shipping due to local regulations. Please check the product page for shipping availability to your country.",
        "tags": ["international", "shipping", "delivery"],
        "last_updated": "2024-03-20T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 2
    }
  }
  ```

- Answer specific customer questions
  ```bash
  # Find specific information about international shipping
  curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=international+shipping" -u admin:admin123
  ```
  ```json
  # Response
  {
    "data": {
      "answer": "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Some items may be restricted from international shipping due to local regulations. Please check the product page for shipping availability to your country.",
      "confidence": 0.87,
      "source": "FAQ faq_008"
    }
  }
  ```

- Implement a customer self-service FAQ section
  ```bash
  # Get all FAQs for self-service knowledge base
  curl -X GET "https://ecom-store-ebon.vercel.app/api/faq?limit=100" -u admin:admin123
  ```

### Notifications
- View past notifications
  - `GET /api/customers/:id/notifications`
- Check notification status
  - `GET /api/customers/:id/notifications/:notificationId`

## API Capabilities for Developers

### Data Access
- Pagination for large data sets
  - Add `?page=1&limit=20` to any list endpoint
- Filtering by various parameters
  - Add query parameters like `?category=Electronics&in_stock=true`
- Sorting options
  - Add `?sort=price&order=desc` to list endpoints
- Detailed error handling
  - All endpoints return consistent error format
- Structured data responses
  - All endpoints return data in consistent JSON format

## Checkout Process

### Checkout Flow
- Process checkout
  - `POST /api/checkout`
  - Example:
    ```bash
    # Process checkout
    curl -X POST "https://ecom-store-ebon.vercel.app/api/checkout" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "cart_id": "cart_001",
        "customer_id": "cust_001",
        "shipping_address": {
          "line1": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "postal_code": "94105",
          "country": "US"
        },
        "payment_method": {
          "type": "credit_card",
          "card_token": "tok_visa"
        }
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "order_id": "order_001",
        "status": "created",
        "total_amount": {"amount": 609.97, "currency": "USD"},
        "created_at": "2024-04-22T16:00:00Z"
      }
    }
    ```
- Validate shipping information
  - `POST /api/shipping/validate`
  - Example:
    ```bash
    # Validate shipping information
    curl -X POST "https://ecom-store-ebon.vercel.app/api/shipping/validate" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "address": {
          "line1": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "postal_code": "94105",
          "country": "US"
        }
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "valid": true,
        "normalized_address": {
          "line1": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "postal_code": "94105",
          "country": "US"
        },
        "shipping_options": [
          {
            "id": "standard",
            "name": "Standard Shipping",
            "price": {"amount": 10.00, "currency": "USD"},
            "estimated_days": "3-5"
          },
          {
            "id": "express",
            "name": "Express Shipping",
            "price": {"amount": 25.00, "currency": "USD"},
            "estimated_days": "1-2"
          }
        ]
      }
    }
    ```

### Payment Processing
- Process payments
  - `POST /api/payments`
  - Example:
    ```bash
    # Process payment
    curl -X POST "https://ecom-store-ebon.vercel.app/api/payments" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "order_id": "order_001",
        "payment_method": {
          "type": "credit_card",
          "card_token": "tok_visa"
        },
        "amount": {"amount": 609.97, "currency": "USD"}
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "payment_id": "pay_001",
        "order_id": "order_001",
        "status": "succeeded",
        "amount": {"amount": 609.97, "currency": "USD"},
        "created_at": "2024-04-22T16:05:00Z"
      }
    }
    ```
- View payment history
  - `GET /api/customers/:id/payments`
  - Example:
    ```bash
    # Get customer payment history
    curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001/payments" \
      -u admin:admin123
    ```
    ```json
    # Response
    {
      "data": [
        {
          "payment_id": "pay_001",
          "order_id": "order_001",
          "status": "succeeded",
          "amount": {"amount": 609.97, "currency": "USD"},
          "method": "credit_card",
          "created_at": "2024-04-22T16:05:00Z"
        },
        {
          "payment_id": "pay_002",
          "order_id": "order_002",
          "status": "succeeded",
          "amount": {"amount": 89.99, "currency": "USD"},
          "method": "credit_card",
          "created_at": "2024-04-15T10:30:00Z"
        }
      ]
    }
    ```

### Order Confirmation
- Send order confirmation
  - `POST /api/notifications/order-confirmation`
  - Example:
    ```bash
    # Send order confirmation
    curl -X POST "https://ecom-store-ebon.vercel.app/api/notifications/order-confirmation" \
      -u admin:admin123 \
      -H "Content-Type: application/json" \
      -d '{
        "order_id": "order_001",
        "customer_id": "cust_001",
        "notification_method": "email"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "notification_id": "notif_001",
        "status": "sent",
        "sent_at": "2024-04-22T16:10:00Z"
      }
    }
    ```

## Account Management

### Customer Registration
- Register new customer
  - `POST /api/customers`
  - Example:
    ```bash
    # Register new customer
    curl -X POST "https://ecom-store-ebon.vercel.app/api/customers" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "jane.doe@example.com",
        "password": "SecurePassword123",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+1234567890"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cust_002",
        "email": "jane.doe@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "created_at": "2024-04-22T16:15:00Z"
      }
    }
    ```
- Verify customer email
  - `POST /api/customers/verify-email`
  - Example:
    ```bash
    # Verify customer email
    curl -X POST "https://ecom-store-ebon.vercel.app/api/customers/verify-email" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "jane.doe@example.com",
        "verification_code": "123456"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "verified": true,
        "customer_id": "cust_002"
      }
    }
    ```

### Customer Login
- Customer login
  - `POST /api/auth/login`
  - Example:
    ```bash
    # Customer login
    curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "jane.doe@example.com",
        "password": "SecurePassword123"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_at": "2024-04-23T16:20:00Z",
        "customer": {
          "id": "cust_002",
          "email": "jane.doe@example.com",
          "first_name": "Jane",
          "last_name": "Doe"
        }
      }
    }
    ```
- Password reset
  - `POST /api/auth/password-reset`
  - Example:
    ```bash
    # Request password reset
    curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/password-reset" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "jane.doe@example.com"
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "message": "Password reset instructions sent to email",
        "email": "jane.doe@example.com"
      }
    }
    ```

### Customer Profile
- View customer profile
  - `GET /api/customers/:id`
  - Example:
    ```bash
    # Get customer profile
    curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_002" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cust_002",
        "email": "jane.doe@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+1234567890",
        "addresses": [
          {
            "id": "addr_001",
            "type": "shipping",
            "line1": "123 Main St",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94105",
            "country": "US",
            "is_default": true
          }
        ],
        "created_at": "2024-04-22T16:15:00Z"
      }
    }
    ```
- Update customer profile
  - `PUT /api/customers/:id`
  - Example:
    ```bash
    # Update customer profile
    curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/cust_002" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
      -H "Content-Type: application/json" \
      -d '{
        "phone": "+1987654321",
        "addresses": [
          {
            "id": "addr_001",
            "line1": "456 Market St",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94105",
            "country": "US",
            "is_default": true
          }
        ]
      }'
    ```
    ```json
    # Response
    {
      "data": {
        "id": "cust_002",
        "email": "jane.doe@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+1987654321",
        "addresses": [
          {
            "id": "addr_001",
            "type": "shipping",
            "line1": "456 Market St",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94105",
            "country": "US",
            "is_default": true
          }
        ],
        "updated_at": "2024-04-22T16:25:00Z"
      }
    }
    ``` 