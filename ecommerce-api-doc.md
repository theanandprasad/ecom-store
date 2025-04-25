# E-Commerce API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Products](#products)
4. [Categories](#categories)
5. [Customers](#customers)
6. [Orders](#orders)
7. [Carts](#carts)
8. [Wishlists](#wishlists)
9. [Promotions](#promotions)
10. [Support](#support)
11. [FAQ](#faq)
12. [Returns](#returns)
13. [Search](#search)
14. [Authentication Endpoints](#authentication-endpoints)

## Introduction

This API provides comprehensive endpoints for an e-commerce platform. The API follows RESTful conventions and supports pagination, filtering, and proper error handling.

**Base URL:** `https://ecom-store-ebon.vercel.app/api`

## Authentication

Most API endpoints require Basic Authentication:

```
Authorization: Basic base64(username:password)
```

Default credentials: `admin:admin123`

For client applications, OTP-based authentication is also available.

## Products

### List all products
Retrieves a paginated list of products with optional filtering.

**Endpoint:** `GET /products`

**Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `category` (optional): Filter by product category
- `search` (optional): Search term to filter products
- `sort_by` (optional): Field to sort by (name, price, created_at)
- `sort_order` (optional): Sort direction (asc, desc)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/products?page=${PAGE}&limit=${LIMIT}&category=${CATEGORY}&search=${SEARCH_TERM}&sort_by=${SORT_FIELD}&sort_order=${SORT_DIRECTION}" \
  -u admin:admin123
```

**Note:** For more reliable category filtering with complete product details, use the `/categories/:categoryId/products` endpoint instead.

### Get a specific product
Retrieves detailed information about a single product.

**Endpoint:** `GET /products/:productId`

**Path Parameters:**
- `productId` (required): The unique identifier of the product

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/products/${PRODUCT_ID}" \
  -u admin:admin123
```

### Create a new product
Adds a new product to the catalog.

**Endpoint:** `POST /products`

**Request Body Parameters:**
- `name` (required): Product name
- `description` (required): Product description
- `price` (required): Product price
- `image_url` (required): URL to product image
- `category` (required): Product category
- `stock` (required): Available inventory
- `attributes` (optional): Additional product attributes

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/products" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${PRODUCT_NAME}",
    "description": "${PRODUCT_DESCRIPTION}",
    "price": ${PRICE},
    "image_url": "${IMAGE_URL}",
    "category": "${CATEGORY}",
    "stock": ${STOCK_QUANTITY}
  }'
```

### Update a product
Updates an existing product's information.

**Endpoint:** `PUT /products/:productId`

**Path Parameters:**
- `productId` (required): The unique identifier of the product

**Request Body Parameters:**
- `name` (optional): Updated product name
- `description` (optional): Updated product description
- `price` (optional): Updated product price
- `image_url` (optional): Updated URL to product image
- `category` (optional): Updated product category
- `stock` (optional): Updated inventory amount

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/products/${PRODUCT_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${UPDATED_NAME}",
    "price": ${UPDATED_PRICE},
    "stock": ${UPDATED_STOCK}
  }'
```

### Delete a product
Removes a product from the catalog.

**Endpoint:** `DELETE /products/:productId`

**Path Parameters:**
- `productId` (required): The unique identifier of the product

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/products/${PRODUCT_ID}" \
  -u admin:admin123
```

### Get product reviews
Retrieves all reviews for a specific product.

**Endpoint:** `GET /products/:productId/reviews`

**Path Parameters:**
- `productId` (required): The unique identifier of the product

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `rating` (optional): Filter by rating (1-5)
- `sort` (optional): Field to sort by (created_at, helpful_votes)
- `order` (optional): Sort direction (asc, desc)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/products/${PRODUCT_ID}/reviews?page=${PAGE}&limit=${LIMIT}&rating=${RATING}" \
  -u admin:admin123
```

### Add a review to a product
Adds a customer review for a specific product.

**Endpoint:** `POST /products/:productId/reviews`

**Path Parameters:**
- `productId` (required): The unique identifier of the product

**Request Body Parameters:**
- `customer_id` (required): ID of the customer writing the review
- `rating` (required): Rating from 1-5
- `title` (required): Review title
- `content` (required): Review content
- `verified_purchase` (optional): Whether this is from a verified purchase
- `images` (optional): Array of image URLs for the review

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/products/${PRODUCT_ID}/reviews" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "${CUSTOMER_ID}",
    "rating": ${RATING},
    "title": "${REVIEW_TITLE}",
    "content": "${REVIEW_CONTENT}",
    "verified_purchase": ${IS_VERIFIED}
  }'
```

## Categories

### List all categories
Retrieves a paginated list of product categories.

**Endpoint:** `GET /categories`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/categories?page=${PAGE}&limit=${LIMIT}" \
  -u admin:admin123
```

### Get a specific category
Retrieves detailed information about a product category.

**Endpoint:** `GET /categories/:categoryId`

**Path Parameters:**
- `categoryId` (required): The unique identifier of the category

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/categories/${CATEGORY_ID}" \
  -u admin:admin123
```

### Create a new category
Adds a new product category to the catalog.

**Endpoint:** `POST /categories`

**Request Body Parameters:**
- `name` (required): Name of the category
- `description` (optional): Description of the category

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/categories" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${CATEGORY_NAME}",
    "description": "${CATEGORY_DESCRIPTION}"
  }'
```

### Update a category
Updates an existing product category's information.

**Endpoint:** `PUT /categories/:categoryId`

**Path Parameters:**
- `categoryId` (required): The unique identifier of the category

**Request Body Parameters:**
- `name` (optional): Updated category name
- `description` (optional): Updated category description

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/categories/${CATEGORY_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${UPDATED_NAME}",
    "description": "${UPDATED_DESCRIPTION}"
  }'
```

### Delete a category
Removes a product category from the catalog.

**Endpoint:** `DELETE /categories/:categoryId`

**Path Parameters:**
- `categoryId` (required): The unique identifier of the category

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/categories/${CATEGORY_ID}" \
  -u admin:admin123
```

### Get products by category
Retrieves all products that belong to a specific category.

**Endpoint:** `GET /categories/:categoryId/products`

**Path Parameters:**
- `categoryId` (required): The unique identifier of the category

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 10): Number of items per page
- `sort_by` (optional, default: 'created_at'): Field to sort by (name, price, created_at)
- `sort_order` (optional, default: 'desc'): Sort direction (asc, desc)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/categories/${CATEGORY_ID}/products?page=${PAGE}&limit=${LIMIT}&sort_by=${SORT_FIELD}&sort_order=${SORT_DIRECTION}" \
  -u admin:admin123
```

**Note:** This is the recommended method for retrieving products by category, as it provides comprehensive product details and proper pagination.

## Customers

### List all customers
Retrieves a paginated list of customers.

**Endpoint:** `GET /customers`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `tier` (optional): Filter by loyalty tier (BRONZE, SILVER, GOLD, PLATINUM)
- `sort` (optional): Field to sort by (name, created_at, loyalty_points)
- `order` (optional): Sort direction (asc, desc)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers?page=${PAGE}&limit=${LIMIT}&tier=${TIER}&sort=${SORT_FIELD}&order=${SORT_DIRECTION}" \
  -u admin:admin123
```

### Get a specific customer
Retrieves detailed information about a customer.

**Endpoint:** `GET /customers/:customerId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}" \
  -u admin:admin123
```

### Create a new customer
Registers a new customer.

**Endpoint:** `POST /customers`

**Request Body Parameters:**
- `name` (required): Customer's full name
- `email` (required): Customer's email address
- `phone` (optional): Customer's phone number
- `preferences` (optional): Customer preferences object
  - `language` (optional): Preferred language
  - `currency` (optional): Preferred currency
  - `marketing_emails` (optional): Whether to send marketing emails

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/customers" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${CUSTOMER_NAME}",
    "email": "${CUSTOMER_EMAIL}",
    "phone": "${PHONE_NUMBER}",
    "preferences": {
      "language": "${PREFERRED_LANGUAGE}",
      "currency": "${PREFERRED_CURRENCY}",
      "marketing_emails": ${MARKETING_EMAILS_ENABLED}
    }
  }'
```

### Update a customer
Updates a customer's information.

**Endpoint:** `PUT /customers/:customerId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Request Body Parameters:**
- `name` (optional): Updated customer name
- `email` (optional): Updated email address
- `phone` (optional): Updated phone number
- `preferences` (optional): Updated customer preferences

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${UPDATED_NAME}",
    "phone": "${UPDATED_PHONE}",
    "preferences": {
      "marketing_emails": ${MARKETING_EMAILS_ENABLED}
    }
  }'
```

### Delete a customer
Removes a customer from the system.

**Endpoint:** `DELETE /customers/:customerId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}" \
  -u admin:admin123
```

### Get customer orders
Retrieves order history for a specific customer.

**Endpoint:** `GET /customers/:customerId/orders`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by order status
- `date_from` (optional): Filter orders after this date (ISO format)
- `date_to` (optional): Filter orders before this date (ISO format)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/orders?page=${PAGE}&limit=${LIMIT}&status=${ORDER_STATUS}" \
  -u admin:admin123
```

### Get customer cart
Retrieves the current shopping cart for a customer.

**Endpoint:** `GET /customers/:customerId/cart`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/cart" \
  -u admin:admin123
```

### Get customer wishlist
Retrieves the wishlist for a specific customer.

**Endpoint:** `GET /customers/:customerId/wishlist`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/wishlist?page=${PAGE}&limit=${LIMIT}" \
  -u admin:admin123
```

### Get customer reviews
Retrieves all reviews written by a specific customer.

**Endpoint:** `GET /customers/:customerId/reviews`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `rating` (optional): Filter by rating (1-5)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/reviews?page=${PAGE}&limit=${LIMIT}&rating=${RATING}" \
  -u admin:admin123
```

### Get customer support tickets
Retrieves all support tickets created by a customer.

**Endpoint:** `GET /customers/:customerId/support-tickets`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by ticket status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `category` (optional): Filter by ticket category

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/support-tickets?page=${PAGE}&limit=${LIMIT}&status=${TICKET_STATUS}" \
  -u admin:admin123
```

### Get customer returns
Retrieves all return requests made by a customer.

**Endpoint:** `GET /customers/:customerId/returns`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by return status (REQUESTED, APPROVED, RECEIVED, REFUNDED, REJECTED)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/returns?page=${PAGE}&limit=${LIMIT}&status=${RETURN_STATUS}" \
  -u admin:admin123
```

### Get customer notifications
Retrieves notifications for a customer.

**Endpoint:** `GET /customers/:customerId/notifications`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `read` (optional): Filter by read status (true/false)
- `type` (optional): Filter by notification type

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/notifications?page=${PAGE}&limit=${LIMIT}&read=${READ_STATUS}" \
  -u admin:admin123
```

### Get customer loyalty info
Retrieves the customer's loyalty program status and points.

**Endpoint:** `GET /customers/:customerId/loyalty`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/loyalty" \
  -u admin:admin123
```

### Get customer addresses
Retrieves all shipping and billing addresses for a customer.

**Endpoint:** `GET /customers/:customerId/addresses`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `type` (optional): Filter by address type (SHIPPING, BILLING)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/addresses?page=${PAGE}&limit=${LIMIT}&type=${ADDRESS_TYPE}" \
  -u admin:admin123
```

### Add new customer address
Adds a new address for a customer.

**Endpoint:** `POST /customers/:customerId/addresses`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer

**Request Body Parameters:**
- `type` (required): Address type (SHIPPING or BILLING)
- `line1` (required): Street address
- `city` (required): City
- `state` (required): State or province
- `postal_code` (required): Zip or postal code
- `country` (required): Country code
- `is_default` (optional): Whether this is the default address of its type

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/addresses" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "${ADDRESS_TYPE}",
    "line1": "${STREET_ADDRESS}",
    "city": "${CITY}",
    "state": "${STATE}",
    "postal_code": "${ZIP_CODE}",
    "country": "${COUNTRY_CODE}",
    "is_default": ${IS_DEFAULT_ADDRESS}
  }'
```

### Get specific customer address
Retrieves a specific address for a customer.

**Endpoint:** `GET /customers/:customerId/addresses/:addressId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer
- `addressId` (required): The unique identifier of the address

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/addresses/${ADDRESS_ID}" \
  -u admin:admin123
```

### Update customer address
Updates an existing customer address.

**Endpoint:** `PUT /customers/:customerId/addresses/:addressId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer
- `addressId` (required): The unique identifier of the address

**Request Body Parameters:**
- `line1` (optional): Updated street address
- `city` (optional): Updated city
- `state` (optional): Updated state or province
- `postal_code` (optional): Updated zip or postal code
- `country` (optional): Updated country code
- `is_default` (optional): Whether this is the default address of its type

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/addresses/${ADDRESS_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "${UPDATED_STREET_ADDRESS}",
    "city": "${UPDATED_CITY}",
    "state": "${UPDATED_STATE}",
    "postal_code": "${UPDATED_ZIP_CODE}",
    "country": "${UPDATED_COUNTRY_CODE}",
    "is_default": ${UPDATED_IS_DEFAULT}
  }'
```

### Delete customer address
Removes an address from a customer's profile.

**Endpoint:** `DELETE /customers/:customerId/addresses/:addressId`

**Path Parameters:**
- `customerId` (required): The unique identifier of the customer
- `addressId` (required): The unique identifier of the address

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/customers/${CUSTOMER_ID}/addresses/${ADDRESS_ID}" \
  -u admin:admin123
```

## Orders

### List all orders
Retrieves a paginated list of orders with optional filtering.

**Endpoint:** `GET /orders`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by order status
- `customer_id` (optional): Filter by customer
- `min_total` (optional): Filter by minimum total amount
- `max_total` (optional): Filter by maximum total amount
- `sort` (optional): Field to sort by (created_at, total_amount)
- `order` (optional): Sort direction (asc, desc)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/orders?page=${PAGE}&limit=${LIMIT}&status=${ORDER_STATUS}&customer_id=${CUSTOMER_ID}" \
  -u admin:admin123
```

### Get a specific order
Retrieves detailed information about an order including items, shipping, and payment.

**Endpoint:** `GET /orders/:orderId`

**Path Parameters:**
- `orderId` (required): The unique identifier of the order

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/orders/${ORDER_ID}" \
  -u admin:admin123
```

### Create a new order
Places a new order for a customer.

**Endpoint:** `POST /orders`

**Request Body Parameters:**
- `customer_id` (required): ID of the customer placing the order
- `items` (required): Array of order items
  - `product_id` (required): ID of the product
  - `quantity` (required): Quantity of the product
- `shipping_address_id` (required): ID of the shipping address
- `billing_address_id` (optional): ID of the billing address (if different from shipping)
- `payment_method` (required): Payment method to use

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/orders" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "${CUSTOMER_ID}",
    "items": [
      {
        "product_id": "${PRODUCT_ID}",
        "quantity": ${QUANTITY}
      }
    ],
    "shipping_address_id": "${SHIPPING_ADDRESS_ID}",
    "payment_method": "${PAYMENT_METHOD}"
  }'
```

### Update an order
Updates the status or details of an existing order.

**Endpoint:** `PUT /orders/:orderId`

**Path Parameters:**
- `orderId` (required): The unique identifier of the order

**Request Body Parameters:**
- `status` (optional): Updated order status
- `tracking_number` (optional): Shipping tracking number
- `estimated_delivery` (optional): Estimated delivery date
- `notes` (optional): Order notes or special instructions

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/orders/${ORDER_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "${UPDATED_STATUS}",
    "tracking_number": "${TRACKING_NUMBER}",
    "estimated_delivery": "${ESTIMATED_DELIVERY_DATE}"
  }'
```

### Delete an order
Cancels and removes an order from the system.

**Endpoint:** `DELETE /orders/:orderId`

**Path Parameters:**
- `orderId` (required): The unique identifier of the order

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/orders/${ORDER_ID}" \
  -u admin:admin123
```

## Carts

### List all carts
Retrieves a paginated list of shopping carts in the system.

**Endpoint:** `GET /carts`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `customer_id` (optional): Filter by customer
- `status` (optional): Filter by cart status

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/carts?page=${PAGE}&limit=${LIMIT}&customer_id=${CUSTOMER_ID}&status=${STATUS}" \
  -u admin:admin123
```

### Create a new cart
Creates a new shopping cart, optionally linked to a customer.

**Endpoint:** `POST /carts`

**Request Body Parameters:**
- `customer_id` (optional): ID of the customer to link the cart to
- `metadata` (optional): Additional metadata for the cart

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/carts" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "${CUSTOMER_ID}"
  }'
```

### Get a specific cart
Retrieves detailed information about a shopping cart including items.

**Endpoint:** `GET /carts/:cartId`

**Path Parameters:**
- `cartId` (required): The unique identifier of the cart

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/carts/${CART_ID}" \
  -u admin:admin123
```

### Update a cart
Updates cart metadata or status.

**Endpoint:** `PUT /carts/:cartId`

**Path Parameters:**
- `cartId` (required): The unique identifier of the cart

**Request Body Parameters:**
- `status` (optional): Updated cart status
- `metadata` (optional): Updated cart metadata
- `customer_id` (optional): Customer to associate with the cart

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/carts/${CART_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "${UPDATED_STATUS}",
    "metadata": {
      "source": "${SOURCE}"
    }
  }'
```

### Delete a cart
Removes a shopping cart from the system.

**Endpoint:** `DELETE /carts/:cartId`

**Path Parameters:**
- `cartId` (required): The unique identifier of the cart

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/carts/${CART_ID}" \
  -u admin:admin123
```

### Add item to cart
Adds a product to a shopping cart.

**Endpoint:** `POST /carts/:cartId/items`

**Path Parameters:**
- `cartId` (required): The unique identifier of the cart

**Request Body Parameters:**
- `product_id` (required): ID of the product to add
- `quantity` (required): Quantity of the product
- `options` (optional): Product options (size, color, etc.)

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/carts/${CART_ID}/items" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "${PRODUCT_ID}",
    "quantity": ${QUANTITY}
  }'
```

### Remove item from cart
Removes a product from a shopping cart.

**Endpoint:** `DELETE /carts/:cartId/items/:itemId`

**Path Parameters:**
- `cartId` (required): The unique identifier of the cart
- `itemId` (required): The unique identifier of the cart item

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/carts/${CART_ID}/items/${ITEM_ID}" \
  -u admin:admin123
```

## Wishlists

### List all wishlists
Retrieves a paginated list of wishlists.

**Endpoint:** `GET /wishlists`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `customer_id` (optional): Filter by customer

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/wishlists?page=${PAGE}&limit=${LIMIT}&customer_id=${CUSTOMER_ID}" \
  -u admin:admin123
```

### Create a new wishlist
Creates a new wishlist for a customer.

**Endpoint:** `POST /wishlists`

**Request Body Parameters:**
- `customer_id` (required): ID of the customer who owns the wishlist
- `name` (optional): Name of the wishlist
- `is_public` (optional): Whether the wishlist is public
- `description` (optional): Description of the wishlist

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/wishlists" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "${CUSTOMER_ID}",
    "name": "${WISHLIST_NAME}"
  }'
```

### Get wishlist details
Retrieves detailed information about a wishlist including items.

**Endpoint:** `GET /wishlists/:wishlistId`

**Path Parameters:**
- `wishlistId` (required): The unique identifier of the wishlist

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/wishlists/${WISHLIST_ID}" \
  -u admin:admin123
```

### Update a wishlist
Updates wishlist metadata or settings.

**Endpoint:** `PUT /wishlists/:wishlistId`

**Path Parameters:**
- `wishlistId` (required): The unique identifier of the wishlist

**Request Body Parameters:**
- `name` (optional): Updated wishlist name
- `is_public` (optional): Whether the wishlist is public
- `description` (optional): Updated wishlist description

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/wishlists/${WISHLIST_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${UPDATED_NAME}",
    "is_public": ${IS_PUBLIC}
  }'
```

### Delete a wishlist
Removes a wishlist from the system.

**Endpoint:** `DELETE /wishlists/:wishlistId`

**Path Parameters:**
- `wishlistId` (required): The unique identifier of the wishlist

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/wishlists/${WISHLIST_ID}" \
  -u admin:admin123
```

### Add item to wishlist
Adds a product to a wishlist.

**Endpoint:** `POST /wishlists/:wishlistId/items`

**Path Parameters:**
- `wishlistId` (required): The unique identifier of the wishlist

**Request Body Parameters:**
- `product_id` (required): ID of the product to add
- `notes` (optional): Personal notes about the item

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/wishlists/${WISHLIST_ID}/items" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "${PRODUCT_ID}",
    "notes": "${ITEM_NOTES}"
  }'
```

### Remove item from wishlist
Removes a product from a wishlist.

**Endpoint:** `DELETE /wishlists/:wishlistId/items/:itemId`

**Path Parameters:**
- `wishlistId` (required): The unique identifier of the wishlist
- `itemId` (required): The unique identifier of the wishlist item

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/wishlists/${WISHLIST_ID}/items/${ITEM_ID}" \
  -u admin:admin123
```

## Promotions

### List all promotions
Retrieves a paginated list of promotions and discounts.

**Endpoint:** `GET /promotions`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `type` (optional): Filter by promotion type
- `active` (optional): Filter active promotions (true/false)

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/promotions?page=${PAGE}&limit=${LIMIT}&type=${PROMOTION_TYPE}&active=${IS_ACTIVE}" \
  -u admin:admin123
```

### Create a new promotion
Creates a new promotion or discount.

**Endpoint:** `POST /promotions`

**Request Body Parameters:**
- `name` (required): Name of the promotion
- `description` (required): Description of the promotion
- `type` (required): Type of promotion (PERCENTAGE, FIXED_AMOUNT, BUY_X_GET_Y, etc.)
- `value` (required): Value of the promotion (percentage or amount)
- `code` (optional): Promotion code for customer to apply
- `start_date` (required): Start date of the promotion
- `end_date` (required): End date of the promotion
- `active` (required): Whether the promotion is active

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/promotions" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "${PROMOTION_NAME}",
    "description": "${PROMOTION_DESCRIPTION}",
    "type": "${PROMOTION_TYPE}",
    "value": ${PROMOTION_VALUE},
    "code": "${PROMOTION_CODE}",
    "start_date": "${START_DATE}",
    "end_date": "${END_DATE}",
    "active": ${IS_ACTIVE}
  }'
