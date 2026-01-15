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
      default: 'bg-slate-800/50 border border-white/10 shadow-xl',
      glass: 'bg-slate-800/30 border border-white/10 shadow-xl backdrop-blur-xl',
      gradient: 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/20 shadow-2xl',
      bordered: 'bg-slate-800/50 border-2 border-white/10 shadow-xl',
      custom: 'shadow-xl',
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
