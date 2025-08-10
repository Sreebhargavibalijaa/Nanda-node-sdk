/**
 * Core NANDA Agent Class
 * Main entry point for the NANDA SDK
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  AgentConfig, 
  Message, 
  Conversation, 
  MessageImprovementResult,
  AgentStatus,
  AgentCapabilities,
  MessageProcessingOptions
} from '../types';
import { defaultLogger } from './logger';
import { messageImprover } from './message-improver';
import { AgentBridge } from './agent-bridge';
import { ApiServer } from './api-server';
import { RegistryClient } from './registry-client';

export class NANDA {
  private config: AgentConfig;
  private logger = defaultLogger;
  private conversations: Map<string, Conversation> = new Map();
  private agentBridge: AgentBridge;
  private apiServer: ApiServer;
  private registryClient: RegistryClient;
  private startTime: Date;
  private messageCount: number = 0;
  private isRunning: boolean = false;

  constructor(config: AgentConfig) {
    this.config = {
      port: 6000,
      apiPort: 6001,
      ssl: false,
      logLevel: 'info',
      ...config
    };

    this.startTime = new Date();
    this.initializeComponents();
    this.logger.info(`NANDA agent initialized: ${this.config.agentId}`);
  }

  /**
   * Initialize core components
   */
  private initializeComponents(): void {
    // Initialize agent bridge
    this.agentBridge = new AgentBridge(this.config, this.logger);
    
    // Initialize API server
    this.apiServer = new ApiServer(this.config, this.logger);
    
    // Initialize registry client
    this.registryClient = new RegistryClient(this.config, this.logger);
    
    // Set up message processing pipeline
    this.setupMessagePipeline();
  }

  /**
   * Set up message processing pipeline
   */
  private setupMessagePipeline(): void {
    // Register message handlers
    this.agentBridge.onMessage(async (message: Message) => {
      await this.processMessage(message);
    });

    this.agentBridge.onError((error: Error) => {
      this.logger.error(`Agent bridge error: ${error.message}`);
    });
  }

  /**
   * Process incoming messages
   */
  async processMessage(message: Message, options: MessageProcessingOptions = {}): Promise<MessageImprovementResult> {
    try {
      this.messageCount++;
      this.logger.messageReceived(message.conversationId, message.id);

      // Store message in conversation
      this.storeMessage(message);

      // Apply message improvement if enabled
      if (options.improveMessage !== false) {
        const improverName = options.improverName || messageImprover.getActive();
        const result = await messageImprover.improveWith(improverName, message.content[0]?.content || '', {
          conversationId: message.conversationId,
          messageId: message.id,
          role: message.role
        });

        this.logger.messageProcessed(message.conversationId, message.id, result.improvementType);
        return result;
      }

      return {
        originalMessage: message.content[0]?.content || '',
        improvedMessage: message.content[0]?.content || '',
        improvementType: 'none',
        metadata: { messageId: message.id, conversationId: message.conversationId }
      };

    } catch (error) {
      this.logger.error(`Error processing message: ${error}`);
      throw error;
    }
  }

  /**
   * Store a message in its conversation
   */
  private storeMessage(message: Message): void {
    let conversation = this.conversations.get(message.conversationId);
    
    if (!conversation) {
      conversation = {
        id: message.conversationId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.conversations.set(message.conversationId, conversation);
    }

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
  }

  /**
   * Get conversation by ID
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * Get all conversations
   */
  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  /**
   * Create a new conversation
   */
  createConversation(metadata?: any): Conversation {
    const conversationId = uuidv4();
    const conversation: Conversation = {
      id: conversationId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata
    };

    this.conversations.set(conversationId, conversation);
    this.logger.info(`New conversation created: ${conversationId}`);
    
    return conversation;
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId: string): boolean {
    const deleted = this.conversations.delete(conversationId);
    if (deleted) {
      this.logger.info(`Conversation deleted: ${conversationId}`);
    }
    return deleted;
  }

  /**
   * Get agent status
   */
  getStatus(): AgentStatus {
    const uptime = Date.now() - this.startTime.getTime();
    
    return {
      agentId: this.config.agentId,
      status: this.isRunning ? 'running' : 'stopped',
      uptime,
      messageCount: this.messageCount,
      lastActivity: this.startTime,
      endpoints: {
        agent: `http://localhost:${this.config.port}`,
        api: `http://localhost:${this.config.apiPort}`,
        health: `http://localhost:${this.config.apiPort}/api/health`
      }
    };
  }

  /**
   * Get agent capabilities
   */
  getCapabilities(): AgentCapabilities {
    return {
      messageImprovement: true,
      conversationManagement: true,
      webSocketSupport: true,
      apiEndpoints: true,
      registryIntegration: true,
      customImprovers: true,
      logging: true,
      ssl: this.config.ssl || false
    };
  }

  /**
   * Start the NANDA agent
   */
  async start(): Promise<void> {
    try {
      this.logger.info(`Starting NANDA agent: ${this.config.agentId}`);
      
      // Start agent bridge
      await this.agentBridge.start();
      
      // Start API server
      await this.apiServer.start();
      
      // Register with registry
      await this.registryClient.register();
      
      this.isRunning = true;
      this.logger.agentStart(this.config.agentId, this.config.port || 6000);
      
    } catch (error) {
      this.logger.error(`Failed to start NANDA agent: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the NANDA agent
   */
  async stop(): Promise<void> {
    try {
      this.logger.info(`Stopping NANDA agent: ${this.config.agentId}`);
      
      // Stop agent bridge
      await this.agentBridge.stop();
      
      // Stop API server
      await this.apiServer.stop();
      
      this.isRunning = false;
      this.logger.agentStop(this.config.agentId);
      
    } catch (error) {
      this.logger.error(`Error stopping NANDA agent: ${error}`);
      throw error;
    }
  }

  /**
   * Restart the NANDA agent
   */
  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  /**
   * Check if agent is running
   */
  isAgentRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...updates };
    this.logger.info('Configuration updated');
  }

  /**
   * Get message improver instance
   */
  getMessageImprover() {
    return messageImprover;
  }

  /**
   * Get agent bridge instance
   */
  getAgentBridge() {
    return this.agentBridge;
  }

  /**
   * Get API server instance
   */
  getApiServer() {
    return this.apiServer;
  }

  /**
   * Get registry client instance
   */
  getRegistryClient() {
    return this.registryClient;
  }
} 