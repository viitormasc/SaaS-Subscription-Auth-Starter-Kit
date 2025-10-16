import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import validator from 'validator';
import { ChangePasswordValidator } from '../core/userValidator/ChangePasswordValidator';
import { LoginUserValidator } from '../core/userValidator/LoginUserValidator';
import { SignUpUserValidator } from '../core/userValidator/SignUpUserValidator';
import EmailValidation from '../models/EmailValidationModel';
import User from '../models/UserModel';
import sendValidationCode from '../services/email/SendValidationCode';
import { EmailValidationCodeBody, ForgotPasswordParams, SignupBody, UserDocument } from '../types/interfaces';
dotenv.config();

const senderEmail = `no-reply@${process.env.WEBSITE_DOMAIN}`;

export const sendSignUpValidationCodeEmail = async (req: Request<{}, any, SignupBody>, res: Response, next: NextFunction) => {
  const { email, name, password, confirmPassword } = req.body ?? ({} as SignupBody);
  const signUpValidation = new SignUpUserValidator(email, password, confirmPassword);
  const errors = signUpValidation.checkValidation();

  if (errors.length) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  const normalizedEmail = validator.normalizeEmail(email, { gmail_remove_dots: false }) || email;
  try {
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      res.status(409).json({
        errors: 'User already exists',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Failed to verify email availability' });
    return;
  }

  try {
    const previousCode = await EmailValidation.find({ email: normalizedEmail });
    if (previousCode) {
      await EmailValidation.deleteMany({ email: normalizedEmail });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: 'Internal error deleting existing ones',
    });
    return;
  }
  const emailSentID = sendValidationCode(senderEmail, normalizedEmail);

  if (!emailSentID) {
    res.status(500).json({
      success: false,
      message: 'Failed to send validation email',
      errors: 'Email service unavailable, please try again',
    });
    return;
  }
  res.status(200).json({ succes: true, message: 'Validation code sent successfully' });
  return;
};

export const sendForgotPasswordEmail = async (req: Request<ForgotPasswordParams, any, SignupBody>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, errors: ['Please send a valid Email'] });
    return;
  }
  if (id) {
    const existingCode = EmailValidation.find({ _id: id });
    if (!existingCode) {
      res.status(401).json({
        success: false,
        errors: ['Code expired, please go back and send another email'],
      });
      return;
    }
  }
  const normalizedEmail = validator.normalizeEmail(email, { gmail_remove_dots: false }) || email;
  try {
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (!existingUser) {
      res.status(400).json({
        errors: ['This e-mail is not linked to any account'],
      });
      return;
    }
    if (existingUser.source !== 'local') {
      res.status(400).json({
        success: false,
        errors: [`This account was created with ${existingUser.source}, please try to login via ${existingUser.source}`],
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Internal Error on email verification' });
    return;
  }
  try {
    const previousCode = await EmailValidation.find({ email: normalizedEmail });
    if (previousCode) {
      await EmailValidation.deleteMany({ email: normalizedEmail });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: 'Internal error deleting existing ones',
    });
    return;
  }
  const emailSentID = await sendValidationCode(senderEmail, normalizedEmail);
  if (!emailSentID) {
    res.status(500).json({
      success: false,
      errors: 'Internal error while sending email, please try again',
    });
    return;
  }
  res.status(200).json({ succes: true, message: 'Email succesfully sended', emailSentID });
  return;
};

export const checkValidationCodeEmail = async (req: Request<{}, any, EmailValidationCodeBody>, res: Response, next: NextFunction) => {
  const { email, validationCode } = req.body ?? ({} as EmailValidationCodeBody);
  if (!email || !validationCode) {
    res.status(400).json({ success: false, errors: 'Missing required fields' });
    return;
  }
  console.log('body for validation', req.body);
  try {
    const dbValidationDocument = await EmailValidation.findOneAndUpdate({ email }, { $inc: { validationTries: 1 } });
    if (!dbValidationDocument) {
      res.status(410).json({
        success: false,
        errors: 'The validation code has expired, please request another one',
      });
      return;
    }

    dbValidationDocument.save();
    if (dbValidationDocument.validationTries >= 5) {
      await dbValidationDocument.deleteOne({ email });
      dbValidationDocument.save();
      res.status(429).json({
        success: false,
        errors: 'Maximum validation attempts exceeded, please request a new code',
      });
      return;
    }
    if (dbValidationDocument.validationCode !== validationCode) {
      res.status(401).json({
        success: false,
        errors: 'Invalid validation code',
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, errors: 'User not found' });
      return;
    }
    const userId = user?._id;
    res.status(200).json({
      success: true,
      message: 'Email validated successfully',
      userId,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errors: 'Internal server error' });
    return;
  }
};

export const postSignup = async (req: Request<{}, any, SignupBody>, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, confirmPassword } = req.body ?? ({} as SignupBody);

    const normalizedEmail = validator.normalizeEmail(email, { gmail_remove_dots: false }) || email;

    const user = new User({
      email: normalizedEmail,
      password,
      name,
    });
    await user.save();

    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: userData,
      });
    });
  } catch (err) {
    next(err);
  }
};

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const loginValidation = new LoginUserValidator(email, password);
  console.log('loginValidation', loginValidation);
  const errors = loginValidation.checkValidation();
  if (errors.length) {
    console.log('errors');
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  passport.authenticate('local', (err: string, user: UserDocument, info: { message?: string }) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: info.message || 'Authentication failed',
      });
    }
    console.log('usercontroller', user);
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const userData = {
        _id: user._id,
        email: user.email,
      };
      console.log('userData', userData);
      // if you want the date in the right zone time you need to use .tostring() method, and the response will be the right time for your timezone
      user.lastLogin = Date.now();
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: userData,
      });
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return res.status(500).json({
          success: false,
          message: 'Logout failed',
          errors: ['Failed to destroy session'],
        })
      }
      // Clear the user object and send success response
      req.user = undefined;
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    });
  });
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id, email, name, profilePhoto } = req.user as UserDocument;

  try {
    const user: UserDocument | null = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: 'The requested user does not exist',
        statusCode: 404
      });
    }
    res.status(200).json({ success: true, message: 'User retrieved successfully', user: { _id, email, name, profilePhoto } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', errors: [error] });
  }
};

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', (err: any, user: UserDocument, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [info ? info.message : 'Authentication failed'],
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(`${process.env.FRONT_END_URL}/`);
    });
  })(req, res, next);
};

