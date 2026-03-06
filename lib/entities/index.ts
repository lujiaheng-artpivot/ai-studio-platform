// Domain Layer - 实体定义

export interface Script {
  id: string;
  content: string;
  title?: string;
  author?: string;
  genre?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StyleAnalysis {
  id: string;
  scriptId: string;
  styles: CinematicStyle[];
  characters: Character[];
  scenes: SceneBreakdown[];
  overallTone: string;
  visualThemes: string[];
  colorPalette: ColorPalette;
  createdAt: Date;
}

export interface CinematicStyle {
  name: string;
  description: string;
  artMovements: string[];
  visualPrompt: string;
  lightingDescription: string;
  cameraWork: string;
  references: string[];
}

export interface Character {
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  visualDescription: string;
  personality: string[];
  arc?: string;
}

export interface SceneBreakdown {
  sceneNumber: number;
  location: string;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  description: string;
  mood: string;
  characters: string[];
  keyActions: string[];
  visualPrompt: string;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  mood: string;
}

export interface Storyboard {
  id: string;
  projectId: string;
  scriptId: string;
  shots: Shot[];
  totalDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shot {
  shotNumber: number;
  sceneNumber: number;
  shotType: ShotType;
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  description: string;
  dialogue?: string;
  duration?: number;
  visualPrompt: string;
  generatedImage?: string;
  notes?: string;
}

export type ShotType = 
  | 'ECU'  // Extreme Close-Up
  | 'CU'   // Close-Up
  | 'MCU'  // Medium Close-Up
  | 'MS'   // Medium Shot
  | 'MWS'  // Medium Wide Shot
  | 'WS'   // Wide Shot
  | 'EWS'  // Extreme Wide Shot
  | 'OTS'  // Over-the-Shoulder
  | 'POV'; // Point of View

export type CameraAngle =
  | 'eye-level'
  | 'high-angle'
  | 'low-angle'
  | 'birds-eye'
  | 'dutch-angle'
  | 'overhead';

export type CameraMovement =
  | 'static'
  | 'pan'
  | 'tilt'
  | 'dolly'
  | 'tracking'
  | 'crane'
  | 'handheld'
  | 'steadicam';

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  script?: Script;
  styleAnalysis?: StyleAnalysis;
  storyboard?: Storyboard;
  scenes: Scene[];
  characters: Character[];
  status: ProjectStatus;
  computeSecondsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 
  | 'draft'
  | 'analyzing'
  | 'generating'
  | 'completed'
  | 'error';

export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  description: string;
  location: string;
  timeOfDay: string;
  mood: string;
  visualPrompt: string;
  generatedImages: GeneratedImage[];
  status: 'pending' | 'generating' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  seed?: number;
  parameters?: Record<string, unknown>;
  createdAt: Date;
}

export interface WorkflowState {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  project: Project;
  isProcessing: boolean;
  error?: string;
}

export type WorkflowStep =
  | 'upload-script'
  | 'analyze-style'
  | 'generate-storyboard'
  | 'generate-scenes'
  | 'generate-characters'
  | 'create-shot-list'
  | 'export-project';

export interface AIGenerationRequest {
  userId: string;
  projectId: string;
  type: 'style-analysis' | 'storyboard' | 'image' | 'character';
  input: unknown;
  parameters?: Record<string, unknown>;
}

export interface AIGenerationResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  computeSecondsUsed: number;
  model: string;
}
