import { NextResponse } from 'next/server';

export type ErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'RESOURCE_EXISTS'
  | 'PRODUCT_NOT_FOUND'
  | 'CUSTOMER_NOT_FOUND'
  | 'ORDER_NOT_FOUND'
  | 'CART_NOT_FOUND'
  | 'WISHLIST_NOT_FOUND'
  | 'REVIEW_NOT_FOUND'
  | 'PROMOTION_NOT_FOUND'
  | 'SUPPORT_TICKET_NOT_FOUND'
  | 'FAQ_NOT_FOUND'
  | 'RETURN_NOT_FOUND'
  | 'NOTIFICATION_NOT_FOUND';

// HTTP status code mapping
const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  VALIDATION_ERROR: 400,
  RESOURCE_EXISTS: 409,
  PRODUCT_NOT_FOUND: 404,
  CUSTOMER_NOT_FOUND: 404,
  ORDER_NOT_FOUND: 404,
  CART_NOT_FOUND: 404,
  WISHLIST_NOT_FOUND: 404,
  REVIEW_NOT_FOUND: 404,
  PROMOTION_NOT_FOUND: 404,
  SUPPORT_TICKET_NOT_FOUND: 404,
  FAQ_NOT_FOUND: 404,
  RETURN_NOT_FOUND: 404,
  NOTIFICATION_NOT_FOUND: 404,
};

// Error response interface
export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
  };
}

// Success response interface
export interface SuccessResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

// Pagination metadata interface
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Create a success response
 * @param data - The data to return
 * @param meta - Additional metadata
 * @returns NextResponse with success data
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, any>
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ data, meta }, { status: 200 });
}

/**
 * Create a paginated success response
 * @param data - The data to return
 * @param total - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns NextResponse with paginated data
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<SuccessResponse<T[]>> {
  const totalPages = Math.ceil(total / limit);
  
  return NextResponse.json(
    {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      } as PaginationMeta,
    },
    { status: 200 }
  );
}

/**
 * Create an error response
 * @param code - Error code
 * @param message - Error message
 * @param details - Additional error details
 * @returns NextResponse with error data
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  const status = HTTP_STATUS[code] || 500;
  
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Create a not found error response for a resource
 * @param resourceType - Type of resource (e.g., 'product')
 * @param id - ID of the resource
 * @returns NextResponse with not found error
 */
export function notFoundResponse(
  resourceType: string,
  id: string
): NextResponse<ErrorResponse> {
  const code = `${resourceType.toUpperCase()}_NOT_FOUND` as ErrorCode;
  const message = `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} with ID '${id}' not found`;
  
  return errorResponse(code, message, { [`${resourceType}_id`]: id });
}

/**
 * Create a validation error response
 * @param errors - Validation errors
 * @returns NextResponse with validation error
 */
export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse<ErrorResponse> {
  return errorResponse('VALIDATION_ERROR', 'Validation failed', errors);
}

/**
 * Create a created response (201)
 * @param data - The created resource data
 * @returns NextResponse with created data
 */
export function createdResponse<T>(data: T): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ data }, { status: 201 });
}

/**
 * Create a no content response (204)
 * @returns NextResponse with no content
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
} 