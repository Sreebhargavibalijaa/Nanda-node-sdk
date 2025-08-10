# 🚀 NANDA Node.js SDK - Quick Start Guide

Get your first NANDA agent running in **under 5 minutes**!

## ⚡ Super Quick Start

### 1. Install the SDK

```bash
npm install nanda-node-sdk
```

### 2. Create Your Agent

Create a file called `my-agent.js`:

```javascript
const { NANDA } = require('nanda-node-sdk');

// Your custom message improvement logic
function myImprover(message) {
  return message
    .replace(/hello/gi, 'greetings')
    .replace(/goodbye/gi, 'farewell')
    .toUpperCase();
}

// Create and start your agent
async function startAgent() {
  const agent = new NANDA({
    agentId: 'my-first-agent',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-key-here',
    domain: 'localhost',
    port: 6000,
    apiPort: 6001
  });

  // Register your custom logic
  agent.getMessageImprover().register('my-improver', myImprover);
  agent.getMessageImprover().setActive('my-improver');

  // Start the agent
  await agent.start();
  
  console.log('🚀 Your agent is running!');
  console.log('🔗 Health check: http://localhost:6001/api/health');
}

startAgent().catch(console.error);
```

### 3. Set Your API Key

```bash
export ANTHROPIC_API_KEY="your-actual-api-key-here"
```

### 4. Run Your Agent

```bash
node my-agent.js
```

**🎉 That's it!** Your agent is now running and can communicate with other agents worldwide!

---

## 🔧 TypeScript Version

If you prefer TypeScript, here's the same agent:

```typescript
import { NANDA, AgentConfig } from 'nanda-node-sdk';

const config: AgentConfig = {
  agentId: 'my-first-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: 'localhost',
  port: 6000,
  apiPort: 6001
};

function myImprover(message: string): string {
  return message
    .replace(/hello/gi, 'greetings')
    .replace(/goodbye/gi, 'farewell')
    .toUpperCase();
}

async function startAgent() {
  const agent = new NANDA(config);
  
  agent.getMessageImprover().register('my-improver', myImprover);
  agent.getMessageImprover().setActive('my-improver');
  
  await agent.start();
  
  console.log('🚀 Your agent is running!');
  console.log('🔗 Health check: http://localhost:6001/api/health');
}

startAgent().catch(console.error);
```

---

## 🧪 Test Your Agent

### Test the API

```bash
# Health check
curl http://localhost:6001/api/health

# Improve a message
curl -X POST http://localhost:6001/api/improve \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello world, goodbye!"}'
```

### Test WebSocket

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:6000');

ws.on('open', () => {
  console.log('Connected to agent!');
  
  // Send a message
  ws.send(JSON.stringify({
    type: 'message',
    content: 'Hello there!'
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
});
```

---

## 🌐 Production Deployment

### 1. Get a Domain

Purchase a domain (e.g., `myagent.com`) and point it to your server.

### 2. Set Environment Variables

```bash
export ANTHROPIC_API_KEY="your-api-key"
export DOMAIN_NAME="myagent.com"
```

### 3. Update Your Agent

```javascript
const agent = new NANDA({
  agentId: 'production-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  domain: process.env.DOMAIN_NAME,
  port: 6000,
  apiPort: 6001,
  ssl: true  // Enable SSL
});
```

### 4. Generate SSL Certificates

```bash
sudo certbot certonly --standalone -d myagent.com
sudo cp -L /etc/letsencrypt/live/myagent.com/fullchain.pem .
sudo cp -L /etc/letsencrypt/live/myagent.com/privkey.pem .
sudo chown $USER:$USER fullchain.pem privkey.pem
chmod 600 fullchain.pem privkey.pem
```

### 5. Run in Production

```bash
nohup node my-agent.js > agent.log 2>&1 &
tail -f agent.log
```

---

## 🔍 What's Happening?

When you run your agent:

1. **Agent Bridge** starts on port 6000 (WebSocket)
2. **API Server** starts on port 6001 (HTTP)
3. **Registry Client** connects to global NANDA network
4. **Message Improver** processes incoming messages
5. **Your Logic** transforms messages as specified

### Network Architecture

```
Internet → Your Domain → SSL → Agent → Global NANDA Network
                ↓
        Other agents can discover and communicate with yours
```

---

## 🎯 Next Steps

1. **Customize Logic**: Modify the `myImprover` function
2. **Add Features**: Integrate with databases, external APIs
3. **Scale Up**: Run multiple agent instances
4. **Join Community**: Connect with other NANDA developers

---

## 🆘 Need Help?

- **Documentation**: [Full README](README.md)
- **Examples**: Check the `examples/` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/nanda-node-sdk/issues)
- **Discord**: [Join our community](https://discord.gg/nanda)

---

**Happy coding! 🚀🤖** 