'use client';

import { useWorkflowStore, workflowHelpers } from '@/lib/stores/workflow-store';
import { Check, Circle, Lock } from 'lucide-react';
import type { WorkflowStep } from '@/lib/entities';

const steps: { id: WorkflowStep; name: string; description: string }[] = [
  {
    id: 'upload-script',
    name: '上传剧本',
    description: '上传或粘贴你的电影剧本',
  },
  {
    id: 'analyze-style',
    name: '风格分析',
    description: 'AI 分析剧本并提取电影风格',
  },
  {
    id: 'generate-storyboard',
    name: '生成故事板',
    description: '创建详细的分镜脚本',
  },
  {
    id: 'generate-scenes',
    name: '场景生成',
    description: '生成场景概念图',
  },
  {
    id: 'generate-characters',
    name: '角色设计',
    description: '创建角色视觉设计',
  },
  {
    id: 'create-shot-list',
    name: '拍摄计划',
    description: '生成详细的拍摄计划',
  },
  {
    id: 'export-project',
    name: '导出项目',
    description: '导出完整的项目文件',
  },
];

export function WorkflowProgress() {
  const { currentStep, completedSteps } = useWorkflowStore();
  const progress = workflowHelpers.getProgress();

  return (
    <div className="w-full">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">工作流进度</span>
          <span className="text-sm font-medium text-amber-500">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const canProceed = workflowHelpers.canProceedToStep(step.id);
          const isLocked = !isCompleted && !isCurrent && !canProceed;

          return (
            <div
              key={step.id}
              className={`
                relative flex items-start gap-4 p-4 rounded-xl border transition-all
                ${isCurrent
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : isLocked
                  ? 'bg-white/5 border-white/10 opacity-50'
                  : 'bg-white/5 border-white/10'
                }
              `}
            >
              {/* 步骤图标 */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${isCurrent
                    ? 'bg-amber-500 text-black'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : isLocked
                    ? 'bg-white/10 text-gray-500'
                    : 'bg-white/10 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>

              {/* 步骤信息 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`
                      font-semibold
                      ${isCurrent
                        ? 'text-amber-500'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-gray-300'
                      }
                    `}
                  >
                    {index + 1}. {step.name}
                  </h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs rounded-full">
                      进行中
                    </span>
                  )}
                  {isCompleted && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                      已完成
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>

              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className="absolute left-9 top-14 w-0.5 h-4 bg-white/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
