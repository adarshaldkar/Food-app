// Test script to verify email functionality
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');
    
    // Test Gmail transporter
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
        }
    });
    
    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ Gmail SMTP connection successful!');
        
        // Send test email
        const info = await transporter.sendMail({
            from: {
                name: 'Food App Test',
                address: process.env.EMAIL_USER
            },
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email - Food App',
            html: `
                <h1>Test Email Successful! 🎉</h1>
                <p>If you're seeing this, the email configuration is working correctly.</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        // Test fallback (Ethereal)
        console.log('Testing fallback transporter...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            const fallbackTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            
            const fallbackInfo = await fallbackTransporter.sendMail({
                from: 'test@foodapp.com',
                to: 'test@example.com',
                subject: 'Test Email - Food App (Fallback)',
                html: '<h1>Fallback email working!</h1>'
            });
            
            console.log('✅ Fallback email sent successfully!');
            console.log('Preview URL:', nodemailer.getTestMessageUrl(fallbackInfo));
            
        } catch (fallbackError) {
            console.error('❌ Fallback email also failed:', fallbackError.message);
        }
    }
}

testEmail();