export class ValidationCodeEmailTemplate {
  static generateTemplate(validationCode: string): string {
    const expirationTime = '20 minutes';
    const companyName = 'StudyTimerApp';
    const supportEmail = 'support@studytimerapp.com';
    // In production, you would use your actual logo URL
    // For now, we'll use a placeholder or base64 encoded logo
    const logoUrl = 'https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=StudyTracker';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Validation Code</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            height: 40px;
            margin-bottom: 20px;
        }
        
        .email-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .email-subtitle {
            color: #E0F2FE;
            font-size: 16px;
            font-weight: 400;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1E293B;
        }
        
        .instructions {
            font-size: 16px;
            color: #64748B;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .code-container {
            background: #F8FAFC;
            border: 2px dashed #E2E8F0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        
        .code-label {
            font-size: 14px;
            color: #64748B;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }
        
        .validation-code {
            font-size: 42px;
            font-weight: 700;
            color: #3B82F6;
            letter-spacing: 8px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            background: #FFFFFF;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #E2E8F0;
        }
        
        .expiration-notice {
            background: #FFFBEB;
            border: 1px solid #FCD34D;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
        }
        
        .expiration-text {
            color: #92400E;
            font-size: 14px;
            font-weight: 500;
        }
        
        .security-notice {
            background: #F0F9FF;
            border: 1px solid #BAE6FD;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #0C4A6E;
        }
        
        .button {
            display: inline-block;
            background: #3B82F6;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        
        .button:hover {
            background: #2563EB;
        }
        
        .email-footer {
            background: #F1F5F9;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
        }
        
        .footer-text {
            font-size: 14px;
            color: #64748B;
            margin-bottom: 10px;
        }
        
        .contact-info {
            font-size: 14px;
            color: #475569;
        }
        
        .signature {
            margin-top: 25px;
            color: #64748B;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .email-header, .email-body {
                padding: 30px 20px;
            }
            
            .validation-code {
                font-size: 32px;
                letter-spacing: 6px;
                padding: 12px;
            }
            
            .email-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="email-title">Verify Your Account</div>
            <div class="email-subtitle">Enter the code below to complete your verification</div>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="greeting">Hello </div>
            
            <div class="instructions">
                Thank you for choosing ${companyName}! To complete your account verification, 
                please use the following validation code:
            </div>
            
            <div class="code-container">
                <div class="code-label">Your Verification Code</div>
                <div class="validation-code">${validationCode}</div>
                <div class="code-label">Valid for ${expirationTime}</div>
            </div>
            
            <div class="expiration-notice">
                <div class="expiration-text">
                    ⏰ This code will expire in ${expirationTime}. Please use it before it expires.
                </div>
            </div>
            
            <div class="security-notice">
                🔒 For your security, please do not share this code with anyone. 
            </div>
            
                    </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">
                If you didn't request this code, please ignore this email or contact support if you have concerns.
            </div>
            
            <div class="contact-info">
                Need help? Contact our support team at 
                <a href="mailto:${supportEmail}" style="color: #3B82F6; text-decoration: none;">
                    ${supportEmail}
                </a>
            </div>
            
            <div class="signature">
                Best regards,<br>
                The ${companyName} Team
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  static generateTextTemplate(validationCode: string): string {
    const expirationTime = '20 minutes';
    const companyName = 'StudyTimerApp';
    const supportEmail = 'support@studytimerapp.com';

    return `
Hello ,

Thank you for choosing ${companyName}! To complete your account verification, please use the following validation code:

Your Verification Code: ${validationCode}

This code will expire in ${expirationTime}. Please use it before it expires.

For your security, please do not share this code with anyone. ${companyName} will never ask you for your verification code.

If you didn't request this code, please ignore this email or contact our support team at ${supportEmail}.

Best regards,
The ${companyName} Team
    `.trim();
  }
}
