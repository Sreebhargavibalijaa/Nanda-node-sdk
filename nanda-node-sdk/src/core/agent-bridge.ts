/**
 * Agent Bridge
 * Handles communication between the agent and external systems
 */

import { AgentConfig, Message } from '../types';
import { Logger } from './logger';

export class AgentBridge {
  private config: AgentConfig;
  private logger: Logger;
  private isRunning: boolean = false;
  private port: number;
  private messageHandlers: ((message: Message) => void)[] = [];
  private errorHandlers: ((error: Error) => void)[] = [];

  constructor(config: AgentConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.port = config.port || 6000;
  }

  /**
   * Start the agent bridge
   */
  async start(): Promise<void> {
    try {
      this.logger.info(`Starting agent bridge on port ${this.port}`);
      
      // Simulate starting the bridge
      // In a real implementation, this would start a WebSocket or HTTP server
      this.isRunning = true;
      
      this.logger.info(`Agent bridge started successfully on port ${this.port}`);
      // Event handlers would be called here
      
    } catch (error) {
      this.logger.error(`Failed to start agent bridge: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the agent bridge
   */
  async stop(): Promise<void> {
    try {
      this.logger.info('Stopping agent bridge');
      
      this.isRunning = false;
      
      this.logger.info('Agent bridge stopped');
      // Event handlers would be called here
      
    } catch (error) {
      this.logger.error(`Error stopping agent bridge: ${error}`);
      throw error;
    }
  }

  /**
   * Check if bridge is running
   */
  isBridgeRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Send a message through the bridge
   */
  async sendMessage(message: Message): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Agent bridge is not running');
    }

    try {
      this.logger.debug(`Sending message: ${message.id}`);
      // Message sent event handlers would be called here
      
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`);
      throw error;
    }
  }

  /**
   * Simulate receiving a message (for testing)
   */
  simulateMessage(message: Message): void {
    if (!this.isRunning) {
      throw new Error('Agent bridge is not running');
    }

    this.logger.debug(`Simulating received message: ${message.id}`);
    // Call message handlers
    this.messageHandlers.forEach(handler => handler(message));
  }

  /**
   * Get bridge status
   */
  getStatus() {
    return {
      running: this.isRunning,
      port: this.port,
      config: this.config
    };
  }

  /**
   * Register message handler
   */
  onMessage(handler: (message: Message) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Register error handler
   */
  onError(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler);
  }
} 