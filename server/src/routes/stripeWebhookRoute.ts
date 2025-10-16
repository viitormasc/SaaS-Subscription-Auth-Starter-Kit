import express from 'express';
import * as webhookController from '../controllers/stripeWebhookController';
const route = express.Router();

route.post('/', express.raw({ type: 'application/json' }), webhookController.handleWebhook);

export default route