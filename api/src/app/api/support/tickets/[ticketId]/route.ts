import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { SupportTicket } from '@/types';

interface RouteParams {
  params: {
    ticketId: string;
  };
}

/**
 * GET /api/support/tickets/:ticketId
 * Fetch a specific support ticket by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = params;
    
    // Get the ticket by ID
    const ticket = await DataService.getSupportTicketById(ticketId);
    
    // If ticket not found, return 404 error
    if (!ticket) {
      return notFoundResponse('support ticket', ticketId);
    }
    
    // Return the ticket
    return successResponse(ticket);
    
  } catch (error) {
    console.error(`Error fetching support ticket ${params.ticketId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the support ticket'
    );
  }
}

/**
 * PUT /api/support/tickets/:ticketId
 * Update a specific support ticket by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = params;
    
    // Get the ticket by ID
    const ticket = await DataService.getSupportTicketById(ticketId);
    
    // If ticket not found, return 404 error
    if (!ticket) {
      return notFoundResponse('support ticket', ticketId);
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the status if provided
    if (body.status && !['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(body.status)) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED'
      );
    }
    
    // Validate the priority if provided
    if (body.priority && !['LOW', 'MEDIUM', 'HIGH'].includes(body.priority)) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'priority must be one of: LOW, MEDIUM, HIGH'
      );
    }
    
    // Update the ticket
    const updatedTicket: SupportTicket = {
      ...ticket,
      subject: body.subject ?? ticket.subject,
      message: body.message ?? ticket.message,
      status: body.status ?? ticket.status,
      priority: body.priority ?? ticket.priority,
      order_id: body.order_id ?? ticket.order_id,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, we would save the updated ticket
    // For now, we're just returning the updated ticket
    
    // Return the updated ticket
    return successResponse(updatedTicket);
    
  } catch (error) {
    console.error(`Error updating support ticket ${params.ticketId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the support ticket'
    );
  }
}

/**
 * DELETE /api/support/tickets/:ticketId
 * Delete a specific support ticket by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = params;
    
    // Get the ticket by ID
    const ticket = await DataService.getSupportTicketById(ticketId);
    
    // If ticket not found, return 404 error
    if (!ticket) {
      return notFoundResponse('support ticket', ticketId);
    }
    
    // Get all support tickets
    const tickets = await DataService.getSupportTickets();
    
    // Filter out the ticket to delete
    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    
    // In a real implementation, we would save the updated tickets list
    // For now, we're just simulating the deletion
    
    // Return success message
    return successResponse({ message: "Support ticket deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting support ticket ${params.ticketId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the support ticket'
    );
  }
} 