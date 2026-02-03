# Oten IDP Next.js Sample

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![NextAuth](https://img.shields.io/badge/NextAuth-4.24.13-purple)](https://next-auth.js.org/)

A sample Next.js application demonstrating authentication with **Oten IDP** using OpenID Connect (OIDC) and OAuth 2.0 with server-side rendering.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Code Examples](#-code-examples)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#-security-best-practices)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Overview

This sample application demonstrates how to:

- ✅ Authenticate users with Oten IDP using Authorization Code Flow with PKCE
- ✅ Handle login and logout flows with server-side redirects
- ✅ Manage authentication state with server-side sessions
- ✅ Store and retrieve user tokens securely in HTTP-only cookies
- ✅ Handle token expiration and session management
- ✅ Make authenticated API calls using access tokens
- ✅ Implement server-side rendering (SSR) with authentication

### Why NextAuth (Auth.js)?

This sample uses [`NextAuth v4`](https://next-auth.js.org/), the most popular authentication library for Next.js that provides:

- 🎯 **Simple API** - Clean server-side authentication with minimal setup
- 🔄 **Automatic Session Management** - Handles sessions and tokens automatically
- 📦 **Built for Next.js** - Designed specifically for Next.js App Router
- 🛡️ **Type Safe** - Full TypeScript support out of the box
- ⚡ **Server-First** - Server-side authentication for better security
- 🧪 **Well Tested** - Battle-tested in production applications
- 🔐 **Secure by Default** - HTTP-only cookies, CSRF protection, and more

## ✨ Features

- **🔐 Secure Authentication** - OAuth 2.0 / OpenID Connect with PKCE
- **⚛️ Modern Next.js** - Built with Next.js 15 App Router and TypeScript
- **🎨 Beautiful UI** - Glassmorphism design with smooth animations (matches React sample)
- **🔄 Session Management** - Automatic server-side session storage in encrypted cookies
- **⚡ Fast Development** - Hot module replacement with Next.js
- **📦 Minimal Setup** - Uses NextAuth for seamless authentication
- **🛡️ Type Safe** - Full TypeScript support
- **🌐 SSR Support** - Server-side rendering with authentication

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- An **Oten IDP account** with a configured application

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/oten-platform/sample-nextjs.git
cd sample-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Oten IDP Application

1. Log in to your [Oten Developer Portal](https://developer.oten.com)
2. Create a new application or select an existing one
3. Configure the following settings:
   - **Application Type**: Regular Web Application
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/oten-idp`
   - **Logout URIs**: `http://localhost:3000`
   - **Allow Origins (CORS)**: `http://localhost:3000`
   - **Allowed Scopes**: `openid`, `profile`, `email`

4. Save your configuration and note your:
   - **Issuer URL** (`https://account.oten.com/`)
   - **Client ID**
   - **Client Secret**

### 4. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
OTEN_IDP_ISSUER=https://account.oten.com/
OTEN_IDP_CLIENT_ID=your_client_id_here
OTEN_IDP_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-random-string
```

> ⚠️ **Important**:
>
> - Never commit your `.env.local` file to version control
> - Generate a strong `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

### 5. Run the Application

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 6. Test the Authentication Flow

1. Open http://localhost:3000 in your browser
2. Click the **"Log In"** button
3. You'll be redirected to Oten IDP login page
4. Enter your credentials
5. After successful authentication, you'll be redirected back to the app
6. Your profile information will be displayed

## ⚙️ Configuration

### Environment Variables

| Variable                 | Required | Description                                   | Example                     |
| ------------------------ | -------- | --------------------------------------------- | --------------------------- |
| `OTEN_IDP_ISSUER`        | ✅ Yes   | Oten IDP issuer URL (OIDC discovery endpoint) | `https://account.oten.com/` |
| `OTEN_IDP_CLIENT_ID`     | ✅ Yes   | Your application's client ID                  | `abc123xyz...`              |
| `OTEN_IDP_CLIENT_SECRET` | ✅ Yes   | Your application's client secret              | `secret123...`              |
| `NEXTAUTH_URL`           | ✅ Yes   | Your application's URL                        | `http://localhost:3000`     |
| `NEXTAUTH_SECRET`        | ✅ Yes   | Secret for encrypting session tokens          | `random-32-char-string`     |

### NextAuth Configuration

The NextAuth settings are configured in `src/libs/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth";

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
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.sub = profile.sub as string;
      }
      return token;
    },
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
```

## 📂 Project Structure

```
oten-auth-nextjs/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/
│   │   │   └── route.ts          # NextAuth API route handler
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout with SessionProvider
│   │   └── page.tsx              # Main page with SSR authentication
│   ├── components/
│   │   ├── LoginButton.tsx       # Login button (Client Component)
│   │   ├── LogoutButton.tsx      # Logout button (Client Component)
│   │   ├── Profile.tsx           # User profile display (Client Component)
│   │   └── SessionProvider.tsx   # NextAuth SessionProvider wrapper
│   └── libs/
│       └── auth.ts               # NextAuth v4 configuration
├── .env.local                    # Environment variables (create this)
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── CONTRIBUTING.md               # Contributing guidelines
├── QUICK_START.md                # Quick start guide
└── README.md
```

## 🔍 How It Works

### Authentication Flow

```
┌─────────┐              ┌──────────────┐              ┌──────────────┐
│  User   │              │  Next.js App │              │  Oten IDP    │
└────┬────┘              └──────┬───────┘              └──────┬───────┘
     │                          │                             │
     │  1. Click "Log In"       │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  2. Server Action triggers  │
     │                          │     signIn("oten")          │
     │                          │                             │
     │                          │  3. Redirect to /authorize  │
     │                          │     (with PKCE)             │
     │                          ├────────────────────────────>│
     │                          │                             │
     │  4. Redirected to Oten IDP login page                  │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  5. Enter credentials    │                             │
     ├────────────────────────────────────────────────────────>
     │                          │                             │
     │  6. Redirect back with auth code                       │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  7. Callback to          │                             │
     │     /api/auth/callback   │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  8. Exchange code for tokens│
     │                          ├────────────────────────────>│
     │                          │                             │
     │                          │  9. Return access_token &   │
     │                          │     id_token                │
     │                          │<────────────────────────────┤
     │                          │                             │
     │                          │  10. Store session in       │
     │                          │      encrypted HTTP-only    │
     │                          │      cookie                 │
     │                          │                             │
     │  11. Redirect to home    │                             │
     │      with session        │                             │
     │<─────────────────────────┤                             │
     │                          │                             │
     │  12. SSR renders page    │                             │
     │      with user profile   │                             │
     │<─────────────────────────┤                             │
     │                          │                             │
```

### Key Components

#### **NextAuth Configuration** (`src/libs/auth.ts`)

The authentication configuration that:

- Defines the Oten IDP provider with OAuth 2.0 settings
- Enables PKCE and state checks for security
- Configures JWT and session callbacks to store tokens
- Exports `authOptions` for use in API routes and server components

#### **API Route Handler** (`src/app/api/auth/[...nextauth]/route.ts`)

A catch-all API route that handles all NextAuth endpoints:

```typescript
import { authOptions } from "@/libs/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

This single route handles:

- `/api/auth/signin` - Initiates login
- `/api/auth/callback/oten-idp` - OAuth callback
- `/api/auth/signout` - Initiates logout
- `/api/auth/session` - Returns current session

#### **Server Components**

- **page.tsx** - Main page that uses `getServerSession(authOptions)` to get session server-side
- **layout.tsx** - Root layout that wraps the app with `SessionProvider`

#### **Client Components**

- **LoginButton** - Client component that calls `signIn("oten-idp")`
- **LogoutButton** - Client component that calls `signOut()`
- **Profile** - Client component for displaying user profile with image error handling
- **SessionProvider** - Wrapper for NextAuth's SessionProvider

### Automatic Features

NextAuth automatically handles:

- **Session Storage** - Encrypted sessions in HTTP-only cookies
- **Token Management** - Stores access and ID tokens securely
- **CSRF Protection** - Built-in CSRF token validation
- **Callback Processing** - Handles OAuth callback parameters
- **Error Management** - Provides error handling for authentication failures

## 📚 API Reference

### getServerSession() Function

Server-side function to get the current session:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    console.log("User:", session.user);
    console.log("Access Token:", session.accessToken);
  }
}
```

**Returns**: `Promise<Session | null>`

### signIn() Function

Client-side function to initiate login:

```typescript
import { signIn } from "next-auth/react";

// In a client component
signIn("oten-idp");

// With redirect options
signIn("oten-idp", { callbackUrl: "/dashboard" });
```

**Parameters**:

- `provider` (string) - Provider ID (use "oten-idp")
- `options` (object, optional) - Redirect options

### signOut() Function

Client-side function to initiate logout:

```typescript
import { signOut } from "next-auth/react";

// In a client component
signOut();

// With redirect options
signOut({ callbackUrl: "/" });
```

**Parameters**:

- `options` (object, optional) - Redirect options

### Session Object

```typescript
{
  user: {
    id: string;           // User ID (from sub claim)
    name: string;         // Full name
    email: string;        // Email address
    image?: string;       // Profile picture URL
  },
  accessToken?: string;   // Access token for API calls
  idToken?: string;       // ID token
  expires: string;        // Session expiration timestamp
}
```

### Making Authenticated API Calls

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>Not authenticated</div>;
  }

  const response = await fetch("https://api.example.com/protected", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return <div>{JSON.stringify(data)}</div>;
}
```

## 💻 Code Examples

### Complete Component Examples

#### Login Button (Client Component)

```typescript
"use client";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      className="button login"
      onClick={() => signIn("oten-idp", { callbackUrl: "/" })}
    >
      Log In
    </button>
  );
}
```

#### Logout Button (Client Component)

```typescript
"use client";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="button logout"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Log Out
    </button>
  );
}
```

#### Profile Component (Client Component)

```typescript
"use client";
import { useSession } from "next-auth/react";

