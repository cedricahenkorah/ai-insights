import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { googleAuth } from "./lib/auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  pages: { signIn: "/auth" },

  session: {
    strategy: "jwt",
    maxAge: 5 * 24 * 60 * 60, // 5 days
  },

  callbacks: {
    async signIn({ user }) {
      try {
        // Send a request to your backend's auth endpoint
        const response = await googleAuth(user);

        // Attach the returned access token to the user object
        user.accessToken = response.data.accessToken;

        return true;
      } catch (error) {
        console.error("Error sending request to backend auth endpoint:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Add accessToken to the token
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Add accessToken to the session
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
});
