/**
 * Core type definitions for NANDA Node.js SDK
 */

export interface MessageContent {
  type: 'text' | 'image' | 'file';
  content: string;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
  timestamp: Date;
  conversationId: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AgentConfig {
  agentId: string;
  anthropicApiKey: string;
  domain: string;
  port?: number;
  apiPort?: number;
  ssl?: boolean;
  certPath?: string;
  keyPath?: string;
  registryUrl?: string;
  publicUrl?: string;
  apiUrl?: string;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

export interface RegistryConfig {
  url: string;
  agentId: string;
  agentUrl: string;
  apiUrl: string;
}

export interface MessageImprovementResult {
  originalMessage: string;
  improvedMessage: string;
  improvementType: 'custom' | 'default' | 'none';
  metadata?: Record<string, any>;
}

export type MessageImprover = (message: string, context?: any) => string | Promise<string>;

export interface ImprovementRegistry {
  [name: string]: MessageImprover;
}

export interface ServerConfig {
  host: string;
  port: number;
  cors?: boolean;
  corsOptions?: any;
}

export interface LogConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'simple';
  transports: string[];
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  services: {
    agent: boolean;
    api: boolean;
    registry: boolean;
  };
  details?: Record<string, any>;
}

export interface AgentStatus {
  agentId: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  messageCount: number;
  lastActivity: Date;
  endpoints: {
    agent: string;
    api: string;
    health: string;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: any;
  timestamp: Date;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: Date;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export interface WebSocketMessage {
  type: 'message' | 'status' | 'error' | 'ping' | 'pong';
  data: any;
  timestamp: Date;
  id?: string;
}

export interface ConversationMetadata {
  title?: string;
  tags?: string[];
  participants?: string[];
  context?: Record<string, any>;
  customFields?: Record<string, any>;
}

export interface MessageProcessingOptions {
  improveMessage?: boolean;
  improverName?: string;
  logMessage?: boolean;
  storeInDatabase?: boolean;
  validateContent?: boolean;
}

export interface AgentCapabilities {
  messageImprovement: boolean;
  conversationManagement: boolean;
  webSocketSupport: boolean;
  apiEndpoints: boolean;
  registryIntegration: boolean;
  customImprovers: boolean;
  logging: boolean;
  ssl: boolean;
} 