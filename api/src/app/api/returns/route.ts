import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse, notFoundResponse } from '@/utils/api-utils';
import { Return } from '@/types';

/**
 * GET /api/returns
 * Fetch all returns with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all returns
    const returns = await DataService.getReturns();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const customerId = searchParams.get('customer_id');
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');
    
    // Apply filters
    let filteredReturns = returns;
    
    // Filter by customer ID if provided
    if (customerId) {
      filteredReturns = filteredReturns.filter(
        returnItem => returnItem.customer_id === customerId
      );
    }
    
    // Filter by order ID if provided
    if (orderId) {
      filteredReturns = filteredReturns.filter(
        returnItem => returnItem.order_id === orderId
      );
    }
    
    // Filter by status if provided
    if (status) {
      filteredReturns = filteredReturns.filter(
        returnItem => returnItem.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Sort by date (newest first)
    filteredReturns.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const total = filteredReturns.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedReturns = filteredReturns.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedReturns, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching returns:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching returns'
    );
  }
}

/**
 * POST /api/returns
 * Create a new return request
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.order_id) {
      return errorResponse('VALIDATION_ERROR', 'order_id is required');
    }
    if (!body.customer_id) {
      return errorResponse('VALIDATION_ERROR', 'customer_id is required');
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'items is required and must be a non-empty array');
    }
    
    // Validate each item
    for (const item of body.items) {
      if (!item.product_id) {
        return errorResponse('VALIDATION_ERROR', 'product_id is required for each item');
      }
      if (!item.quantity || item.quantity <= 0) {
        return errorResponse('VALIDATION_ERROR', 'quantity is required and must be greater than 0');
      }
      if (!item.reason) {
        return errorResponse('VALIDATION_ERROR', 'reason is required for each item');
      }
    }
    
    // Verify the order exists
    const order = await DataService.getOrderById(body.order_id);
    if (!order) {
      return notFoundResponse('order', body.order_id);
    }
    
    // Verify the customer exists
    const customer = await DataService.getCustomerById(body.customer_id);
    if (!customer) {
      return notFoundResponse('customer', body.customer_id);
    }
    
    // Verify that the order belongs to the customer
    if (order.customer_id !== body.customer_id) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Order does not belong to the specified customer',
        { order_id: body.order_id, customer_id: body.customer_id }
      );
    }
    
    // Create a new return
    const now = new Date().toISOString();
    const newReturn: Return = {
      id: `ret_${Date.now()}`,
      order_id: body.order_id,
      customer_id: body.customer_id,
      items: body.items,
      status: 'PENDING',
      created_at: now,
      updated_at: now
    };
    
    // Add refund amount if provided
    if (body.refund_amount) {
      newReturn.refund_amount = body.refund_amount;
    }
    
    // In a real implementation, we would save the new return
    // For now, we're just returning the new return
    
    // Return the created return
    return successResponse(newReturn);
    
  } catch (error) {
    console.error('Error creating return:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the return'
    );
  }
} 