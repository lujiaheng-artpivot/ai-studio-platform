import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GEMINI_TEXT_MODEL, getGeminiClient } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();
    const script = typeof body.script === 'string' ? body.script.trim() : '';
    const projectId = typeof body.projectId === 'string' ? body.projectId : undefined;

    if (!script) {
      return NextResponse.json({ success: false, error: '剧本内容不能为空' }, { status: 400 });
    }

    if (script.length > 20000) {
      return NextResponse.json({ success: false, error: '剧本过长，请控制在 20,000 字符以内' }, { status: 400 });
    }

    console.log('🎬 开始分析剧本...');
    console.log('📝 剧本长度:', script.length, '字符');
    console.log('👤 用户 ID:', userId);
    console.log('📁 项目 ID:', projectId || 'n/a');

    const gemini = getGeminiClient();
    const startTime = Date.now();

    const styleAnalysis = await gemini.analyzeScript(script);

    const computeTime = (Date.now() - startTime) / 1000;

    return NextResponse.json({
      success: true,
      data: styleAnalysis,
      meta: {
        computeSecondsUsed: Math.ceil(computeTime),
        model: GEMINI_TEXT_MODEL,
      },
    });
  } catch (error: unknown) {
    console.error('❌ 剧本分析错误:', error);

    const message = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        success: false,
        error: '分析失败',
        message,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
