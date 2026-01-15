"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Filter,
  Building2,
  Users,
  DollarSign,
  AlertTriangle
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data for reports
const reportStats = {
  totalSites: 5,
  totalApartments: 120,
  totalIssues: 45,
  monthlyRevenue: 125000,
  monthlyExpense: 85000,
  occupancyRate: 92,
}

const reportTemplates = [
  {
    id: "1",
    name: "Aylık Mali Rapor",
    description: "Gelir, gider ve bakiye özeti",
    icon: DollarSign,
    color: "from-green-500 to-emerald-600",
    type: "financial"
  },
  {
    id: "2",
    name: "Eksiklik Raporu",
    description: "Açık ve kapalı eksiklikler",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-600",
    type: "issues"
  },
  {
    id: "3",
    name: "Doluluk Raporu",
    description: "Daire doluluk oranları",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    type: "occupancy"
  },
  {
    id: "4",
    name: "Bakım Raporu",
    description: "Periyodik bakım ve onarımlar",
    icon: BarChart3,
    color: "from-purple-500 to-pink-600",
    type: "maintenance"
  },
  {
    id: "5",
    name: "Sayaç Okuma Raporu",
    description: "Elektrik, su ve doğalgaz tüketimi",
    icon: TrendingUp,
    color: "from-yellow-500 to-orange-600",
    type: "meters"
  },
  {
    id: "6",
    name: "Site Özet Raporu",
    description: "Tüm sitelerin genel durumu",
    icon: Building2,
    color: "from-cyan-500 to-blue-600",
    type: "summary"
  }
]

export default function RaporlarPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current_month")
  const [selectedSite, setSelectedSite] = useState("all")

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`)
    // Implement report generation logic
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Raporlar</h1>
          <p className="text-slate-400 mt-1 text-lg">Detaylı raporlar oluşturun ve analiz edin</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ModernCard padding="md" className="text-center">
          <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{reportStats.totalSites}</p>
          <p className="text-xs text-slate-400 mt-1">Site</p>
        </ModernCard>
        <ModernCard padding="md" className="text-center">
          <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{reportStats.totalApartments}</p>
          <p className="text-xs text-slate-400 mt-1">Daire</p>
        </ModernCard>
        <ModernCard padding="md" className="text-center">
          <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{reportStats.totalIssues}</p>
          <p className="text-xs text-slate-400 mt-1">Eksiklik</p>
        </ModernCard>
        <ModernCard padding="md" className="text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">₺{(reportStats.monthlyRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Gelir</p>
        </ModernCard>
        <ModernCard padding="md" className="text-center">
          <BarChart3 className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">₺{(reportStats.monthlyExpense / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Gider</p>
        </ModernCard>
        <ModernCard padding="md" className="text-center">
          <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{reportStats.occupancyRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Doluluk</p>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Dönem Seçin</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_month">Bu Ay</SelectItem>
                <SelectItem value="last_month">Geçen Ay</SelectItem>
                <SelectItem value="current_quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="current_year">Bu Yıl</SelectItem>
                <SelectItem value="custom">Özel Tarih Aralığı</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Site Filtrele</label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Siteler</SelectItem>
                <SelectItem value="site1">Yeşil Vadi Sitesi</SelectItem>
                <SelectItem value="site2">Mavi Su Konutları</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {/* Report Templates */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-800/50/50 p-1 rounded-xl border border-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-800/50 data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            Tüm Raporlar
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-slate-800/50 data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            Mali
          </TabsTrigger>
          <TabsTrigger value="operational" className="data-[state=active]:bg-slate-800/50 data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            Operasyonel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => {
              const Icon = template.icon
              return (
                <ModernCard key={template.id} hover padding="none" className="overflow-hidden group">
                  <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-600 transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <ModernButton 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Oluştur
                      </ModernButton>
                      <ModernButton 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <Download className="h-4 w-4" />
                      </ModernButton>
                    </div>
                  </div>
                </ModernCard>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.filter(t => t.type === 'financial').map((template) => {
              const Icon = template.icon
              return (
                <ModernCard key={template.id} hover padding="none" className="overflow-hidden group">
                  <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-600 transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <ModernButton 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Oluştur
                      </ModernButton>
                      <ModernButton 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <Download className="h-4 w-4" />
                      </ModernButton>
                    </div>
                  </div>
                </ModernCard>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.filter(t => t.type !== 'financial').map((template) => {
              const Icon = template.icon
              return (
                <ModernCard key={template.id} hover padding="none" className="overflow-hidden group">
                  <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-600 transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <ModernButton 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Oluştur
                      </ModernButton>
                      <ModernButton 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <Download className="h-4 w-4" />
                      </ModernButton>
                    </div>
                  </div>
                </ModernCard>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Reports */}
      <ModernCard title="Son Oluşturulan Raporlar" padding="md">
        <div className="space-y-3">
          {[
            { name: "Ocak 2024 Mali Rapor", date: "2024-02-15", size: "245 KB" },
            { name: "Eksiklik Raporu - Haftalık", date: "2024-02-14", size: "128 KB" },
            { name: "Doluluk Raporu - Aylık", date: "2024-02-13", size: "89 KB" },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/10 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-white">{report.name}</p>
                  <p className="text-xs text-slate-400">{report.date} • {report.size}</p>
                </div>
              </div>
              <ModernButton size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </ModernButton>
            </div>
          ))}
        </div>
      </ModernCard>
    </div>
  )
}
