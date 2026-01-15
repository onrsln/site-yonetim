"use client"

import { useState } from "react"
import {
  Plus,
  Gauge,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  Building2,
  Zap,
  Droplet,
  Flame
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
import { ModernInput } from "@/components/ui/modern-input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for development
const mockMeters = [
  {
    id: "1",
    type: "ELECTRIC",
    meterNumber: "EL-2024-001",
    location: "A Blok - Daire 12",
    site: "Yeşil Vadi Sitesi",
    lastReading: 1250,
    currentReading: 1320,
    readingDate: "2024-02-15",
    consumption: 70,
    trend: "up"
  },
  {
    id: "2",
    type: "WATER",
    meterNumber: "SU-2024-045",
    location: "B Blok - Daire 5",
    site: "Mavi Su Konutları",
    lastReading: 450,
    currentReading: 465,
    readingDate: "2024-02-14",
    consumption: 15,
    trend: "up"
  },
  {
    id: "3",
    type: "GAS",
    meterNumber: "GZ-2024-089",
    location: "A Blok - Daire 8",
    site: "Yeşil Vadi Sitesi",
    lastReading: 890,
    currentReading: 920,
    readingDate: "2024-02-13",
    consumption: 30,
    trend: "down"
  }
]

const meterTypeIcons = {
  ELECTRIC: Zap,
  WATER: Droplet,
  GAS: Flame,
}

const meterTypeColors = {
  ELECTRIC: "from-yellow-400 to-orange-500",
  WATER: "from-blue-400 to-cyan-500",
  GAS: "from-red-400 to-orange-600",
}

const meterTypeLabels: Record<string, string> = {
  ELECTRIC: "Elektrik",
  WATER: "Su",
  GAS: "Doğalgaz",
}

export default function SayaclarPage() {
  const [meters, setMeters] = useState(mockMeters)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Filtered data
  const filteredMeters = meters.filter(item => {
    const matchesSearch = item.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.site.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Sayaç Yönetimi</h1>
          <p className="text-slate-400 mt-1 text-lg">Elektrik, su ve doğalgaz sayaçlarını takip edin</p>
        </div>
        <ModernButton onClick={() => setIsDialogOpen(true)} icon={<Plus className="w-5 h-5" />}>
          Yeni Okuma Kaydı
        </ModernButton>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <ModernCard padding="md" className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Toplam Elektrik</p>
              <p className="text-3xl font-bold text-white mt-1">1,250 kWh</p>
              <p className="text-xs text-slate-400 mt-1">Bu ay</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-100">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard padding="md" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Toplam Su</p>
              <p className="text-3xl font-bold text-white mt-1">850 m³</p>
              <p className="text-xs text-slate-400 mt-1">Bu ay</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-100">
              <Droplet className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard padding="md" className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Toplam Doğalgaz</p>
              <p className="text-3xl font-bold text-white mt-1">620 m³</p>
              <p className="text-xs text-slate-400 mt-1">Bu ay</p>
            </div>
            <div className="p-4 rounded-xl bg-red-100">
              <Flame className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Sayaç no, konum veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Tür Filtrele" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {Object.entries(meterTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {/* Meters List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeters.map((meter) => {
          const Icon = meterTypeIcons[meter.type as keyof typeof meterTypeIcons]
          const gradient = meterTypeColors[meter.type as keyof typeof meterTypeColors]
          
          return (
            <ModernCard key={meter.id} hover padding="none" className="overflow-hidden group">
              <div className={`h-24 bg-gradient-to-br ${gradient} relative`}>
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-slate-800/50/20 hover:bg-slate-800/50/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Okuma Ekle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-slate-800/50 shadow-md border border-white/10">
                    <Icon className="h-8 w-8" style={{
                      color: meter.type === 'ELECTRIC' ? '#f59e0b' : 
                             meter.type === 'WATER' ? '#3b82f6' : '#ef4444'
                    }} />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-600 transition-colors">
                      {meter.meterNumber}
                    </h3>
                    <ModernBadge variant="secondary" size="sm" className="mt-1">
                      {meterTypeLabels[meter.type]}
                    </ModernBadge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 className="h-4 w-4" />
                    {meter.site}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Gauge className="h-4 w-4" />
                    {meter.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(meter.readingDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Son Okuma</p>
                      <p className="text-lg font-bold text-white">{meter.lastReading}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${meter.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                      {meter.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-semibold">{meter.consumption}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Güncel</p>
                      <p className="text-lg font-bold text-white">{meter.currentReading}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCard>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-slate-800/50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">Yeni Sayaç Okuması</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Sayaç Türü</label>
              <Select defaultValue="ELECTRIC">
                <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(meterTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ModernInput
              label="Sayaç Numarası"
              placeholder="Örn: EL-2024-001"
            />

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="Önceki Okuma"
                type="number"
                placeholder="0"
              />
              <ModernInput
                label="Güncel Okuma"
                type="number"
                placeholder="0"
              />
            </div>

            <ModernInput
              label="Okuma Tarihi"
              type="date"
            />

            <ModernInput
              label="Konum"
              placeholder="Örn: A Blok - Daire 12"
            />

            <DialogFooter className="gap-2 mt-4">
              <ModernButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton onClick={() => setIsDialogOpen(false)}>
                Kaydet
              </ModernButton>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
