## Environment Setup Checklist

Please verify you have completed these steps:

### 1. Supabase Setup

**Have you created a Supabase project?**
- Go to https://database.new
- Create a new project
- Wait for it to finish provisioning

**Have you run the SQL schemas?**
1. Open your Supabase project → SQL Editor
2. Run `supabase_schema.sql` first (profiles table)
3. Then run `supabase_schema_phase4.sql` (conversations, messages, coupons)

**Have you set up environment variables?**
Create a `.env.local` file in the root with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DEEPGRAM_API_KEY=your-deepgram-key
```

Find these in: Supabase Dashboard → Settings → API

### 2. Test Supabase Connection

Try this test:
1. Go to http://localhost:3000/auth/register
2. Enter email: test@example.com
3. Enter password: testpassword123
4. Click Sign up
5. Check your email for verification link
6. Click the verification link
7. Go back to http://localhost:3000/auth/login
8. Login with same credentials

### 3. Common Issues

**"Could not create user" error:**
- Check if SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Verify SQL schemas were run successfully
- Check Supabase Dashboard → Authentication → Users

**Email not sending:**
- Supabase sends verification emails automatically
- Check spam folder
- In development, you can disable email verification in Supabase Dashboard → Authentication → Providers → Email

**Still not working?**
- Restart the dev server: `npm run dev`
- Clear browser cache
- Check browser console for specific errors
- Check Supabase logs in Dashboard → Logs
