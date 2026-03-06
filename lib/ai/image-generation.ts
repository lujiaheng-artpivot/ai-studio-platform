// Infrastructure Layer - 图像生成客户端（多提供商）
import { getNanoBananaClient } from './nanobanana';

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance?: number;
  seed?: number;
  model?: string;
  numImages?: number;
}

export interface ImageGenerationResult {
  url: string;
  seed?: number;
  model: string;
  parameters: Record<string, unknown>;
  cost?: number;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`);
  }
}

export class ReplicateClient {
  private apiToken: string;
  private baseUrl = 'https://api.replicate.com/v1';

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.REPLICATE_API_TOKEN || '';
    if (!this.apiToken) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const {
      prompt,
      negativePrompt,
      width = 1024,
      height = 1024,
      steps = 28,
      guidance = 3.5,
      seed,
    } = options;

    const createResponse = await fetch(`${this.baseUrl}/predictions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-1.1-pro',
        input: {
          prompt,
          negative_prompt: negativePrompt,
          width,
          height,
          num_inference_steps: steps,
          guidance_scale: guidance,
          seed: seed || Math.floor(Math.random() * 1000000),
          output_format: 'png',
          output_quality: 95,
        },
      }),
    });

    const prediction = await parseJsonResponse<{
      status?: string;
      error?: string;
      output?: string[];
      input?: Record<string, unknown>;
      urls?: { get?: string };
    }>(createResponse);

    if (!createResponse.ok) {
      throw new Error(`Replicate API error: ${prediction.error || createResponse.statusText}`);
    }

    if (!prediction.urls?.get) {
      throw new Error('Replicate API error: missing status URL');
    }

    let result = prediction;
    const maxAttempts = 90;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (result.status === 'succeeded') break;
      if (result.status === 'failed' || result.status === 'canceled') {
        throw new Error(`Image generation failed: ${result.error || result.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      result = await parseJsonResponse<typeof result>(statusResponse);
    }

    if (result.status !== 'succeeded' || !result.output?.[0]) {
      throw new Error('Image generation timed out on Replicate');
    }

    return {
      url: result.output[0],
      seed: typeof result.input?.seed === 'number' ? result.input.seed : undefined,
      model: 'flux-1.1-pro',
      parameters: result.input || {},
      cost: 0.04,
    };
  }
}

export class FalClient {
  private apiKey: string;
  private baseUrl = 'https://fal.run/fal-ai';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FAL_KEY || '';
    if (!this.apiKey) {
      throw new Error('FAL_KEY is not configured');
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const {
      prompt,
      width = 1024,
      height = 1024,
      steps = 28,
      guidance = 3.5,
      seed,
    } = options;

    const response = await fetch(`${this.baseUrl}/flux-pro/v1.1`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: { width, height },
        num_inference_steps: steps,
        guidance_scale: guidance,
        seed: seed || Math.floor(Math.random() * 1000000),
        enable_safety_checker: false,
      }),
    });

    const result = await parseJsonResponse<{
      images?: Array<{ url?: string }>;
      seed?: number;
      error?: string;
    }>(response);

    if (!response.ok || !result.images?.[0]?.url) {
      throw new Error(`Fal.ai API error: ${result.error || response.statusText}`);
    }

    return {
      url: result.images[0].url,
      seed: result.seed,
      model: 'flux-pro-1.1',
      parameters: { prompt, width, height, steps, guidance },
      cost: 0.025,
    };
  }
}

export class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const { prompt, width = 1024, height = 1024 } = options;

    const size = width >= 1792 || height >= 1792 ? '1792x1024' : '1024x1024';

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'hd',
        style: 'vivid',
      }),
    });

    const result = await parseJsonResponse<{
      data?: Array<{ url?: string }>;
      error?: { message?: string };
    }>(response);

    if (!response.ok || !result.data?.[0]?.url) {
      throw new Error(`OpenAI API error: ${result.error?.message || response.statusText}`);
    }

    return {
      url: result.data[0].url,
      model: 'dall-e-3',
      parameters: { prompt, size, quality: 'hd' },
      cost: size === '1792x1024' ? 0.12 : 0.08,
    };
  }
}

export class NanoBananaAdapter {
  private client: ReturnType<typeof getNanoBananaClient>;

  constructor() {
    this.client = getNanoBananaClient();
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const { prompt, numImages = 1 } = options;

    const imageUrl = await this.client.generateAndWait({
      prompt,
      type: 'TEXTTOIAMGE',
      numImages,
    });

    return {
      url: imageUrl,
      model: 'nanobanana-pro',
      parameters: { prompt, numImages },
      cost: 0.02,
    };
  }
}

export class ImageGenerationClient {
  private provider: 'replicate' | 'fal' | 'openai' | 'nanobanana';
  private client: ReplicateClient | FalClient | OpenAIClient | NanoBananaAdapter;

  constructor(provider?: 'replicate' | 'fal' | 'openai' | 'nanobanana') {
    if (provider) {
      this.provider = provider;
    } else if (process.env.NANOBANANA_API_KEY) {
      this.provider = 'nanobanana';
    } else if (process.env.REPLICATE_API_TOKEN) {
      this.provider = 'replicate';
    } else if (process.env.FAL_KEY) {
      this.provider = 'fal';
    } else if (process.env.OPENAI_API_KEY) {
      this.provider = 'openai';
    } else {
      throw new Error('No image generation API key configured');
    }

    switch (this.provider) {
      case 'nanobanana':
        this.client = new NanoBananaAdapter();
        break;
      case 'replicate':
        this.client = new ReplicateClient();
        break;
      case 'fal':
        this.client = new FalClient();
        break;
      case 'openai':
        this.client = new OpenAIClient();
        break;
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    return this.client.generateImage(options);
  }

  getProvider(): string {
    return this.provider;
  }

  estimateCost(numImages: number): number {
    const costPerImage: Record<'nanobanana' | 'replicate' | 'fal' | 'openai', number> = {
      nanobanana: 0.02,
      replicate: 0.04,
      fal: 0.025,
      openai: 0.08,
    };

    return costPerImage[this.provider] * numImages;
  }
}

let imageClient: ImageGenerationClient | null = null;

export function getImageGenerationClient(
  provider?: 'replicate' | 'fal' | 'openai' | 'nanobanana'
): ImageGenerationClient {
  if (!imageClient || (provider && imageClient.getProvider() !== provider)) {
    imageClient = new ImageGenerationClient(provider);
  }
  return imageClient;
}
