/**
 * Basic NANDA Agent Example
 * Demonstrates the simplest way to create and run a NANDA agent
 */

import { NANDA, AgentConfig } from '../src';

async function runBasicAgent() {
  console.log('🚀 Starting Basic NANDA Agent Example');
  console.log('=' .repeat(50));

  // Configuration
  const config: AgentConfig = {
    agentId: 'basic-agent-example',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here',
    domain: process.env.DOMAIN_NAME || 'localhost',
    port: 6000,
    apiPort: 6001,
    ssl: false,
    logLevel: 'info'
  };

  try {
    // Create NANDA agent
    console.log('📝 Creating NANDA agent...');
    const nanda = new NANDA(config);

    // Start the agent
    console.log('🚀 Starting agent...');
    await nanda.start();

    console.log('✅ Agent started successfully!');
    console.log(`🔗 Agent Bridge: http://localhost:${config.port}`);
    console.log(`🔗 API Server: http://localhost:${config.apiPort}`);
    console.log(`🔗 Health Check: http://localhost:${config.apiPort}/api/health`);

    // Get agent status
    const status = nanda.getStatus();
    console.log('\n📊 Agent Status:');
    console.log(`  ID: ${status.agentId}`);
    console.log(`  Status: ${status.status}`);
    console.log(`  Uptime: ${status.uptime}ms`);
    console.log(`  Message Count: ${status.messageCount}`);

    // Get agent capabilities
    const capabilities = nanda.getCapabilities();
    console.log('\n🔧 Agent Capabilities:');
    Object.entries(capabilities).forEach(([capability, enabled]) => {
      console.log(`  ${capability}: ${enabled ? '✅' : '❌'}`);
    });

    // Keep the agent running
    console.log('\n⏳ Agent is running. Press Ctrl+C to stop...');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down agent...');
      await nanda.stop();
      console.log('✅ Agent stopped successfully');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error running basic agent:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  runBasicAgent();
}

export { runBasicAgent }; 