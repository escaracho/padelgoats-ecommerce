import { Amplify } from 'aws-amplify';

const config = {
  credentials: {
    accessKeyId: process.env.CUSTOM_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CUSTOM_SECRET_ACCESS_KEY || '',
  },
  region: process.env.CUSTOM_AWS_REGION || 'sa-east-1',
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'sa-east-1',
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
      credentials: config.credentials,
    }
  }
}); 