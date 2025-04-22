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
 * GET /api/customers/:customerId/reviews
 * Fetch reviews created by a specific customer
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
    
    // Get all reviews
    const reviews = await DataService.getReviews();
    
    // Filter reviews for the customer
    const customerReviews = reviews.filter(review => review.customer_id === customerId);
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter reviews if needed
    let filteredReviews = customerReviews;
    
    // Apply product filter if provided
    const productId = searchParams.get('product_id');
    if (productId) {
      filteredReviews = filteredReviews.filter(
        review => review.product_id === productId
      );
    }
    
    // Apply status filter if provided
    const status = searchParams.get('status');
    if (status) {
      filteredReviews = filteredReviews.filter(
        review => review.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Apply rating filter if provided
    const ratingMin = parseInt(searchParams.get('rating_min') || '0');
    const ratingMax = parseInt(searchParams.get('rating_max') || '5');
    filteredReviews = filteredReviews.filter(
      review => review.rating >= ratingMin && review.rating <= ratingMax
    );
    
    // Sort reviews by date descending (most recent first)
    filteredReviews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const total = filteredReviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedReviews, total, page, limit);
    
  } catch (error) {
    console.error(`Error fetching reviews for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the reviews'
    );
  }
} 