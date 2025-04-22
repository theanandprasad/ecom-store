import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          E-Commerce API Documentation
        </p>
      </div>

      <div className="relative flex place-items-center my-16">
        <h1 className="text-4xl font-bold">E-Commerce Store API</h1>
      </div>

      <div className="mb-8 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">API Documentation</h2>
          <div className="flex gap-4">
            <Link href="/api/docs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Interactive Docs
            </Link>
            <Link href="/swagger.json" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
              Swagger/OpenAPI Spec
            </Link>
          </div>
        </div>
        <p className="mb-4">
          This API provides endpoints for managing an e-commerce store, including products, customers, orders, carts, reviews, and more.
          All endpoints support filtering, pagination, and proper error handling.
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            API Endpoints
          </h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/products</code> - List all products
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/products/:id</code> - Get a specific product
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/products</code> - Create a new product
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/products/:id</code> - Update a product
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/products/:id</code> - Delete a product
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/products/:id/reviews</code> - Get product reviews
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/products/:id/reviews</code> - Add a review to a product
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Customers</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/customers</code> - List all customers
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id</code> - Get a specific customer
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/customers</code> - Create a new customer
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/customers/:id</code> - Update a customer
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/customers/:id</code> - Delete a customer
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/orders</code> - Get customer orders
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/cart</code> - Get customer cart
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/wishlist</code> - Get customer wishlist
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/reviews</code> - Get customer reviews
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/support-tickets</code> - Get customer support tickets
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/returns</code> - Get customer returns
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/notifications</code> - Get customer notifications
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/loyalty</code> - Get customer loyalty info
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/addresses</code> - Get customer addresses
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/customers/:id/addresses</code> - Add new customer address
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:id/addresses/:addressId</code> - Get specific customer address
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/customers/:id/addresses/:addressId</code> - Update customer address
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/customers/:id/addresses/:addressId</code> - Delete customer address
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Orders</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/orders</code> - List all orders
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/orders/:id</code> - Get a specific order
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/orders</code> - Create a new order
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/orders/:id</code> - Update an order
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/orders/:id</code> - Delete an order
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Carts</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/carts</code> - List all carts
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/carts</code> - Create a new cart
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/carts/:id</code> - Get a specific cart
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/carts/:id</code> - Update a cart
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/carts/:id</code> - Delete a cart
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/carts/:id/items</code> - Add item to cart
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/carts/:id/items/:itemId</code> - Remove item from cart
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Wishlists</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/wishlists</code> - List all wishlists
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/wishlists</code> - Create a new wishlist
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/wishlists/:id</code> - Get wishlist details
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/wishlists/:id</code> - Update a wishlist
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/wishlists/:id</code> - Delete a wishlist
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/wishlists/:id/items</code> - Add item to wishlist
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/wishlists/:id/items/:itemId</code> - Remove item from wishlist
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Promotions</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/promotions</code> - List all promotions
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/promotions</code> - Create a new promotion
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/promotions/:id</code> - Get promotion details
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/promotions/:id</code> - Update a promotion
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/promotions/:id</code> - Delete a promotion
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Support</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/support/tickets</code> - List all support tickets
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/support/tickets</code> - Create a new support ticket
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/support/tickets/:id</code> - Get ticket details
              </li>
              <li>
                <code className="font-mono font-bold">PUT /api/support/tickets/:id</code> - Update a ticket
              </li>
              <li>
                <code className="font-mono font-bold">DELETE /api/support/tickets/:id</code> - Delete a ticket
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">FAQ</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/faq</code> - List all FAQ items
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/faq/lookup</code> - Find answer to a query
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Returns</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/returns</code> - List all returns
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/returns</code> - Create a new return request
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/products/:productId/reviews</code> - Get reviews for a product
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/products/:productId/reviews</code> - Create a review for a product
              </li>
              <li>
                <code className="font-mono font-bold">GET /api/customers/:customerId/reviews</code> - Get reviews by a customer
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">GET /api/search/products</code> - Search products
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Authentication</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code className="font-mono font-bold">POST /api/auth/send-otp</code> - Send one-time password
              </li>
              <li>
                <code className="font-mono font-bold">POST /api/auth/verify-otp</code> - Verify one-time password
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <p className="mb-4">
          The API supports two authentication methods:
        </p>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. Basic Authentication</h3>
          <p className="mb-2">
            Most API endpoints require Basic Authentication:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              Authorization: Basic base64(username:password)
            </code>
          </pre>
          <p className="mt-2">
            Default credentials: <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">admin:admin123</code>
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">2. OTP-based Authentication</h3>
          <p className="mb-2">
            For client applications, use the OTP (One-Time Password) flow:
          </p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>
              <strong>Request OTP:</strong> Send a request to <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">POST /api/auth/send-otp</code> with <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">{`{"phone_or_email": "user@example.com"}`}</code>
            </li>
            <li>
              <strong>Verify OTP:</strong> Send the received code to <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">POST /api/auth/verify-otp</code> with <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">{`{"otp_session_id": "session_id", "code": "123456"}`}</code>
            </li>
            <li>
              <strong>Use JWT Token:</strong> Include the returned JWT token in subsequent requests: <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">Authorization: Bearer &lt;token&gt;</code>
            </li>
          </ol>
        </div>
      </div>

      <div className="mb-8 w-full max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4">Testing and Documentation</h2>
        <p className="mb-4">
          The API includes comprehensive unit tests for all endpoints. The documentation is available in both this interactive page and
          through the Swagger/OpenAPI specification.
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Running Tests</h3>
          <pre className="overflow-x-auto">
            <code className="text-sm">
              npm run test
            </code>
          </pre>
        </div>
      </div>
      
      <footer className="border-t border-gray-300 mt-8 pt-8 w-full text-center text-sm">
        <p>
          E-Commerce Store API - Built with Next.js and TypeScript
        </p>
      </footer>
    </main>
  );
}
