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
 * GET /api/customers/:customerId/returns
 * Fetch returns for a specific customer
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
    
    // Get returns for the customer
    const returns = await DataService.getReturnsByCustomerId(customerId);
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter returns if needed
    let filteredReturns = returns;
    
    // Apply status filter if provided
    const status = searchParams.get('status');
    if (status) {
      filteredReturns = filteredReturns.filter(
        returnItem => returnItem.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Apply order filter if provided
    const orderId = searchParams.get('order_id');
    if (orderId) {
      filteredReturns = filteredReturns.filter(
        returnItem => returnItem.order_id === orderId
      );
    }
    
    // Sort returns by date descending (most recent first)
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
    console.error(`Error fetching returns for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the returns'
    );
  }
} 