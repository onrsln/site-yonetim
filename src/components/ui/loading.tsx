import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Loading({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="lg" />
    </div>
  )
}

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    </div>
  )
}
