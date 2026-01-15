"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Package,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Building2,
  MapPin,
  Calendar,
  QrCode,
  Tag
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
import { Loading } from "@/components/ui/loading"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  status: string
  purchaseDate: string | null
  serialNumber: string | null
  siteId: string
  site: {
    name: string
  }
  commonAreaId: string | null
  commonArea: {
    name: string
  } | null
}

interface Site {
  id: string
  name: string
}

interface CommonArea {
  id: string
  name: string
}

const categories = [
  { value: "FURNITURE", label: "Mobilya" },
  { value: "ELECTRONICS", label: "Elektronik" },
  { value: "GARDEN", label: "Bahçe" },
  { value: "SPORTS", label: "Spor Ekipmanı" },
  { value: "TOOLS", label: "Hırdavat" },
  { value: "OTHER", label: "Diğer" },
]

const statusVariants: Record<string, "success" | "warning" | "danger" | "secondary" | "info"> = {
  NEW: "success",
  GOOD: "info",
  NEEDS_MAINTENANCE: "warning",
  BROKEN: "danger",
  SCRAP: "secondary",
}

const statusLabels: Record<string, string> = {
  NEW: "Yeni",
  GOOD: "İyi",
  NEEDS_MAINTENANCE: "Bakım Gerekli",
  BROKEN: "Arızalı",
  SCRAP: "Hurda",
}

export default function DemirbaslarPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSiteId, setFilterSiteId] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    category: "OTHER",
    quantity: "1",
    status: "NEW",
    serialNumber: "",
    siteId: "",
    commonAreaId: "",
  })

  useEffect(() => {
    fetchItems()
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.site.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesSite = filterSiteId === "all" || item.siteId === filterSiteId
      const matchesCategory = filterCategory === "all" || item.category === filterCategory
      
      return matchesSearch && matchesSite && matchesCategory
    })
    setFilteredItems(filtered)
  }, [searchQuery, filterSiteId, filterCategory, items])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/inventory")
      const data = await res.json()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("Error fetching inventory items:", error)
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

  const fetchCommonAreas = async (siteId: string) => {
    try {
      const res = await fetch(`/api/common-areas?siteId=${siteId}`)
      const data = await res.json()
      setCommonAreas(data)
    } catch (error) {
      console.error("Error fetching common areas:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingItem ? `/api/inventory/${editingItem.id}` : "/api/inventory"
      const method = editingItem ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
        }),
      })

      if (res.ok) {
        fetchItems()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving inventory item:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu demirbaşı silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/inventory/${id}`, { method: "DELETE" })
      fetchItems()
    } catch (error) {
      console.error("Error deleting inventory item:", error)
    }
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      status: item.status,
      serialNumber: item.serialNumber || "",
      siteId: item.siteId,
      commonAreaId: item.commonAreaId || "",
    })
    
    fetchCommonAreas(item.siteId)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      category: "OTHER",
      quantity: "1",
      status: "NEW",
      serialNumber: "",
      siteId: "",
      commonAreaId: "",
    })
    setCommonAreas([])
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Demirbaşlar</h1>
          <p className="text-gray-500 mt-1 text-lg">Tüm demirbaş envanterini yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Demirbaş
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Demirbaş adı, seri no veya site ara..."
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
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ModernCard>

      {filteredItems.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-purple-50 mb-4">
            <Package className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Demirbaş bulunamadı</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı demirbaş yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Demirbaş Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ModernCard key={item.id} hover padding="none" className="overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-purple-500 to-indigo-600 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-white shadow-md border border-gray-100">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h3>
                    <ModernBadge variant={statusVariants[item.status]} size="sm">
                      {statusLabels[item.status]}
                    </ModernBadge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {item.site.name}
                  </div>
                  {item.commonArea && (
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {item.commonArea.name}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs font-medium">Kategori</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <QrCode className="h-4 w-4" />
                      <span className="text-xs font-medium">Adet</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{item.quantity}</span>
                  </div>
                </div>

                {item.serialNumber && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                      <QrCode className="h-3 w-3" />
                      SN: {item.serialNumber}
                    </p>
                  </div>
                )}
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingItem ? "Demirbaşı Düzenle" : "Yeni Demirbaş Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <ModernInput
              label="Demirbaş Adı *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Ofis Sandalyesi"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Site *</label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, siteId: value, commonAreaId: "" })
                    fetchCommonAreas(value)
                  }}
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ortak Alan</label>
                <Select
                  value={formData.commonAreaId}
                  onValueChange={(value) => setFormData({ ...formData, commonAreaId: value })}
                  disabled={!formData.siteId}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                    <SelectValue placeholder="Alan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Seçiniz</SelectItem>
                    {commonAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Kategori</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Durum</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="Adet"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <ModernInput
                label="Seri No"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Varsa girin"
              />
            </div>

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingItem ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
