import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/api-utils';
import { verifyOTP } from '@/lib/otp-store';

/**
 * POST /api/auth/verify-otp
 * Verify a one-time password
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.otp_session_id) {
      return errorResponse('VALIDATION_ERROR', 'otp_session_id is required');
    }
    if (!body.code) {
      return errorResponse('VALIDATION_ERROR', 'code is required');
    }
    
    // Verify the OTP
    const result = verifyOTP(body.otp_session_id, body.code);
    
    if (!result.valid) {
      return errorResponse('VALIDATION_ERROR', result.reason || 'Invalid OTP');
    }
    
    // Generate a mock JWT token
    // In a real implementation, this would be a proper JWT token with user details
    const token = `mock_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Return success with token
    return successResponse({
      success: true,
      token
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while verifying the OTP'
    );
  }
} 