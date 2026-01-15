import React from 'react'
import { cn } from '@/lib/utils'

interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const ModernTextarea = React.forwardRef<HTMLTextAreaElement, ModernTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const baseStyles = 'flex w-full rounded-xl border-2 bg-slate-800 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y'
    
    const errorStyles = error ? 'border-red-500 focus:ring-red-400' : 'border-white/10 focus:border-cyan-400'

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-slate-300">
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
          <p className="text-sm font-medium text-red-400 animate-fade-in">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ModernTextarea.displayName = 'ModernTextarea'

export { ModernTextarea }
