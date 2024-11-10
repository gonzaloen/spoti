// Ruta: /pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "user-read-email user-follow-read user-read-recently-played user-top-read",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/api/login', // Ruta personalizada para el login si lo necesitas
  },
  callbacks: {
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
