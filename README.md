# WhatsApp Business API Backend

A comprehensive Node.js backend server for WhatsApp Business API webhook handling, flow automation, and message processing.

## 🚀 Features

- **Webhook Processing**: Secure webhook endpoint for WhatsApp Business API
- **Flow Automation**: Trigger-based automation system for WhatsApp flows
- **Message Handling**: Send and receive WhatsApp messages programmatically
- **Security**: Built-in webhook verification, CORS, and security headers
- **Health Monitoring**: Health check endpoints and logging
- **Development Ready**: Hot reload support with nodemon

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- WhatsApp Business API account
- Meta Developer Account

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd whatsapp-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3001
   HOST=localhost
   NODE_ENV=development

   # Frontend CORS
   FRONTEND_URL=http://localhost:5173

   # WhatsApp Business API
   WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
   WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

   # Meta Graph API
   GRAPH_API_VERSION=v18.0
   GRAPH_API_URL=https://graph.facebook.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3001
```

### Endpoints

#### Health Check

```http
GET /health
```

Returns server health status, uptime, and version information.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2023-10-08T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

#### Webhook Verification & Processing

```http
GET /webhook
```

WhatsApp webhook verification endpoint.

**Query Parameters:**

- `hub.mode` - Verification mode (should be "subscribe")
- `hub.verify_token` - Your webhook verify token
- `hub.challenge` - Challenge string to echo back

```http
POST /webhook
```

Receives WhatsApp webhook payloads for message processing.

**Request Body:**

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "PHONE_NUMBER",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "messages": [...]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

#### Trigger Management

```http
GET /api/triggers
```

Get all automation triggers.

```http
POST /api/triggers
```

Create a new automation trigger.

**Request Body:**

```json
{
  "name": "Welcome Flow",
  "type": "message_received",
  "conditions": {
    "keyword": "start",
    "phone_number": "+1234567890"
  },
  "actions": [
    {
      "type": "send_message",
      "template": "welcome_template"
    }
  ],
  "active": true
}
```

```http
PUT /api/triggers/:id
```

Update an existing trigger.

```http
DELETE /api/triggers/:id
```

Delete a trigger.

```http
POST /api/triggers/:id/test
```

Test a trigger execution.

#### WhatsApp Messaging

```http
POST /api/whatsapp/send-message
```

Send a WhatsApp message.

**Request Body:**

```json
{
  "to": "+1234567890",
  "type": "text",
  "text": {
    "body": "Hello from WhatsApp API!"
  }
}
```

```http
POST /api/whatsapp/send-template
```

Send a WhatsApp template message.

**Request Body:**

```json
{
  "to": "+1234567890",
  "template": {
    "name": "template_name",
    "language": {
      "code": "en"
    },
    "components": []
  }
}
```

## 🏗 Project Structure

```
whatsapp-backend/
├── routes/
│   ├── webhook.js          # Webhook handling routes
│   ├── triggers.js         # Trigger management routes
│   └── whatsapp.js        # WhatsApp messaging routes
├── services/
│   ├── webhookService.js   # Webhook processing logic
│   ├── triggerService.js   # Trigger management logic
│   └── whatsappService.js  # WhatsApp API integration
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔐 Security Features

- **Webhook Verification**: Validates incoming webhooks using verify tokens
- **CORS Protection**: Configurable CORS policy for frontend integration
- **Security Headers**: Helmet.js for security headers
- **Environment Variables**: Sensitive data stored in environment variables
- **Request Limiting**: Body size limits to prevent abuse

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
FRONTEND_URL=https://your-frontend-domain.com
WEBHOOK_VERIFY_TOKEN=your_secure_webhook_token
WHATSAPP_ACCESS_TOKEN=your_production_access_token
WHATSAPP_PHONE_NUMBER_ID=your_production_phone_id
```

### Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test webhook endpoint
curl -X GET "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test_challenge"

# Test health endpoint
curl http://localhost:3001/health
```

## 📝 Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests

### Adding New Features

1. Create route handlers in `/routes`
2. Implement business logic in `/services`
3. Update this README with new endpoints
4. Add appropriate error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **Webhook Verification Failed**

   - Check `WEBHOOK_VERIFY_TOKEN` in `.env`
   - Ensure token matches Meta Developer settings

2. **CORS Errors**

   - Update `FRONTEND_URL` in `.env`
   - Check CORS configuration in `server.js`

3. **WhatsApp API Errors**
   - Verify `WHATSAPP_ACCESS_TOKEN` is valid
   - Check `WHATSAPP_PHONE_NUMBER_ID` is correct
   - Ensure phone number is verified with Meta

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Check WhatsApp Business API documentation
- Review Meta Developer documentation

---

Made with ❤️ for WhatsApp Business API integration
