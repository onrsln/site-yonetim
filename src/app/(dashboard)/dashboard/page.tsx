"use client"

import { useSession } from "next-auth/react"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
import {
  Building2,
  Building,
  Home,
  AlertTriangle,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react"

const stats = [
  {
    title: "Toplam Site",
    value: "1",
    icon: Building2,
    change: "+0",
    changeType: "neutral",
    variant: "primary" as const
  },
  {
    title: "Toplam Blok",
    value: "8",
    icon: Building,
    change: "+2",
    changeType: "increase",
    variant: "secondary" as const
  },
  {
    title: "Toplam Daire",
    value: "256",
    icon: Home,
    change: "+16",
    changeType: "increase",
    variant: "success" as const
  },
  {
    title: "Açık Eksiklik",
    value: "12",
    icon: AlertTriangle,
    change: "-3",
    changeType: "decrease",
    variant: "danger" as const
  },
  {
    title: "Demirbaş",
    value: "145",
    icon: Package,
    change: "+12",
    changeType: "increase",
    variant: "warning" as const
  },
  {
    title: "Personel",
    value: "8",
    icon: Users,
    change: "+1",
    changeType: "increase",
    variant: "info" as const
  }
]

const recentIssues = [
  {
    id: 1,
    title: "A Blok 3. Kat Asansör Arızası",
    priority: "URGENT",
    status: "IN_PROGRESS",
    createdAt: "2 saat önce",
  },
  {
    id: 2,
    title: "B Blok Lobi Aydınlatma Eksikliği",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "5 saat önce",
  },
  {
    id: 3,
    title: "Otopark Giriş Bariyeri Arızası",
    priority: "HIGH",
    status: "WAITING",
    createdAt: "1 gün önce",
  },
  {
    id: 4,
    title: "Fitness Salonu Klima Bakımı",
    priority: "LOW",
    status: "RESOLVED",
    createdAt: "2 gün önce",
  },
]

const priorityVariants: Record<string, "primary" | "secondary" | "success" | "warning" | "danger" | "info"> = {
  LOW: "secondary",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
}

const statusVariants: Record<string, "primary" | "secondary" | "success" | "warning" | "danger" | "info"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  WAITING: "secondary",
  RESOLVED: "success",
}

const priorityLabels: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
}

const statusLabels: Record<string, string> = {
  OPEN: "Açık",
  IN_PROGRESS: "Devam Ediyor",
  WAITING: "Beklemede",
  RESOLVED: "Çözüldü",
}

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Hoş Geldiniz, {session?.user?.name || "Kullanıcı"}
          </h1>
          <p className="text-gray-500 mt-1 text-lg">
            Site yönetim sistemi kontrol paneli
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <ModernCard key={stat.title} hover padding="lg" className="border-t-4" style={{ borderColor: `var(--${stat.variant}-500)` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.variant === 'primary' ? 'blue' : stat.variant === 'secondary' ? 'slate' : stat.variant === 'success' ? 'green' : stat.variant === 'danger' ? 'red' : stat.variant === 'warning' ? 'yellow' : 'cyan'}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.variant === 'primary' ? 'blue' : stat.variant === 'secondary' ? 'slate' : stat.variant === 'success' ? 'green' : stat.variant === 'danger' ? 'red' : stat.variant === 'warning' ? 'yellow' : 'cyan'}-600`} />
              </div>
              <ModernBadge 
                variant={stat.changeType === 'increase' ? 'success' : stat.changeType === 'decrease' ? 'danger' : 'secondary'} 
                size="sm"
              >
                {stat.change}
              </ModernBadge>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Issues */}
        <div className="lg:col-span-2">
          <ModernCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Son Eksiklikler</h2>
                <p className="text-sm text-gray-500">Takip edilen son arıza ve eksiklikler</p>
              </div>
              <ModernBadge variant="secondary" size="lg">
                12 açık kayıt
              </ModernBadge>
            </div>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md hover:scale-[1.01] border border-transparent hover:border-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${
                      issue.priority === 'URGENT' ? 'bg-red-500' :
                      issue.priority === 'HIGH' ? 'bg-orange-500' :
                      issue.priority === 'MEDIUM' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {issue.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{issue.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ModernBadge variant={priorityVariants[issue.priority]} size="sm">
                      {priorityLabels[issue.priority]}
                    </ModernBadge>
                    <ModernBadge variant={statusVariants[issue.status]} size="sm">
                      {statusLabels[issue.status]}
                    </ModernBadge>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>

        {/* Quick Stats / Summary */}
        <div className="lg:col-span-1">
          <ModernCard className="h-full bg-gradient-to-br from-white to-gray-50">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Haftalık Özet</h2>
              <p className="text-sm text-gray-500">Bu haftanın önemli metrikleri</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Çözülen</p>
                    <p className="text-xs text-gray-500">Bu hafta</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">8</span>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bekleyen</p>
                    <p className="text-xs text-gray-500">7 gün içinde</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">5</span>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Yeni Kayıt</p>
                    <p className="text-xs text-gray-500">Bu ay</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">12</span>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Aktif Üye</p>
                    <p className="text-xs text-gray-500">Toplam</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
