/**
 * API Server
 * Handles REST API endpoints for the NANDA agent
 */

import express from 'express';
import cors from 'cors';
import { AgentConfig, HealthCheckResult, ApiResponse } from '../types';
import { Logger } from './logger';

export class ApiServer {
  private config: AgentConfig;
  private logger: Logger;
  private app: express.Application;
  private server: any;
  private port: number;
  private isRunning: boolean = false;

  constructor(config: AgentConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.port = config.apiPort || 6001;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // CORS
    this.app.use(cors({
      origin: true,
      credentials: true
    }));

    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.apiRequest(req.method, req.path, res.statusCode);
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      const health: HealthCheckResult = {
        status: 'healthy',
        timestamp: new Date(),
        services: {
          agent: true,
          api: true,
          registry: false // Will be updated based on actual status
        }
      };
      
      res.json(this.createSuccessResponse(health));
    });

    // Agent status endpoint
    this.app.get('/api/status', (req, res) => {
      const status = {
        agentId: this.config.agentId,
        running: this.isRunning,
        port: this.port,
        timestamp: new Date()
      };
      
      res.json(this.createSuccessResponse(status));
    });

    // Send message endpoint
    this.app.post('/api/send', (req, res) => {
      try {
        const { message, conversationId } = req.body;
        
        if (!message) {
          return res.status(400).json(this.createErrorResponse('Message is required', 'MISSING_MESSAGE'));
        }

        // Process message here
        const response = {
          messageId: `msg_${Date.now()}`,
          conversationId: conversationId || `conv_${Date.now()}`,
          timestamp: new Date(),
          status: 'sent'
        };

        res.json(this.createSuccessResponse(response));
        
      } catch (error) {
        this.logger.error(`Error in send endpoint: ${error}`);
        res.status(500).json(this.createErrorResponse('Internal server error', 'INTERNAL_ERROR'));
      }
    });

    // Receive message endpoint
    this.app.post('/api/receive_message', (req, res) => {
      try {
        const { message, conversationId } = req.body;
        
        if (!message) {
          return res.status(400).json(this.createErrorResponse('Message is required', 'MISSING_MESSAGE'));
        }

        // Process received message here
        const response = {
          messageId: `msg_${Date.now()}`,
          conversationId: conversationId || `conv_${Date.now()}`,
          timestamp: new Date(),
          status: 'received'
        };

        res.json(this.createSuccessResponse(response));
        
      } catch (error) {
        this.logger.error(`Error in receive endpoint: ${error}`);
        res.status(500).json(this.createErrorResponse('Internal server error', 'INTERNAL_ERROR'));
      }
    });

    // List agents endpoint
    this.app.get('/api/agents/list', (req, res) => {
      const agents = [
        {
          id: this.config.agentId,
          name: `NANDA Agent ${this.config.agentId}`,
          status: this.isRunning ? 'running' : 'stopped',
          port: this.port
        }
      ];
      
      res.json(this.createSuccessResponse(agents));
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'NANDA Agent API Server',
        version: '1.0.0',
        agentId: this.config.agentId,
        endpoints: {
          health: '/api/health',
          status: '/api/status',
          send: '/api/send',
          receive: '/api/receive_message',
          agents: '/api/agents/list'
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json(this.createErrorResponse('Endpoint not found', 'NOT_FOUND'));
    });
  }

  /**
   * Start the API server
   */
  async start(): Promise<void> {
    try {
      this.logger.info(`Starting API server on port ${this.port}`);
      
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(this.port, () => {
          this.isRunning = true;
          this.logger.info(`API server started successfully on port ${this.port}`);
          resolve();
        });
        
        this.server.on('error', (error: Error) => {
          this.logger.error(`Failed to start API server: ${error.message}`);
          reject(error);
        });
      });
      
    } catch (error) {
      this.logger.error(`Error starting API server: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the API server
   */
  async stop(): Promise<void> {
    try {
      if (this.server) {
        this.logger.info('Stopping API server');
        
        return new Promise((resolve) => {
          this.server.close(() => {
            this.isRunning = false;
            this.logger.info('API server stopped');
            resolve();
          });
        });
      }
    } catch (error) {
      this.logger.error(`Error stopping API server: ${error}`);
      throw error;
    }
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Create success response
   */
  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date()
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(message: string, code: string): ApiResponse<null> {
    return {
      success: false,
      error: message,
      code,
      timestamp: new Date()
    };
  }

  /**
   * Get server info
   */
  getInfo() {
    return {
      port: this.port,
      running: this.isRunning,
      endpoints: [
        'GET /api/health',
        'GET /api/status',
        'POST /api/send',
        'POST /api/receive_message',
        'GET /api/agents/list'
      ]
    };
  }
} 