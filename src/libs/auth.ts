import { NextAuthOptions } from "next-auth";

/**
 * NextAuth v4 configuration for Oten IDP
 * Uses Authorization Code Flow with PKCE
 */
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "oten-idp",
      name: "Oten IDP",
      type: "oauth",
      wellKnown: `${process.env.OTEN_IDP_ISSUER}.well-known/openid-configuration`,
      clientId: process.env.OTEN_IDP_CLIENT_ID!,
      clientSecret: process.env.OTEN_IDP_CLIENT_SECRET!,
      client: {
        id_token_signed_response_alg: "EdDSA", // Oten IDP uses EdDSA for signing
      },
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      checks: ["pkce", "state"],
      // Map OIDC claims to NextAuth profile
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  callbacks: {
    // Store additional token info in the session
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.sub = profile.sub as string;
      }
      return token;
    },
    // Make token info available in the session
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.idToken) {
        session.idToken = token.idToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend session types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
  }
}

