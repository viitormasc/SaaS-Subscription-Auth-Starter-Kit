import express from 'express';
const route = express.Router();
import * as authController from '../controllers/authController';
import { ensureAuth } from '../middleware/authMiddleware';
import verifyCaptcha from '../middleware/recaptchaMiddleware';

route.post('/signup', authController.postSignup);

route.post('/login', authController.postLogin);

route.get('/google', authController.googleAuth);

route.get('/google/callback', authController.googleAuthCallback);

route.get('/logout', ensureAuth, authController.logout);

route.get('/me', ensureAuth, authController.getUser);

route.post('/sendValidationCodeEmail', verifyCaptcha, authController.sendSignUpValidationCodeEmail);

route.put('/checkValidationCodeEmail', authController.checkValidationCodeEmail);

route.post('/sendForgotPasswordEmail', verifyCaptcha, authController.sendForgotPasswordEmail);

route.post('/resendForgotPasswordEmail/:id', authController.sendForgotPasswordEmail);

route.put('/changePassword', authController.changeForgotPassword);

route.put('/changeUserLoggedInPassword', ensureAuth, authController.changeUserLoggedInPassword);

export default route;
