import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/api-utils';
import { verifyOTP } from '@/lib/otp-store';
import fs from 'fs';
import path from 'path';

// Import mock data directly in the route file
const mockOtpSessions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'mock-data', 'otp_sessions.json'), 'utf8'));
const mockCustomers = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'mock-data', 'customers.json'), 'utf8'));

/**
 * POST /api/auth/verify-otp
 * Verify a one-time password and return customer details
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
    
    // Find OTP session by code in mock data
    const otpSession = mockOtpSessions.otp_sessions.find(
      (session: any) => session.code === body.code
    );

    // If OTP not found or invalid
    if (!otpSession) {
      return errorResponse('VALIDATION_ERROR', 'Invalid OTP code');
    }

    // For demo purposes, we're ignoring the expiry date check
    // In a real implementation, we would check if the OTP is expired
    // const expiryDate = new Date(otpSession.expires_at);
    // if (expiryDate < new Date()) {
    //   return errorResponse('VALIDATION_ERROR', 'OTP has expired');
    // }
    
    // Generate a mock JWT token
    const token = `mock_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Find customer by user_id from OTP session
    const customer = mockCustomers.customers.find(
      (cust: any) => cust.id === otpSession.user_id
    );
    
    // If customer not found
    if (!customer) {
      return errorResponse('CUSTOMER_NOT_FOUND', 'Customer not found');
    }

    // Extract first and last name from the full name
    const nameParts = customer.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Return success with token and customer details
    return successResponse({
      success: true,
      token,
      customer_id: customer.id,
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: firstName,
        last_name: lastName
      }
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while verifying the OTP'
    );
  }
} 