import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID || ''
    }
  },
  API: {
    REST: {
      padelgoatsApi: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'sa-east-1',
      }
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'sa-east-1',
    }
  }
}); 