```

### Get promotion details
Retrieves detailed information about a promotion.

**Endpoint:** `GET /promotions/:promotionId`

**Path Parameters:**
- `promotionId` (required): The unique identifier of the promotion

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/promotions/${PROMOTION_ID}" \
  -u admin:admin123
```

### Update a promotion
Updates an existing promotion.

**Endpoint:** `PUT /promotions/:promotionId`

**Path Parameters:**
- `promotionId` (required): The unique identifier of the promotion

**Request Body Parameters:**
- `description` (optional): Updated promotion description
- `value` (optional): Updated promotion value
- `end_date` (optional): Updated end date
- `active` (optional): Updated active status

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/promotions/${PROMOTION_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "${UPDATED_DESCRIPTION}",
    "value": ${UPDATED_VALUE},
    "end_date": "${UPDATED_END_DATE}",
    "active": ${UPDATED_IS_ACTIVE}
  }'
```

### Delete a promotion
Removes a promotion from the system.

**Endpoint:** `DELETE /promotions/:promotionId`

**Path Parameters:**
- `promotionId` (required): The unique identifier of the promotion

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/promotions/${PROMOTION_ID}" \
  -u admin:admin123
```

## Support

### List all support tickets
Retrieves a paginated list of customer support tickets.

**Endpoint:** `GET /support/tickets`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by ticket status
- `priority` (optional): Filter by priority level
- `customer_id` (optional): Filter by customer

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/support/tickets?page=${PAGE}&limit=${LIMIT}&status=${TICKET_STATUS}&priority=${PRIORITY}" \
  -u admin:admin123
