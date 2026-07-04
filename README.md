# LeadFlow AI

AI-powered lead qualification and appointment booking for small businesses. Automatically engages new leads, asks qualification questions, scores them, and books appointments — while notifying the business owner at every step.

## Demo industries included out of the box

| Business type | `NEXT_PUBLIC_BUSINESS_TYPE` value |
|---|---|
| Dental clinic | `dental` |
| Immigration consultant | `immigration` |
| Real estate agency | `realestate` |
| Coaching center | `coaching` |

Switching industries = one environment variable change. No code changes needed.

---

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling  
- **Supabase** (PostgreSQL) for data storage
- **Anthropic Claude Sonnet 4.6** for AI qualification
- **Resend** for email notifications
- **Calendly** for appointment booking
- **Vercel** for deployment

---

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up the Supabase database
1. Create a project at supabase.com
2. Go to SQL Editor → New Query
3. Paste the contents of `supabase/schema.sql` and run it

### 4. Configure Calendly webhook
1. Go to Calendly Integrations → Webhooks
2. Add webhook URL: `https://your-domain.com/api/calendly/webhook`
3. Select event: `invitee.created`
4. Copy the signing key to `CALENDLY_WEBHOOK_SECRET`

### 5. Run
```bash
npm run dev
```

- Landing page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

---

## How the flow works

```
Lead submits form
   → Lead created in Supabase
   → AI chat opens (Claude)
   → AI asks 5 qualification questions
   → After 5 answers: qualification engine fires
   → Claude returns { qualified, reason, score }

If qualified:
   → Calendly booking link shown to lead
   → Owner notified via email (Resend)

Lead books appointment via Calendly
   → Calendly webhook fires
   → Booking stored in DB
   → Owner notified with appointment time
   → Dashboard updates
```

---

## Adding a new industry

1. Open `lib/business-config.ts`
2. Add entry to `businessConfigs` with questions, criteria, services, prompt
3. Set `NEXT_PUBLIC_BUSINESS_TYPE=your-key`
4. Done

---

## Deploy to Vercel

```bash
vercel
```

Or connect GitHub repo at vercel.com. Add all env vars in Vercel project settings.
