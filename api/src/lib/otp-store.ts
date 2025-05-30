/**
 * OTP Store
 * In a real implementation, this would be stored in a database
 * For this mock implementation, we use a simple in-memory store
 */

interface OTPSession {
  code: string;
  expires: number;
}

export const otpStore: Record<string, OTPSession> = {};

/**
 * Generate a random OTP code
 * @returns A 6-digit numeric OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a new OTP session
 * @param expiresIn Expiry time in seconds
 * @returns Session ID and expiry time
 */
export function createOTPSession(expiresIn: number = 300): { sessionId: string, expiresIn: number } {
  // Generate a unique session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  
  // Generate a random 6-digit OTP
  const code = generateOTP();
  
  // Set expiry time
  const expires = Date.now() + expiresIn * 1000;
  
  // Store the OTP
  otpStore[sessionId] = { code, expires };
  
  return { sessionId, expiresIn };
}

/**
 * Verify an OTP code
 * @param sessionId OTP session ID
 * @param code OTP code to verify
 * @returns Whether the OTP is valid
 */
export function verifyOTP(sessionId: string, code: string): { valid: boolean; reason?: string } {
  // For mock implementation, always return success regardless of inputs
  return { valid: true };
} 