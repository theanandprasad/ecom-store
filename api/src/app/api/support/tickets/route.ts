import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse, notFoundResponse } from '@/utils/api-utils';
import { SupportTicket } from '@/types';

/**
 * GET /api/support/tickets
 * Fetch all support tickets with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all support tickets
    const tickets = await DataService.getSupportTickets();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    // Apply filters
    let filteredTickets = tickets;
    
    // Filter by customer ID if provided
    if (customerId) {
      filteredTickets = filteredTickets.filter(
        ticket => ticket.customer_id === customerId
      );
    }
    
    // Filter by status if provided
    if (status) {
      filteredTickets = filteredTickets.filter(
        ticket => ticket.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Filter by priority if provided
    if (priority) {
      filteredTickets = filteredTickets.filter(
        ticket => ticket.priority.toLowerCase() === priority.toLowerCase()
      );
    }
    
    // Sort by date (newest first)
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
    console.error('Error fetching support tickets:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching support tickets'
    );
  }
}

/**
 * POST /api/support/tickets
 * Create a new support ticket
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id) {
      return errorResponse('VALIDATION_ERROR', 'customer_id is required');
    }
    if (!body.subject) {
      return errorResponse('VALIDATION_ERROR', 'subject is required');
    }
    if (!body.message) {
      return errorResponse('VALIDATION_ERROR', 'message is required');
    }
    
    // Verify customer exists
    const customer = await DataService.getCustomerById(body.customer_id);
    if (!customer) {
      return notFoundResponse('customer', body.customer_id);
    }
    
    // Create a new support ticket
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      customer_id: body.customer_id,
      subject: body.subject,
      message: body.message,
      status: 'OPEN',
      priority: body.priority || 'MEDIUM',
      order_id: body.order_id,
      created_at: now,
      updated_at: now
    };
    
    // In a real implementation, we would save the new ticket
    // For now, we're just returning the new ticket
    
    // Return the created ticket
    return successResponse(newTicket);
    
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the support ticket'
    );
  }
} 