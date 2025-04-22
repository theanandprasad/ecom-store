import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse
} from '@/utils/api-utils';

interface RouteParams {
  params: {
    customerId: string;
  };
}

/**
 * GET /api/customers/:customerId/wishlist
 * Fetch wishlist for a specific customer
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
    
    // Get wishlist for the customer
    const wishlist = await DataService.getWishlistByCustomerId(customerId);
    
    // If wishlist not found, return empty wishlist with customer ID
    if (!wishlist) {
      return successResponse({
        id: `wish_${new Date().getTime()}`,
        customer_id: customerId,
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Return the wishlist
    return successResponse(wishlist);
    
  } catch (error) {
    console.error(`Error fetching wishlist for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the wishlist'
    );
  }
} 