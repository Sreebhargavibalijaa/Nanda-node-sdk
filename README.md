# 🚀 NANDA Node.js SDK

<div align="center">

![NANDA Logo](https://img.shields.io/badge/NANDA-AI%20Agent%20SDK-blue?style=for-the-badge&logo=node.js)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Build powerful, customizable AI agents with Node.js and TypeScript**

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 🌟 What is NANDA?

**NANDA** (Network of Autonomous Neural Decision Agents) is a revolutionary framework for building AI agents that can communicate, collaborate, and learn from each other across the global internet.

The **Node.js SDK** provides a robust, TypeScript-first approach to creating NANDA agents with enterprise-grade features:

- 🔌 **Plug-and-Play Architecture** - Drop-in message improvement logic
- 🌐 **Global Agent Network** - Connect with agents worldwide
- 🚀 **Production Ready** - Built-in SSL, logging, and monitoring
- 🎯 **TypeScript Native** - Full type safety and IntelliSense
- 🔧 **Highly Customizable** - Extend every aspect of your agent

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and **npm** or **yarn**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))
- **Domain name** (for production) or use `localhost` for testing

### Installation

```bash
# Install the SDK
npm install nanda-node-sdk

# Or with yarn
yarn add nanda-node-sdk
```

### My First Agent (5 minutes!)
<img width="720" height="400" alt="image" src="https://github.com/user-attachments/assets/0bb2a633-47de-443e-bd05-3da9301a6118" />
- Created and deployed a Nanda agent using the Base Agent SDK
- Implemented full chat functionality with Claude 3.5 Sonnet
- Set up all required API endpoints (health, chat, send, messages, agents/list)
agent_id: agentm679929

```typescript
import { NANDA, AgentConfig } from 'nanda-node-sdk';

// 1. Configure your agent
const config: AgentConfig = {
  agentId: 'my-first-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: process.env.DOMAIN_NAME || 'localhost',
  port: 6000,
  apiPort: 6001
};

// 2. Create your improvement logic
function myMessageImprover(message: string): string {
  return message
    .replace(/hello/gi, 'greetings')
    .replace(/goodbye/gi, 'farewell')
    .toUpperCase();
}

// 3. Create and start your agent
async function startAgent() {
  const nanda = new NANDA(config);
  
  // Register your custom logic
  nanda.getMessageImprover().register('my-improver', myMessageImprover);
  nanda.getMessageImprover().setActive('my-improver');
  
  // Start the agent
  await nanda.start();
  
  console.log('🚀 Your NANDA agent is running!');
  console.log(`🔗 API: http://localhost:${config.apiPort}/api/health`);
}

startAgent().catch(console.error);
```

### Run It!

```bash
# Set your API key
export ANTHROPIC_API_KEY="your-key-here"

# Run your agent
node your-agent.js
```

**🎉 That's it!** Your agent is now running and can communicate with other agents worldwide!

---

### Core Components

| Component | Purpose | Customizable |
|-----------|---------|--------------|
| **NANDA** | Main agent orchestrator | ✅ Fully |
| **Message Improver** | Text transformation logic | ✅ Plug-and-play |
| **Agent Bridge** | Communication protocol | ✅ Extensible |
| **API Server** | HTTP/WebSocket endpoints | ✅ Configurable |
| **Registry Client** | Global agent discovery | ✅ Optional |

---

## 📚 Examples

### 1. Basic Agent

```typescript
import { NANDA } from 'nanda-node-sdk';

const agent = new NANDA({
  agentId: 'simple-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: 'localhost'
});

await agent.start();
```

### 2. Custom Message Improvement

```typescript
import { NANDA } from 'nanda-node-sdk';

// Create a sophisticated message improver
function smartImprover(message: string): string {
  // Add emojis based on sentiment
  if (message.includes('happy')) message += ' 😊';
  if (message.includes('sad')) message += ' 😢';
  
  // Make it more professional
  message = message.replace(/hey/gi, 'Hello');
  message = message.replace(/bye/gi, 'Goodbye');
  
  return message;
}

const agent = new NANDA({
  agentId: 'smart-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: 'localhost'
});

// Register your custom logic
agent.getMessageImprover().register('smart', smartImprover);
agent.getMessageImprover().setActive('smart');

await agent.start();
```

### 3. LangChain Integration

```typescript
import { NANDA } from 'nanda-node-sdk';
import { ChatAnthropic } from 'langchain/anthropic';
import { PromptTemplate } from 'langchain/prompts';

// Create LangChain-based improver
async function langchainImprover(message: string): Promise<string> {
  const llm = new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-3-haiku-20240307'
  });
  
  const prompt = PromptTemplate.fromTemplate(
    'Make this message more professional: {message}'
  );
  
  const chain = prompt.pipe(llm);
  const result = await chain.invoke({ message });
  
  return result.content as string;
}

const agent = new NANDA({
  agentId: 'langchain-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: 'localhost'
});

agent.getMessageImprover().register('langchain', langchainImprover);
agent.getMessageImprover().setActive('langchain');

await agent.start();
```

### 4. Production-Ready Agent

```typescript
import { NANDA } from 'nanda-node-sdk';

