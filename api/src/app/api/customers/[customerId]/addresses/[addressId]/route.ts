import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse
} from '@/utils/api-utils';
import { Address } from '@/types';

interface RouteParams {
  params: {
    customerId: string;
    addressId: string;
  };
}

/**
 * GET /api/customers/:customerId/addresses/:addressId
 * Fetch a specific address for a customer
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId, addressId } = params;
    
    // Check if the customer exists
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Find the address
    const address = customer.addresses?.find(addr => addr.id === addressId);
    
    // If address not found, return 404 error
    if (!address) {
      return notFoundResponse('address', addressId);
    }
    
    // Return the address
    return successResponse(address);
    
  } catch (error) {
    console.error(`Error fetching address ${params.addressId} for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the address'
    );
  }
}

/**
 * PUT /api/customers/:customerId/addresses/:addressId
 * Update a specific address for a customer
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId, addressId } = params;
    
    // Check if the customer exists
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Check if the customer has addresses
    if (!customer.addresses || customer.addresses.length === 0) {
      return notFoundResponse('address', addressId);
    }
    
    // Find the address index
    const addressIndex = customer.addresses.findIndex(addr => addr.id === addressId);
    
    // If address not found, return 404 error
    if (addressIndex === -1) {
      return notFoundResponse('address', addressId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.street || !body.city || !body.state || !body.zip || !body.country || !body.type) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['street', 'city', 'state', 'zip', 'country', 'type']
        }
      );
    }
    
    // Make sure type is valid
    if (body.type !== 'SHIPPING' && body.type !== 'BILLING') {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid address type',
        {
          allowed_values: ['SHIPPING', 'BILLING']
        }
      );
    }
    
    // Create the updated address
    const updatedAddress: Address = {
      id: addressId,
      type: body.type,
      street: body.street,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      is_default: body.is_default === undefined ? customer.addresses[addressIndex].is_default : body.is_default
    };
    
    // If this is set as default, remove default from other addresses of the same type
    if (updatedAddress.is_default) {
      customer.addresses = customer.addresses.map(addr => {
        if (addr.id !== addressId && addr.type === updatedAddress.type) {
          return { ...addr, is_default: false };
        }
        return addr;
      });
    }
    
    // Update the address
    customer.addresses[addressIndex] = updatedAddress;
    
    // Update the customer record
    await DataService.updateCustomer(customer);
    
    // Return the updated address
    return successResponse(updatedAddress);
    
  } catch (error) {
    console.error(`Error updating address ${params.addressId} for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the address'
    );
  }
}

/**
 * DELETE /api/customers/:customerId/addresses/:addressId
 * Delete a specific address for a customer
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId, addressId } = params;
    
    // Check if the customer exists
    const customer = await DataService.getCustomerById(customerId);
    
    // If customer not found, return 404 error
    if (!customer) {
      return notFoundResponse('customer', customerId);
    }
    
    // Check if the customer has addresses
    if (!customer.addresses || customer.addresses.length === 0) {
      return notFoundResponse('address', addressId);
    }
    
    // Find the address index
    const addressIndex = customer.addresses.findIndex(addr => addr.id === addressId);
    
    // If address not found, return 404 error
    if (addressIndex === -1) {
      return notFoundResponse('address', addressId);
    }
    
    // Remove the address
    customer.addresses.splice(addressIndex, 1);
    
    // Update the customer record
    await DataService.updateCustomer(customer);
    
    // Return success
    return successResponse({ message: 'Address deleted successfully' });
    
  } catch (error) {
    console.error(`Error deleting address ${params.addressId} for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the address'
    );
  }
} 