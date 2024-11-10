// /pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-top-read,user-follow-read',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // If initial sign in, persist Spotify access token to the token
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach access token to session
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
