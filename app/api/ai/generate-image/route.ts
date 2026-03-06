import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getImageGenerationClient, type ImageGenerationOptions } from '@/lib/ai/image-generation';
import { getGeminiClient } from '@/lib/ai/gemini';
import { put } from '@vercel/blob';

function clampDimension(value: unknown, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(256, Math.min(2048, Math.round(number)));
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const style = typeof body.style === 'string' ? body.style.trim() : undefined;
    const optimizePrompt = Boolean(body.optimizePrompt ?? true);
    const width = clampDimension(body.width, 1024);
    const height = clampDimension(body.height, 1024);
    const projectId = typeof body.projectId === 'string' ? body.projectId : undefined;
    const sceneId = typeof body.sceneId === 'string' ? body.sceneId : undefined;
    const provider = typeof body.provider === 'string' ? body.provider : undefined;
    const selectedProvider =
      provider === 'replicate' ||
      provider === 'fal' ||
      provider === 'openai' ||
      provider === 'nanobanana'
        ? provider
        : undefined;

    if (!prompt) {
      return NextResponse.json({ success: false, error: '缺少提示词' }, { status: 400 });
    }

    let finalPrompt = prompt;

    if (optimizePrompt) {
      const gemini = getGeminiClient();
      finalPrompt = await gemini.optimizePrompt(prompt, style);
    }

    const imageClient = getImageGenerationClient(selectedProvider);

    const imageOptions: ImageGenerationOptions = {
      prompt: finalPrompt,
      width,
      height,
    };

    const startTime = Date.now();
    const result = await imageClient.generateImage(imageOptions);
    const generationTime = (Date.now() - startTime) / 1000;

    const imageResponse = await fetch(result.url);
    if (!imageResponse.ok) {
      throw new Error(`图像下载失败: HTTP ${imageResponse.status}`);
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const imageBlob = await imageResponse.blob();

    const filename = `${userId}/${projectId || 'temp'}/${sceneId || Date.now()}.png`;
    const blob = await put(filename, imageBlob, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: blob.url,
        originalUrl: result.url,
        prompt: finalPrompt,
        originalPrompt: prompt,
        seed: result.seed,
        model: result.model,
        provider: imageClient.getProvider(),
        parameters: result.parameters,
      },
      meta: {
        computeSecondsUsed: Math.ceil(generationTime),
        estimatedCost: result.cost,
      },
    });
  } catch (error: unknown) {
    console.error('❌ 图像生成错误:', error);

    const message = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        success: false,
        error: '生成失败',
        message,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
