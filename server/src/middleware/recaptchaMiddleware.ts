import axios from 'axios';
import qs from 'qs';
import { NextFunction, Request, Response } from 'express';

const verifyCaptcha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { captcha } = req.body;

  if (!captcha) {
    res.status(400).json({ success: false, errors: 'Please complete the CAPTCHA' });
    return;
  }

  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const remoteIp = req.ip;

  console.log('🔍 reCAPTCHA verification attempt:', {
    hasSecretKey: !!secretKey,
    remoteIp,
    captchaLength: captcha?.length,
  });

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      qs.stringify({
        secret: secretKey,
        response: captcha,
        remoteip: remoteIp,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    if (response.data.success) {
      console.log('✅ reCAPTCHA verification successful', response.data);
      next(); // ✅ Only call next() once
    } else {
      console.log('❌ reCAPTCHA verification failed', response.data);
      res.status(400).json({
        success: false,
        errors: 'CAPTCHA verification failed. Please try again.',
      });
    }
  } catch (error) {
    console.error('❌ reCAPTCHA validation error:', error);
    res.status(500).json({ success: false, errors: 'CAPTCHA validation error' });
  }
};

export default verifyCaptcha;
