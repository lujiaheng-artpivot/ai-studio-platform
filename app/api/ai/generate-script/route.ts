import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGeminiClient } from '@/lib/ai/gemini';
import { DEFAULT_SCRIPT_TYPE, isScriptType } from '@/lib/script-types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const body = await req.json();
    const idea = typeof body.idea === 'string' ? body.idea.trim() : '';
    const genre = typeof body.genre === 'string' ? body.genre.trim() : 'drama';
    const scriptType = isScriptType(body.scriptType) ? body.scriptType : DEFAULT_SCRIPT_TYPE;

    if (!idea) {
      return NextResponse.json({ success: false, error: '请先输入故事想法' }, { status: 400 });
    }

    const gemini = getGeminiClient();
    const startTime = Date.now();
    const draft = await gemini.generateScriptDraft(idea, genre, scriptType);
    const computeTime = (Date.now() - startTime) / 1000;

    return NextResponse.json({
      success: true,
      data: {
        ...draft,
        scriptType,
      },
      meta: {
        computeSecondsUsed: Math.ceil(computeTime),
        model: 'gemini-2.0-flash-thinking-exp-1219',
      },
    });
  } catch (error: unknown) {
    console.error('❌ 剧本草稿生成错误:', error);
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
