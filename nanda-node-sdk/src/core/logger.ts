/**
 * NANDA SDK Logger
 * Provides structured logging with different levels and formats
 */

import winston from 'winston';
import { LogConfig } from '../types';

export class Logger {
  private logger: winston.Logger;
  private config: LogConfig;

  constructor(config: Partial<LogConfig> = {}) {
    this.config = {
      level: 'info',
      format: 'simple',
      transports: ['console'],
      ...config
    };

    this.initializeLogger();
  }

  private initializeLogger(): void {
    const format = this.config.format === 'json' 
      ? winston.format.json()
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
        );

    this.logger = winston.createLogger({
      level: this.config.level,
      format,
      transports: this.createTransports(),
      exitOnError: false
    });
  }

  private createTransports(): winston.transport[] {
    const transports: winston.transport[] = [];

    if (this.config.transports.includes('console')) {
      transports.push(new winston.transports.Console());
    }

    if (this.config.transports.includes('file')) {
      transports.push(
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        })
      );
    }

    return transports;
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  // Convenience methods for common logging patterns
  agentStart(agentId: string, port: number): void {
    this.info(`Agent ${agentId} starting on port ${port}`);
  }

  agentStop(agentId: string): void {
    this.info(`Agent ${agentId} stopped`);
  }

  messageReceived(conversationId: string, messageId: string): void {
    this.debug(`Message ${messageId} received in conversation ${conversationId}`);
  }

  messageProcessed(conversationId: string, messageId: string, improvementType: string): void {
    this.debug(`Message ${messageId} processed with ${improvementType} improvement in conversation ${conversationId}`);
  }

  registryConnection(url: string, success: boolean): void {
    if (success) {
      this.info(`Successfully connected to registry at ${url}`);
    } else {
      this.error(`Failed to connect to registry at ${url}`);
    }
  }

  apiRequest(method: string, endpoint: string, statusCode: number): void {
    this.debug(`${method} ${endpoint} - ${statusCode}`);
  }

  sslStatus(enabled: boolean, certPath?: string): void {
    if (enabled) {
      this.info(`SSL enabled with certificates at ${certPath || 'default path'}`);
    } else {
      this.warn('SSL disabled - running in HTTP mode');
    }
  }

  portConflict(originalPort: number, newPort: number): void {
    this.warn(`Port ${originalPort} in use, using ${newPort} instead`);
  }

  // Method to update log level at runtime
  setLevel(level: string): void {
    this.logger.level = level;
    this.info(`Log level changed to ${level}`);
  }

  // Method to add custom transport
  addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  // Get current logger instance
  getLogger(): winston.Logger {
    return this.logger;
  }
}

// Default logger instance
export const defaultLogger = new Logger(); 