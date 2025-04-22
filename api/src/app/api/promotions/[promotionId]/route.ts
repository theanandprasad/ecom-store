import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { Promotion } from '@/types';

interface RouteParams {
  params: {
    promotionId: string;
  };
}

/**
 * GET /api/promotions/:promotionId
 * Fetch a specific promotion by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { promotionId } = params;
    
    // Get the promotion by ID
    const promotion = await DataService.getPromotionById(promotionId);
    
    // If promotion not found, return 404 error
    if (!promotion) {
      return notFoundResponse('promotion', promotionId);
    }
    
    // Return the promotion
    return successResponse(promotion);
    
  } catch (error) {
    console.error(`Error fetching promotion ${params.promotionId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the promotion'
    );
  }
}

/**
 * PUT /api/promotions/:promotionId
 * Update a specific promotion by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { promotionId } = params;
    
    // Get the promotion by ID
    const promotion = await DataService.getPromotionById(promotionId);
    
    // If promotion not found, return 404 error
    if (!promotion) {
      return notFoundResponse('promotion', promotionId);
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the promotion type if provided
    if (body.type && !['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y'].includes(body.type)) {
      return errorResponse('VALIDATION_ERROR', 'type must be one of: PERCENTAGE, FIXED_AMOUNT, BUY_X_GET_Y');
    }
    
    // Update the promotion
    const updatedPromotion: Promotion = {
      ...promotion,
      name: body.name ?? promotion.name,
      description: body.description ?? promotion.description,
      type: body.type ?? promotion.type,
      value: body.value ?? promotion.value,
      start_date: body.start_date ?? promotion.start_date,
      end_date: body.end_date ?? promotion.end_date,
      applicable_products: body.applicable_products ?? promotion.applicable_products,
      min_purchase_amount: body.min_purchase_amount ?? promotion.min_purchase_amount,
      max_discount_amount: body.max_discount_amount ?? promotion.max_discount_amount,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, we would save the updated promotion
    // For now, we're just returning the updated promotion
    
    // Return the updated promotion
    return successResponse(updatedPromotion);
    
  } catch (error) {
    console.error(`Error updating promotion ${params.promotionId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the promotion'
    );
  }
}

/**
 * DELETE /api/promotions/:promotionId
 * Delete a specific promotion by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { promotionId } = params;
    
    // Get the promotion by ID
    const promotion = await DataService.getPromotionById(promotionId);
    
    // If promotion not found, return 404 error
    if (!promotion) {
      return notFoundResponse('promotion', promotionId);
    }
    
    // Get all promotions
    const promotions = await DataService.getPromotions();
    
    // Filter out the promotion to delete
    const updatedPromotions = promotions.filter(p => p.id !== promotionId);
    
    // In a real implementation, we would save the updated promotions list
    // For now, we're just simulating the deletion
    
    // Return success message
    return successResponse({ message: "Promotion deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting promotion ${params.promotionId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the promotion'
    );
  }
} 