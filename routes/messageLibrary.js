const express = require('express');
const messageLibraryService = require('../services/messageLibraryService');

const router = express.Router();

// Get all published messages
router.get('/messages/published', (req, res) => {
  try {
    const publishedMessages = messageLibraryService.getPublishedMessages();
    res.json(publishedMessages);
  } catch (error) {
    console.error('Error getting published messages:', error);
    res.status(500).json({ error: 'Failed to get published messages' });
  }
});

// Get all messages
router.get('/messages', (req, res) => {
  try {
    const messages = messageLibraryService.messages;
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Get message by ID
router.get('/messages/:messageId', (req, res) => {
  try {
    const message = messageLibraryService.getMessageById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({ error: 'Failed to get message' });
  }
});

// Create new message
router.post('/messages', (req, res) => {
  try {
    const newMessage = messageLibraryService.addMessage(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Update message
router.put('/messages/:messageId', (req, res) => {
  try {
    const messageId = req.params.messageId;
    const messageIndex = messageLibraryService.messages.findIndex(m => m.messageId === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messageLibraryService.messages[messageIndex] = {
      ...messageLibraryService.messages[messageIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json(messageLibraryService.messages[messageIndex]);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message
router.delete('/messages/:messageId', (req, res) => {
  try {
    const messageId = req.params.messageId;
    const messageIndex = messageLibraryService.messages.findIndex(m => m.messageId === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messageLibraryService.messages.splice(messageIndex, 1);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Publish message
router.post('/messages/:messageId/publish', (req, res) => {
  try {
    const messageId = req.params.messageId;
    const messageIndex = messageLibraryService.messages.findIndex(m => m.messageId === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messageLibraryService.messages[messageIndex].status = 'published';
    messageLibraryService.messages[messageIndex].updatedAt = new Date().toISOString();
    
    res.json(messageLibraryService.messages[messageIndex]);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: 'Failed to publish message' });
  }
});

// Unpublish message
router.post('/messages/:messageId/unpublish', (req, res) => {
  try {
    const messageId = req.params.messageId;
    const messageIndex = messageLibraryService.messages.findIndex(m => m.messageId === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messageLibraryService.messages[messageIndex].status = 'draft';
    messageLibraryService.messages[messageIndex].updatedAt = new Date().toISOString();
    
    res.json(messageLibraryService.messages[messageIndex]);
  } catch (error) {
    console.error('Error unpublishing message:', error);
    res.status(500).json({ error: 'Failed to unpublish message' });
  }
});

// Get all triggers
router.get('/triggers', (req, res) => {
  try {
    const triggers = messageLibraryService.triggers;
    res.json(triggers);
  } catch (error) {
    console.error('Error getting triggers:', error);
    res.status(500).json({ error: 'Failed to get triggers' });
  }
});

// Get triggers by message ID
router.get('/triggers/message/:messageId', (req, res) => {
  try {
    const triggers = messageLibraryService.triggers.filter(t => t.messageId === req.params.messageId);
    res.json(triggers);
  } catch (error) {
    console.error('Error getting triggers:', error);
    res.status(500).json({ error: 'Failed to get triggers' });
  }
});

// Create new trigger
router.post('/triggers', (req, res) => {
  try {
    const newTrigger = messageLibraryService.addTrigger(req.body);
    res.status(201).json(newTrigger);
  } catch (error) {
    console.error('Error creating trigger:', error);
    res.status(500).json({ error: 'Failed to create trigger' });
  }
});

// Find matching triggers (for webhook processing)
router.post('/triggers/match', (req, res) => {
  try {
    const { messageText, phoneNumber } = req.body;
    const matchingTriggers = messageLibraryService.findMatchingTriggers(messageText);
    
    res.json({
      messageText,
      phoneNumber,
      matchingTriggers,
      count: matchingTriggers.length
    });
  } catch (error) {
    console.error('Error finding matching triggers:', error);
    res.status(500).json({ error: 'Failed to find matching triggers' });
  }
});

// Test message sending
router.post('/test-send', async (req, res) => {
  try {
    const { messageId, phoneNumber } = req.body;
    
    if (!messageId || !phoneNumber) {
      return res.status(400).json({ error: 'messageId and phoneNumber are required' });
    }
    
    const message = messageLibraryService.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const result = await messageLibraryService.sendLibraryMessage(message, phoneNumber);
    res.json(result);
  } catch (error) {
    console.error('Error sending test message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export/import data
router.get('/export', (req, res) => {
  try {
    const data = {
      messages: messageLibraryService.messages,
      triggers: messageLibraryService.triggers
    };
    res.json(data);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

router.post('/import', (req, res) => {
  try {
    const { messages, triggers } = req.body;
    
    if (messages) {
      messageLibraryService.messages = messages;
    }
    
    if (triggers) {
      messageLibraryService.triggers = triggers;
    }
    
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

module.exports = router;
