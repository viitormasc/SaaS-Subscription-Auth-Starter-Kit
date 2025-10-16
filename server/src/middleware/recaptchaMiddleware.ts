process.loadEnvFile();
import axios from 'axios';

import { Request, Response, NextFunction } from 'express';

const verifyCaptcha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { captcha } = req.body;
  console.log('captcha', captcha);
  if (!captcha) {
    res.status(400).json({ success: false, errors: 'Please complete the CAPTCHA' });
    return;
  }

  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const remoteIp = req.connection.remoteAddress;
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip:${remoteIp}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (response.data.success) {
      next();
    } else {
      console.log(response.data);
      res.status(400).json({ success: false, errors: 'CAPTCHA validation failed' });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: 'CAPTCHA validation error' });
    return;
  }
};

export default verifyCaptcha;
