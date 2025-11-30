import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProgressStep {
  id?: string
  title?: string
  label?: string
  path?: string
  status?: 'completed' | 'current' | 'upcoming'
}

interface ProgressBarProps {
  steps: ProgressStep[]
  currentStep?: number
}

export function ProgressBar({ steps, currentStep = 0 }: ProgressBarProps) {
  // Normalize steps to handle both formats
  const normalizedSteps = steps.map((step, index) => ({
    id: step.id || `step-${index}`,
    title: step.title || step.label || `Step ${index + 1}`,
    status: step.status || (index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming',
  }))

  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-neutral-200 -z-10" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-primary-600 -z-10 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {normalizedSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                'progress-step',
                step.status === 'completed' && 'progress-step-completed',
                step.status === 'current' && 'progress-step-active',
                step.status === 'upcoming' && 'progress-step-pending'
              )}
            >
              {step.status === 'completed' ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium text-center max-w-[80px]',
                step.status === 'current' ? 'text-primary-600' : 'text-neutral-500'
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-neutral-500">{normalizedSteps[currentStep]?.title}</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
