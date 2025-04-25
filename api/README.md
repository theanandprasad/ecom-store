# E-Commerce Store API

This project implements a comprehensive REST API for an e-commerce store using Next.js API routes and mock data. It provides endpoints for managing products, customers, orders, and other e-commerce features.

## Technologies Used

- Next.js 14
- TypeScript
- Mock JSON data
- Jest for testing
- Swagger/OpenAPI for documentation

## Features

- **Product Management:** Create, read, update, and delete products with support for categories, attributes, and images.
- **Customer Management:** Manage customer profiles, preferences, and addresses.
- **Order Processing:** Handle order creation, status updates, and history.
- **Shopping Cart:** Implement cart operations with item management and persistence.
- **Wishlist Management:** Allow customers to maintain wishlists with their favorite products.
- **Review System:** Collect and display product reviews with ratings and moderation.
- **Promotions & Discounts:** Configure and apply promotional offers to products.
- **Support System:** Manage support tickets and customer requests.
- **Returns & Refunds:** Process return requests and refunds.
- **FAQ Management:** Store and retrieve frequently asked questions.
- **Search Functionality:** Find products using various criteria.
- **Authentication:** Secure API access using Basic Authentication.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the API directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Set up environment variables (copy .env.example to .env.local):

```bash
cp .env.example .env.local
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The API will be available at `https://ecom-store-ebon.vercel.app/api`.

## Testing

The API includes comprehensive unit tests for all endpoints. To run the tests:

```bash
npm run test
```

Tests cover:
- Request validation
- Response formatting
- Error handling
- Data manipulation
- Authentication
- Business logic

## API Documentation

API documentation is available in multiple formats:

1. **Interactive Swagger UI**: Visit `/api/docs` while the server is running
2. **OpenAPI Specification**: Available at `/swagger.json`
3. **Homepage Documentation**: Visit the root URL `/` for a comprehensive overview

### Authentication

All API endpoints are protected with Basic Authentication. Include the following header in all requests:

```
Authorization: Basic base64(username:password)
```

Default credentials:
- Username: admin
- Password: admin123

### API Endpoints

#### Products

- `GET /api/products` - List all products (supports pagination and filtering)
- `POST /api/products` - Create a new product
- `GET /api/products/:productId` - Get a specific product
- `PUT /api/products/:productId` - Update a product
- `DELETE /api/products/:productId` - Delete a product
- `GET /api/products/:productId/reviews` - Get product reviews
- `POST /api/products/:productId/reviews` - Add a review for a product

#### Customers

- `GET /api/customers` - List all customers (supports pagination and filtering)
- `POST /api/customers` - Create a new customer
- `GET /api/customers/:customerId` - Get a specific customer
- `PUT /api/customers/:customerId` - Update a customer
- `DELETE /api/customers/:customerId` - Delete a customer

#### Orders

- `GET /api/orders` - List all orders (supports pagination and filtering)
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderId` - Get a specific order
- `PUT /api/orders/:orderId` - Update an order
- `DELETE /api/orders/:orderId` - Delete an order

#### Carts

- `GET /api/carts` - List all carts
- `POST /api/carts` - Create a new cart
- `GET /api/carts/:cartId` - Get a specific cart
- `PUT /api/carts/:cartId` - Update a cart
- `DELETE /api/carts/:cartId` - Delete a cart
- `POST /api/carts/:cartId/items` - Add items to cart
- `DELETE /api/carts/:cartId/items/:itemId` - Remove item from cart

#### Wishlists

- `GET /api/wishlists` - List all wishlists
- `POST /api/wishlists` - Create a new wishlist
- `GET /api/wishlists/:wishlistId` - Get wishlist details
- `PUT /api/wishlists/:wishlistId` - Update a wishlist
- `DELETE /api/wishlists/:wishlistId` - Delete a wishlist
- `POST /api/wishlists/:wishlistId/items` - Add item to wishlist
- `DELETE /api/wishlists/:wishlistId/items/:itemId` - Remove item from wishlist

### Example Requests

#### Get Products

```
GET /api/products?page=1&limit=20&category=Electronics
```

#### Create a Product

```json
POST /api/products
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": {
    "amount": 199.99,
    "currency": "USD"
  },
  "category": "Electronics",
  "brand": "TechBrand",
  "stock_quantity": 50,
  "in_stock": true,
  "tags": ["wireless", "noise-cancelling", "premium"]
}
```

#### Add a Review

```json
POST /api/products/prod_001/reviews
{
  "customer_id": "cust_001",
  "rating": 5,
  "title": "Excellent Product",
  "content": "These headphones are amazing! The sound quality is superb and battery life is excellent.",
  "verified_purchase": true
}
```

## Project Structure

```
api/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   └── [productId]/
│   │   │   │       └── reviews/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── carts/
│   │   │   └── ...
│   │   └── page.tsx
│   ├── lib/
│   │   └── data-service.ts
│   ├── middleware.ts
│   ├── middlewares/
│   │   └── auth-middleware.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── api-utils.ts
│   └── __tests__/
│       ├── products.test.ts
│       └── reviews.test.ts
├── public/
│   └── swagger.json
├── mock-data/
│   ├── products.json
│   ├── customers.json
│   └── ...
├── package.json
└── README.md
```

## Mock Data

The API uses mock JSON data from the following files:

- products.json
- customers.json
- orders.json
- carts.json
- wishlists.json
- reviews.json
- promotions.json
- support_tickets.json
- faq.json
- returns.json
- notifications.json

## Future Enhancements

- Move from mock data to a real database
- Implement JWT authentication with refresh tokens
- Add rate limiting for API endpoints
- Implement logging and monitoring
- Create a frontend admin dashboard
- Add webhooks for order events
- Support multi-language content

## License

This project is licensed under the MIT License.