```

### Create a new support ticket
Creates a new customer support ticket.

**Endpoint:** `POST /support/tickets`

**Request Body Parameters:**
- `customer_id` (required): ID of the customer creating the ticket
- `subject` (required): Ticket subject line
- `message` (required): Ticket message content
- `category` (required): Ticket category
- `priority` (optional, default: MEDIUM): Ticket priority (LOW, MEDIUM, HIGH, CRITICAL)
- `order_id` (optional): Related order ID

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/support/tickets" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "${CUSTOMER_ID}",
    "subject": "${TICKET_SUBJECT}",
    "message": "${TICKET_MESSAGE}",
    "category": "${TICKET_CATEGORY}",
    "priority": "${PRIORITY}",
    "order_id": "${ORDER_ID}"
  }'
```

### Get ticket details
Retrieves detailed information about a support ticket.

**Endpoint:** `GET /support/tickets/:ticketId`

**Path Parameters:**
- `ticketId` (required): The unique identifier of the support ticket

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/support/tickets/${TICKET_ID}" \
  -u admin:admin123
```

### Update a ticket
Updates a support ticket's status or details.

**Endpoint:** `PUT /support/tickets/:ticketId`

**Path Parameters:**
- `ticketId` (required): The unique identifier of the support ticket

**Request Body Parameters:**
- `status` (optional): Updated ticket status
- `agent_notes` (optional): Support agent notes
- `priority` (optional): Updated priority level
- `resolution` (optional): Ticket resolution details

```bash
curl -X PUT "https://ecom-store-ebon.vercel.app/api/support/tickets/${TICKET_ID}" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "${UPDATED_STATUS}",
    "agent_notes": "${AGENT_NOTES}",
    "priority": "${UPDATED_PRIORITY}"
  }'
