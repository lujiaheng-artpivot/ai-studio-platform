// Infrastructure Layer - Gemini 客户端（结构化输出 + 容错解析）

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { getGeminiApiKey } from '@/lib/config';
import { getScriptTypeOption, type ScriptType } from '@/lib/script-types';

export const GEMINI_TEXT_MODEL = 'gemini-3.1-pro-preview';

export interface ScriptAnalysisResult {
  styles?: Array<{
    name?: string;
    description?: string;
    artMovements?: string[];
    visualPrompt?: string;
    lightingDescription?: string;
    cameraWork?: string;
    references?: string[];
  }>;
  characters?: Array<{
    name?: string;
    description?: string;
    role?: string;
    visualDescription?: string;
    personality?: string[];
    arc?: string;
  }>;
  scenes?: Array<{
    sceneNumber?: number;
    location?: string;
    timeOfDay?: string;
    description?: string;
    mood?: string;
    characters?: string[];
    keyActions?: string[];
    visualPrompt?: string;
  }>;
  overallTone?: string;
  visualThemes?: string[];
  colorPalette?: {
    primary?: string[];
    secondary?: string[];
    accent?: string[];
    mood?: string;
  };
}

export interface StoryboardResult {
  shots?: Array<{
    shotNumber?: number;
    sceneNumber?: number;
    shotType?: string;
    cameraAngle?: string;
    cameraMovement?: string;
    description?: string;
    dialogue?: string;
    duration?: number;
    visualPrompt?: string;
    notes?: string;
  }>;
  totalDuration?: number;
}

export interface ScriptDraftResult {
  title: string;
  genre: string;
  logline: string;
  synopsis: string;
  screenplay: string;
}

function getScriptTypeInstruction(type: ScriptType): string {
  switch (type) {
    case 'high_concept':
      return `
- 叙事要求：一句话可讲清核心设定（What If），并且冲突清晰。
- 节奏要求：3幕结构，前15%触发激励事件，中段反转，结尾升级对抗。
- 画面要求：场面调度具备商业大片视觉冲击。`;
    case 'micro_film':
      return `
- 叙事要求：总时长按3-5分钟短片设计，聚焦一个情绪主题。
- 节奏要求：快速建立关系，在中后段给出反转或揭示。
- 画面要求：场景精简、预算可控，但镜头要有情绪记忆点。`;
    case 'commercial':
      return `
- 叙事要求：围绕品牌主张构建“问题-转折-解决”结构。
- 节奏要求：每一场戏都服务传播目标，结尾有可复用口号或品牌金句。
- 画面要求：强调视觉锤（可复述的强记忆画面）和传播点。`;
    case 'cannes':
    default:
      return `
- 叙事要求：强调文学性与潜台词，可使用留白和隐喻。
- 节奏要求：允许慢节奏铺陈，但关键转折必须成立。
- 画面要求：动作描写具备诗意，场景与人物心理形成互文。`;
  }
}

