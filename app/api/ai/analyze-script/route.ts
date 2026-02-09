import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { script } = await req.json();

    if (!script || script.trim().length === 0) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    // TODO: Check user's compute seconds balance
    // TODO: Deduct compute seconds after successful analysis

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this film script and extract cinematic style information. Return a JSON object with this structure:
{
  "styles": [
    {
      "name": "Style name",
      "artMovements": ["movement1", "movement2"],
      "visualPrompt": "Detailed visual description for image generation",
      "lightingDescription": "Lighting style description"
    }
  ],
  "characters": [
    {
      "name": "Character name",
      "visualDescription": "Detailed physical appearance"
    }
  ]
}

Script:
${script}

Provide 2-3 distinct visual styles and extract all main characters.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // TODO: Save analysis to database
    // TODO: Deduct 5 compute seconds from user's balance

    return NextResponse.json({ 
      success: true, 
      analysis,
      computeUsed: 5 
    });

  } catch (error: any) {
    console.error('Script analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze script' },
      { status: 500 }
    );
  }
}
