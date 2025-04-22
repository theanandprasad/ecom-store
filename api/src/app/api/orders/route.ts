import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { Order, OrderItem } from '@/types';

/**
 * GET /api/orders
 * Fetch all orders with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all orders
    const orders = await DataService.getOrders();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');
    
    // Apply filters
    let filteredOrders = orders;
    
    // Filter by customer ID if provided
    if (customerId) {
      filteredOrders = filteredOrders.filter(
        order => order.customer_id === customerId
      );
    }
    
    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(
        order => order.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedOrders, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching orders'
    );
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id || !body.items || !body.shipping_address) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['customer_id', 'items', 'shipping_address']
        }
      );
    }
    
    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Order must contain at least one item',
        { field: 'items' }
      );
    }
    
    // Check if customer exists
    const customer = await DataService.getCustomerById(body.customer_id);
    if (!customer) {
      return errorResponse(
        'CUSTOMER_NOT_FOUND',
        `Customer with ID '${body.customer_id}' not found`,
        { customer_id: body.customer_id }
      );
    }
    
    // Validate each item and calculate total amount
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];
    
    for (const item of body.items) {
      if (!item.product_id || !item.quantity) {
        return errorResponse(
          'VALIDATION_ERROR',
          'Each item must have a product_id and quantity',
          { field: 'items' }
        );
      }
      
      // Check if product exists and is in stock
      const product = await DataService.getProductById(item.product_id);
      if (!product) {
        return errorResponse(
          'PRODUCT_NOT_FOUND',
          `Product with ID '${item.product_id}' not found`,
          { product_id: item.product_id }
        );
      }
      
      if (!product.in_stock || product.stock_quantity < item.quantity) {
        return errorResponse(
          'VALIDATION_ERROR',
          `Product '${product.name}' is not available in the requested quantity`,
          { 
            product_id: item.product_id,
            requested_quantity: item.quantity,
            available_quantity: product.stock_quantity
          }
        );
      }
      
      // Calculate item total
      const itemTotal = product.price.amount * item.quantity;
      totalAmount += itemTotal;
      
      // Add item to order items
      orderItems.push({
        id: `item_${orderItems.length + 1}`,
        product_id: item.product_id,
        quantity: item.quantity,
        price: {
          amount: product.price.amount,
          currency: product.price.currency
        },
        status: 'PENDING'
      });
    }
    
    // Get all orders
    const orders = await DataService.getOrders();
    
    // Generate a new order ID
    const orderId = `order_${(orders.length + 1).toString().padStart(3, '0')}`;
    
    // Create a new order
    const newOrder: Order = {
      id: orderId,
      customer_id: body.customer_id,
      status: 'PENDING',
      items: orderItems,
      total_amount: {
        amount: totalAmount,
        currency: 'USD' // Default currency
      },
      shipping_address: body.shipping_address,
      billing_address: body.billing_address || body.shipping_address,
      payment_method: body.payment_method || 'CREDIT_CARD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new order to the orders array
    orders.push(newOrder);
    
    // In a real implementation, we would:
    // 1. Save the updated orders list
    // 2. Update product stock quantities
    // 3. Create payment records
    // 4. Send confirmation emails
    
    // For now, we're just simulating the creation
    
    // Return the created order
    return successResponse(newOrder);
    
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the order'
    );
  }
} 