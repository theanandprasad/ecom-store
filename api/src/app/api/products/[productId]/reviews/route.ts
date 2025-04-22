import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  paginatedResponse
} from '@/utils/api-utils';
import { Review } from '@/types';

interface RouteParams {
  params: {
    productId: string;
  };
}

/**
 * GET /api/products/:productId/reviews
 * Fetch reviews for a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { productId } = params;
    
    // Check if the product exists
    const product = await DataService.getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Get reviews for the product
    const reviews = await DataService.getReviewsByProductId(productId);
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter reviews if needed
    let filteredReviews = reviews;
    
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
    
    // Sort reviews by helpful votes if requested
    const sort = searchParams.get('sort');
    if (sort === 'helpful') {
      filteredReviews.sort((a, b) => b.helpful_votes - a.helpful_votes);
    } else if (sort === 'recent') {
      filteredReviews.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sort === 'rating_high') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'rating_low') {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    }
    
    // Calculate pagination
    const total = filteredReviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedReviews, total, page, limit);
    
  } catch (error) {
    console.error(`Error fetching reviews for product ${params.productId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the reviews'
    );
  }
}

/**
 * POST /api/products/:productId/reviews
 * Create a new review for a product
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { productId } = params;
    
    // Check if the product exists
    const product = await DataService.getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id || !body.rating || !body.content) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['customer_id', 'rating', 'content']
        }
      );
    }
    
    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Rating must be between 1 and 5',
        {
          field: 'rating',
          value: body.rating,
          allowed_range: '1-5'
        }
      );
    }
    
    // Get all reviews
    const reviews = await DataService.getReviews();
    
    // Generate a new review ID
    const reviewId = `rev_${(reviews.length + 1).toString().padStart(3, '0')}`;
    
    // Create a new review
    const newReview: Review = {
      id: reviewId,
      product_id: productId,
      customer_id: body.customer_id,
      rating: body.rating,
      title: body.title || '',
      content: body.content,
      images: body.images || [],
      verified_purchase: body.verified_purchase !== undefined ? body.verified_purchase : false,
      helpful_votes: 0,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new review to the reviews array
    reviews.push(newReview);
    
    // In a real implementation, we would save the updated reviews list
    // For now, we're just simulating the creation
    
    // Return the created review
    return successResponse(newReview);
    
  } catch (error) {
    console.error(`Error creating review for product ${params.productId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the review'
    );
  }
} 