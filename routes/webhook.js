const express = require('express');
const crypto = require('crypto');
const { processWebhookPayload } = require('../services/webhookService');

const router = express.Router();

// Webhook verification endpoint (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification request:', { mode, token: token ? '***' : 'missing', challenge });

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error('❌ WEBHOOK_VERIFY_TOKEN not configured');
    return res.status(500).send('Server configuration error');
  }

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed:', {
      expectedToken: verifyToken,
      receivedToken: token,
      mode
    });
    res.status(403).send('Verification failed');
  }
});

// Webhook message processing endpoint (POST)
router.post('/', async (req, res) => {
  const body = req.body;
  const signature = req.headers['x-hub-signature-256'];

  console.log('📨 Webhook payload received');

  // Verify request signature (recommended for security)
  if (process.env.WEBHOOK_APP_SECRET) {
    if (!signature) {
      console.error('❌ Missing webhook signature');
      return res.status(401).send('Unauthorized - Missing signature');
    }

    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', process.env.WEBHOOK_APP_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).send('Unauthorized - Invalid signature');
    }
    
    console.log('✅ Webhook signature verified');
  } else {
    console.warn('⚠️  Webhook signature verification disabled (WEBHOOK_APP_SECRET not set)');
  }

  try {
    await processWebhookPayload(body);
    console.log('✅ Webhook processed successfully');
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;