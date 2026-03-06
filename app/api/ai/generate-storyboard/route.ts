import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GEMINI_TEXT_MODEL, getGeminiClient, type ScriptAnalysisResult } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();
    const script = typeof body.script === 'string' ? body.script.trim() : '';
    const styleAnalysis = body.styleAnalysis as ScriptAnalysisResult | undefined;
    const projectId = typeof body.projectId === 'string' ? body.projectId : undefined;

    if (!script || !styleAnalysis) {
      return NextResponse.json(
        { success: false, error: '缺少必需参数：script 和 styleAnalysis' },
        { status: 400 }
      );
    }

    console.log('🎬 开始生成故事板...');
    console.log('👤 用户 ID:', userId);
    console.log('📁 项目 ID:', projectId || 'n/a');

    const gemini = getGeminiClient();
    const startTime = Date.now();

    const storyboard = await gemini.generateStoryboard(script, styleAnalysis);
    const computeTime = (Date.now() - startTime) / 1000;

    return NextResponse.json({
      success: true,
      data: storyboard,
      meta: {
        computeSecondsUsed: Math.ceil(computeTime),
        model: GEMINI_TEXT_MODEL,
        shots: storyboard.shots?.length || 0,
      },
    });
  } catch (error: unknown) {
    console.error('❌ 故事板生成错误:', error);

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
