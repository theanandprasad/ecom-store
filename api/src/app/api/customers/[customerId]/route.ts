import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
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
  { params }: RouteParams
) {
  try {
    const { customerId } = params;
    
    // Get the customer by ID
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Return the customer
    return successResponse(customer);
    
  } catch (error) {
    console.error(`Error fetching customer ${params.customerId}:`, error);
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
  { params }: RouteParams
) {
  try {
    const { customerId } = params;
    
    // Get the customer by ID
    const customer = await DataService.getCustomerById(customerId);
    
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
    
    // Get all customers
    const customers = await DataService.getCustomers();
    
    // Find the index of the customer to update
    const index = customers.findIndex(c => c.id === customerId);
    
    // Update the customer in the array
    customers[index] = updatedCustomer;
    
    // In a real implementation, we would save the updated customers list
    // For now, we're just simulating the update
    
    // Return the updated customer
    return successResponse(updatedCustomer);
    
  } catch (error) {
    console.error(`Error updating customer ${params.customerId}:`, error);
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
  { params }: RouteParams
) {
  try {
    const { customerId } = params;
    
    // Get the customer by ID
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Get all customers
    const customers = await DataService.getCustomers();
    
    // Filter out the customer to delete
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    
    // In a real implementation, we would save the updated customers list
    // For now, we're just simulating the deletion
    
    // Return success message
    return successResponse({ message: "Customer deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the customer'
    );
  }
} 