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
 * GET /api/customers/:customerId/support-tickets
 * Fetch support tickets for a specific customer
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
    
    // Get support tickets for the customer
    const tickets = await DataService.getSupportTicketsByCustomerId(customerId);
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter tickets if needed
    let filteredTickets = tickets;
    
    // Apply status filter if provided
    const status = searchParams.get('status');
    if (status) {
      filteredTickets = filteredTickets.filter(
        ticket => ticket.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Apply priority filter if provided
    const priority = searchParams.get('priority');
    if (priority) {
      filteredTickets = filteredTickets.filter(
        ticket => ticket.priority.toLowerCase() === priority.toLowerCase()
      );
    }
    
    // Sort tickets by date descending (most recent first)
    filteredTickets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const total = filteredTickets.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedTickets, total, page, limit);
    
  } catch (error) {
    console.error(`Error fetching support tickets for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the support tickets'
    );
  }
} 