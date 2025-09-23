# URL Environment Variable Setup - Summary

This document summarizes all the changes made to replace hardcoded URLs with environment variables throughout your application.

## Environment Files Updated

### Server (.env)
```
# Added:
BACKEND_URL=http://localhost:5001
# Existing:
FRONTEND_URL=http://localhost:5173
```

### Client (.env)
```
# Added:
VITE_BACKEND_URL=http://localhost:5001
VITE_FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5001/api/v1
# Existing:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51R1rFfFVhqaCFYDjOluJm2oscrzFVKWOyNnYwDKvvix7F2vXTVtbK63mLEFg1cbf9TzfkxGVaMv9sGowPSF5b7h700YO0xfwb2
```

## New Configuration File
- **client/src/config/env.ts**: Centralized environment variable management for the client

## Files Updated

### Server Side
1. **server/index.ts**: CORS configuration
2. **server/mailtrap/email.ts**: Email template links

### Client Side
3. **client/src/lib/axios.ts**: Base URL configuration
4. **client/src/store/useUserStore.ts**: API endpoints
5. **client/src/store/useRestaurantStore.ts**: API endpoints
6. **client/src/store/useMenuStore.ts**: API endpoints
7. **client/src/store/useOrderStore.ts**: API endpoints
8. **client/src/auth/login.tsx**: API connectivity test
9. **client/src/components/VerifyOwnerRequest.tsx**: API calls
10. **client/src/components/VerifyOwnerOTP.tsx**: API calls
11. **client/src/components/BecomeOwner.tsx**: Multiple API calls
12. **client/src/admin/OwnerRequests.tsx**: API calls
13. **client/src/components/ResturantDetail.tsx**: API connectivity test

## Usage Pattern

### Server (Node.js)
```javascript
// Using environment variables
process.env.FRONTEND_URL || 'http://localhost:5173'
process.env.BACKEND_URL || 'http://localhost:5001'
```

### Client (React with Vite)
```javascript
// Import config
import { config } from '@/config/env';

// Use helper functions
config.getApiUrl('/menu')
config.getBackendUrl('/some-path')

// Or direct access
config.API_BASE_URL
config.BACKEND_URL
config.FRONTEND_URL
```

## Benefits

1. **Environment-specific URLs**: Easy to change URLs for different environments (development, staging, production)
2. **Centralized Configuration**: All URL management in one place
3. **Type Safety**: Helper functions prevent URL construction errors
4. **Easy Deployment**: Just update .env files for different environments
5. **No More Hardcoding**: All URLs are now dynamic and configurable

## Next Steps for Deployment

### For Production:
Update your .env files with production URLs:

**Server .env:**
```
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

**Client .env:**
```
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_FRONTEND_URL=https://your-frontend-domain.com
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

### For Different Environments:
You can now easily create separate .env files for:
- `.env.local` (local development)
- `.env.development` (development server)
- `.env.staging` (staging server)
- `.env.production` (production server)

All your URLs are now fully configurable through environment variables! 🎉