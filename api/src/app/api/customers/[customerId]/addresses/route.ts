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
  };
}

/**
 * GET /api/customers/:customerId/addresses
 * Fetch addresses for a specific customer
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
    
    // Return the customer's addresses
    return successResponse(customer.addresses || []);
    
  } catch (error) {
    console.error(`Error fetching addresses for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the addresses'
    );
  }
}

/**
 * POST /api/customers/:customerId/addresses
 * Add a new address for a customer
 */
export async function POST(
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
    
    // Create a unique ID for the new address
    const addressId = `addr_${Date.now()}`;
    
    // Create the new address
    const newAddress: Address = {
      id: addressId,
      type: body.type,
      street: body.street,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      is_default: body.is_default === undefined ? false : body.is_default
    };
    
    // If this is set as default, remove default from other addresses of the same type
    if (newAddress.is_default) {
      customer.addresses = (customer.addresses || []).map(addr => {
        if (addr.type === newAddress.type) {
          return { ...addr, is_default: false };
        }
        return addr;
      });
    }
    
    // Add the new address to the customer
    if (!customer.addresses) {
      customer.addresses = [];
    }
    customer.addresses.push(newAddress);
    
    // Update the customer record
    await DataService.updateCustomer(customer);
    
    // Return the created address
    return successResponse(newAddress);
    
  } catch (error) {
    console.error(`Error adding address for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while adding the address'
    );
  }
} 