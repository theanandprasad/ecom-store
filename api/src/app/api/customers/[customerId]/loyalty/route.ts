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
 * GET /api/customers/:customerId/loyalty
 * Fetch loyalty information for a specific customer
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
    
    // Define tier thresholds
    const tierThresholds = {
      'BRONZE': 0,
      'SILVER': 1000,
      'GOLD': 5000,
      'PLATINUM': 10000
    };
    
    // Get next tier info
    const currentTier = customer.tier;
    let nextTier;
    let pointsToNextTier = 0;
    
    // Determine next tier and points needed
    if (currentTier === 'BRONZE') {
      nextTier = 'SILVER';
      pointsToNextTier = tierThresholds['SILVER'] - customer.loyalty_points;
    } else if (currentTier === 'SILVER') {
      nextTier = 'GOLD';
      pointsToNextTier = tierThresholds['GOLD'] - customer.loyalty_points;
    } else if (currentTier === 'GOLD') {
      nextTier = 'PLATINUM';
      pointsToNextTier = tierThresholds['PLATINUM'] - customer.loyalty_points;
    } else {
      nextTier = null;
      pointsToNextTier = 0;
    }
    
    // Create loyalty response
    const loyaltyInfo = {
      customer_id: customer.id,
      points_balance: customer.loyalty_points,
      current_tier: customer.tier,
      next_tier: nextTier,
      points_to_next_tier: pointsToNextTier > 0 ? pointsToNextTier : 0,
      tier_benefits: getTierBenefits(customer.tier)
    };
    
    // Return the loyalty information
    return successResponse(loyaltyInfo);
    
  } catch (error) {
    console.error(`Error fetching loyalty information for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the loyalty information'
    );
  }
}

/**
 * Helper function to get tier benefits
 */
function getTierBenefits(tier: string): string[] {
  switch (tier) {
    case 'BRONZE':
      return [
        'Earn 1 point for every $1 spent',
        'Free standard shipping on orders over $50',
        'Birthday discount 5%'
      ];
    case 'SILVER':
      return [
        'Earn 1.5 points for every $1 spent',
        'Free standard shipping on all orders',
        'Birthday discount 10%',
        'Early access to sales'
      ];
    case 'GOLD':
      return [
        'Earn 2 points for every $1 spent',
        'Free express shipping on all orders',
        'Birthday discount 15%',
        'Early access to sales',
        'Dedicated customer service line'
      ];
    case 'PLATINUM':
      return [
        'Earn 3 points for every $1 spent',
        'Free priority shipping on all orders',
        'Birthday discount 20%',
        'VIP early access to sales and new products',
        'Dedicated personal shopper',
        'Free gift with every purchase'
      ];
    default:
      return [];
  }
} 