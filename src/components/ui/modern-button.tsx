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
      primary: 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-400 shadow-lg hover:scale-105',
      secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500 shadow-lg border border-white/10',
      success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-400 shadow-lg',
      warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-400 shadow-lg',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-400 shadow-lg',
      ghost: 'bg-transparent text-slate-200 hover:bg-slate-700/30 focus:ring-cyan-400',
      outline: 'border-2 border-white/10 text-slate-200 hover:bg-slate-800/50 focus:ring-cyan-400',
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