export interface ShotPlanResult {
  sceneSummary: string;
  shots: Array<{
    shot: number;
    type: string;
    camera: string;
    durationSec: number;
    description: string;
    notes?: string;
  }>;
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey?: string) {
    const key = apiKey || getGeminiApiKey();
    if (!key) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY or GOOGLE_GEMINI_API_KEY.');
    }

    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
    });
  }

  private sanitizeJsonText(raw: string): string {
    const trimmed = raw.trim();
    const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return fenced[1].trim();
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return trimmed.slice(firstBrace, lastBrace + 1).trim();
    }

    throw new Error('Failed to locate JSON object in model response');
  }

  private async requestText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  }

  private async requestJson<T>(prompt: string): Promise<T> {
    const text = await this.requestText(prompt);
    const sanitized = this.sanitizeJsonText(text);

    try {
      return JSON.parse(sanitized) as T;
    } catch (error) {
      throw new Error(`Failed to parse model JSON output: ${(error as Error).message}`);
    }
  }

  async analyzeScript(script: string): Promise<ScriptAnalysisResult> {
    const prompt = `你是一位专业电影制作顾问。请分析以下剧本并输出 JSON。

剧本：
${script}

输出 JSON 结构：
{
  "styles": [{
    "name": "风格名称",
    "description": "风格描述",
    "artMovements": ["艺术运动"],
    "visualPrompt": "英文视觉提示词",
    "lightingDescription": "灯光描述",
    "cameraWork": "镜头语言",
    "references": ["参考电影或导演"]
  }],
  "characters": [{
    "name": "角色名",
    "description": "角色描述",
    "role": "protagonist/antagonist/supporting/minor",
    "visualDescription": "外观描述",
    "personality": ["性格"],
    "arc": "角色弧线"
  }],
  "scenes": [{
    "sceneNumber": 1,
    "location": "场景地点",
    "timeOfDay": "dawn/day/dusk/night",
    "description": "场景描述",
    "mood": "氛围",
    "characters": ["角色"],
    "keyActions": ["关键动作"],
    "visualPrompt": "英文视觉提示词"
  }],
  "overallTone": "整体基调",
  "visualThemes": ["视觉主题"],
  "colorPalette": {
    "primary": ["主色"],
    "secondary": ["辅色"],
    "accent": ["强调色"],
    "mood": "色彩情绪"
  }
}

要求：
1. 仅输出 JSON。
2. visualPrompt 必须是英文。
3. 不要输出 Markdown。`;

    return this.requestJson<ScriptAnalysisResult>(prompt);
  }

  async generateStoryboard(script: string, styleAnalysis: ScriptAnalysisResult): Promise<StoryboardResult> {
    const prompt = `你是一位资深分镜导演。基于剧本和风格分析输出分镜 JSON。

剧本：
${script}

风格分析：
${JSON.stringify(styleAnalysis, null, 2)}

输出 JSON：
{
  "shots": [{
    "shotNumber": 1,
    "sceneNumber": 1,
    "shotType": "ECU/CU/MCU/MS/MWS/WS/EWS/OTS/POV",
    "cameraAngle": "eye-level/high-angle/low-angle/birds-eye/dutch-angle/overhead",
    "cameraMovement": "static/pan/tilt/dolly/tracking/crane/handheld/steadicam",
    "description": "镜头描述",
    "dialogue": "对白",
    "duration": 4,
    "visualPrompt": "英文提示词",
    "notes": "导演备注"
  }],
  "totalDuration": 120
}

要求：
1. 仅输出 JSON。
2. 至少输出 6 个镜头。
3. visualPrompt 必须是英文。`;

    return this.requestJson<StoryboardResult>(prompt);
  }

  async generateScriptDraft(idea: string, genre: string, scriptType: ScriptType): Promise<ScriptDraftResult> {
    const typeMeta = getScriptTypeOption(scriptType);
    const typeInstruction = getScriptTypeInstruction(scriptType);
    const prompt = `你是专业编剧。请根据用户创意生成可拍摄的短片剧本草稿。

剧本类型：${typeMeta.label}
题材偏好：${genre}
创意想法：${idea}

类型策略：
${typeInstruction}

输出 JSON：
{
  "title": "片名",
  "genre": "题材",
  "logline": "一句话梗概",
  "synopsis": "100-180字剧情简介",
  "screenplay": "标准剧本文本（包含场景标题、动作、对白）"
}

要求：
1. 只输出 JSON，不要 Markdown。
2. screenplay 使用标准格式：INT./EXT. + 场景 + 时间。
3. 内容中文输出。
4. 内容必须体现所选剧本类型的叙事策略和风格。`;

    return this.requestJson<ScriptDraftResult>(prompt);
  }

  async generateShotPlan(sceneDescription: string): Promise<ShotPlanResult> {
    const prompt = `你是电影导演。根据场景描述输出可拍摄镜头计划。

场景描述：
${sceneDescription}

输出 JSON：
{
  "sceneSummary": "场景总结",
  "shots": [{
    "shot": 1,
    "type": "镜头类型",
    "camera": "机位与运动",
    "durationSec": 4,
    "description": "镜头内容",
    "notes": "执行备注"
  }]
}

要求：
1. 只输出 JSON。
2. 输出 6-12 个镜头。
3. 镜头顺序具备叙事连贯性。`;

    return this.requestJson<ShotPlanResult>(prompt);
  }

  async generateCharacterPrompt(character: Record<string, unknown>, style: Record<string, unknown>): Promise<string> {
    const prompt = `基于角色和电影风格，生成英文角色视觉提示词。

角色：
${JSON.stringify(character, null, 2)}

风格：
${JSON.stringify(style, null, 2)}

要求：
1. 英文输出。
2. 100-200 词。
3. 仅返回提示词，不要解释。`;

    return this.requestText(prompt);
  }

  async generateShootingPlan(storyboard: Record<string, unknown>, scenes: Array<Record<string, unknown>>): Promise<Record<string, unknown>> {
    const prompt = `你是电影制片统筹。请基于分镜和场景，输出拍摄计划 JSON。

分镜：
${JSON.stringify(storyboard, null, 2)}

场景：
${JSON.stringify(scenes, null, 2)}

输出 JSON，包含：shootingDays, totalDays, budget, timeline。
只输出 JSON。`;

    return this.requestJson<Record<string, unknown>>(prompt);
  }

  async optimizePrompt(originalPrompt: string, style?: string): Promise<string> {
    const prompt = `你是 AI 图像提示词优化专家。优化以下提示词用于电影级图像生成。

原始提示词：
${originalPrompt}
${style ? `\n风格：${style}` : ''}

要求：
1. 英文输出。
2. 120-220 词。
3. 包含构图、灯光、色彩、镜头信息。
4. 仅输出优化后的提示词。`;

    return this.requestText(prompt);
  }
}

let geminiClient: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
  if (!geminiClient) {
    geminiClient = new GeminiClient();
  }
  return geminiClient;
}
