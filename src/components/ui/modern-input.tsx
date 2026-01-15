import React from 'react'
import { cn } from '@/lib/utils'

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, label, error, helperText, icon, iconPosition = 'left', type, ...props }, ref) => {
    const baseStyles = 'flex h-12 w-full rounded-xl border-2 bg-slate-800 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50'
    
    const errorStyles = error ? 'border-red-500 focus:ring-red-400' : 'border-white/10 focus:border-cyan-400'
    
    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              baseStyles,
              errorStyles,
              iconPadding,
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
        </div>
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

ModernInput.displayName = 'ModernInput'

export { ModernInput }
