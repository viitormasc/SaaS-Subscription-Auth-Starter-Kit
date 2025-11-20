import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController';
import { ensureAuth } from '../middleware/authMiddleware';
const route = express.Router();

route.post('/create-checkout-session', ensureAuth, subscriptionController.createCheckoutSession);

route.get('/status', ensureAuth, subscriptionController.getSubscriptionStatus);

route.post('/create-portal-session', ensureAuth, subscriptionController.createPortalSession);

export default route;