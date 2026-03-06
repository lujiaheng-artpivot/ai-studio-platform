import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getNanoBananaClient } from '@/lib/ai/nanobanana';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const type = body.type === 'IMAGETOIAMGE' ? 'IMAGETOIAMGE' : 'TEXTTOIAMGE';
    const numImages = typeof body.numImages === 'number' ? Math.min(Math.max(body.numImages, 1), 4) : 1;
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((url: unknown): url is string => typeof url === 'string')
      : undefined;
    const watermark = typeof body.watermark === 'string' ? body.watermark : undefined;
    const projectId = typeof body.projectId === 'string' ? body.projectId : undefined;
    const sceneId = typeof body.sceneId === 'string' ? body.sceneId : undefined;

    if (!prompt) {
      return NextResponse.json({ success: false, error: '缺少提示词' }, { status: 400 });
    }

    const nanoBanana = getNanoBananaClient();
    const startTime = Date.now();

    const imageUrl = await nanoBanana.generateAndWait({
      prompt,
      type,
      numImages,
      imageUrls,
      watermark,
    });

    const generationTime = (Date.now() - startTime) / 1000;

    let blobUrl = imageUrl;
    try {
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        const filename = `${userId}/${projectId || 'nanobanana'}/${sceneId || Date.now()}.png`;
        const blob = await put(filename, imageBlob, {
          access: 'public',
          contentType: imageResponse.headers.get('content-type') || 'image/png',
          addRandomSuffix: true,
        });

        blobUrl = blob.url;
      }
    } catch (uploadError) {
      console.warn('⚠️ 上传到 Blob 失败，使用原始 URL:', uploadError);
    }

    return NextResponse.json({
      success: true,
      data: {
        url: blobUrl,
        originalUrl: imageUrl,
        prompt,
        provider: 'nanobanana',
        model: 'nanobanana-pro',
      },
      meta: {
        computeSecondsUsed: Math.ceil(generationTime),
        generationTime,
      },
    });
  } catch (error: unknown) {
    console.error('❌ NanoBanana 生成错误:', error);

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

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ success: false, error: '缺少 taskId' }, { status: 400 });
    }

    const nanoBanana = getNanoBananaClient();
    const status = await nanoBanana.getTaskStatus(taskId);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: unknown) {
    console.error('❌ 查询任务状态错误:', error);
    const message = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        success: false,
        error: '查询失败',
        message,
      },
      { status: 500 }
    );
  }
}
