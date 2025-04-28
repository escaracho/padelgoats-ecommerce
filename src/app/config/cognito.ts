import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const COGNITO_CONFIG = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'sa-east-1',
};

export const cognitoClient = new CognitoIdentityProviderClient({
  region: COGNITO_CONFIG.region,
}); 