const agent = new NANDA({
  agentId: 'production-agent',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  domain: 'myagent.com',
  port: 6000,
  apiPort: 6001,
  ssl: true,
  logLevel: 'info',
  registryUrl: 'https://registry.nanda.ai'
});

// Custom message processing
agent.getMessageImprover().register('production', (message) => {
  // Add logging
  console.log(`Processing message: ${message}`);
  
  // Apply business logic
  let improved = message;
  if (message.includes('urgent')) {
    improved = `🚨 URGENT: ${message}`;
  }
  
  // Add timestamp
  improved += ` [${new Date().toISOString()}]`;
  
  return improved;
});

agent.getMessageImprover().setActive('production');

await agent.start();
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DOMAIN_NAME=yourdomain.com

# Optional
AGENT_ID=my_custom_agent_id
PORT=6000
API_PORT=6001
SSL_ENABLED=true
LOG_LEVEL=info
REGISTRY_URL=https://registry.nanda.ai
```

### Configuration Object

```typescript
interface AgentConfig {
  // Required
  anthropicApiKey: string;
  domain: string;
  
  // Optional
  agentId?: string;           // Auto-generated if not provided
  port?: number;              // Default: 6000
  apiPort?: number;           // Default: 6001
  ssl?: boolean;              // Default: false
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  registryUrl?: string;       // Default: https://chat.nanda-registry.com:6900
  
  // Advanced
  customHeaders?: Record<string, string>;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  cors?: {
    origin: string | string[];
    credentials: boolean;
  };
}
```

---

## 🌐 Deployment

### Local Development

```bash
# Clone and setup
git clone https://github.com/yourusername/nanda-node-sdk.git
cd nanda-node-sdk

# Install dependencies
npm install

# Run examples
npm run example:basic
npm run example:custom
npm run example:server
```

### Production Deployment

#### 1. Server Setup

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nodejs npm certbot

# CentOS/RHEL
sudo yum install -y nodejs npm certbot
```

#### 2. SSL Certificates

```bash
# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com

# Copy to your app directory
sudo cp -L /etc/letsencrypt/live/yourdomain.com/fullchain.pem .
sudo cp -L /etc/letsencrypt/live/yourdomain.com/privkey.pem .
sudo chown $USER:$USER fullchain.pem privkey.pem
chmod 600 fullchain.pem privkey.pem
```

#### 3. Run Your Agent

```bash
# Set environment variables
export ANTHROPIC_API_KEY="your-key-here"
export DOMAIN_NAME="yourdomain.com"

# Start in background
nohup node your-agent.js > agent.log 2>&1 &

# Monitor logs
tail -f agent.log
```

#### 4. Systemd Service (Optional)

```ini
# /etc/systemd/system/nanda-agent.service
[Unit]
Description=NANDA AI Agent
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/your/agent
Environment=ANTHROPIC_API_KEY=your-key-here
Environment=DOMAIN_NAME=yourdomain.com
ExecStart=/usr/bin/node your-agent.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable nanda-agent
sudo systemctl start nanda-agent
sudo systemctl status nanda-agent
```

---

## 📊 API Reference

### Core Classes

#### NANDA

The main agent class that orchestrates all functionality.

```typescript
class NANDA {
  constructor(config: AgentConfig)
  
  // Lifecycle
  start(): Promise<void>
  stop(): Promise<void>
  restart(): Promise<void>
  
  // Status & Info
  getStatus(): AgentStatus
  getCapabilities(): AgentCapabilities
  getConfig(): AgentConfig
  
  // Message Processing
  processMessage(message: Message, options?: MessageProcessingOptions): Promise<MessageImprovementResult>
  
  // Components
  getMessageImprover(): MessageImprover
  getAgentBridge(): AgentBridge
  getApiServer(): ApiServer
  getRegistryClient(): RegistryClient
}
```

#### Message Improver

Handles text transformation and improvement logic.

```typescript
class MessageImprover {
  // Registration
  register(name: string, improver: MessageImproverFunction): void
  unregister(name: string): boolean
  
  // Activation
  setActive(name: string): void
  getActive(): string
  
  // Processing
  improveWith(name: string, message: string, context?: any): Promise<MessageImprovementResult>
  improve(message: string, context?: any): Promise<MessageImprovementResult>
}
```

### API Endpoints

When running, your agent exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Agent health status |
| `/api/status` | GET | Detailed agent status |
| `/api/messages` | GET | Message history |
| `/api/improve` | POST | Improve a message |
| `/api/conversations` | GET | Conversation list |
| `/api/agents` | GET | Connected agents |

### WebSocket Events

```typescript
// Connect to your agent
const ws = new WebSocket('ws://localhost:6000');

// Listen for events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'message_received':
      console.log('New message:', data.message);
      break;
    case 'message_improved':
      console.log('Message improved:', data.result);
      break;
    case 'agent_connected':
      console.log('Agent connected:', data.agentId);
      break;
  }
};
```

---

## 🔍 Monitoring & Debugging

### Built-in Logging

