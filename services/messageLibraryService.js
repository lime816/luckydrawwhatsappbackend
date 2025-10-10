const axios = require('axios');

// Message Library Integration Service
class MessageLibraryService {
  constructor() {
    // This should point to your frontend's message library API
    // For now, we'll use in-memory storage similar to triggers
    this.messages = [
      {
        messageId: 'msg_1',
        name: 'Welcome Message',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Welcome! How can I help you today? 👋'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_2', 
        name: 'Help Menu',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'How can we help?',
          body: 'Please choose one of the options below:',
          footer: 'We are here to assist you',
          buttons: [
            { id: 'btn_1', title: 'Get Support', buttonId: 'support' },
            { id: 'btn_2', title: 'View Services', buttonId: 'services' },
            { id: 'btn_3', title: 'Contact Us', buttonId: 'contact' }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.triggers = [
      {
        triggerId: 'trigger_1',
        triggerType: 'keyword_match',
        triggerValue: ['hello', 'hi', 'hey'],
        nextAction: 'send_message',
        targetId: 'msg_1', // Points to message ID
        messageId: 'msg_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_2',
        triggerType: 'keyword_match', 
        triggerValue: ['help', 'menu', 'options'],
        nextAction: 'send_message',
        targetId: 'msg_2', // Points to message ID
        messageId: 'msg_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Get all published messages
  getPublishedMessages() {
    return this.messages.filter(msg => msg.status === 'published');
  }

  // Get message by ID
  getMessageById(messageId) {
    return this.messages.find(msg => msg.messageId === messageId);
  }

  // Find matching triggers for a message
  findMatchingTriggers(messageText) {
    const normalizedText = messageText.toLowerCase().trim();
    
    return this.triggers.filter(trigger => {
      if (trigger.triggerType === 'keyword_match') {
        const keywords = Array.isArray(trigger.triggerValue) 
          ? trigger.triggerValue 
          : [trigger.triggerValue];
        
        return keywords.some(keyword => 
          normalizedText.includes(keyword.toLowerCase())
        );
      }
      return false;
    });
  }

  // Send message using WhatsApp API
  async sendLibraryMessage(messageEntry, recipientPhone) {
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0';

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      throw new Error('Missing WhatsApp API credentials');
    }

    const apiUrl = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    
    let messagePayload;

    switch (messageEntry.type) {
      case 'standard_text':
        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: messageEntry.contentPayload.body
          }
        };
        break;

      case 'interactive_button':
        const payload = messageEntry.contentPayload;
        const interactive = {
          type: 'button',
          body: { text: payload.body || '' },
          action: {
            buttons: (payload.buttons || []).slice(0, 3).map(btn => ({
              type: 'reply',
              reply: {
                id: btn.buttonId || btn.id,
                title: btn.title
              }
            }))
          }
        };

        if (payload.header) {
          interactive.header = { type: 'text', text: payload.header };
        }
        if (payload.footer) {
          interactive.footer = { text: payload.footer };
        }

        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'interactive',
          interactive
        };
        break;

      case 'interactive_list':
        const listPayload = messageEntry.contentPayload;
        const listInteractive = {
          type: 'list',
          body: { text: listPayload.body || '' },
          action: {
            button: listPayload.buttonText || 'View Options',
            sections: (listPayload.sections || []).map(section => ({
              title: section.title,
              rows: (section.rows || []).map(row => ({
                id: row.rowId || row.id,
                title: row.title,
                description: row.description
              }))
            }))
          }
        };

        if (listPayload.header) {
          listInteractive.header = { type: 'text', text: listPayload.header };
        }
        if (listPayload.footer) {
          listInteractive.footer = { text: listPayload.footer };
        }

        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'interactive',
          interactive: listInteractive
        };
        break;

      default:
        throw new Error(`Unsupported message type: ${messageEntry.type}`);
    }

    try {
      console.log('📤 Sending message via WhatsApp API:', {
        type: messageEntry.type,
        to: recipientPhone,
        messageId: messageEntry.messageId
      });

      const response = await axios.post(apiUrl, messagePayload, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Message sent successfully:', response.data);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('❌ Failed to send message:', error.response?.data || error.message);
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Add a new message (for API integration)
  addMessage(messageData) {
    const newMessage = {
      messageId: `msg_${Date.now()}`,
      ...messageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }

  // Add a new trigger (for API integration)
  addTrigger(triggerData) {
    const newTrigger = {
      triggerId: `trigger_${Date.now()}`,
      ...triggerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.triggers.push(newTrigger);
    return newTrigger;
  }
}

module.exports = new MessageLibraryService();
