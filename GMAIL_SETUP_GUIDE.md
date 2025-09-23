# 📧 Gmail App Password Setup Guide

## 🎯 **Goal: Get REAL emails delivered to users' inboxes**

## 📋 **Step-by-Step Instructions:**

### **Step 1: Enable 2-Factor Authentication**
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** on the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process if not already enabled

### **Step 2: Generate App Password**
1. Still in **Security** → **2-Step Verification**
2. Scroll down to **App passwords**
3. Click **App passwords**
4. You might need to sign in again
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (custom name)**
7. Type: **Food App Server**
8. Click **Generate**
9. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### **Step 3: Update Your .env File**
Replace the current password with the new one:

```env
EMAIL_USER=studywithmeadarsh@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**IMPORTANT:** 
- Use the 16-character password WITH spaces
- Don't use your regular Gmail password
- Don't use the old password `avey iyhd fqic erqq`

### **Step 4: Test the Connection**
Run this command to test:
```bash
node test-email.js
```

If you see "✅ Gmail SMTP connection successful!" then you're ready!

## 🚫 **Common Mistakes:**
- Using regular Gmail password (won't work)
- Not enabling 2-Factor Authentication first
- Copying the password incorrectly
- Using an old/revoked app password

## ✅ **Success Indicators:**
- Gmail SMTP connection successful
- Real test email received in your Gmail inbox
- No "Invalid login" errors

---
**Follow these steps exactly and your emails will start working!**