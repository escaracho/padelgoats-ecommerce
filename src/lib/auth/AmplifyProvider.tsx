'use client';

import { ReactNode, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AmplifyProviderProps {
  children: ReactNode;
}

export function AmplifyProvider({ children }: AmplifyProviderProps) {
  useEffect(() => {
    try {
      // Configure Amplify
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
            identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
            signUpVerificationMethod: 'code',
          },
        },
      });
    } catch (error) {
      console.error('Error configuring Amplify:', error);
    }
  }, []);

  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
} 