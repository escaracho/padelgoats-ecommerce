import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a mock implementation. In a real app, you would:
        // 1. Validate credentials against your database
        // 2. Return user object if valid
        // 3. Return null if invalid

        if (credentials?.email === 'admin@example.com' && credentials?.password === 'admin123') {
          return {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            isAdmin: true
          };
        }

        if (credentials?.email === 'user@example.com' && credentials?.password === 'user123') {
          return {
            id: '2',
            email: 'user@example.com',
            name: 'Regular User',
            isAdmin: false
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}; 