"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Building2,
  Building,
  Layers,
  Package
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
import { Loading } from "@/components/ui/loading"

interface CommonArea {
  id: string
  name: string
  type: string
  description: string | null
  siteId: string
  site: {
    name: string
  }
  _count: {
    items: number
    issues: number
  }
}

interface Site {
  id: string
  name: string
}

const areaTypes = [
  { value: "PARK", label: "Park" },
  { value: "POOL", label: "Havuz" },
  { value: "GYM", label: "Spor Salonu" },
  { value: "PARKING", label: "Otopark" },
  { value: "GARDEN", label: "Bahçe" },
  { value: "OTHER", label: "Diğer" },
]

export default function OrtakAlanlarPage() {
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([])
  const [filteredAreas, setFilteredAreas] = useState<CommonArea[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<CommonArea | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSiteId, setFilterSiteId] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    type: "OTHER",
    description: "",
    siteId: "",
  })

  useEffect(() => {
    fetchCommonAreas()
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = commonAreas.filter(area => {
      const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          area.site.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSite = filterSiteId === "all" || area.siteId === filterSiteId
      const matchesType = filterType === "all" || area.type === filterType
      
      return matchesSearch && matchesSite && matchesType
    })
    setFilteredAreas(filtered)
  }, [searchQuery, filterSiteId, filterType, commonAreas])

  const fetchCommonAreas = async () => {
    try {
      const res = await fetch("/api/common-areas")
      const data = await res.json()
      setCommonAreas(data)
      setFilteredAreas(data)
    } catch (error) {
      console.error("Error fetching common areas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites")
      const data = await res.json()
      setSites(data)
    } catch (error) {
      console.error("Error fetching sites:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingArea ? `/api/common-areas/${editingArea.id}` : "/api/common-areas"
      const method = editingArea ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchCommonAreas()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving common area:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ortak alanı silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/common-areas/${id}`, { method: "DELETE" })
      fetchCommonAreas()
    } catch (error) {
      console.error("Error deleting common area:", error)
    }
  }

  const openEditDialog = (area: CommonArea) => {
    setEditingArea(area)
    setFormData({
      name: area.name,
      type: area.type,
      description: area.description || "",
      siteId: area.siteId,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingArea(null)
    setFormData({
      name: "",
      type: "OTHER",
      description: "",
      siteId: "",
    })
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Ortak Alanlar</h1>
          <p className="text-gray-500 mt-1 text-lg">Tüm ortak alanları görüntüleyin ve yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Ortak Alan
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Ortak alan veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-white"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select value={filterSiteId} onValueChange={setFilterSiteId}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Site Filtrele" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Siteler</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Tür Filtrele" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {areaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ModernCard>

      {filteredAreas.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-green-50 mb-4">
            <MapPin className="h-12 w-12 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Ortak alan bulunamadı</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı ortak alan yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Ortak Alan Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <ModernCard key={area.id} hover padding="none" className="overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-green-400 to-emerald-600 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(area)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(area.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-white shadow-md border border-gray-100">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {area.name}
                    </h3>
                    <ModernBadge variant="success" size="sm">
                      {areaTypes.find(t => t.value === area.type)?.label || area.type}
                    </ModernBadge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {area.site.name}
                  </div>
                </div>

                {area.description && (
                  <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                    {area.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Package className="h-4 w-4" />
                      <span className="text-xs font-medium">Demirbaşlar</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{area._count.items}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Layers className="h-4 w-4" />
                      <span className="text-xs font-medium">Arızalar</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{area._count.issues}</span>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingArea ? "Ortak Alanı Düzenle" : "Yeni Ortak Alan Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Site *</label>
              <Select
                value={formData.siteId}
                onValueChange={(value) => setFormData({ ...formData, siteId: value })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                  <SelectValue placeholder="Site seçin" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ModernInput
              label="Alan Adı *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Çocuk Parkı"
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tür *</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  {areaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ModernTextarea
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ortak alan hakkında açıklama"
              rows={3}
            />

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingArea ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
