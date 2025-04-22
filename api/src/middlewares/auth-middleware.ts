import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '../utils/api-utils';

// Get credentials from environment variables
const API_USERNAME = process.env.API_USERNAME || 'admin';
const API_PASSWORD = process.env.API_PASSWORD || 'admin123';

/**
 * Basic authentication middleware
 * @param request - The incoming request
 * @returns NextResponse or undefined to continue
 */
export async function authMiddleware(
  request: NextRequest
): Promise<NextResponse | undefined> {
  // Get the Authorization header
  const authHeader = request.headers.get('Authorization');
  
  // Check if Authorization header exists and is a Basic auth header
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return errorResponse(
      'UNAUTHORIZED',
      'Missing or invalid Authorization header',
      { required_format: 'Basic base64(username:password)' }
    );
  }
  
  // Extract the base64 encoded credentials
  const base64Credentials = authHeader.split(' ')[1];
  
  try {
    // Decode the base64 credentials
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
    
    // Validate the credentials
    if (username === API_USERNAME && password === API_PASSWORD) {
      // Continue to the API route handler
      return undefined;
    }
    
    // Invalid credentials
    return errorResponse('UNAUTHORIZED', 'Invalid credentials');
    
  } catch (error) {
    // Error decoding credentials
    return errorResponse(
      'UNAUTHORIZED',
      'Invalid Authorization format',
      { required_format: 'Basic base64(username:password)' }
    );
  }
}

export default authMiddleware; 