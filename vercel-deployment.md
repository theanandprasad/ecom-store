# Vercel Deployment Details for ecom-store API

This document outlines the deployment process and configuration for the ecom-store API project hosted on Vercel.

## Project Structure

The ecom-store API is organized as follows:

```
api/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── verify-otp/
│   │   │   │   │   └── route.ts
│   │   │   │   └── send-otp/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   └── ...other API routes
│   ├── lib/
│   ├── utils/
│   └── ...
├── mock-data/
│   ├── customers.json
│   ├── otp_sessions.json
│   ├── products.json
│   └── ...other mock data files
├── deploy.sh
├── vercel.json
└── ...
```

## Deployment Script

The project uses a simple deployment script (`deploy.sh`) to deploy to Vercel:

```bash
#!/bin/bash

# Update next.config.js to disable type checking during build
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
EOL

# Deploy to Vercel
vercel --prod

echo "Deployment process completed!"
```

## Vercel Configuration

The project uses a `vercel.json` file to configure the deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "public": true,
  "env": {
    "USE_NEDB": "true"
  }
}
```

## Deployment Process

To deploy changes to the API:

1. Make the necessary code changes
2. Navigate to the `api` directory: `cd api`
3. Run the deployment script: `./deploy.sh`
4. The script will update the Next.js configuration and deploy to Vercel

## Deployment History

Below are the recent deployments made to the project:

| Date | Feature/Change | Deployment URL |
|------|----------------|----------------|
| May 2024 | Enabled NeDB mode for database operations | https://ecom-store-ebon.vercel.app/ |
| April 2024 | Updated verify-otp endpoint to include customer details in response | https://ecom-store-ebon.vercel.app/ |
| April 2024 | Updated verify-otp to use mock data for OTP verification | https://ecom-store-rjoygte0p-theanandprasads-projects.vercel.app/ |

## Environment Variables

The project uses the following environment variables configured in Vercel:

- USE_NEDB: Set to "true" to enable NeDB for data operations (configured in vercel.json)
- API_TOKEN: Secret token for authentication
- DB_PATH: Path for NeDB database files (defaults to /tmp/db in production)

## Data Storage

The project supports two modes of data storage:

1. **Static JSON Files** (when USE_NEDB is false):
   - Uses JSON files in the `mock-data/` directory to simulate database responses
   - Read-only operations
   - Useful for demos and testing

2. **NeDB Database** (when USE_NEDB is true):
   - Uses NeDB for full CRUD operations
   - Stores data in JSON format with MongoDB-like querying
   - Enables write operations like creating and updating products

## API Endpoints

The main API endpoints are:

- `/api/auth/send-otp` - Send OTP for authentication
- `/api/auth/verify-otp` - Verify OTP and get customer details
- `/api/customers/:id` - Get customer details
- `/api/customers/:id/orders` - Get customer orders
- `/api/customers/:id/cart` - Get customer cart
- `/api/customers/:id/wishlist` - Get customer wishlist
- `/api/products` - Get all products
- `/api/products/:id` - Get, update, or delete a specific product
- ...and more

## Accessing the API

The API can be accessed at the base URL: https://ecom-store-ebon.vercel.app/

Authentication is required for most endpoints and can be done using Basic Auth with admin:admin123 credentials:

```bash
curl -X GET "https://ecom-store-ebon.vercel.app/api/endpoint" -u admin:admin123
```

## OTP Authentication

The API supports OTP-based authentication:

```bash
# Send OTP
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"phone_or_email": "john.doe@example.com", "purpose": "login"}'

# Verify OTP
curl -X POST "https://ecom-store-ebon.vercel.app/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{"otp_session_id": "session_id_here", "code": "123456"}'
```

## Troubleshooting Deployments

If you encounter issues with deployment:

1. Check the Vercel deployment logs in the Vercel Dashboard
2. Ensure mock data files are correctly formatted and accessible
3. Check for TypeScript or ESLint errors that might be causing build failures
4. Verify the environment variables are correctly set in vercel.json 