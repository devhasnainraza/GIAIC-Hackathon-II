# Newsletter System Setup Guide

## Overview
The newsletter system allows users to subscribe to updates from your Pure Tasks application. It includes email verification, welcome emails, and the ability to send updates to all subscribers.

## Features
- ✅ Email subscription with validation
- ✅ Double opt-in (email verification)
- ✅ Welcome email after verification
- ✅ Unsubscribe functionality
- ✅ Admin endpoints to manage subscribers
- ✅ Beautiful HTML email templates

## Setup Instructions

### 1. Database Setup

You need to create the `newsletter_subscribers` table in your Neon PostgreSQL database.

**Option A: Using SQL Script (Recommended)**

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project and database
3. Open the SQL Editor
4. Copy and paste the contents of `sql/create_newsletter_table.sql`
5. Run the script

**Option B: Using Alembic Migration**

```bash
cd backend
alembic upgrade head
```

### 2. Environment Variables

Add the following to your `.env` file (or HuggingFace Space settings):

```env
# Frontend URL (required for email verification links)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Email Provider (required for sending emails)
EMAIL_PROVIDER=resend  # Options: resend, gmail, console

# If using Resend
RESEND_API_KEY=your_resend_api_key

# If using Gmail
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# From email address
FROM_EMAIL=noreply@puretasks.com
```

**Important:**
- For production, use `resend` or `gmail` as EMAIL_PROVIDER (not `console`)
- Update `FRONTEND_URL` to your actual Vercel deployment URL
- Get a Resend API key from: https://resend.com/api-keys

### 3. Deploy Backend

Push your changes to HuggingFace:

```bash
cd backend
git add .
git commit -m "Add newsletter system with email verification"
git push
```

HuggingFace will automatically rebuild (takes 5-10 minutes).

### 4. Update HuggingFace Environment Variables

Go to your HuggingFace Space settings and add:
- `FRONTEND_URL` - Your Vercel frontend URL
- `EMAIL_PROVIDER` - Set to `resend` or `gmail`
- `RESEND_API_KEY` - Your Resend API key (if using Resend)
- `FROM_EMAIL` - Your sender email address

## API Endpoints

### Subscribe to Newsletter
```bash
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Verify Email
```bash
GET /api/newsletter/verify/{token}
```

### Unsubscribe
```bash
POST /api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Get All Subscribers (Admin)
```bash
GET /api/newsletter/subscribers
```

### Send Newsletter (Admin)
```bash
POST /api/newsletter/send
Content-Type: application/json

{
  "subject": "Newsletter Title",
  "content": "<h2>Your HTML content here</h2>"
}
```

## Testing

### Test Subscription Flow

1. Go to your website footer
2. Enter an email address
3. Click "Subscribe"
4. Check the email inbox for confirmation
5. Click the verification link
6. Receive welcome email

### Test API Directly

```bash
# Subscribe
curl -X POST https://hasnain-raza3-pure-tasks-backend.hf.space/api/newsletter/subscribe /
  -H "Content-Type: application/json" /
  -d '{"email":"test@example.com"}'

# Get subscribers
curl https://hasnain-raza3-pure-tasks-backend.hf.space/api/newsletter/subscribers
```

## Frontend Integration

The newsletter form is already integrated in:
- Footer component (`frontend/components/landing/Footer.tsx`)
- Newsletter form component (`frontend/components/newsletter/NewsletterForm.tsx`)

## Email Templates

Email templates are defined in `backend/src/services/newsletter_service.py`:
- Confirmation email with verification link
- Welcome email after verification
- Newsletter update emails with unsubscribe link

## Troubleshooting

### Emails not sending
- Check `EMAIL_PROVIDER` is set correctly (not `console` in production)
- Verify API keys are correct
- Check backend logs for errors

### Verification links not working
- Ensure `FRONTEND_URL` is set to your actual frontend domain
- Check that the frontend has a route at `/newsletter/verify/[token]`

### Database errors
- Verify the `newsletter_subscribers` table exists
- Check database connection string is correct
- Ensure database user has CREATE TABLE permissions

## Security Notes

- Email addresses are unique (no duplicate subscriptions)
- Verification tokens are randomly generated
- Unsubscribe links are included in all newsletter emails
- Double opt-in prevents spam subscriptions
- All email operations are logged

## Next Steps

1. ✅ Create the database table
2. ✅ Set environment variables
3. ✅ Deploy backend to HuggingFace
4. ✅ Test subscription flow
5. 📧 Send your first newsletter!

## Support

For issues or questions, check:
- Backend logs on HuggingFace Space
- Database logs on Neon dashboard
- Email provider dashboard (Resend/Gmail)
