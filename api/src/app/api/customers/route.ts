import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { Customer } from '@/types';

/**
 * GET /api/customers
 * Fetch all customers with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all customers
    const customers = await DataService.getCustomers();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Apply filters if needed
    let filteredCustomers = customers;
    
    // Filter by tier if provided
    const tier = searchParams.get('tier');
    if (tier) {
      filteredCustomers = filteredCustomers.filter(
        customer => customer.tier.toLowerCase() === tier.toLowerCase()
      );
    }
    
    // Search by name or email if provided
    const search = searchParams.get('search');
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(
        customer => 
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate pagination
    const total = filteredCustomers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedCustomers, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching customers'
    );
  }
}

/**
 * POST /api/customers
 * Create a new customer
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.name) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['email', 'name']
        }
      );
    }
    
    // Check if email is unique
    const customers = await DataService.getCustomers();
    const emailExists = customers.some(customer => customer.email === body.email);
    
    if (emailExists) {
      return errorResponse(
        'RESOURCE_EXISTS',
        'A customer with this email already exists',
        { email: body.email }
      );
    }
    
    // Generate a new customer ID
    const customerId = `cust_${(customers.length + 1).toString().padStart(3, '0')}`;
    
    // Create a new customer
    const newCustomer: Customer = {
      id: customerId,
      email: body.email,
      name: body.name,
      phone: body.phone || '',
      addresses: body.addresses || [],
      preferences: {
        language: body.preferences?.language || 'en',
        currency: body.preferences?.currency || 'USD',
        marketing_emails: body.preferences?.marketing_emails !== undefined 
          ? body.preferences.marketing_emails 
          : true
      },
      loyalty_points: body.loyalty_points || 0,
      tier: body.tier || 'BRONZE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new customer to the customers array
    customers.push(newCustomer);
    
    // In a real implementation, we would save the updated customers list
    // For now, we're just simulating the creation
    
    // Return the created customer
    return successResponse(newCustomer);
    
  } catch (error) {
    console.error('Error creating customer:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the customer'
    );
  }
} 