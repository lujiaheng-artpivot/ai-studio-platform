import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getNanoBananaClient } from '@/lib/ai/nanobanana';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
    }

    const nanoBanana = getNanoBananaClient();
    const credits = await nanoBanana.getAccountCredits();

    return NextResponse.json({
      success: true,
      data: {
        credits,
        provider: 'nanobanana',
      },
    });
  } catch (error: unknown) {
    console.error('❌ 查询余额错误:', error);
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