export const sendRecoverEmail = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;

  if (!email || !validator.isEmail(email)) {
    res.status(400).json({
      success: false,
      errors: 'Bad request! Please send a valid email',
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(422).json({
        success: false,
        errors: 'Does not exist an user with this email',
      });
      return;
    }
    if (existingUser.source !== 'local') {
      res.status(422).json({
        success: false,
        errors: `User was creatad via ${existingUser.source}. Please use this method to login`,
      });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, errors: 'Internal error' });
    throw new Error(error);
  }
};

// here the user is not logged in and forgot his password so he must change
export const changeForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, confirmPassword, userId } = req.body;

  const validator = new ChangePasswordValidator(newPassword, confirmPassword);
  const errors = validator.checkValidation();
  if (errors.length) {
    res.status(400).json({ success: false, message: 'Validation Failed', errors });
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, errors: 'User not found' });
    return;
  }

  if (user.source !== 'local') {
    res.status(403).json({
      success: false,
      message: 'Password change not allowed',
      errors: `This account uses ${user.source} authentication`,
    });
    return;
  }

  user.password = newPassword;

  await user.save();
  const userData = {
    _id: user._id,
    email: user.email,
    name: user.name,
    profilePhoto: user.profilePhoto,
  };

  try {
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        user: userData,
      });
      return;
    });
  } catch (err) {
    next(err);
  }
  return;
};

//here the user is logged in and is changing his password
export const changeUserLoggedInPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, confirmPassword, currentPassword } = req.body;
  const userId = req.user?._id;

  const validator = new ChangePasswordValidator(newPassword, confirmPassword);
  const errors = validator.checkValidation();
  if (errors.length) {
    res.status(400).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({ success: false, message: 'Invalid password', errors: 'New password must be different from current password' });
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, errors: 'User not found' });
    return;
  }

  if (user.source !== 'local') {
    res.status(403).json({
      success: false,
      errors: `Accounts using ${user.source} authentication cannot change passwords`,
    });
    return;
  }

  try {
    // const isMatch = await user.comparePassword(currentPassword);
    const isMatch = await new Promise<boolean>((resolve, reject) => {
      user.comparePassword(currentPassword, (err, match) => {
        if (err) return reject(err);
        resolve(!!match);
      });
    });

    if (!isMatch) {
      return res.status(401).json({ success: false, errors: 'Authentication failed, incorrect password' });
    }
    user.password = newPassword;
    await user.save();
    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
      profilePhoto: user.profilePhoto,
    };

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      user: userData,
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, errors: 'Internal error' });
  }
};