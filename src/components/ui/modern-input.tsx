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
    const baseStyles = 'flex h-12 w-full rounded-xl border-2 bg-[#1a2942] backdrop-blur-sm px-4 py-3 text-sm font-medium text-[#e2e8f0] placeholder:text-[#64748b] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50'
    
    const errorStyles = error ? 'border-[#ef4444] focus:ring-[#ef4444]' : 'border-[#2d3f5f] focus:border-[#0ea5e9]'
    
    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-[#94a3b8]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">
              {icon}
            </div>
          )}
        </div>
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

ModernInput.displayName = 'ModernInput'

export { ModernInput }
