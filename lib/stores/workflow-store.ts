// Application Layer - 工作流状态管理

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Project, 
  WorkflowStep, 
  StyleAnalysis, 
  Storyboard,
  Scene,
} from '@/lib/entities';

interface WorkflowState {
  // 当前项目
  currentProject: Project | null;
  
  // 工作流步骤
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  
  // 处理状态
  isProcessing: boolean;
  error: string | null;
  
  // 数据
  script: string | null;
  styleAnalysis: StyleAnalysis | null;
  storyboard: Storyboard | null;
  scenes: Scene[];
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  setScript: (script: string) => void;
  setStyleAnalysis: (analysis: StyleAnalysis) => void;
  setStoryboard: (storyboard: Storyboard) => void;
  addScene: (scene: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  
  setCurrentStep: (step: WorkflowStep) => void;
  completeStep: (step: WorkflowStep) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  
  reset: () => void;
}

const initialState = {
  currentProject: null,
  currentStep: 'upload-script' as WorkflowStep,
  completedSteps: [] as WorkflowStep[],
  isProcessing: false,
  error: null,
  script: null,
  styleAnalysis: null,
  storyboard: null,
  scenes: [],
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentProject: (project) => set({ currentProject: project }),
      
      setScript: (script) => set({ script }),
      
      setStyleAnalysis: (analysis) => set({ styleAnalysis: analysis }),
      
      setStoryboard: (storyboard) => set({ storyboard }),
      
      addScene: (scene) => set((state) => ({
        scenes: [...state.scenes, scene],
      })),
      
      updateScene: (sceneId, updates) => set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === sceneId ? { ...scene, ...updates } : scene
        ),
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      completeStep: (step) => set((state) => ({
        completedSteps: [...state.completedSteps, step],
      })),
      
      setProcessing: (isProcessing) => set({ isProcessing }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'workflow-storage',
      partialize: (state) => ({
        currentProject: state.currentProject,
        script: state.script,
        styleAnalysis: state.styleAnalysis,
        storyboard: state.storyboard,
        scenes: state.scenes,
        completedSteps: state.completedSteps,
      }),
    }
  )
);

// 工作流助手函数
export const workflowHelpers = {
  // 检查步骤是否完成
  isStepCompleted: (step: WorkflowStep): boolean => {
    const { completedSteps } = useWorkflowStore.getState();
    return completedSteps.includes(step);
  },

  // 获取下一步
  getNextStep: (currentStep: WorkflowStep): WorkflowStep | null => {
    const steps: WorkflowStep[] = [
      'upload-script',
      'analyze-style',
      'generate-storyboard',
      'generate-scenes',
      'generate-characters',
      'create-shot-list',
      'export-project',
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  },

  // 获取步骤进度百分比
  getProgress: (): number => {
    const { completedSteps } = useWorkflowStore.getState();
    const totalSteps = 7;
    return Math.round((completedSteps.length / totalSteps) * 100);
  },

  // 检查是否可以进行下一步
  canProceedToStep: (step: WorkflowStep): boolean => {
    const { script, styleAnalysis, storyboard } = useWorkflowStore.getState();
    
    switch (step) {
      case 'upload-script':
        return true;
      case 'analyze-style':
        return !!script;
      case 'generate-storyboard':
        return !!script && !!styleAnalysis;
      case 'generate-scenes':
        return !!storyboard;
      case 'generate-characters':
        return !!styleAnalysis;
      case 'create-shot-list':
        return !!storyboard;
      case 'export-project':
        return !!storyboard;
      default:
        return false;
    }
  },
};
