interface Step {
  label: string;
  status: 'current' | 'disabled' | 'completed';
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="inline-flex py-2 px-4 flex-col items-center gap-0.5 bg-bg-medium w-full h-[70px]">
      <div className="flex w-full flex-col items-center gap-1 relative">
        <div className="grid w-full grid-cols-3 items-start relative">
          {/* Connecting line */}
          {steps.length > 1 && (
            <div className="absolute left-[16.666%] right-[16.666%] top-[7.5px] h-[1px] bg-border-weak1 rounded-[6px]" />
          )}

          {/* Step indicators */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-col items-center gap-0.5 relative z-10"
              aria-current={index === currentStep ? 'step' : undefined}
            >
              {/* Circle indicator */}
              <div className="relative">
                {step.status === 'current' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
                      fill="#6952F9"
                    />
                    <path
                      d="M10.3333 8C10.3333 9.28866 9.28866 10.3333 8 10.3333C6.71134 10.3333 5.66667 9.28866 5.66667 8C5.66667 6.71134 6.71134 5.66667 8 5.66667C9.28866 5.66667 10.3333 6.71134 10.3333 8Z"
                      fill="white"
                    />
                  </svg>
                ) : step.status === 'completed' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" fill="#6952F9" />
                    <path
                      d="M6.5 8.5L7.5 9.5L9.5 6.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="3" fill="#B1B1B1" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <div
                className={`w-[76px] text-center font-roboto text-[12px] font-medium leading-[18px] tracking-[0.24px] ${
                  step.status === 'current' ? 'text-text-default' : 'text-text-disabled'
                }`}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
