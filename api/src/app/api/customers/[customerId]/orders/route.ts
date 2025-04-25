import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  paginatedResponse
} from '@/utils/api-utils';

interface RouteParams {
  params: {
    customerId: string;
  };
}

/**
 * GET /api/customers/:customerId/orders
 * Fetch orders for a specific customer
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId } = params;
    
    // Check if the customer exists
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Get orders for the customer
    const orders = await DataService.getOrdersByCustomerId(customerId);
    
    // Get all products to add names
    const products = await DataService.getProducts();
    const productsMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {} as Record<string, any>);
    
    // Enhance orders with product names
    const enhancedOrders = orders.map(order => {
      const enhancedItems = order.items.map(item => {
        return {
          ...item,
          product_name: productsMap[item.product_id]?.name || 'Unknown Product'
        };
      });
      
      return {
        ...order,
        items: enhancedItems
      };
    });
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter orders if needed
    let filteredOrders = enhancedOrders;
    
    // Apply status filter if provided
    const status = searchParams.get('status');
    if (status) {
      filteredOrders = filteredOrders.filter(
        order => order.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Sort orders by date descending (most recent first)
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
    console.error(`Error fetching orders for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the orders'
    );
  }
} 