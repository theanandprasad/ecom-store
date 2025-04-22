import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { Cart } from '@/types';

/**
 * GET /api/carts
 * Fetch all carts with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all carts
    const carts = await DataService.getCarts();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const customerId = searchParams.get('customer_id');
    
    // Apply filters
    let filteredCarts = carts;
    
    // Filter by customer ID if provided
    if (customerId) {
      filteredCarts = filteredCarts.filter(
        cart => cart.customer_id === customerId
      );
    }
    
    // Calculate pagination
    const total = filteredCarts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedCarts = filteredCarts.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedCarts, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching carts:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching carts'
    );
  }
}

/**
 * POST /api/carts
 * Create a new cart
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Get all carts
    const carts = await DataService.getCarts();
    
    // If customer_id is provided, check if the customer already has a cart
    if (body.customer_id) {
      const existingCart = await DataService.getCartByCustomerId(body.customer_id);
      if (existingCart) {
        return errorResponse(
          'RESOURCE_EXISTS',
          `Customer with ID '${body.customer_id}' already has a cart`,
          { 
            customer_id: body.customer_id,
            cart_id: existingCart.id
          }
        );
      }
      
      // Check if the customer exists
      const customer = await DataService.getCustomerById(body.customer_id);
      if (!customer) {
        return errorResponse(
          'CUSTOMER_NOT_FOUND',
          `Customer with ID '${body.customer_id}' not found`,
          { customer_id: body.customer_id }
        );
      }
    }
    
    // Generate a new cart ID
    const cartId = `cart_${(carts.length + 1).toString().padStart(3, '0')}`;
    
    // Set expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Create a new cart
    const newCart: Cart = {
      id: cartId,
      customer_id: body.customer_id || undefined,
      items: [],
      total_amount: {
        amount: 0,
        currency: 'USD'
      },
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new cart to the carts array
    carts.push(newCart);
    
    // In a real implementation, we would save the updated carts list
    // For now, we're just simulating the creation
    
    // Return the created cart
    return successResponse(newCart);
    
  } catch (error) {
    console.error('Error creating cart:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the cart'
    );
  }
} 