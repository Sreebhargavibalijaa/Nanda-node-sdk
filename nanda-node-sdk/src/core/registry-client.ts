/**
 * Registry Client
 * Handles communication with the NANDA registry service
 */

import axios from 'axios';
import { AgentConfig, RegistryConfig } from '../types';
import { Logger } from './logger';

export class RegistryClient {
  private config: AgentConfig;
  private logger: Logger;
  private registryUrl: string;
  private isRegistered: boolean = false;

  constructor(config: AgentConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.registryUrl = config.registryUrl || 'https://chat.nanda-registry.com:6900';
  }

  /**
   * Register the agent with the registry
   */
  async register(): Promise<boolean> {
    try {
      this.logger.info(`Registering agent ${this.config.agentId} with registry at ${this.registryUrl}`);
      
      const registryData: RegistryConfig = {
        url: this.registryUrl,
        agentId: this.config.agentId,
        agentUrl: this.config.publicUrl || `http://localhost:${this.config.port}`,
        apiUrl: this.config.apiUrl || `http://localhost:${this.config.apiPort}`
      };

      const response = await axios.post(
        `${this.registryUrl}/register`,
        registryData,
        {
          timeout: 30000,
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        }
      );

      if (response.status === 200) {
        this.isRegistered = true;
        this.logger.registryConnection(this.registryUrl, true);
        this.logger.info(`Agent ${this.config.agentId} registered successfully`);
        return true;
      } else {
        this.logger.warn(`Registry registration failed with status ${response.status}: ${response.data}`);
        return false;
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          this.logger.warn(`Could not connect to registry at ${this.registryUrl}. Agent will continue without registration.`);
        } else if (error.response?.status === 400) {
          this.logger.warn(`Registry registration failed: ${error.response.data}`);
        } else {
          this.logger.error(`Registry connection error: ${error.message}`);
        }
      } else {
        this.logger.error(`Unexpected error during registry registration: ${error}`);
      }
      
      this.isRegistered = false;
      return false;
    }
  }

  /**
   * Unregister the agent from the registry
   */
  async unregister(): Promise<boolean> {
    try {
      if (!this.isRegistered) {
        this.logger.info('Agent not registered with registry');
        return true;
      }

      this.logger.info(`Unregistering agent ${this.config.agentId} from registry`);
      
      const response = await axios.delete(
        `${this.registryUrl}/register/${this.config.agentId}`,
        {
          timeout: 10000,
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200 || response.status === 404) {
        this.isRegistered = false;
        this.logger.info(`Agent ${this.config.agentId} unregistered successfully`);
        return true;
      } else {
        this.logger.warn(`Registry unregistration failed with status ${response.status}`);
        return false;
      }

    } catch (error) {
      this.logger.error(`Error unregistering from registry: ${error}`);
      return false;
    }
  }

  /**
   * Check if agent is registered
   */
  isAgentRegistered(): boolean {
    return this.isRegistered;
  }

  /**
   * Get registry status
   */
  getRegistryStatus() {
    return {
      url: this.registryUrl,
      registered: this.isRegistered,
      agentId: this.config.agentId
    };
  }

  /**
   * Update registry with new information
   */
  async updateRegistration(updates: Partial<RegistryConfig>): Promise<boolean> {
    try {
      if (!this.isRegistered) {
        this.logger.warn('Cannot update registration: agent not registered');
        return false;
      }

      this.logger.info(`Updating registry for agent ${this.config.agentId}`);
      
      const response = await axios.put(
        `${this.registryUrl}/register/${this.config.agentId}`,
        updates,
        {
          timeout: 15000,
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200) {
        this.logger.info(`Registry updated successfully for agent ${this.config.agentId}`);
        return true;
      } else {
        this.logger.warn(`Registry update failed with status ${response.status}`);
        return false;
      }

    } catch (error) {
      this.logger.error(`Error updating registry: ${error}`);
      return false;
    }
  }

  /**
   * Heartbeat to registry
   */
  async heartbeat(): Promise<boolean> {
    try {
      if (!this.isRegistered) {
        return false;
      }

      const response = await axios.post(
        `${this.registryUrl}/heartbeat/${this.config.agentId}`,
        {
          timestamp: new Date().toISOString(),
          status: 'alive'
        },
        {
          timeout: 5000,
          validateStatus: (status) => status < 500
        }
      );

      return response.status === 200;

    } catch (error) {
      this.logger.debug(`Heartbeat failed: ${error}`);
      return false;
    }
  }

  /**
   * Get registry URL
   */
  getRegistryUrl(): string {
    return this.registryUrl;
  }

  /**
   * Set registry URL
   */
  setRegistryUrl(url: string): void {
    this.registryUrl = url;
    this.logger.info(`Registry URL updated to: ${url}`);
  }
} 