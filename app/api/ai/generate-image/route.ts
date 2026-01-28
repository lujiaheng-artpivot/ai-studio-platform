import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // TODO: Check user's compute seconds balance
    // TODO: Check user's subscription tier for resolution limits

    // Call Google Gemini API for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          number_of_images: 1,
          aspect_ratio: '16:9',
          safety_filter_level: 'block_some',
          person_generation: 'allow_all'
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Image generation failed');
    }

    const data = await response.json();
    
    // The response contains base64 encoded image
    const imageData = data.generatedImages[0].image;
    const imageUrl = `data:image/png;base64,${imageData}`;

    // TODO: Upload to cloud storage (S3, Cloudinary, etc.)
    // TODO: Save generation record to database
    // TODO: Deduct compute seconds based on resolution (15 for 1080p, 30 for 4K)

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      computeUsed: 15 
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
