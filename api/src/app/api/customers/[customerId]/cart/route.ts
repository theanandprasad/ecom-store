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
 * GET /api/customers/:customerId/cart
 * Fetch cart for a specific customer
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
    
    // Get cart for the customer
    const cart = await DataService.getCartByCustomerId(customerId);
    
    // If cart not found, return empty cart with customer ID
    if (!cart) {
      return successResponse({
        id: `cart_${new Date().getTime()}`,
        customer_id: customerId,
        items: [],
        total_amount: { amount: 0, currency: 'USD' },
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Return the cart
    return successResponse(cart);
    
  } catch (error) {
    console.error(`Error fetching cart for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the cart'
    );
  }
} 