"use client"

import { useState } from "react"
import {
  Plus,
  Wrench,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  User,
  Building2
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernTextarea } from "@/components/ui/modern-textarea"
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
const mockMaintenances = [
  {
    id: "1",
    title: "Asansör Periyodik Bakımı",
    type: "PERIODIC",
    status: "SCHEDULED",
    date: "2024-02-15",
    site: "Yeşil Vadi Sitesi",
    technician: "Asansör Servisi A.Ş.",
    cost: 1500,
    description: "A Blok asansörlerinin aylık rutin kontrolü"
  },
  {
    id: "2",
    title: "Havuz Temizliği",
    type: "REPAIR",
    status: "COMPLETED",
    date: "2024-02-10",
    site: "Mavi Su Konutları",
    technician: "Havuzcu Mehmet",
    cost: 800,
    description: "Havuz filtrelerinin değişimi ve kimyasal bakımı"
  },
  {
    id: "3",
    title: "Jeneratör Yakıt İkmali",
    type: "PERIODIC",
    status: "IN_PROGRESS",
    date: "2024-02-14",
    site: "Yeşil Vadi Sitesi",
    technician: "Teknik Ekip",
    cost: 5000,
    description: "Ana jeneratör yakıt tankının doldurulması"
  }
]

const statusVariants: Record<string, "secondary" | "success" | "warning" | "danger" | "info" | "primary"> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
}

const statusLabels: Record<string, string> = {
  SCHEDULED: "Planlandı",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
}

const typeLabels: Record<string, string> = {
  PERIODIC: "Periyodik Bakım",
  REPAIR: "Onarım",
  INSTALLATION: "Kurulum",
  INSPECTION: "Kontrol",
}

export default function BakimPage() {
  const [maintenances, setMaintenances] = useState(mockMaintenances)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filtered data
  const filteredMaintenances = maintenances.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.site.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Bakım Yönetimi</h1>
          <p className="text-gray-500 mt-1 text-lg">Periyodik bakım ve onarım işlemlerini takip edin</p>
        </div>
        <ModernButton onClick={() => setIsDialogOpen(true)} icon={<Plus className="w-5 h-5" />}>
          Yeni Bakım Kaydı
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Bakım başlığı veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-white"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Durum Filtrele" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {/* Maintenance List */}
      <div className="grid gap-4">
        {filteredMaintenances.map((item) => (
          <ModernCard key={item.id} hover padding="md" className="group border-l-4" style={{
            borderLeftColor: item.status === 'COMPLETED' ? '#22c55e' : 
                           item.status === 'IN_PROGRESS' ? '#eab308' : 
                           item.status === 'CANCELLED' ? '#ef4444' : '#3b82f6'
          }}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <ModernBadge variant={statusVariants[item.status]} size="sm">
                    {statusLabels[item.status]}
                  </ModernBadge>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                    {typeLabels[item.type]}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {item.site}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {item.technician}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-900">
                    ₺{item.cost.toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">Yeni Bakım Kaydı</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <ModernInput
              label="Bakım Başlığı"
              placeholder="Örn: Asansör Bakımı"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">İşlem Türü</label>
                <Select defaultValue="PERIODIC">
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Durum</label>
                <Select defaultValue="SCHEDULED">
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="Tarih"
                type="date"
              />
              <ModernInput
                label="Maliyet (₺)"
                type="number"
                placeholder="0.00"
              />
            </div>

            <ModernInput
              label="Teknik Servis / Sorumlu"
              placeholder="Firma veya kişi adı"
              icon={<User className="w-4 h-4" />}
            />

            <ModernTextarea
              label="Açıklama"
              placeholder="Yapılacak işlemler hakkında detaylar..."
              rows={3}
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
