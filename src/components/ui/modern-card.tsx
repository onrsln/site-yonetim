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
      default: 'bg-[#1a2942] border border-[#2d3f5f] shadow-lg',
      glass: 'bg-[#1a2942]/80 border border-[#2d3f5f]/50 shadow-lg',
      gradient: 'bg-gradient-to-br from-[#1a2942] to-[#0f1e33] border border-[#2d3f5f] shadow-lg',
      bordered: 'bg-[#1a2942] border-2 border-[#2d3f5f] shadow-lg',
      custom: 'shadow-lg',
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
