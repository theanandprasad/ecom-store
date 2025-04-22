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
 * GET /api/customers/:customerId/notifications
 * Fetch notifications for a specific customer
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
    
    // Get notifications for the customer
    const notifications = await DataService.getNotificationsByCustomerId(customerId);
    
    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter notifications if needed
    let filteredNotifications = notifications;
    
    // Apply type filter if provided
    const type = searchParams.get('type');
    if (type) {
      filteredNotifications = filteredNotifications.filter(
        notification => notification.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    // Apply read status filter if provided
    const read = searchParams.get('read');
    if (read !== null) {
      const isRead = read === 'true';
      filteredNotifications = filteredNotifications.filter(
        notification => notification.read === isRead
      );
    }
    
    // Sort notifications by date descending (most recent first)
    filteredNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const total = filteredNotifications.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedNotifications, total, page, limit);
    
  } catch (error) {
    console.error(`Error fetching notifications for customer ${params.customerId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the notifications'
    );
  }
} 