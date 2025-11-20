export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface ChatResponse {
  message: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface IAIProvider {
  name: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
  streamChat?(request: ChatRequest): AsyncGenerator<string, void, unknown>;
  isAvailable(): Promise<boolean>;
}

export class ClaudeProvider implements IAIProvider {
  name = 'Claude';
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'claude-sonnet-4-5-20250929';
    this.baseURL = config.baseURL || 'https://api.anthropic.com/v1';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Separate system messages from conversation
      const systemMessages = request.messages
        .filter((m) => m.role === 'system')
        .map((m) => m.content)
        .join('\n\n');

      const conversationMessages = request.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const systemPrompt = request.systemPrompt ? `${request.systemPrompt}\n\n${systemMessages}` : systemMessages;

      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: request.model || this.model,
          max_tokens: request.maxTokens || 1024,
          temperature: request.temperature || 0.7,
          system: systemPrompt,
          messages: conversationMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      return {
        message: data.content[0].text,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('Claude provider error:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });
      return response.ok || response.status === 400; // 400 = valid auth, invalid request
    } catch {
      return false;
    }
  }
}

export class OpenAIProvider implements IAIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4-turbo-preview';
    this.baseURL = config.baseURL || 'https://api.openai.com/v1';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // OpenAI handles system messages in the messages array
      const allMessages = [...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []), ...request.messages];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: allMessages,
          max_tokens: request.maxTokens || 1024,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      return {
        message: data.choices[0].message.content,
        usage: {
          inputTokens: data.usage.prompt_tokens,
          outputTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('OpenAI provider error:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class GeminiProvider implements IAIProvider {
  name = 'Gemini';
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-pro';
    this.baseURL = config.baseURL || 'https://generativelanguage.googleapis.com/v1';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Gemini format is different
      const contents = request.messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const systemInstruction =
        request.systemPrompt ||
        request.messages
          .filter((m) => m.role === 'system')
          .map((m) => m.content)
          .join('\n');

      const response = await fetch(`${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 1024,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      return {
        message: data.candidates[0].content.parts[0].text,
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount || 0,
          outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model: this.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('Gemini provider error:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models?key=${this.apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class OllamaProvider implements IAIProvider {
  name = 'Ollama';
  private model: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    this.model = config.model || 'llama3.1';
    this.baseURL = config.baseURL || 'http://localhost:11434';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const allMessages = [...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []), ...request.messages];

      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: allMessages,
          stream: false,
          options: {
            temperature: request.temperature || 0.7,
            num_predict: request.maxTokens || 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        message: data.message.content,
        usage: {
          inputTokens: data.prompt_eval_count || 0,
          outputTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('Ollama provider error:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
export class DeepSeekProvider implements IAIProvider {
  name = 'DeepSeek';
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'deepseek-chat';
    this.baseURL = config.baseURL || 'https://api.deepseek.com/v1';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // DeepSeek uses OpenAI-compatible API
      const allMessages = [...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []), ...request.messages];
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: allMessages,
          max_tokens: request.maxTokens || 1024,
          temperature: request.temperature || 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${error}`);
      }

      const data = await response.json();

      return {
        message: data.choices[0].message.content,
        usage: {
          inputTokens: data.usage?.prompt_tokens || 0,
          outputTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('DeepSeek provider error:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Update the ProviderType to include deepseek
export type ProviderType = 'claude' | 'openai' | 'gemini' | 'ollama' | 'deepseek';

// Update the AIProviderFactory to include DeepSeek
export class AIProviderFactory {
  static create(type: ProviderType, config: AIProviderConfig): IAIProvider {
    switch (type) {
      case 'claude':
        return new ClaudeProvider(config);
      case 'openai':
        return new OpenAIProvider(config);
      case 'gemini':
        return new GeminiProvider(config);
      case 'ollama':
        return new OllamaProvider(config);
      case 'deepseek':
        return new DeepSeekProvider(config);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }

  static async detectAvailableProviders(configs: Record<ProviderType, AIProviderConfig>): Promise<ProviderType[]> {
    const available: ProviderType[] = [];

    for (const [type, config] of Object.entries(configs)) {
      try {
        const provider = this.create(type as ProviderType, config);
        if (await provider.isAvailable()) {
          available.push(type as ProviderType);
        }
      } catch (error) {
        console.log(`Provider ${type} not available:`, error);
      }
    }

    return available;
  }
}

export class AIChatService {
  private provider: IAIProvider;
  private currentProviderType: ProviderType;

  constructor(providerType: ProviderType, config: AIProviderConfig) {
    this.provider = AIProviderFactory.create(providerType, config);
    this.currentProviderType = providerType;
  }

  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatResponse> {
    return this.provider.chat({
      messages,
      systemPrompt,
    });
  }

  async switchProvider(providerType: ProviderType, config: AIProviderConfig): Promise<void> {
    this.provider = AIProviderFactory.create(providerType, config);
    this.currentProviderType = providerType;

    // Verify it's available
    const available = await this.provider.isAvailable();
    if (!available) {
      throw new Error(`Provider ${providerType} is not available`);
    }
  }

  getCurrentProvider(): string {
    return this.provider.name;
  }

  async isHealthy(): Promise<boolean> {
    return this.provider.isAvailable();
  }
}
