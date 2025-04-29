import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';

export function withAdminAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAccessComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      const checkAdminAccess = async () => {
        try {
          const session = await fetchAuthSession();
          const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
          const hasAdminAccess = groups.includes('admins');

          if (!hasAdminAccess) {
            console.log('User is not an admin, redirecting to home');
            router.push('/');
            return;
          }

          setIsAdmin(true);
        } catch (error) {
          console.error('Error checking admin access:', error);
          router.push('/');
        } finally {
          setIsLoading(false);
        }
      };

      checkAdminAccess();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl">Cargando...</div>
        </div>
      );
    }

    if (!isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 