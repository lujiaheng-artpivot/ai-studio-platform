export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '',
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
    priceId: process.env.STRIPE_LITE_PRICE_ID || '',
    computeSeconds: 300,
    features: [
      '300 compute seconds/month',
      'Watermark-free 1080p exports',
      '~18 finished clips per month',
      'Standard processing time',
      'All AI tools access',
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
    priceId: process.env.STRIPE_STANDARD_PRICE_ID || '',
    computeSeconds: 1000,
    features: [
      '1,000 compute seconds/month',
      'Full commercial license',
      '~47 client deliverables',
      'Priority queue access (22-28% faster)',
      '4K export capability',
      'Batch processing (3 simultaneous)',
      'Priority email support',
      'No attribution required'
    ],
    limitations: [],
    maxResolution: '4K',
    hasWatermark: false,
    commercialLicense: true,
    priority: 'high',
    batchProcessing: 3,
  },
  pro: {
    name: 'Pro',
    price: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    computeSeconds: 5000,
    features: [
      '5,000 compute seconds/month',
      'API access for automation',
      'Team collaboration (5 seats)',
      'Priority rendering (2.1 min avg)',
      'Dedicated support (4.2h response)',
      'Custom branding',
      'Advanced analytics',
      'White-label options',
      'SLA guarantee'
    ],
    limitations: [],
    maxResolution: '4K',
    hasWatermark: false,
    commercialLicense: true,
    priority: 'highest',
    batchProcessing: 10,
    apiAccess: true,
    teamSeats: 5,
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

export const AI_TOOLS = {
  cinestyle: {
    id: 'cinestyle',
    name: 'CineStyle AI',
    description: 'Analyze scripts and generate cinematic style concepts',
    icon: '🎬',
    computeCost: {
      analysis: 5,
      sceneGeneration: 15,
      characterGeneration: 12,
    },
    minTier: 'free' as SubscriptionTier,
  },
  storyboard: {
    id: 'storyboard',
    name: 'Storyboard AI',
    description: 'Create professional storyboards from scripts',
    icon: '📋',
    computeCost: {
      frameGeneration: 18,
      sequenceGeneration: 25,
    },
    minTier: 'lite' as SubscriptionTier,
  },
  scriptMaster: {
    id: 'scriptMaster',
    name: 'Script Master',
    description: 'AI-powered screenplay writing assistant',
    icon: '✍️',
    computeCost: {
      generation: 8,
      analysis: 5,
    },
    minTier: 'free' as SubscriptionTier,
  },
  cinelogic: {
    id: 'cinelogic',
    name: 'CineLogic Director',
    description: 'Professional director tools and shot planning',
    icon: '🎥',
    computeCost: {
      shotPlanning: 20,
      sceneBreakdown: 15,
    },
    minTier: 'standard' as SubscriptionTier,
  },
  virtualStudio: {
    id: 'virtualStudio',
    name: 'Gemini 3D Virtual Studio',
    description: '3D virtual cinematography and set design',
    icon: '🎭',
    computeCost: {
      render3D: 30,
      setDesign: 25,
    },
    minTier: 'standard' as SubscriptionTier,
  },
  contactSheet: {
    id: 'contactSheet',
    name: 'Cinematic Contact Sheet',
    description: 'Generate cinematic sample sheets',
    icon: '📸',
    computeCost: {
      sheetGeneration: 20,
    },
    minTier: 'lite' as SubscriptionTier,
  },
} as const;

export type AIToolId = keyof typeof AI_TOOLS;
