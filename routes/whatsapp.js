const express = require('express');
const { sendFlowMessage, testWhatsAppConnection } = require('../services/whatsappService');

const router = express.Router();

// Test WhatsApp connection
router.get('/test', async (req, res) => {
  try {
    const result = await testWhatsAppConnection();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('WhatsApp connection test failed:', error);
    res.status(500).json({
      success: false,
      error: 'WhatsApp connection test failed',
      details: error.message
    });
  }
});

// Send flow message manually
router.post('/send-flow', async (req, res) => {
  try {
    const { phoneNumber, flowId, message } = req.body;

    if (!phoneNumber || !flowId) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber and flowId are required'
      });
    }

    const result = await sendFlowMessage(phoneNumber, flowId, message);

    res.json({
      success: true,
      data: result,
      message: 'Flow sent successfully'
    });
  } catch (error) {
    console.error('Error sending flow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send flow',
      details: error.message
    });
  }
});

// Get WhatsApp configuration status
router.get('/config', (req, res) => {
  const config = {
    hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
    hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
    hasBusinessAccountId: !!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? 
      process.env.WHATSAPP_PHONE_NUMBER_ID.substring(0, 4) + '***' : null
  };

  res.json({
    success: true,
    data: config,
    isConfigured: config.hasAccessToken && config.hasPhoneNumberId && config.hasBusinessAccountId
  });
});

module.exports = router;