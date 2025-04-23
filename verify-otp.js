/**
 * OTP Verification Endpoint
 * 
 * This file contains the implementation for the verify-otp endpoint
 * that authenticates users by verifying a one-time password and
 * returns a JWT token along with the customer ID.
 */

// Import required modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { validateRequest } = require('../middleware/validation');
const { findOtpSession, invalidateOtpSession } = require('../services/otpService');
const { findCustomerByEmail, findCustomerByPhone } = require('../services/customerService');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * Verify OTP endpoint
 * 
 * POST /api/auth/verify-otp
 * 
 * Request body:
 * {
 *   "otp_session_id": "session_id_here",
 *   "code": "123456"
 * }
 * 
 * Success response:
 * {
 *   "data": {
 *     "success": true,
 *     "token": "jwt_token_here",
 *     "customer_id": "cust_001",
 *     "customer": {
 *       "id": "cust_001", 
 *       "email": "john.doe@example.com",
 *       "first_name": "John",
 *       "last_name": "Doe"
 *     }
 *   }
 * }
 * 
 * Error response:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Error message"
 *   }
 * }
 */
router.post('/verify-otp', validateRequest('verifyOtp'), async (req, res) => {
  try {
    const { otp_session_id, code } = req.body;
    
    // Find OTP session
    const session = await findOtpSession(otp_session_id);
    
    // Check if session exists
    if (!session) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SESSION',
          message: 'Invalid or expired OTP session'
        }
      });
    }
    
    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
      return res.status(400).json({
        error: {
          code: 'EXPIRED_OTP',
          message: 'OTP has expired. Please request a new one'
        }
      });
    }
    
    // Check if maximum attempts exceeded
    if (session.attempts >= 3) {
      return res.status(400).json({
        error: {
          code: 'OTP_ATTEMPTS_EXCEEDED',
          message: 'Too many incorrect attempts. Please request a new OTP'
        }
      });
    }
    
    // Verify OTP code
    if (session.code !== code) {
      // Increment attempt counter
      await incrementOtpAttempts(otp_session_id);
      
      return res.status(400).json({
        error: {
          code: 'INVALID_OTP',
          message: 'The provided OTP is invalid'
        }
      });
    }
    
    // Find customer by contact information
    let customer;
    if (session.contact_type === 'email') {
      customer = await findCustomerByEmail(session.contact);
    } else {
      customer = await findCustomerByPhone(session.contact);
    }
    
    // If customer not found (should not happen in normal flow)
    if (!customer) {
      return res.status(404).json({
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Customer not found'
        }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        sub: customer.id,
        email: customer.email,
        role: customer.role || 'customer'
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Invalidate OTP session (security best practice)
    await invalidateOtpSession(otp_session_id);
    
    // Return success response with token and customer ID
    return res.status(200).json({
      data: {
        success: true,
        token: token,
        customer_id: customer.id,
        customer: {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name
        }
      }
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again later.'
      }
    });
  }
});

/**
 * Helper function to increment OTP attempts
 */
async function incrementOtpAttempts(sessionId) {
  try {
    // In a real implementation, this would update the database
    // For this example, we'll assume it works
    return true;
  } catch (error) {
    console.error('Error incrementing OTP attempts:', error);
    throw error;
  }
}

module.exports = router; 