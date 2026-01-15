import React from 'react'
import { cn } from '@/lib/utils'

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered' | 'custom'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  children: React.ReactNode
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300 backdrop-blur-sm'
    
    const variants = {
      default: 'bg-white border border-secondary-200 shadow-soft',
      glass: 'bg-white/10 border border-white/20 shadow-soft',
      gradient: 'bg-gradient-to-br from-white/80 to-secondary-50/80 border border-white/40 shadow-medium',
      bordered: 'bg-white border-2 border-secondary-300 shadow-soft',
      custom: 'shadow-soft',
    }
    
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    }

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hover && 'hover-lift cursor-pointer',
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

ModernCard.displayName = 'ModernCard'

export { ModernCard }
