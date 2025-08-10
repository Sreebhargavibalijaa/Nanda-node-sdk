/**
 * Custom Message Improvement Example
 * Demonstrates how to create and use custom message improvement logic
 */

import { NANDA, AgentConfig, MessageImprover as MessageImproverType } from '../src';

async function runCustomImprovementExample() {
  console.log('🚀 Starting Custom Message Improvement Example');
  console.log('=' .repeat(50));

  // Configuration
  const config: AgentConfig = {
    agentId: 'custom-improvement-example',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here',
    domain: process.env.DOMAIN_NAME || 'localhost',
    port: 6002,
    apiPort: 6003,
    ssl: false,
    logLevel: 'info'
  };

  try {
    // Create NANDA agent
    console.log('📝 Creating NANDA agent...');
    const nanda = new NANDA(config);

    // Get the message improver instance
    const messageImprover = nanda.getMessageImprover();

    // Create custom improvement functions
    console.log('🔧 Registering custom improvement functions...');

    // 1. Emoji enhancer
    messageImprover.register('emoji', async (message: string): Promise<string> => {
      const emojiMap: Record<string, string> = {
        'hello': '👋',
        'hi': '👋',
        'goodbye': '👋',
        'bye': '👋',
        'thanks': '🙏',
        'thank you': '🙏',
        'great': '🎉',
        'awesome': '🎉',
        'amazing': '🎉',
        'love': '❤️',
        'happy': '😊',
        'sad': '😢',
        'angry': '😠',
        'laugh': '😂',
        'cool': '😎'
      };

      let improved = message;
      Object.entries(emojiMap).forEach(([word, emoji]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        improved = improved.replace(regex, `${word} ${emoji}`);
      });

      return improved;
    });

    // 2. Formal business improver
    messageImprover.register('business', async (message: string): Promise<string> => {
      const formalMap: Record<string, string> = {
        'hi': 'Hello',
        'hey': 'Hello',
        'thanks': 'Thank you',
        'thx': 'Thank you',
        'u': 'you',
        'ur': 'your',
        'r': 'are',
        'btw': 'by the way',
        'asap': 'as soon as possible',
        'fyi': 'for your information',
        'imo': 'in my opinion',
        'tbh': 'to be honest'
      };

      let improved = message;
      Object.entries(formalMap).forEach(([informal, formal]) => {
        const regex = new RegExp(`\\b${informal}\\b`, 'gi');
        improved = improved.replace(regex, formal);
      });

      // Capitalize first letter and add period if missing
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      if (!/[.!?]$/.test(improved)) {
        improved += '.';
      }

      return improved;
    });

    // 3. Creative storyteller
    messageImprover.register('storyteller', async (message: string): Promise<string> => {
      const storyStarters = [
        'Once upon a time, ',
        'In a world where ',
        'Legend has it that ',
        'Deep in the heart of ',
        'On a magical day, '
      ];

      const starter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
      let improved = starter + message.toLowerCase();

      // Add dramatic punctuation
      if (improved.includes('amazing') || improved.includes('incredible') || improved.includes('unbelievable')) {
        improved = improved.replace(/\.$/, '!');
      }

      return improved;
    });

    console.log('✅ Custom improvement functions registered!');
    console.log('\n📋 Available improvers:');
    messageImprover.list().forEach(name => {
      console.log(`  • ${name}`);
    });

    // Test the custom improvers
    console.log('\n🧪 Testing custom improvement functions...');
    
    const testMessages = [
      'hello there, how are you doing?',
      'thanks for the help, that was great!',
      'this is an amazing discovery',
      'hi, can you help me with something?',
      'goodbye, see you later!'
    ];

    for (const message of testMessages) {
      console.log(`\n📝 Original: "${message}"`);
      
      // Test each improver
      for (const improverName of ['emoji', 'business', 'storyteller']) {
        const result = await messageImprover.improveWith(improverName, message);
        console.log(`🔧 ${improverName}: "${result.improvedMessage}"`);
      }
    }

    // Set active improver
    console.log('\n🎯 Setting active improver to "emoji"...');
    messageImprover.setActive('emoji');
    console.log(`✅ Active improver: ${messageImprover.getActive()}`);

    // Start the agent
    console.log('\n🚀 Starting agent with custom improvements...');
    await nanda.start();

    console.log('✅ Agent started successfully with custom improvements!');
    console.log(`🔗 Agent Bridge: http://localhost:${config.port}`);
    console.log(`🔗 API Server: http://localhost:${config.apiPort}`);

    // Keep the agent running
    console.log('\n⏳ Agent is running with custom improvements. Press Ctrl+C to stop...');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down agent...');
      await nanda.stop();
      console.log('✅ Agent stopped successfully');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error running custom improvement example:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  runCustomImprovementExample();
}

export { runCustomImprovementExample }; 