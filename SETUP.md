# Setup Guide - Composio AI Chat

This guide will help you set up and run the project locally.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
   - Check: `node --version`
   - Download: [nodejs.org](https://nodejs.org/)

2. **pnpm** package manager installed
   - Install: `npm install -g pnpm`
   - Check: `pnpm --version`

3. **PostgreSQL database** running
   - Local installation or cloud service (e.g., Supabase, Neon, Railway)
   - You'll need the connection string

4. **API Keys** (see below for details)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create Environment Variables File

Create a `.env.local` file in the root directory:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### 3. Configure Environment Variables

Add the following variables to your `.env.local` file:

#### Required Variables

```env
# Database (REQUIRED)
POSTGRES_URL=postgresql://user:password@localhost:5432/database_name

# Authentication (REQUIRED)
AUTH_SECRET=your-random-secret-key-here
# Generate one with: openssl rand -base64 32

# GitHub OAuth (REQUIRED for GitHub login)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI AI (REQUIRED for chat functionality)
OPENAI_API_KEY=sk-your-api-key-here

# Composio Integration (REQUIRED for third-party app integrations)
COMPOSIO_API_KEY=your_composio_api_key

# Vercel Blob (REQUIRED for file uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

#### Optional Variables

```env
# Redis (OPTIONAL - for resumable streams)
# If not provided, resumable streams will be disabled
REDIS_URL=redis://localhost:6379

# Composio OAuth URLs (OPTIONAL - for specific app integrations)
NEXT_PUBLIC_COMPOSIO_AUTH_GITHUB=https://your-app.com/api/connections/callback
NEXT_PUBLIC_COMPOSIO_AUTH_GMAIL=https://your-app.com/api/connections/callback
NEXT_PUBLIC_COMPOSIO_AUTH_GOOGLECALENDAR=https://your-app.com/api/connections/callback
NEXT_PUBLIC_COMPOSIO_AUTH_LINEAR=https://your-app.com/api/connections/callback
NEXT_PUBLIC_COMPOSIO_AUTH_NOTION=https://your-app.com/api/connections/callback
NEXT_PUBLIC_COMPOSIO_AUTH_SLACK=https://your-app.com/api/connections/callback

# Port (OPTIONAL - defaults to 3000)
PORT=3000
```

### 4. Get Your API Keys

#### AUTH_SECRET
Generate a random secret:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

#### Composio API Key
1. Go to [Composio Developer Portal](https://app.composio.dev/developers)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key

#### Vercel Blob Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Go to Storage → Blob
4. Create a new Blob store (or use existing)
5. Copy the `BLOB_READ_WRITE_TOKEN`

#### PostgreSQL Database
**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally, then:
POSTGRES_URL=postgresql://postgres:password@localhost:5432/chat_db
```

**Option B: Cloud Database (Recommended)**
- [Supabase](https://supabase.com/) - Free tier available
- [Neon](https://neon.tech/) - Free tier available
- [Railway](https://railway.app/) - Free tier available

Copy the connection string provided by your service.

### 5. Run Database Migrations

```bash
pnpm db:migrate
```

This will create all necessary database tables.

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
- Verify your `POSTGRES_URL` is correct
- Ensure PostgreSQL is running
- Check if the database exists
- Verify network/firewall settings for cloud databases

### Missing Environment Variables

If you see errors about missing environment variables:
- Ensure `.env.local` is in the root directory
- Check that variable names match exactly (case-sensitive)
- Restart the dev server after adding new variables

### GitHub OAuth Not Working

- Verify callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
- Check that Client ID and Secret are correct
- Ensure GitHub app is not in "Development" mode restrictions

### AI Chat Not Working

- Verify `OPENAI_API_KEY` is set correctly
- Check your OpenAI account has credits/quota
- Ensure the API key has proper permissions

### File Uploads Not Working

- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob storage is properly configured
- Ensure file size is under 5MB (current limit)

## Quick Start (Minimal Setup)

For a minimal setup to just get it running:

1. **Install dependencies**: `pnpm install`
2. **Set minimal env vars**:
   ```env
   POSTGRES_URL=your_postgres_url
   AUTH_SECRET=generate-random-secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   OPENAI_API_KEY=your_openai_key
   COMPOSIO_API_KEY=your_composio_key
   BLOB_READ_WRITE_TOKEN=your_blob_token
   ```
3. **Run migrations**: `pnpm db:migrate`
4. **Start server**: `pnpm dev`

Note: Some features (like file uploads, Composio integrations) won't work without their respective API keys, but basic chat functionality should work with just the required variables.

## Additional Commands

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test

# Open database studio (visual database browser)
pnpm db:studio

# Build for production
pnpm build

# Start production server
pnpm start
```

## Next Steps

Once the app is running:
1. Visit `http://localhost:3000`
2. You can sign in as a guest (no GitHub required)
3. Or sign in with GitHub for full features
4. Start chatting with the AI!

