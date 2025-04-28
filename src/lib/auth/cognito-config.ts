import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          phone: false,
          username: false
        },
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_APP_URL || ''],
          redirectSignOut: [process.env.NEXT_PUBLIC_APP_URL || ''],
          responseType: 'code'
        }
      }
    }
  });
}; 