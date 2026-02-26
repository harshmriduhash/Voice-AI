# 🚀 Launch Checklist

- [ ] **API Keys**: Verify all keys are in Vercel (Deepgram, Gemini, Clerk, MongoDB).
- [ ] **Security**: Run `fix_rls.sql` or equivalent Prisma migration.
- [ ] **Custom Domain**: Connect your domain in Vercel settings.
- [ ] **Analytics**: Connect PostHog or Google Analytics.
- [ ] **Legal**: Add Privacy Policy and Terms of Service.
- [ ] **Support**: Verify the Contact Form (Web3Forms) is working.

---

# 🏗️ Production Checklist

- [ ] **Environment**: Set `NODE_ENV` to `production`.
- [ ] **Database**: Enable MongoDB backup/sharding if needed.
- [ ] **Caching**: Implement Redis (Upstash) for heavy API routes.
- [ ] **Logging**: Set up Sentry for error tracking.
- [ ] **Performance**: Run Lighthouse audit and fix bottlenecks.
- [ ] **SEO**: Verify meta tags and sitemap.

---

# ⚡ Execution Checklist

- [ ] **Step 1**: Finalize Clerk Auth flow (Modals + Redirection).
- [ ] **Step 2**: Connect MongoDB via Prisma.
- [ ] **Step 3**: Test the Voice-to-Voice loop end-to-end.
- [ ] **Step 4**: Run a full production build (`npm run build`).
- [ ] **Step 5**: Deploy to Vercel.

---

# 🎯 MVP Launch Checklist

- [ ] **Core Feature**: Voice recording + AI response + Audio playback.
- [ ] **User Flow**: Sign up -> Try voice -> Check history.
- [ ] **Monetization**: Working mock payment route (or Stripe test mode).
- [ ] **Landing Page**: Clear value proposition and "Get Started" call-to-action.
- [ ] **Mobile**: Critical UI elements work on iOS/Android browsers.

---

# ✅ Ready Checklist

- [ ] Build is passing? Yes.
- [ ] Keys are secure? Yes.
- [ ] Mobile responsive? Yes.
- [ ] Credits deducting? Yes.
- [ ] AI responses concise? Yes.

---

# 💎 SaaS Ready Checklist

- [ ] **Onboarding**: Welcome email after sign-up.
- [ ] **Usage limits**: Credits are strictly enforced.
- [ ] **Billing**: Subscription tier logic (Free vs Pro).
- [ ] **Scalability**: Stateless API routes.
- [ ] **Maintenance Mode**: Flag to disable interactions during updates.
