// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getUserFromDatabase, createUserInDatabase, getUserById } from '../../../lib/db';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;


if (!clientId || !clientSecret) {
  throw new Error('GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET doivent être définis dans les variables d\'environnement');
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      
      const userData = await getUserFromDatabase(user.email as string);
      
     
      if (!userData) {
        await createUserInDatabase(user.email as string, user.name as string);
      }

      // Toujours autoriser la connexion, la validation de l'adresse se fait après
      return true;
    },
    async jwt({ token, user }) {
      // Lors de la première connexion
      if (user) {
        const userData = await getUserFromDatabase(user.email as string);
        if (userData) {
          token.id = userData._id.toString();
          token.addressValidated = userData.addressValidated || false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.addressValidated = token.addressValidated as boolean;
      }
      return session;
    },
  },
  secret: nextAuthSecret || '',
});
