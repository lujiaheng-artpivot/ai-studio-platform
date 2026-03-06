export type ScriptType = 'cannes' | 'high_concept' | 'micro_film' | 'commercial';

export const DEFAULT_SCRIPT_TYPE: ScriptType = 'cannes';

export type ScriptTypeOption = {
  id: ScriptType;
  label: string;
  description: string;
  placeholder: string;
  guidance: string;
};

export const SCRIPT_TYPE_OPTIONS: ScriptTypeOption[] = [
  {
    id: 'cannes',
    label: '戛纳 / 艺术电影',
    description: '文学性、诗意、电影节导向',
    placeholder: '例如：雨季末尾，母女在旧影院等待一场不会上映的电影。',
    guidance: '文艺叙事、留白表达、镜头语言优先',
  },
  {
    id: 'high_concept',
    label: '高概念电影',
    description: '商业化强设定、可一句话讲清',
    placeholder: '例如：失忆的消防员每天醒来都在不同的灾难现场。',
    guidance: '冲突明确、节奏强、情节钩子清晰',
  },
  {
    id: 'micro_film',
    label: '微电影',
    description: '短时长情感爆发、传播友好',
    placeholder: '例如：快递员在最后一单里收到自己十年前写给未来的信。',
    guidance: '3-5分钟结构、反转或余韵、成本可控',
  },
  {
    id: 'commercial',
    label: '广告创意',
    description: '品牌叙事、视觉记忆点明确',
    placeholder: '例如：一个让陌生人共享耳机的咖啡品牌广告。',
    guidance: '品牌洞察、传播点、结尾口号强化',
  },
];

const SCRIPT_TYPE_SET = new Set<ScriptType>(SCRIPT_TYPE_OPTIONS.map((item) => item.id));

export function isScriptType(value: unknown): value is ScriptType {
  return typeof value === 'string' && SCRIPT_TYPE_SET.has(value as ScriptType);
}

export function getScriptTypeOption(type: ScriptType): ScriptTypeOption {
  return SCRIPT_TYPE_OPTIONS.find((item) => item.id === type) || SCRIPT_TYPE_OPTIONS[0];
}