```typescript
import { Logger } from 'nanda-node-sdk';

const logger = new Logger({
  level: 'debug',
  format: 'json',
  transports: ['console', 'file']
});

// Use in your agent
logger.info('Agent started successfully');
logger.error('Failed to process message', { error: error.message });
logger.debug('Processing message', { messageId: message.id });
```

### Health Checks

```bash
# Check agent health
curl http://localhost:6001/api/health

# Get detailed status
curl http://localhost:6001/api/status

# Monitor in real-time
watch -n 5 'curl -s http://localhost:6001/api/health'
```

### Metrics & Analytics

```typescript
// Get agent metrics
const status = agent.getStatus();
console.log(`Uptime: ${status.uptime}ms`);
console.log(`Messages processed: ${status.messageCount}`);
console.log(`Active conversations: ${status.activeConversations}`);

// Get capabilities
const capabilities = agent.getCapabilities();
console.log('Message improvement:', capabilities.messageImprovement);
console.log('SSL support:', capabilities.ssl);
console.log('Registry connection:', capabilities.registryConnection);
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { NANDA } from 'nanda-node-sdk';

describe('NANDA Agent', () => {
  let agent: NANDA;
  
  beforeEach(() => {
    agent = new NANDA({
      agentId: 'test-agent',
      anthropicApiKey: 'test-key',
      domain: 'localhost'
    });
  });
  
  afterEach(async () => {
    await agent.stop();
  });
  
  it('should start successfully', async () => {
    await expect(agent.start()).resolves.not.toThrow();
    expect(agent.isAgentRunning()).toBe(true);
  });
  
  it('should process messages', async () => {
    await agent.start();
    
    const result = await agent.processMessage({
      id: 'test-1',
      content: [{ content: 'Hello world' }],
      role: 'user',
      conversationId: 'conv-1'
    });
    
    expect(result.improvedContent).toBeDefined();
  });
});
```

### Integration Tests

```typescript
import { NANDA } from 'nanda-node-sdk';
import axios from 'axios';

describe('NANDA API Integration', () => {
  let agent: NANDA;
  
  beforeAll(async () => {
    agent = new NANDA({
      agentId: 'integration-test',
      anthropicApiKey: 'test-key',
      domain: 'localhost',
      port: 6000,
      apiPort: 6001
    });
    
    await agent.start();
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  
  afterAll(async () => {
    await agent.stop();
  });
  
  it('should respond to health check', async () => {
    const response = await axios.get('http://localhost:6001/api/health');
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('healthy');
  });
  
  it('should improve messages via API', async () => {
    const response = await axios.post('http://localhost:6001/api/improve', {
      message: 'Hello world',
      improver: 'default'
    });
    
    expect(response.status).toBe(200);
    expect(response.data.improvedMessage).toBeDefined();
  });
});
```

---

## 🚀 Performance & Scaling

### Optimization Tips

1. **Message Processing**
   ```typescript
   // Use async processing for heavy operations
   agent.getMessageImprover().register('async', async (message) => {
     const result = await heavyProcessing(message);
     return result;
   });
   ```

2. **Connection Pooling**
   ```typescript
   // Configure connection limits
   const agent = new NANDA({
     ...config,
     maxConnections: 100,
     connectionTimeout: 30000
   });
   ```
---

## 🔒 Security

### SSL/TLS Configuration

```typescript
const agent = new NANDA({
  ...config,
  ssl: true,
  sslOptions: {
    cert: fs.readFileSync('./fullchain.pem'),
    key: fs.readFileSync('./privkey.pem'),
    ca: fs.readFileSync('./chain.pem')
  }
});
```

### Authentication

```typescript
// Custom authentication middleware
agent.getApiServer().use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
});
```

### Rate Limiting

```typescript
const agent = new NANDA({
  ...config,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // limit each IP to 100 requests per windowMs
  }
});
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/nanda-node-sdk.git
cd nanda-node-sdk

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **comprehensive tests** for new features
- Update **documentation** for API changes

---

## 📚 Additional Resources

### Documentation

- [API Reference](https://docs.nanda.ai/node-sdk)
- [Architecture Guide](https://docs.nanda.ai/architecture)
- [Deployment Guide](https://docs.nanda.ai/deployment)
- [Best Practices](https://docs.nanda.ai/best-practices)

### Community

- [Discord Server](https://discord.gg/nanda)
- [GitHub Discussions](https://github.com/yourusername/nanda-node-sdk/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nanda)
- [Blog](https://blog.nanda.ai)

### Examples & Templates

- [Basic Agent Template](https://github.com/yourusername/nanda-node-sdk/tree/main/templates/basic)
- [LangChain Integration](https://github.com/yourusername/nanda-node-sdk/tree/main/templates/langchain)
- [Production Setup](https://github.com/yourusername/nanda-node-sdk/tree/main/templates/production)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** for providing the Claude API
- **Node.js** community for the amazing runtime
- **TypeScript** team for type safety
- **All contributors** who make NANDA possible

---

<div align="center">

**Built with ❤️ by the NANDA Team**

[Website](https://nanda.ai) • [GitHub](https://github.com/yourusername/nanda-node-sdk) • [Discord](https://discord.gg/nanda)

</div> 
