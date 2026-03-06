import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGeminiClient } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();
    const sceneDescription = typeof body.sceneDescription === 'string' ? body.sceneDescription.trim() : '';

    if (!sceneDescription) {
      return NextResponse.json({ success: false, error: '请输入场景描述' }, { status: 400 });
    }

    const gemini = getGeminiClient();
    const startTime = Date.now();
    const shotPlan = await gemini.generateShotPlan(sceneDescription);
    const computeTime = (Date.now() - startTime) / 1000;

    return NextResponse.json({
      success: true,
      data: shotPlan,
      meta: {
        computeSecondsUsed: Math.ceil(computeTime),
        model: 'gemini-2.0-flash-thinking-exp-1219',
      },
    });
  } catch (error: unknown) {
    console.error('❌ 镜头计划生成错误:', error);
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