```

### Delete a ticket
Removes a support ticket from the system.

**Endpoint:** `DELETE /support/tickets/:ticketId`

**Path Parameters:**
- `ticketId` (required): The unique identifier of the support ticket

```bash
curl -X DELETE "https://ecom-store-ebon.vercel.app/api/support/tickets/${TICKET_ID}" \
  -u admin:admin123
```

## FAQ

### List all FAQ items
Retrieves a paginated list of frequently asked questions.

**Endpoint:** `GET /faq`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `category` (optional): Filter by FAQ category (e.g., "SHIPPING", "RETURNS", "PAYMENTS", "ORDERS", etc.)
- `search` (optional): Search in question and answer fields

**Example Request:**
```bash
# Get all shipping-related FAQs
curl -X GET "https://ecom-store-ebon.vercel.app/api/faq?category=SHIPPING" \
  -u admin:admin123
```

**Example Response:**
```json
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

### Find answer to a query
Searches for FAQ items matching a user query. This endpoint uses a relevance-based search algorithm that considers both the question and answer fields, with more weight given to matches in the question field.

**Endpoint:** `GET /faq/lookup`

**Query Parameters:**
- `query` (required): Search query for finding relevant FAQ items

**Example Request:**
```bash
# Find FAQ answers related to shipping
curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=shipping" \
  -u admin:admin123
```

