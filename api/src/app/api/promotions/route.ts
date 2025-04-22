import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { Promotion } from '@/types';

/**
 * GET /api/promotions
 * Fetch all promotions with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all promotions
    const promotions = await DataService.getPromotions();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Apply filters
    let filteredPromotions = promotions;
    
    // Filter by type if provided
    const type = searchParams.get('type');
    if (type) {
      filteredPromotions = filteredPromotions.filter(
        promotion => promotion.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    // Filter by active status
    const active = searchParams.get('active');
    if (active === 'true') {
      const now = new Date().toISOString();
      filteredPromotions = filteredPromotions.filter(
        promotion => promotion.start_date <= now && promotion.end_date >= now
      );
    }
    
    // Filter by product ID
    const productId = searchParams.get('product_id');
    if (productId) {
      filteredPromotions = filteredPromotions.filter(
        promotion => promotion.applicable_products.includes(productId)
      );
    }
    
    // Calculate pagination
    const total = filteredPromotions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedPromotions, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching promotions'
    );
  }
}

/**
 * POST /api/promotions
 * Create a new promotion
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return errorResponse('VALIDATION_ERROR', 'name is required');
    }
    if (!body.type) {
      return errorResponse('VALIDATION_ERROR', 'type is required');
    }
    if (!['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y'].includes(body.type)) {
      return errorResponse('VALIDATION_ERROR', 'type must be one of: PERCENTAGE, FIXED_AMOUNT, BUY_X_GET_Y');
    }
    if (body.value === undefined) {
      return errorResponse('VALIDATION_ERROR', 'value is required');
    }
    if (!body.start_date) {
      return errorResponse('VALIDATION_ERROR', 'start_date is required');
    }
    if (!body.end_date) {
      return errorResponse('VALIDATION_ERROR', 'end_date is required');
    }
    if (!body.applicable_products || !Array.isArray(body.applicable_products)) {
      return errorResponse('VALIDATION_ERROR', 'applicable_products is required and must be an array');
    }
    
    // Create a new promotion
    const newPromotion: Promotion = {
      id: `promo_${Date.now()}`,
      name: body.name,
      description: body.description || '',
      type: body.type,
      value: body.value,
      start_date: body.start_date,
      end_date: body.end_date,
      applicable_products: body.applicable_products,
      min_purchase_amount: body.min_purchase_amount,
      max_discount_amount: body.max_discount_amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, we would save the new promotion
    // For now, we're just returning the new promotion
    
    // Return the created promotion
    return successResponse(newPromotion);
    
  } catch (error) {
    console.error('Error creating promotion:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the promotion'
    );
  }
} 