export function Profile() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="profile-section">
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23667eea'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E"
        alt={user.name || "User"}
        className="profile-picture"
      />
      <div className="profile-info">
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
      </div>
    </div>
  );
}
```

#### Main Page Example (SSR)

```typescript
import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";
import { Profile } from "@/components/Profile";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">Welcome to Oten IDP Sample</h1>

        {isAuthenticated ? (
          <div className="logged-in-section">
            <div className="logged-in-message">✅ Successfully authenticated!</div>
            <h2 className="profile-section-title">Your Profile</h2>
            <div className="profile-card">
              <Profile />
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="action-card">
            <p className="action-text">Get started by signing in to your account</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Protected Page Example (SSR)

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  // Redirect to home if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
}
```

#### Client-Side Session Access

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {session?.user?.name}!</div>;
}
```

> **Note**: This sample wraps the app with `SessionProvider` in `layout.tsx` to enable client-side session access. For better security, prefer server-side authentication with `getServerSession()` when possible.

## 🐛 Troubleshooting

### Common Issues

#### **"Redirect URI mismatch" Error**

**Problem**: The redirect URI doesn't match what's configured in Oten Developer Portal.

**Solution**:

- Verify the redirect URI in Oten Developer Portal is exactly: `http://localhost:3000/api/auth/callback/oten-idp`
- Include the protocol (`http://` or `https://`)
- Don't include trailing slashes
- For production, update to your production URL

#### **"Invalid Client" Error**

**Problem**: Client ID is incorrect or client is not configured properly.

**Solution**:

- Double-check `OTEN_IDP_CLIENT_ID` in your `.env.local` file
- Ensure the client is enabled in Oten Developer Portal dashboard
- Verify the client is configured for Authorization Code Flow
- Check that the issuer URL is correct

#### **"Configuration" Error**

**Problem**: NextAuth configuration is missing or incorrect.

**Solution**:

- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Generate a new secret: `openssl rand -base64 32`
- Ensure `NEXTAUTH_URL` is set to your application URL
- Check that `OTEN_IDP_ISSUER` ends with a trailing slash
- Verify `OTEN_IDP_CLIENT_SECRET` is set correctly

#### **Session Lost on Page Refresh**

**Problem**: User is logged out when refreshing the page.

**Solution**:

- Check browser console for cookie errors
- Verify cookies are enabled in browser settings
- Ensure `NEXTAUTH_SECRET` is consistent across restarts
- Check that your domain is not blocking cookies

#### **CORS Errors**

**Problem**: Browser blocks requests to Oten IDP.

**Solution**:

- Ensure `http://localhost:3000` is added to Allow Origins (CORS) in Oten Developer Portal dashboard
- Verify the issuer URL is correct and accessible
- Check CORS settings in your Oten IDP application

#### **Build Errors**

**Problem**: TypeScript errors during build.

**Solution**:

- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript version is compatible (5.x)
- Verify `tsconfig.json` is properly configured
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Debug Mode

Enable debug logging in NextAuth by adding to `.env.local`:

```bash
NEXTAUTH_DEBUG=true
```

This will log detailed authentication events to the console.

## 🔒 Security Best Practices

This sample implements several security best practices:

- ✅ **Authorization Code Flow with PKCE** - Most secure OAuth flow for web apps
- ✅ **State Parameter** - CSRF protection (handled by NextAuth)
- ✅ **Nonce Validation** - Replay attack protection (handled by NextAuth)
- ✅ **HTTP-only Cookies** - Tokens stored in encrypted HTTP-only cookies (not accessible to JavaScript)
- ✅ **HTTPS Required** - Always use HTTPS in production
- ✅ **Server-Side Sessions** - Session validation happens on the server
- ✅ **CSRF Protection** - Built-in CSRF token validation
- ✅ **Secure by Default** - NextAuth follows security best practices out of the box

### Production Recommendations

1. **Use HTTPS** - Always serve your app over HTTPS in production
2. **Environment Variables** - Never commit `.env.local` to version control
3. **Strong NEXTAUTH_SECRET** - Use a cryptographically secure random string (32+ characters)
4. **Content Security Policy** - Add CSP headers to prevent XSS attacks
5. **Rate Limiting** - Implement rate limiting on authentication endpoints
6. **Session Monitoring** - Track and monitor active user sessions
7. **Audit Logging** - Log authentication events for security monitoring
8. **Update Dependencies** - Keep NextAuth and other dependencies up to date
9. **Secure Cookies** - In production, ensure cookies are set with `Secure` and `SameSite` flags
10. **Token Rotation** - Implement refresh token rotation if supported by your IDP

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This sample application is provided as-is for educational and integration purposes.

## 🆘 Support

- **Documentation**: [Oten IDP Documentation](https://oten.gitbook.io/idp-support/integration/integration-document)
- **Need help**: [Oten IDP Support](https://oten.gitbook.io/idp-support/integration/integration-document#need-help)
- **NextAuth Documentation**: [NextAuth.js Docs](https://next-auth.js.org/)
- **GitHub Issues**: [GitHub Issues](https://github.com/oten-platform/sample-nextjs/issues)

---

**Built with ❤️ using Next.js, TypeScript, NextAuth, and Oten IDP**
