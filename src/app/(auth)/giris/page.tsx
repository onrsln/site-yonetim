"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernCard } from "@/components/ui/modern-card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Geçersiz email veya şifre")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
            <Building2 className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Giriş Yap</h1>
          <p className="text-slate-400 mt-1">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Card */}
        <ModernCard className="shadow-2xl border border-white/10 bg-slate-800/90 backdrop-blur-xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <ModernInput
                label="Email"
                type="email"
                placeholder="ornek@siteyonetim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="space-y-2">
                <ModernInput
                  label="Şifre"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <ModernButton
                type="submit"
                className="w-full h-12 mt-6"
                disabled={isLoading}
                loading={isLoading}
              >
                Giriş Yap
              </ModernButton>
            </form>
          </div>
        </ModernCard>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            İlk giriş mi?
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Sistem yöneticisinden hesap talep edebilirsiniz
          </p>
        </div>
      </div>
    </div>
  )
}
