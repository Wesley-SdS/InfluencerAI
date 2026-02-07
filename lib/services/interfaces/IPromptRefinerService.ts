/**
 * Interface para serviços de refinamento de prompts
 * Princípio: Strategy Pattern + Interface Segregation Principle (ISP)
 */
export interface IPromptRefinerService {
  refine(prompt: string, type: 'image' | 'video'): Promise<string>
}

export interface PromptRefinerConfig {
  apiKey: string
  model?: string
}
