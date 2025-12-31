# Supabase Redirect URL Configuration

## The Problem
When you click "Confirm your mail" in the email, Supabase needs to know where to redirect you back to. If this isn't configured, the email confirmation might not complete properly.

## Solution

### Step 1: Configure Redirect URLs in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to: **Authentication** → **URL Configuration**
3. Add these URLs:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs (add both):**
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

4. Click **Save**

### Step 2: Alternative - Disable Email Confirmation (For Testing)

If you want to test without email verification:

1. Go to: **Authentication** → **Providers** → **Email**
2. Find **"Confirm email"** toggle
3. **Turn it OFF**
4. Save

Then:
- Delete your current test account in Supabase Dashboard → Authentication → Users
- Sign up again with a new email
- You should be able to log in immediately

### Step 3: Check User Status

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your email (name@example.com)
3. Check if:
   - ✅ "Email Confirmed" column shows a checkmark
   - ✅ "Last Sign In" has a timestamp

If "Email Confirmed" is empty, the confirmation didn't work.

### Step 4: Manual Confirmation (Quick Fix)

If the email confirmation isn't working:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user
3. Click on the user
4. Click **"Confirm Email"** button manually
5. Try logging in again

---

## After Fixing

Once you've configured the redirect URLs or disabled email confirmation:

1. **Delete the old test account** in Supabase Dashboard
2. **Sign up again** with a fresh email
3. Try logging in

Let me know which step you're on!