**Example Response:**
```json
{
  "data": {
    "answer": "We offer several shipping options: Standard (3-5 business days), Express (2-3 business days), and Overnight (next business day). Shipping costs vary based on the option selected and your location. Free shipping is available for orders over $50.",
    "confidence": 0.83,
    "source": "FAQ faq_007"
  }
}
```

**Example Specific Queries:**
```bash
# Find information about international shipping
curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=international+shipping" \
  -u admin:admin123

# Find information about shipping costs
curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=shipping+cost" \
  -u admin:admin123

# Find information about delivery times
curl -X GET "https://ecom-store-ebon.vercel.app/api/faq/lookup?query=how+long+shipping" \
  -u admin:admin123
```

## Returns

### List all returns
Retrieves a paginated list of product return requests.

**Endpoint:** `GET /returns`

**Query Parameters:**
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page
- `status` (optional): Filter by return status
- `customer_id` (optional): Filter by customer
- `order_id` (optional): Filter by order

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/returns?page=${PAGE}&limit=${LIMIT}&status=${RETURN_STATUS}&customer_id=${CUSTOMER_ID}" \
  -u admin:admin123
```

### Create a new return request
Creates a new product return request.

**Endpoint:** `POST /returns`

**Request Body Parameters:**
- `order_id` (required): ID of the order containing returned items
- `customer_id` (required): ID of the customer making the return
- `items` (required): Array of items to return
  - `product_id` (required): ID of the product being returned
  - `quantity` (required): Quantity to return
  - `reason` (required): Reason for return (DEFECTIVE, WRONG_ITEM, NO_LONGER_NEEDED, etc.)
  - `description` (optional): Additional details about the return reason

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/returns" \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "${ORDER_ID}",
    "customer_id": "${CUSTOMER_ID}",
    "items": [
      {
        "product_id": "${PRODUCT_ID}",
        "quantity": ${QUANTITY},
        "reason": "${RETURN_REASON}",
        "description": "${RETURN_DESCRIPTION}"
      }
    ]
  }'
```

