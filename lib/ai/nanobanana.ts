// NanoBanana API Client - Professional AI Image Generation

export interface NanoBananaOptions {
  prompt: string;
  type?: 'TEXTTOIAMGE' | 'IMAGETOIAMGE';
  numImages?: number;
  imageUrls?: string[];
  watermark?: string;
  callBackUrl?: string;
}

export interface NanoBananaResult {
  taskId: string;
  status: 'pending' | 'generating' | 'success' | 'failed';
  resultImageUrl?: string;
  errorMessage?: string;
}

export class NanoBananaClient {
  private apiKey: string;
  private baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NANOBANANA_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('NANOBANANA_API_KEY is not configured');
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let payload: T;

    try {
      payload = JSON.parse(text) as T;
    } catch {
      throw new Error(`NanoBanana API returned non-JSON response: ${text.slice(0, 160)}`);
    }

    return payload;
  }

  async generateImage(options: NanoBananaOptions): Promise<string> {
    const {
      prompt,
      type = 'TEXTTOIAMGE',
      numImages = 1,
      imageUrls,
      watermark,
      callBackUrl,
    } = options;

    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        type,
        numImages,
        imageUrls,
        watermark,
        callBackUrl,
      }),
    });

    const result = await this.parseResponse<{ code?: number; msg?: string; data?: { taskId?: string } }>(response);

    if (!response.ok) {
      throw new Error(`NanoBanana API error: ${result.msg || response.statusText}`);
    }

    if (result.code !== 200 || !result.data?.taskId) {
      throw new Error(`NanoBanana API error: ${result.msg || 'taskId missing'}`);
    }

    return result.data.taskId;
  }

  async getTaskStatus(taskId: string): Promise<NanoBananaResult> {
    const response = await fetch(`${this.baseUrl}/record-info?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const result = await this.parseResponse<{
      successFlag?: number;
      response?: { resultImageUrl?: string };
      errorMessage?: string;
      msg?: string;
      data?: {
        successFlag?: number;
        response?: { resultImageUrl?: string };
        errorMessage?: string;
      };
    }>(response);

    if (!response.ok) {
      throw new Error(`NanoBanana API error: ${result.msg || response.statusText}`);
    }

    const successFlag = result.successFlag ?? result.data?.successFlag;
    const responseData = result.response ?? result.data?.response;
    const errorMessage = result.errorMessage ?? result.data?.errorMessage;

    const statusMap: Record<number, 'pending' | 'generating' | 'success' | 'failed'> = {
      0: 'generating',
      1: 'success',
      2: 'failed',
      3: 'failed',
    };

    return {
      taskId,
      status: typeof successFlag === 'number' ? statusMap[successFlag] || 'pending' : 'pending',
      resultImageUrl: responseData?.resultImageUrl,
      errorMessage,
    };
  }

  async waitForCompletion(
    taskId: string,
    maxWaitTime: number = 300000,
    pollInterval: number = 3000
  ): Promise<NanoBananaResult> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getTaskStatus(taskId);

      if (status.status === 'success') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`图像生成失败: ${status.errorMessage || '未知错误'}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('图像生成超时，请稍后重试');
  }

  async generateAndWait(options: NanoBananaOptions): Promise<string> {
    const taskId = await this.generateImage(options);
    const result = await this.waitForCompletion(taskId);

    if (!result.resultImageUrl) {
      throw new Error('未获取到图像 URL');
    }

    return result.resultImageUrl;
  }

  async getAccountCredits(): Promise<number> {
    const response = await fetch('https://api.nanobananaapi.ai/api/v1/common/get-account-credits', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const result = await this.parseResponse<{ data?: { credits?: number }; msg?: string }>(response);

    if (!response.ok) {
      throw new Error(`NanoBanana API error: ${result.msg || response.statusText}`);
    }

    return result.data?.credits || 0;
  }
}

let nanoBananaClient: NanoBananaClient | null = null;

export function getNanoBananaClient(): NanoBananaClient {
  if (!nanoBananaClient) {
    nanoBananaClient = new NanoBananaClient();
  }
  return nanoBananaClient;
}
