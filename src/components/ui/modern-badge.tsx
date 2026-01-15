import React from 'react'
import { cn } from '@/lib/utils'

interface ModernBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const ModernBadge = React.forwardRef<HTMLDivElement, ModernBadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200'
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft',
      secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-soft',
      success: 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-soft',
      warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-soft',
      danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-soft',
      info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-soft',
    }
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ModernBadge.displayName = 'ModernBadge'

export { ModernBadge }
