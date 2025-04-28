import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://master.d3dtekhglrfuc9.amplifyapp.com';
  
  Amplify.configure({
    Auth: {
      Cognito: {
        region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'sa-east-1',
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          phone: false,
          username: false
        },
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN?.replace('https://', ''),
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [appUrl],
          redirectSignOut: [appUrl],
          responseType: 'code'
        }
      }
    }
  });
}; 