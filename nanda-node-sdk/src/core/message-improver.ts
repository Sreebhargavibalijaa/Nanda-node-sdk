/**
 * Message Improvement System
 * Handles custom message improvement logic registration and execution
 */

import { MessageImprover as MessageImproverType, MessageImprovementResult, ImprovementRegistry } from '../types';
import { defaultLogger } from './logger';

export class MessageImprover {
  private improvers: ImprovementRegistry = {};
  private activeImprover: string = 'default';
  private logger = defaultLogger;

  constructor() {
    this.registerDefaultImprovers();
  }

  /**
   * Register a custom message improver function
   */
  register(name: string, improver: MessageImproverType): void {
    if (this.improvers[name]) {
      this.logger.warn(`Overwriting existing improver: ${name}`);
    }
    
    this.improvers[name] = improver;
    this.logger.info(`Message improver registered: ${name}`);
  }

  /**
   * Set the active improver by name
   */
  setActive(name: string): boolean {
    if (!this.improvers[name]) {
      this.logger.error(`Improver not found: ${name}`);
      return false;
    }
    
    this.activeImprover = name;
    this.logger.info(`Active improver set to: ${name}`);
    return true;
  }

  /**
   * Get the active improver name
   */
  getActive(): string {
    return this.activeImprover;
  }

  /**
   * List all registered improvers
   */
  list(): string[] {
    return Object.keys(this.improvers);
  }

  /**
   * Check if an improver exists
   */
  exists(name: string): boolean {
    return name in this.improvers;
  }

  /**
   * Remove an improver
   */
  remove(name: string): boolean {
    if (name === 'default') {
      this.logger.warn('Cannot remove default improver');
      return false;
    }
    
    if (this.activeImprover === name) {
      this.activeImprover = 'default';
    }
    
    delete this.improvers[name];
    this.logger.info(`Improver removed: ${name}`);
    return true;
  }

  /**
   * Improve a message using the active improver
   */
  async improve(message: string, context?: any): Promise<MessageImprovementResult> {
    const improver = this.improvers[this.activeImprover];
    
    if (!improver) {
      this.logger.error(`Active improver not found: ${this.activeImprover}`);
      return {
        originalMessage: message,
        improvedMessage: message,
        improvementType: 'none',
        metadata: { error: 'Improver not found' }
      };
    }

    try {
      const improvedMessage = await improver(message, context);
      
      return {
        originalMessage: message,
        improvedMessage,
        improvementType: this.activeImprover === 'default' ? 'default' : 'custom',
        metadata: { improver: this.activeImprover, context }
      };
    } catch (error) {
      this.logger.error(`Error in message improvement: ${error}`);
      return {
        originalMessage: message,
        improvedMessage: message,
        improvementType: 'none',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Improve a message using a specific improver
   */
  async improveWith(name: string, message: string, context?: any): Promise<MessageImprovementResult> {
    const improver = this.improvers[name];
    
    if (!improver) {
      this.logger.error(`Improver not found: ${name}`);
      return {
        originalMessage: message,
        improvedMessage: message,
        improvementType: 'none',
        metadata: { error: 'Improver not found' }
      };
    }

    try {
      const improvedMessage = await improver(message, context);
      
      return {
        originalMessage: message,
        improvedMessage,
        improvementType: name === 'default' ? 'default' : 'custom',
        metadata: { improver: name, context }
      };
    } catch (error) {
      this.logger.error(`Error in message improvement with ${name}: ${error}`);
      return {
        originalMessage: message,
        improvedMessage: message,
        improvementType: 'none',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Register default improvers
   */
  private registerDefaultImprovers(): void {
    // Default improver that does basic text enhancement
    this.register('default', async (message: string): Promise<string> => {
      // Basic improvements: capitalize first letter, add punctuation if missing
      let improved = message.trim();
      
      if (improved.length === 0) return improved;
      
      // Capitalize first letter
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      
      // Add period if no punctuation at end
      if (!/[.!?]$/.test(improved)) {
        improved += '.';
      }
      
      return improved;
    });

    // Professional improver for business communication
    this.register('professional', async (message: string): Promise<string> => {
      let improved = message.trim();
      
      if (improved.length === 0) return improved;
      
      // Capitalize first letter
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      
      // Replace informal words with professional alternatives
      const replacements: Record<string, string> = {
        'hi': 'Hello',
        'hey': 'Hello',
        'thanks': 'Thank you',
        'thx': 'Thank you',
        'u': 'you',
        'ur': 'your',
        'r': 'are',
        'btw': 'by the way',
        'asap': 'as soon as possible',
        'fyi': 'for your information'
      };
      
      Object.entries(replacements).forEach(([informal, formal]) => {
        const regex = new RegExp(`\\b${informal}\\b`, 'gi');
        improved = improved.replace(regex, formal);
      });
      
      // Add period if no punctuation at end
      if (!/[.!?]$/.test(improved)) {
        improved += '.';
      }
      
      return improved;
    });

    // Creative improver for engaging content
    this.register('creative', async (message: string): Promise<string> => {
      let improved = message.trim();
      
      if (improved.length === 0) return improved;
      
      // Capitalize first letter
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      
      // Add engaging elements
      const engagingStarters = [
        'Exciting news: ',
        'Here\'s something interesting: ',
        'You won\'t believe this: ',
        'Get ready for: ',
        'Amazing discovery: '
      ];
      
      // Only add starter if message is short and doesn't already have one
      if (improved.length < 100 && !improved.includes(':')) {
        const starter = engagingStarters[Math.floor(Math.random() * engagingStarters.length)];
        improved = starter + improved;
      }
      
      // Add exclamation if it's an exciting message
      if (improved.toLowerCase().includes('amazing') || 
          improved.toLowerCase().includes('exciting') ||
          improved.toLowerCase().includes('incredible')) {
        improved = improved.replace(/\.$/, '!');
      }
      
      // Add period if no punctuation at end
      if (!/[.!?]$/.test(improved)) {
        improved += '.';
      }
      
      return improved;
    });

    this.logger.info('Default message improvers registered');
  }
}

// Export singleton instance
export const messageImprover = new MessageImprover(); 