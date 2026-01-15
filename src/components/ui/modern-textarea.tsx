import React from 'react'
import { cn } from '@/lib/utils'

interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const ModernTextarea = React.forwardRef<HTMLTextAreaElement, ModernTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const baseStyles = 'flex w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm font-medium text-secondary-900 placeholder:text-secondary-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y'
    
    const errorStyles = error ? 'border-danger-500 focus:ring-danger-500' : 'border-secondary-200 focus:border-primary-500'

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-secondary-700">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            baseStyles,
            errorStyles,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-danger-600 animate-fade-in">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-secondary-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ModernTextarea.displayName = 'ModernTextarea'

export { ModernTextarea }
