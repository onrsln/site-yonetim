import React from 'react'
import { Slot } from "@radix-ui/react-slot"
import { cn } from '@/lib/utils'

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  asChild?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift'
    
    const variants = {
      primary: 'bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white hover:from-[#0284c7] hover:to-[#0891b2] focus:ring-[#0ea5e9] shadow-lg',
      secondary: 'bg-gradient-to-r from-[#334155] to-[#475569] text-white hover:from-[#475569] hover:to-[#64748b] focus:ring-[#334155] shadow-lg',
      success: 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:ring-[#10b981] shadow-lg',
      warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] focus:ring-[#f59e0b] shadow-lg',
      danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] focus:ring-[#ef4444] shadow-lg',
      ghost: 'bg-transparent text-[#e2e8f0] hover:bg-[#1a2942] focus:ring-[#0ea5e9]',
      outline: 'border-2 border-[#2d3f5f] text-[#e2e8f0] hover:bg-[#1a2942] focus:ring-[#0ea5e9]',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    }

    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          <>
            {!asChild && !loading && icon && icon}
            {children}
          </>
        )}
      </Comp>
    )
  }
)

ModernButton.displayName = 'ModernButton'

export { ModernButton }
