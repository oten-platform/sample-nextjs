# Quick Start Guide

Get your Oten IDP Next.js app running in 5 minutes using NextAuth! ⚡

## ✅ Prerequisites Checklist

- [ ] Node.js 18.17+ installed
- [ ] npm 9+ installed
- [ ] Oten IDP account created
- [ ] Application configured in Oten Developer Portal dashboard

## 🚀 5-Minute Setup

### Step 1: Install (1 min)

```bash
npm install
```

### Step 2: Configure Oten IDP (2 min)

1. Go to [Oten Developer Portal](https://developer.oten.live)
2. Create/select your application
3. Add these URLs:
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/oten-idp`
   - **Logout URIs**: `http://localhost:3000`
   - **Allow Origins (CORS)**: `http://localhost:3000`
4. Copy your **Client ID** and **Client Secret**

### Step 3: Create .env.local File (1 min)

```bash
# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```bash
OTEN_IDP_ISSUER=https://account.oten.live/
OTEN_IDP_CLIENT_ID=your_client_id_here
OTEN_IDP_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-random-string
```

> **Tip**: Generate a secure `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### Step 4: Run (1 min)

```bash
npm run dev
```

Open http://localhost:3000 and click **"Log In"**! 🎉

## 🐛 Troubleshooting

### "Redirect URI mismatch"

- Check that `http://localhost:3000/api/auth/callback/oten-idp` is in your Oten Developer Portal dashboard

### "Invalid Client"

- Verify your Client ID and Client Secret in `.env.local` are correct

### "Configuration Error"

- Make sure `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure `OTEN_IDP_ISSUER` ends with a trailing slash
- Verify `NEXTAUTH_URL` is set correctly

### Can't log in

- Make sure you created an account in Oten IDP
- Check browser console for errors
- Verify cookies are enabled

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- Explore the code in `src/` directory
- Learn about [NextAuth.js](https://next-auth.js.org/)

## 🆘 Need Help?

- [Documentation](https://oten.gitbook.io/idp-support/integration/integration-document)
- [NextAuth Docs](https://next-auth.js.org/)
- [GitHub Issues](https://github.com/oten-platform/sample-nextjs/issues)

---

**Happy coding! 🚀**
