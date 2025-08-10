/**
 * NANDA Node.js SDK
 * Main entry point for the NANDA Base Agent SDK
 */

// Core classes
export { NANDA } from './core/nanda';
export { AgentBridge } from './core/agent-bridge';
export { ApiServer } from './core/api-server';
export { RegistryClient } from './core/registry-client';
export { MessageImprover } from './core/message-improver';
export { Logger } from './core/logger';

// Types
export * from './types';

// Utilities
export { defaultLogger } from './core/logger';
export { messageImprover } from './core/message-improver';

// Version
export const VERSION = '1.0.0';
export const SDK_NAME = 'nanda-node-sdk';

// Default configuration
export const DEFAULT_CONFIG = {
  port: 6000,
  apiPort: 6001,
  ssl: false,
  logLevel: 'info' as const,
  registryUrl: 'https://chat.nanda-registry.com:6900'
};

// Quick start function
export function createNANDA(config: any) {
  // Dynamic import for runtime usage
  return import('./core/nanda').then(module => new module.NANDA(config));
}

// Export default
export default {
  VERSION,
  SDK_NAME,
  DEFAULT_CONFIG
}; 