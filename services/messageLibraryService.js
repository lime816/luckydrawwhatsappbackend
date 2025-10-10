const axios = require('axios');

// Message Library Integration Service
class MessageLibraryService {
  constructor() {
    // This should point to your frontend's message library API
    // For now, we'll use in-memory storage similar to triggers
    this.messages = [
      {
        messageId: 'msg_hi',
        name: 'Welcome - Patient Type Selection',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Hello! Welcome to Daya Hospital. Are you a New Patient or an Existing Patient?\n1️⃣ New Patient → new\n2️⃣ Existing Patient → exist'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_new',
        name: 'New Patient Registration',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Welcome to Daya Hospital! 🏥\nPlease share your Name and Mobile Number to register as a New Patient.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_exist',
        name: 'Existing Patient Menu',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Welcome back, Anil Kumar! 👋 What would you like to do today?\n1️⃣ Book Doctor Appointment → book\n2️⃣ Book Lab Test → lab\n3️⃣ Order Medicines → meds\n4️⃣ View Reports → rep'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_book',
        name: 'Doctor Selection',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Okay. Which Doctor/Department would you like to book for?\n1️⃣ Dr. Sharma → sharma\n2️⃣ Cardiology → cardio\n3️⃣ Orthopaedics → ortho\n4️⃣ Other → other'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma',
        name: 'Dr. Sharma Slots',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma\'s next available slots:\n1️⃣ Mon, Oct 14, 9:30 AM → 930\n2️⃣ Wed, Oct 16, 4:00 PM → 4pm'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma930',
        name: 'Confirm 9:30 AM Slot',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Confirming Dr. Sharma, Mon, Oct 14, 9:30 AM. Fee ₹750.\nPlease pay now. [Payment Link]\nAfter payment, type donepay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma4pm',
        name: 'Confirm 4:00 PM Slot',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Confirming Dr. Sharma, Wed, Oct 16, 4:00 PM. Fee ₹750.\nPlease pay now. [Payment Link]\nAfter payment, type donepay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_donepay',
        name: 'Appointment Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Appointment Confirmed! 🎉 Token: GM-015.\nWould you like to view your prescription or lab test? Type meds or lab.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_lab',
        name: 'Lab Test Booking',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma has advised a Full Body Checkup. Total ₹1200.\nPay to confirm. [Payment Link]\nAfter payment, type lpay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_labpay',
        name: 'Lab Test Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Lab Test Confirmed! Token L-035.\nPlease proceed to the 2nd Floor Laboratory.\nOnce done, type lrep to check for results.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_labrep',
        name: 'Lab Report Ready',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Good news! Your Full Body Checkup report is ready.\nClick to view/download: [Report Link]\nTo order prescribed medicines, type meds.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_meds',
        name: 'Medicine Order',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma\'s prescription is ready:\n1. Paracetamol (10 tabs)\n2. Vitamin D (5 tabs)\nTotal: ₹450\nTo confirm and pay, type confirm.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_ok',
        name: 'Medicine Payment',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Click to pay and confirm your medicine order. [Payment Link]\nAfter payment, type medpay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_medpay',
        name: 'Medicine Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Medicine Order Confirmed! 🎉 ID: PH-567.\nCollect from Pharmacy in 15 minutes.\nLater, type check for follow-up.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_check',
        name: 'Follow-up Check',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'How are you feeling after taking your medicines?\n1️⃣ Better → better\n2️⃣ Same → same\n3️⃣ Worse → worse'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_better',
        name: 'Feeling Better',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'That\'s wonderful! We\'ve updated Dr. Sharma.\nTo schedule your next review, type remind.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_same',
        name: 'Feeling Same',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Thank you for the update. Dr. Sharma will review your case again.\nTo book a review slot, type remind.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_worse',
        name: 'Feeling Worse',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Sorry to hear that. Dr. Sharma will be notified for follow-up.\nType remind to book a quick review appointment.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_remind',
        name: 'Review Reminder',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Reminder: Your review with Dr. Sharma is due tomorrow, Oct 25.\nWould you like to confirm a slot?\n1️⃣ Confirm → yes\n2️⃣ Reschedule → no'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_yes',
        name: 'Confirm Review',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Your review slot has been confirmed. See you tomorrow!'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_no',
        name: 'Reschedule Review',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Please share your preferred date and time to reschedule your appointment.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_help',
        name: 'Help Menu',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'I can assist you with:\n1️⃣ Booking → book\n2️⃣ Lab Tests → lab\n3️⃣ Pharmacy Orders → meds\n4️⃣ Reports → rep'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.triggers = [
      {
        triggerId: 'trigger_hi',
        triggerType: 'keyword_match',
        triggerValue: ['hi', 'hello', 'hey'],
        nextAction: 'send_message',
        targetId: 'msg_hi',
        messageId: 'msg_hi',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_new',
        triggerType: 'keyword_match',
        triggerValue: ['new'],
        nextAction: 'send_message',
        targetId: 'msg_new',
        messageId: 'msg_new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_exist',
        triggerType: 'keyword_match',
        triggerValue: ['exist'],
        nextAction: 'send_message',
        targetId: 'msg_exist',
        messageId: 'msg_exist',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_book',
        triggerType: 'keyword_match',
        triggerValue: ['book'],
        nextAction: 'send_message',
        targetId: 'msg_book',
        messageId: 'msg_book',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_sharma',
        triggerType: 'keyword_match',
        triggerValue: ['sharma'],
        nextAction: 'send_message',
        targetId: 'msg_sharma',
        messageId: 'msg_sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_930',
        triggerType: 'keyword_match',
        triggerValue: ['930'],
        nextAction: 'send_message',
        targetId: 'msg_sharma930',
        messageId: 'msg_sharma930',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_4pm',
        triggerType: 'keyword_match',
        triggerValue: ['4pm'],
        nextAction: 'send_message',
        targetId: 'msg_sharma4pm',
        messageId: 'msg_sharma4pm',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_donepay',
        triggerType: 'keyword_match',
        triggerValue: ['donepay'],
        nextAction: 'send_message',
        targetId: 'msg_donepay',
        messageId: 'msg_donepay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_lab',
        triggerType: 'keyword_match',
        triggerValue: ['lab'],
        nextAction: 'send_message',
        targetId: 'msg_lab',
        messageId: 'msg_lab',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_lpay',
        triggerType: 'keyword_match',
        triggerValue: ['lpay'],
        nextAction: 'send_message',
        targetId: 'msg_labpay',
        messageId: 'msg_labpay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_labrep',
        triggerType: 'keyword_match',
        triggerValue: ['lrep'],
        nextAction: 'send_message',
        targetId: 'msg_labrep',
        messageId: 'msg_labrep',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_meds',
        triggerType: 'keyword_match',
        triggerValue: ['meds'],
        nextAction: 'send_message',
        targetId: 'msg_meds',
        messageId: 'msg_meds',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_confirm',
        triggerType: 'keyword_match',
        triggerValue: ['confirm'],
        nextAction: 'send_message',
        targetId: 'msg_ok',
        messageId: 'msg_ok',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_medpay',
        triggerType: 'keyword_match',
        triggerValue: ['medpay'],
        nextAction: 'send_message',
        targetId: 'msg_medpay',
        messageId: 'msg_medpay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_check',
        triggerType: 'keyword_match',
        triggerValue: ['check'],
        nextAction: 'send_message',
        targetId: 'msg_check',
        messageId: 'msg_check',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_better',
        triggerType: 'keyword_match',
        triggerValue: ['better'],
        nextAction: 'send_message',
        targetId: 'msg_better',
        messageId: 'msg_better',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_same',
        triggerType: 'keyword_match',
        triggerValue: ['same'],
        nextAction: 'send_message',
        targetId: 'msg_same',
        messageId: 'msg_same',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_worse',
        triggerType: 'keyword_match',
        triggerValue: ['worse'],
        nextAction: 'send_message',
        targetId: 'msg_worse',
        messageId: 'msg_worse',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_remind',
        triggerType: 'keyword_match',
        triggerValue: ['remind'],
        nextAction: 'send_message',
        targetId: 'msg_remind',
        messageId: 'msg_remind',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_yes',
        triggerType: 'keyword_match',
        triggerValue: ['yes'],
        nextAction: 'send_message',
        targetId: 'msg_yes',
        messageId: 'msg_yes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_no',
        triggerType: 'keyword_match',
        triggerValue: ['no'],
        nextAction: 'send_message',
        targetId: 'msg_no',
        messageId: 'msg_no',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_help',
        triggerType: 'keyword_match',
        triggerValue: ['help'],
        nextAction: 'send_message',
        targetId: 'msg_help',
        messageId: 'msg_help',
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
