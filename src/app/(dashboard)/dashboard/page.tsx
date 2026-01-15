"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Building,
  Home,
  AlertTriangle,
  Package,
  Wrench,
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
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Toplam Blok",
    value: "8",
    icon: Building,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    title: "Toplam Daire",
    value: "256",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Açık Eksiklik",
    value: "12",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Demirbaş",
    value: "145",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Planlı Bakım",
    value: "5",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
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

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
}

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  WAITING: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldiniz, {session?.user?.name || "Kullanıcı"}
        </h1>
        <p className="text-gray-500 mt-1">
          Site yönetim sistemi kontrol paneli
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Son Eksiklikler</CardTitle>
              <Badge variant="secondary" className="font-normal">
                12 açık
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {issue.title}
                    </p>
                    <p className="text-sm text-gray-500">{issue.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={priorityColors[issue.priority]}>
                      {priorityLabels[issue.priority]}
                    </Badge>
                    <Badge className={statusColors[issue.status]}>
                      {statusLabels[issue.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Haftalık Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Çözülen Sorunlar</p>
                    <p className="text-sm text-gray-500">Bu hafta</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">8</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Bekleyen Bakımlar</p>
                    <p className="text-sm text-gray-500">Önümüzdeki 7 gün</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">5</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Yeni Kayıtlar</p>
                    <p className="text-sm text-gray-500">Bu ay eklenen demirbaş</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">12</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Aktif Kullanıcılar</p>
                    <p className="text-sm text-gray-500">Sistemde kayıtlı</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
