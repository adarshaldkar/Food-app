// Test script for REAL Gmail email delivery
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testRealEmail() {
    console.log('🚀 Testing REAL Gmail Email Delivery...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
    console.log('USE_PRODUCTION_EMAIL:', process.env.USE_PRODUCTION_EMAIL);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('❌ Missing email credentials in .env file!');
        return;
    }

    // Create Gmail transporter with exact same config as your app
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true,
        logger: true
    });

    try {
        // First verify connection
        console.log('🔍 Verifying Gmail SMTP connection...');
        await transporter.verify();
        console.log('✅ Gmail SMTP connection successful!');

        // Send test email to yourself first
        console.log('📧 Sending test email to your Gmail...');
        const testInfo = await transporter.sendMail({
            from: {
                name: 'Food App Test',
                address: process.env.EMAIL_USER
            },
            to: process.env.EMAIL_USER, // Send to yourself
            subject: '🎉 Real Email Test - Food App',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #D19254;">✅ Success! Real Email Working!</h1>
                    <p>If you're reading this in your actual Gmail inbox, then the email system is working perfectly!</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
                    <p><strong>Status:</strong> Real email delivery is now functional! 🚀</p>
                    <hr>
                    <p><em>This email was sent using Gmail SMTP from your Food App.</em></p>
                </div>
            `
        });

        console.log('🎉 SUCCESS! Real email sent to your Gmail inbox!');
        console.log('Message ID:', testInfo.messageId);
        console.log('📨 Check your Gmail inbox for the test email!');

        // Send test email to a different address (if you want to test)
        const testEmail = 'test@example.com'; // You can change this to any real email
        console.log(`\n📧 Would you like to send a test to another email? Change testEmail variable to a real email address.`);
        
    } catch (error) {
        console.error('❌ Email test failed!');
        console.error('Error message:', error.message);
        
        if (error.message.includes('Invalid login')) {
            console.error('\n🚨 SOLUTION NEEDED:');
            console.error('1. Generate a NEW Gmail App Password');
            console.error('2. Go to: https://myaccount.google.com/security');
            console.error('3. Enable 2-Factor Authentication if not enabled');
            console.error('4. Go to App Passwords → Generate new password');
            console.error('5. Update EMAIL_PASSWORD in .env file');
        }
    }
}

testRealEmail();