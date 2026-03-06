export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '',
    stripePriceId: '',
    computeSeconds: 50,
    features: [
      '50 compute seconds/month',
      '720p maximum resolution',
      'Watermark on exports',
      'Standard processing queue',
      'Access to basic tools',
      'Community support'
    ],
    limitations: [
      'No commercial use',
      'Limited to 3-4 simple clips',
      'Watermarked outputs'
    ],
    maxResolution: '720p',
    hasWatermark: true,
    commercialLicense: false,
    priority: 'standard',
  },
  lite: {
    name: 'Lite',
    price: 10,
    priceId: 'price_1SvLSMBcngVE1Bh59ZLYi80n',
    stripePriceId: 'price_1SvLSMBcngVE1Bh59ZLYi80n',
    computeSeconds: 300,
    features: [
      '300 compute seconds/month',
      'Watermark-free 1080p exports',
      '~18 finished clips per month',
      'Standard processing time',
      'Access to all AI tools',
      'Email support'
    ],
    limitations: [
      'No commercial license',
      'Standard queue priority'
    ],
    maxResolution: '1080p',
    hasWatermark: false,
    commercialLicense: false,
    priority: 'standard',
  },
  standard: {
    name: 'Standard',
    price: 30,
    priceId: 'price_1SvLYlBcngVE1Bh5cBYrZQcT',
    stripePriceId: 'price_1SvLYlBcngVE1Bh5cBYrZQcT',
    computeSeconds: 1000,
    features: [
      '1,000 compute seconds/month',
      'Full commercial license',
      '~47 deliverables per month',
      'Priority queue',
      '4K export capability',
      'Advanced AI features',
      'Priority email support'
    ],
    limitations: [],
    maxResolution: '4K',
    hasWatermark: false,
    commercialLicense: true,
    priority: 'high',
  },
  pro: {
    name: 'Pro',
    price: 100,
    priceId: 'price_1SvLdyBcngVE1Bh52yZLHhVA',
    stripePriceId: 'price_1SvLdyBcngVE1Bh52yZLHhVA',
    computeSeconds: 3000,
    features: [
      '3,000 compute seconds/month',
      'Full commercial license',
      '~140 deliverables per month',
      'Highest priority queue',
      '4K export capability',
      'All AI tools & features',
      'Dedicated support channel',
      'Custom branding options'
    ],
    limitations: [],
    maxResolution: '4K',
    hasWatermark: false,
    commercialLicense: true,
    priority: 'highest',
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

export const ALIPAY_TOPUP_PACKAGES = {
  starter: {
    name: '入门算力包',
    priceCny: 29,
    computeSeconds: 300,
    description: '一次性补充 300 秒算力，不自动续费',
  },
  studio: {
    name: '进阶算力包',
    priceCny: 69,
    computeSeconds: 900,
    description: '一次性补充 900 秒算力，适合中强度创作',
  },
  pro: {
    name: '专业算力包',
    priceCny: 129,
    computeSeconds: 2000,
    description: '一次性补充 2,000 秒算力，适合商业项目冲刺',
  },
} as const;

export type AlipayTopupPackageId = keyof typeof ALIPAY_TOPUP_PACKAGES;

export const AI_TOOLS = {
  scriptAnalysis: {
    id: 'script-analysis',
    name: '剧本分析',
    icon: '🎬',
    description: '使用 AI 分析剧本结构、角色发展和故事节奏',
    computeCost: {
      free: 10,
      lite: 8,
      standard: 6,
      pro: 5,
    },
  },
  storyboard: {
    id: 'storyboard',
    name: '故事板生成',
    icon: '📋',
    description: '自动从剧本创建专业故事板和分镜脚本',
    computeCost: {
      free: 15,
      lite: 12,
      standard: 10,
      pro: 8,
    },
  },
  sceneGeneration: {
    id: 'scene-generation',
    name: '场景生成',
    icon: '🖼️',
    description: '生成电影级场景概念图和视觉参考',
    computeCost: {
      free: 12,
      lite: 10,
      standard: 8,
      pro: 6,
    },
  },
  characterDesign: {
    id: 'character-design',
    name: '角色设计',
    icon: '👤',
    description: 'AI 驱动的角色视觉设计和概念艺术',
    computeCost: {
      free: 10,
      lite: 8,
      standard: 6,
      pro: 5,
    },
  },
  director: {
    id: 'director',
    name: '智能导演',
    icon: '🎥',
    description: '专业导演工具和智能镜头规划系统',
    computeCost: {
      free: 20,
      lite: 16,
      standard: 12,
      pro: 10,
    },
  },
  virtualStudio: {
    id: 'virtual-studio',
    name: '3D 虚拟摄影棚',
    icon: '🎭',
    description: '创建 3D 虚拟摄影和场景设计',
    computeCost: {
      free: 25,
      lite: 20,
      standard: 15,
      pro: 12,
    },
  },
} as const;

export type AIToolId = keyof typeof AI_TOOLS;