## Search

### Search products
Searches for products matching the given query.

**Endpoint:** `GET /search/products`

**Query Parameters:**
- `query` (required): Search term to find matching products
- `category` (optional): Filter by product category
- `price_min` (optional): Minimum price filter
- `price_max` (optional): Maximum price filter
- `sort` (optional): Field to sort by (relevance, price, created_at)
- `order` (optional): Sort direction (asc, desc)
- `page` (optional, default: 1): The page number for pagination
- `limit` (optional, default: 20): Number of items per page

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/search/products?query=${SEARCH_QUERY}&category=${CATEGORY}&price_min=${MIN_PRICE}&price_max=${MAX_PRICE}&sort=${SORT_FIELD}&order=${SORT_DIRECTION}&page=${PAGE}&limit=${LIMIT}" \
  -u admin:admin123
```

**Note on filtering products by category:**
For basic category filtering with search capabilities, use this endpoint with a generic search term and the category parameter. For complete product details filtered by category without requiring a search term, use the `/categories/:categoryId/products` endpoint instead, which is the recommended approach.

## Authentication Endpoints

### Send one-time password
Sends a one-time password to the user's email or phone for authentication.

**Endpoint:** `POST /auth/send-otp`

**Request Body Parameters:**
- `phone_or_email` (required): User's phone number or email address

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_or_email": "${USER_EMAIL_OR_PHONE}"
  }'
```

### Verify one-time password
Verifies a one-time password and returns an authentication token.

**Endpoint:** `POST /auth/verify-otp`

**Request Body Parameters:**
- `otp_session_id` (required): Session ID received from the send-otp endpoint
- `code` (required): OTP code received by the user

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "otp_session_id": "${OTP_SESSION_ID}",
    "code": "${OTP_CODE}"
  }'
``` 