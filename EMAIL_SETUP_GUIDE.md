# Email Configuration Setup Guide

## 🚨 IMPORTANT: Current Issue
You're using **Mailtrap** which only captures emails for testing - it doesn't send real emails to users.

## ✅ Solution Implemented
I've added **Gmail SMTP** support for sending real emails to users.

## 📧 Setup Instructions

### Step 1: Enable Gmail App Passwords
1. Go to your Google Account settings: https://myaccount.google.com/
2. Select "Security" from the left menu
3. Enable "2-Step Verification" if not already enabled
4. Under "2-Step Verification", find "App passwords"
5. Generate a new app password for "Mail"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update Environment Variables
Edit your `.env` file and replace these values:
```env
# Set to true to send real emails
USE_PRODUCTION_EMAIL=true

# Your Gmail credentials
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### Step 3: How It Works
- When `USE_PRODUCTION_EMAIL=true`: Sends real emails via Gmail
- When `USE_PRODUCTION_EMAIL=false`: Uses Mailtrap for testing

## 🧪 Testing
1. Update your `.env` file with real Gmail credentials
2. Restart your server: `cd server && npm run dev`
3. Try user registration - the email should arrive in the user's real inbox!

## 📊 Email Services Comparison

| Service | Free Tier | Setup Difficulty | Best For |
|---------|-----------|------------------|----------|
| **Gmail SMTP** ✅ | Yes (500/day) | Easy | Small projects |
| SendGrid | Yes (100/day) | Medium | Production apps |
| Mailgun | Yes (10k/month) | Medium | High volume |
| Amazon SES | Yes (200/day) | Hard | Enterprise |

## 🔧 Alternative Services

### Option 2: SendGrid (If you prefer)
```bash
npm install @sendgrid/mail
```
Then update environment variables:
```env
USE_PRODUCTION_EMAIL=true
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Option 3: Mailgun
```bash
npm install mailgun-js
```
Then update environment variables:
```env
USE_PRODUCTION_EMAIL=true
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

## 🚀 Current Implementation
- ✅ Verification emails
- ✅ Welcome emails  
- ✅ Password reset emails
- ✅ Password reset success emails
- ✅ Fallback to Mailtrap for development
- ✅ Easy switching between production/development

## 🔍 Troubleshooting
1. **"Authentication failed"** - Check your Gmail app password
2. **"Less secure app access"** - Use App Passwords instead
3. **"Daily limit exceeded"** - Gmail allows 500 emails/day for free
4. **Emails in spam** - Add proper SPF/DKIM records to your domain