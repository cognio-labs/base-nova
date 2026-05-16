# LokoAI Auth Setup

This project uses Supabase Auth with Next.js App Router cookies.

## 1. Supabase keys

Create a Supabase project, then copy these values from Project Settings -> API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add them to `.env.local`. On Vercel, add the same variables in Project Settings -> Environment Variables.

## 2. Database

Open Supabase SQL Editor and run:

```sql
-- paste the contents of supabase/schema.sql
```

This creates `profiles`, `projects`, and `generations` with Row Level Security so users can access only their own records.

## 3. Google OAuth

In Supabase Dashboard:

1. Go to Authentication -> Providers -> Google.
2. Enable Google.
3. Add your Google OAuth Client ID and Client Secret.
4. In Google Cloud Console, add Supabase's callback URL shown in the provider screen.
5. In Supabase Authentication -> URL Configuration, set:
   - Site URL: `http://localhost:3000` locally, your Vercel domain in production
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://your-domain.com/auth/callback`

## 4. GitHub OAuth

In Supabase Dashboard:

1. Go to Authentication -> Providers -> GitHub.
2. Enable GitHub.
3. Create a GitHub OAuth App.
4. Set the callback URL to the Supabase callback URL shown in the GitHub provider screen.
5. Paste GitHub Client ID and Client Secret into Supabase.

## 5. Phone OTP

In Supabase Dashboard:

1. Go to Authentication -> Providers -> Phone.
2. Enable Phone provider.
3. Configure an SMS provider supported by Supabase.
4. Users can then sign in with phone number and OTP from the LokoAI login modal.

## 6. Vercel deployment

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Add `https://your-domain.com/auth/callback` to Supabase Redirect URLs.
6. Deploy.

Protected routes are `/workspace`, `/dashboard`, `/projects`, and `/generate`.
