import React from 'react'
import { cn } from '@/lib/utils'

interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const ModernTextarea = React.forwardRef<HTMLTextAreaElement, ModernTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const baseStyles = 'flex w-full rounded-xl border-2 bg-[#1a2942] backdrop-blur-sm px-4 py-3 text-sm font-medium text-[#e2e8f0] placeholder:text-[#64748b] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y'
    
    const errorStyles = error ? 'border-[#ef4444] focus:ring-[#ef4444]' : 'border-[#2d3f5f] focus:border-[#0ea5e9]'

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-[#94a3b8]">
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
          <p className="text-sm font-medium text-[#ef4444] animate-fade-in">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[#64748b]">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ModernTextarea.displayName = 'ModernTextarea'

export { ModernTextarea }
