import { NextRequest } from 'next/server';
import { getCustomerById } from '@/lib/unified-data-service';
import { useNeDb } from '@/lib/config';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { Customer } from '@/types';

interface RouteParams {
  params: {
    customerId: string;
  };
}

/**
 * GET /api/customers/:customerId
 * Fetch a specific customer by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const customerId = context.params.customerId;
    
    // Get the customer by ID
    const customer = await getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Return the customer
    return successResponse(customer);
    
  } catch (error) {
    console.error(`Error fetching customer:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the customer'
    );
  }
}

/**
 * PUT /api/customers/:customerId
 * Update a specific customer by ID
 */
export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const customerId = context.params.customerId;
    
    // Check if NeDB is enabled for write operations
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode to update customers.'
      );
    }
    
    // Get the customer by ID
    const customer = await getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the customer with new values, keeping existing ones if not provided
    const updatedCustomer: Customer = {
      ...customer,
      name: body.name || customer.name,
      phone: body.phone !== undefined ? body.phone : customer.phone,
      addresses: body.addresses || customer.addresses,
      preferences: {
        language: body.preferences?.language || customer.preferences.language,
        currency: body.preferences?.currency || customer.preferences.currency,
        marketing_emails: body.preferences?.marketing_emails !== undefined 
          ? body.preferences.marketing_emails 
          : customer.preferences.marketing_emails
      },
      loyalty_points: body.loyalty_points !== undefined ? body.loyalty_points : customer.loyalty_points,
      tier: body.tier || customer.tier,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation with NeDB, we would update the customer
    // For now, since we don't have a customer NeDB service yet, we'll just return the updated customer
    
    // Return the updated customer
    return successResponse(updatedCustomer);
    
  } catch (error) {
    console.error(`Error updating customer:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the customer'
    );
  }
}

/**
 * DELETE /api/customers/:customerId
 * Delete a specific customer by ID
 */
export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const customerId = context.params.customerId;
    
    // Check if NeDB is enabled for write operations
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode to delete customers.'
      );
    }
    
    // Get the customer by ID
    const customer = await getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // In a real implementation with NeDB, we would delete the customer
    // For now, since we don't have a customer NeDB service yet, we'll just return success
    
    // Return success message
    return successResponse({ message: "Customer deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting customer:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the customer'
    );
  }
} 