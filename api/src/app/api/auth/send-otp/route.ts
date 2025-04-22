import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/api-utils';
import { createOTPSession, otpStore } from '@/lib/otp-store';

/**
 * POST /api/auth/send-otp
 * Send a one-time password to a phone or email
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.phone_or_email) {
      return errorResponse('VALIDATION_ERROR', 'phone_or_email is required');
    }
    
    // Email format validation (simple)
    const isEmail = body.phone_or_email.includes('@');
    const isPhone = /^\+\d{6,15}$/.test(body.phone_or_email);
    
    if (!isEmail && !isPhone) {
      return errorResponse(
        'VALIDATION_ERROR',
        'phone_or_email must be a valid email address or phone number (E.164 format)'
      );
    }
    
    // Create a new OTP session
    const { sessionId, expiresIn } = createOTPSession();
    
    // In a real implementation, this would actually send an email or SMS
    console.log(`[MOCK] Sending OTP: ${otpStore[sessionId].code} to ${body.phone_or_email}`);
    
    // Return session ID and expiry time
    return successResponse({
      otp_session_id: sessionId,
      expires_in: expiresIn
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while sending the OTP'
    );
  }
} 