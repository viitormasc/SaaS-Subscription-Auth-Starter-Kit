import express from 'express';
const route = express.Router();
import * as userController from '../controllers/userController';
import { ensureAuth } from '../middleware/authMiddleware';
import upload from '../middleware/multer';
import verifyCaptcha from '../middleware/recaptchaMiddleware';

route.put('/updateUser', ensureAuth, userController.updateUser);

route.put('/updateProfilePhoto', ensureAuth, upload.single('file'), userController.updateProfilePhoto);

route.delete('/deleteUser', ensureAuth, verifyCaptcha, userController.deleteUser);

export default route;
