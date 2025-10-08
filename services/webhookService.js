const { sendFlowMessage } = require('./whatsappService');
const { findMatchingTrigger } = require('./triggerService');

/**
 * Process incoming webhook payload from WhatsApp Business API
 */
async function processWebhookPayload(payload) {
  console.log('📨 Processing webhook payload:', JSON.stringify(payload, null, 2));

  if (payload.object !== 'whatsapp_business_account') {
    console.log('📝 Not a WhatsApp Business webhook, ignoring');
    return;
  }

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field === 'messages' && change.value.messages) {
        for (const message of change.value.messages) {
          await handleIncomingMessage(message);
        }
      }

      // Handle message status updates (delivery, read, etc.)
      if (change.field === 'messages' && change.value.statuses) {
        for (const status of change.value.statuses) {
          handleMessageStatus(status);
        }
      }
    }
  }
}

/**
 * Handle individual incoming messages
 */
async function handleIncomingMessage(message) {
  try {
    console.log(`📱 Processing message from ${message.from}:`, message);

    let messageText = '';
    
    // Extract message text based on message type
    if (message.type === 'text' && message.text) {
      messageText = message.text.body.toLowerCase().trim();
    } else if (message.type === 'interactive' && message.interactive?.nfm_reply) {
      // Handle flow responses
      await handleFlowResponse(message);
      return;
    } else {
      console.log(`📝 Message type '${message.type}' not supported for triggers`);
      return;
    }

    console.log(`💬 Message text: "${messageText}"`);

    // Find matching trigger
    const trigger = findMatchingTrigger(messageText);
    
    if (trigger && trigger.isActive) {
      console.log(`🎯 Found matching trigger: "${trigger.keyword}" -> Flow: ${trigger.flowId}`);
      await sendFlowMessage(message.from, trigger.flowId, trigger.message);
      
      // Log the successful trigger activation
      console.log(`✅ Successfully sent flow ${trigger.flowId} to ${message.from}`);
    } else {
      console.log(`📝 No active trigger found for message: "${messageText}"`);
    }
  } catch (error) {
    console.error('❌ Error handling incoming message:', error);
    throw error;
  }
}

/**
 * Handle flow completion responses
 */
async function handleFlowResponse(message) {
  try {
    if (message.interactive?.nfm_reply) {
      const response = message.interactive.nfm_reply;
      
      console.log('📋 Flow response received:', {
        from: message.from,
        flowName: response.name,
        responseData: response.response_json,
        body: response.body
      });
      
      // Here you can process the flow response data
      // For example:
      // - Store response in database
      // - Trigger follow-up actions
      // - Send confirmation messages
      // - Update customer records
      
      // Example: Parse and log form data
      try {
        const formData = JSON.parse(response.response_json);
        console.log('📊 Parsed form data:', formData);
        
        // You can add custom logic here based on the form response
        
      } catch (parseError) {
        console.log('⚠️  Could not parse flow response JSON:', response.response_json);
      }
    }
  } catch (error) {
    console.error('❌ Error handling flow response:', error);
  }
}

/**
 * Handle message status updates (delivery, read, etc.)
 */
function handleMessageStatus(status) {
  console.log('📊 Message status update:', {
    messageId: status.id,
    recipientId: status.recipient_id,
    status: status.status,
    timestamp: status.timestamp
  });
}

/**
 * Simulate webhook for testing
 */
async function simulateWebhook(testMessage, phoneNumber) {
  const mockPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test-entry',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: process.env.WHATSAPP_PHONE_NUMBER_ID || '15550617327',
            phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '158282837372377'
          },
          messages: [{
            id: `test-message-${Date.now()}`,
            from: phoneNumber,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            text: { body: testMessage },
            type: 'text'
          }]
        }
      }]
    }]
  };

  console.log('🧪 Simulating webhook with test payload');
  await processWebhookPayload(mockPayload);
  
  return {
    success: true,
    message: 'Test webhook processed successfully',
    testMessage,
    phoneNumber,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processWebhookPayload,
  handleIncomingMessage,
  handleFlowResponse,
  handleMessageStatus,
  simulateWebhook
};