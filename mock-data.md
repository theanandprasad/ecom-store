# E-Commerce Store Mock Data Specification

## Table of Contents
1. [Data Structure Overview](#data-structure-overview)
2. [Mock Data Categories](#mock-data-categories)
3. [Data Relationships](#data-relationships)
4. [Mock Data Files](#mock-data-files)
5. [Data Generation Rules](#data-generation-rules)

## Data Structure Overview

### Base Data Types
```typescript
interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
}

interface Money {
    amount: number;
    currency: string;
}

interface Address {
    id: string;
    type: 'SHIPPING' | 'BILLING';
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    is_default: boolean;
}
```

## Mock Data Categories

### 1. Products
```typescript
interface Product extends BaseEntity {
    name: string;
    description: string;
    price: Money;
    in_stock: boolean;
    stock_quantity: number;
    images: string[];
    attributes: {
        color?: string;
        size?: string;
        material?: string;
        weight?: string;
    };
    category: string;
    brand: string;
    rating: number;
    review_count: number;
    tags: string[];
    specifications: Record<string, string>;
}
```

### 2. Customers
```typescript
interface Customer extends BaseEntity {
    email: string;
    name: string;
    phone: string;
    addresses: Address[];
    preferences: {
        language: string;
        currency: string;
        marketing_emails: boolean;
    };
    loyalty_points: number;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}
```

### 3. Orders
```typescript
interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: Money;
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

interface Order extends BaseEntity {
    customer_id: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    items: OrderItem[];
    total_amount: Money;
    shipping_address: Address;
    billing_address: Address;
    payment_method: string;
    tracking_number?: string;
    estimated_delivery?: string;
}
```

### 4. Reviews
```typescript
interface Review extends BaseEntity {
    product_id: string;
    customer_id: string;
    rating: number;
    title: string;
    content: string;
    images?: string[];
    verified_purchase: boolean;
    helpful_votes: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
```

### 5. Carts
```typescript
interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    price: Money;
}

interface Cart extends BaseEntity {
    customer_id?: string;
    items: CartItem[];
    total_amount: Money;
    expires_at: string;
}
```

### 6. Wishlists
```typescript
interface WishlistItem extends BaseEntity {
    product_id: string;
    added_at: string;
}

interface Wishlist extends BaseEntity {
    customer_id: string;
    items: WishlistItem[];
}
```

### 7. Promotions
```typescript
interface Promotion extends BaseEntity {
    name: string;
    description: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
    value: number;
    start_date: string;
    end_date: string;
    applicable_products: string[];
    min_purchase_amount?: Money;
    max_discount_amount?: Money;
}
```

## Data Relationships

### Product Relationships
- Products belong to categories
- Products have multiple reviews
- Products can be in multiple carts
- Products can be in multiple wishlists
- Products can have multiple promotions

### Customer Relationships
- Customers have multiple addresses
- Customers have multiple orders
- Customers have multiple reviews
- Customers have one cart
- Customers have one wishlist
- Customers have loyalty points

### Order Relationships
- Orders belong to one customer
- Orders have multiple items
- Orders have shipping and billing addresses
- Orders can have promotions applied

## Mock Data Files

### 1. products.json
```json
{
    "products": [
        {
            "id": "prod_001",
            "name": "Premium Wireless Headphones",
            "description": "High-quality wireless headphones with noise cancellation",
            "price": {
                "amount": 199.99,
                "currency": "USD"
            },
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
            "category": "Electronics",
            "brand": "TechBrand",
            "rating": 4.5,
            "review_count": 120,
            "tags": ["wireless", "noise-cancelling", "premium"],
            "specifications": {
                "Bluetooth": "5.0",
                "Charging": "USB-C",
                "Water Resistance": "IPX4"
            }
        }
    ]
}
```

### 2. customers.json
```json
{
    "customers": [
        {
            "id": "cust_001",
            "email": "john.doe@example.com",
            "name": "John Doe",
            "phone": "+1234567890",
            "addresses": [
                {
                    "id": "addr_001",
                    "type": "SHIPPING",
                    "street": "123 Main St",
                    "city": "New York",
                    "state": "NY",
                    "zip": "10001",
                    "country": "US",
                    "is_default": true
                }
            ],
            "preferences": {
                "language": "en",
                "currency": "USD",
                "marketing_emails": true
            },
            "loyalty_points": 1500,
            "tier": "GOLD"
        }
    ]
}
```

### 3. orders.json
```json
{
    "orders": [
        {
            "id": "order_001",
            "customer_id": "cust_001",
            "status": "SHIPPED",
            "items": [
                {
                    "id": "item_001",
                    "product_id": "prod_001",
                    "quantity": 1,
                    "price": {
                        "amount": 199.99,
                        "currency": "USD"
                    },
                    "status": "SHIPPED"
                }
            ],
            "total_amount": {
                "amount": 199.99,
                "currency": "USD"
            },
            "shipping_address": {
                "id": "addr_001",
                "type": "SHIPPING",
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "country": "US",
                "is_default": true
            },
            "billing_address": {
                "id": "addr_001",
                "type": "BILLING",
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "country": "US",
                "is_default": true
            },
            "payment_method": "pm_001",
            "tracking_number": "TRK123456",
            "estimated_delivery": "2024-03-25T10:00:00Z"
        }
    ]
}
```

## Data Generation Rules

### Product Generation
1. Generate 100 unique products
2. Distribute across 5-10 categories
3. Include 3-5 brands
4. Ensure realistic pricing ranges
5. Include various attributes and specifications

### Customer Generation
1. Generate 5 unique customers
2. Include realistic names and emails
3. Generate 1-3 addresses per customer
4. Distribute loyalty tiers appropriately
5. Include various preference combinations

### Order Generation
1. Generate 50-100 orders
2. Distribute across all customers
3. Include 1-5 items per order
4. Use realistic order status distribution
5. Include various shipping and payment methods

### Review Generation
1. Generate 2-5 reviews per product
2. Ensure realistic rating distribution
3. Include verified and unverified purchases
4. Generate helpful vote counts
5. Include various review statuses

### Cart Generation
1. Generate active carts for 30-50% of customers
2. Include 1-5 items per cart
3. Ensure realistic cart totals
4. Include various cart states

### Wishlist Generation
1. Generate wishlists for 40-60% of customers
2. Include 1-10 items per wishlist
3. Ensure realistic product distribution
4. Include various wishlist states

### Promotion Generation
1. Generate 10-20 active promotions
2. Include various promotion types
3. Ensure realistic discount values
4. Include various product applicability
5. Set appropriate date ranges 