import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { Order } from '@/types';

interface RouteParams {
  params: {
    orderId: string;
  };
}

/**
 * GET /api/orders/:orderId
 * Fetch a specific order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { orderId } = params;
    
    // Get the order by ID
    const order = await DataService.getOrderById(orderId);
    
    // If order not found, return 404 error
    if (!order) {
      return notFoundResponse('order', orderId);
    }
    
    // Return the order
    return successResponse(order);
    
  } catch (error) {
    console.error(`Error fetching order ${params.orderId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the order'
    );
  }
}

/**
 * PUT /api/orders/:orderId
 * Update a specific order by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { orderId } = params;
    
    // Get the order by ID
    const order = await DataService.getOrderById(orderId);
    
    // If order not found, return 404 error
    if (!order) {
      return notFoundResponse('order', orderId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Only allowed to update certain fields
    const allowedStatusTransitions: Record<string, string[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED', 'CANCELLED'],
      'DELIVERED': [],
      'CANCELLED': []
    };
    
    // Check status transition if provided
    if (body.status && body.status !== order.status) {
      const allowedTransitions = allowedStatusTransitions[order.status] || [];
      if (!allowedTransitions.includes(body.status)) {
        return errorResponse(
          'VALIDATION_ERROR',
          `Invalid status transition from '${order.status}' to '${body.status}'`,
          {
            current_status: order.status,
            requested_status: body.status,
            allowed_transitions: allowedTransitions
          }
        );
      }
    }
    
    // Update order with new values
    const updatedOrder: Order = {
      ...order,
      status: body.status || order.status,
      tracking_number: body.tracking_number !== undefined ? body.tracking_number : order.tracking_number,
      estimated_delivery: body.estimated_delivery !== undefined ? body.estimated_delivery : order.estimated_delivery,
      updated_at: new Date().toISOString()
    };
    
    // Update individual item statuses if provided
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        if (item.id && item.status) {
          const itemIndex = updatedOrder.items.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            updatedOrder.items[itemIndex].status = item.status;
          }
        }
      }
    }
    
    // Get all orders
    const orders = await DataService.getOrders();
    
    // Find the index of the order to update
    const index = orders.findIndex(o => o.id === orderId);
    
    // Update the order in the array
    orders[index] = updatedOrder;
    
    // In a real implementation, we would save the updated orders list
    // For now, we're just simulating the update
    
    // Return the updated order
    return successResponse(updatedOrder);
    
  } catch (error) {
    console.error(`Error updating order ${params.orderId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the order'
    );
  }
}

/**
 * DELETE /api/orders/:orderId
 * Delete a specific order by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { orderId } = params;
    
    // Get the order by ID
    const order = await DataService.getOrderById(orderId);
    
    // If order not found, return 404 error
    if (!order) {
      return notFoundResponse('order', orderId);
    }
    
    // Can only delete orders in PENDING status
    if (order.status !== 'PENDING') {
      return errorResponse(
        'VALIDATION_ERROR',
        `Cannot delete order with status '${order.status}'`,
        {
          current_status: order.status,
          allowed_status: ['PENDING']
        }
      );
    }
    
    // Get all orders
    const orders = await DataService.getOrders();
    
    // Filter out the order to delete
    const updatedOrders = orders.filter(o => o.id !== orderId);
    
    // In a real implementation, we would save the updated orders list
    // For now, we're just simulating the deletion
    
    // Return success message
    return successResponse({ message: "Order deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting order ${params.orderId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the order'
    );
  }
} 