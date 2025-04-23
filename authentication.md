# OTP Authentication Guide

This guide provides detailed instructions for implementing OTP (One-Time Password) based authentication in your applications using our API.

**Base URL**: [https://ecom-store-ebon.vercel.app/](https://ecom-store-ebon.vercel.app/)

## OTP Authentication Flow

The OTP authentication flow consists of two steps:
1. Request an OTP to be sent to a user's email or phone
2. Verify the OTP to receive an authentication token

## API Endpoints

### 1. Request OTP

**Endpoint**: `POST /api/auth/send-otp`

This endpoint sends a one-time password to the user's email or phone.

#### Request

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_or_email": "john.doe@example.com",
    "purpose": "login"
  }'
```

#### Request Body Parameters

| Parameter      | Type   | Required | Description                               |
|----------------|--------|----------|-------------------------------------------|
| phone_or_email | string | Yes      | Email address or phone number             |
| purpose        | string | Yes      | Purpose of OTP: "login" or "verification" |

#### Sample Response

```json
{
  "data": {
    "otp_session_id": "session_1745331713556_ddctak4s",
    "expires_in": 300
  }
}
```

The `expires_in` field indicates the OTP expiration time in seconds (in this case, 5 minutes).

#### Error Responses

**Invalid Contact Information**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email or phone format"
  }
}
```

**Rate Limit Exceeded**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many OTP requests. Please try again after 15 minutes"
  }
}
```

### 2. Verify OTP

**Endpoint**: `POST /api/auth/verify-otp`

This endpoint verifies the OTP provided by the user and returns an authentication token upon successful verification.

#### Request

```bash
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "otp_session_id": "session_1745331713556_ddctak4s",
    "code": "123456"
  }'
```

#### Request Body Parameters

| Parameter      | Type   | Required | Description                                      |
|----------------|--------|----------|--------------------------------------------------|
| otp_session_id | string | Yes      | The session ID received from the send-otp API    |
| code           | string | Yes      | The OTP code received by the user                |

#### Sample Response

```json
{
  "data": {
    "success": true,
    "token": "mock_jwt_1745331727115_hv7mitql",
    "customer_id": "cust_001",
    "customer": {
      "id": "cust_001",
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

#### Error Responses

**Invalid OTP**
```json
{
  "error": {
    "code": "INVALID_OTP",
    "message": "The provided OTP is invalid or expired"
  }
}
```

**OTP Attempts Exceeded**
```json
{
  "error": {
    "code": "OTP_ATTEMPTS_EXCEEDED",
    "message": "Too many incorrect attempts. Please request a new OTP"
  }
}
```

## Using the Authentication Token

After successful OTP verification, you will receive a JWT token that should be included in the Authorization header for subsequent API requests:

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/me" \
  -H "Authorization: Bearer mock_jwt_1745331727115_hv7mitql"
```

You can also directly use the customer_id returned in the verification response:

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/customers/cust_001" \
  -u admin:admin123
```

## Token Expiration and Refresh

The JWT token has an expiration time (typically 24 hours). When a token expires, you need to re-authenticate using the OTP flow.

## Implementation Examples

### Example 1: Login with OTP

```javascript
// Step 1: Request OTP
async function requestOTP(emailOrPhone) {
  const response = await fetch('https://ecom-store-ebon.vercel.app/api/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone_or_email: emailOrPhone,
      purpose: 'login'
    })
  });
  
  return await response.json();
}

// Step 2: Verify OTP
async function verifyOTP(sessionId, otpCode) {
  const response = await fetch('https://ecom-store-ebon.vercel.app/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      otp_session_id: sessionId,
      code: otpCode
    })
  });
  
  return await response.json();
}

// Step 3: Make authenticated requests
async function getProfile(token) {
  const response = await fetch('https://ecom-store-ebon.vercel.app/api/customers/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Alternative: Use customer_id directly
async function getProfileById(customerId) {
  const response = await fetch(`https://ecom-store-ebon.vercel.app/api/customers/${customerId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa('admin:admin123')
    }
  });
  
  return await response.json();
}
```

### Example 2: Password Reset with OTP

```javascript
// Step 1: Request OTP for password reset
async function requestPasswordResetOTP(emailOrPhone) {
  const response = await fetch('https://ecom-store-ebon.vercel.app/api/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone_or_email: emailOrPhone,
      purpose: 'password_reset'
    })
  });
  
  return await response.json();
}

// Step 2: Verify OTP and set new password
async function resetPassword(sessionId, otpCode, newPassword) {
  // First verify OTP
  const otpResponse = await fetch('https://ecom-store-ebon.vercel.app/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      otp_session_id: sessionId,
      code: otpCode
    })
  });
  
  const otpResult = await otpResponse.json();
  
  if (otpResult.data && otpResult.data.success) {
    // If OTP verification successful, set new password
    const resetResponse = await fetch('https://ecom-store-ebon.vercel.app/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${otpResult.data.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: newPassword
      })
    });
    
    return await resetResponse.json();
  }
  
  return otpResult;
}
```

## Security Considerations

1. **OTP Expiration**: OTPs are valid for a limited time (5 minutes as indicated by the `expires_in` parameter)
2. **Rate Limiting**: API enforces rate limits to prevent brute force attacks
3. **Maximum Attempts**: After multiple failed attempts, you'll need to request a new OTP
4. **Secure Transmission**: Always use HTTPS for API calls
5. **OTP Length**: The system uses 6-digit OTPs for security 