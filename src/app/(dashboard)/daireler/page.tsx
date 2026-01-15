"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Home,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Building2,
  Building,
  Layers,
  Eye,
  User,
  Key
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

interface Apartment {
  id: string
  number: string
  floorId: string
  floor: {
    name: string
    block: {
      id: string
      name: string
      site: {
        id: string
        name: string
      }
    }
  }
  tenant: { name: string } | null
  owner: { name: string } | null
  status: string
  type: string
}

interface Site {
  id: string
  name: string
}

interface Block {
  id: string
  name: string
}

interface Floor {
  id: string
  name: string
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "secondary"> = {
  OCCUPIED: "success",
  EMPTY: "secondary",
  MAINTENANCE: "warning",
  RESERVED: "danger",
}

const statusLabels: Record<string, string> = {
  OCCUPIED: "Dolu",
  EMPTY: "Boş",
  MAINTENANCE: "Tadilat",
  RESERVED: "Rezerve",
}

export default function DairelerPage() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [floors, setFloors] = useState<Floor[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSiteId, setFilterSiteId] = useState<string>("all")
  const [filterBlockId, setFilterBlockId] = useState<string>("all")

  const [formData, setFormData] = useState({
    number: "",
    floorId: "",
    status: "EMPTY",
    type: "2+1",
    siteId: "",
    blockId: "",
  })

  useEffect(() => {
    fetchApartments()
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = apartments.filter(apt => {
      const matchesSearch = apt.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.floor.block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.floor.block.site.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesSite = filterSiteId === "all" || apt.floor.block.site.id === filterSiteId
      const matchesBlock = filterBlockId === "all" || apt.floor.block.id === filterBlockId
      
      return matchesSearch && matchesSite && matchesBlock
    })
    setFilteredApartments(filtered)
  }, [searchQuery, filterSiteId, filterBlockId, apartments])

  const fetchApartments = async () => {
    try {
      const res = await fetch("/api/apartments")
      const data = await res.json()
      setApartments(data)
      setFilteredApartments(data)
    } catch (error) {
      console.error("Error fetching apartments:", error)
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

  const fetchBlocks = async (siteId: string) => {
    try {
      const res = await fetch(`/api/blocks?siteId=${siteId}`)
      const data = await res.json()
      setBlocks(data)
    } catch (error) {
      console.error("Error fetching blocks:", error)
    }
  }

  const fetchFloors = async (blockId: string) => {
    try {
      const res = await fetch(`/api/floors?blockId=${blockId}`)
      const data = await res.json()
      setFloors(data)
    } catch (error) {
      console.error("Error fetching floors:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingApartment ? `/api/apartments/${editingApartment.id}` : "/api/apartments"
      const method = editingApartment ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: formData.number,
          floorId: formData.floorId,
          status: formData.status,
          type: formData.type,
        }),
      })

      if (res.ok) {
        fetchApartments()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving apartment:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu daireyi silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/apartments/${id}`, { method: "DELETE" })
      fetchApartments()
    } catch (error) {
      console.error("Error deleting apartment:", error)
    }
  }

  const openEditDialog = (apt: Apartment) => {
    setEditingApartment(apt)
    setFormData({
      number: apt.number,
      floorId: apt.floorId,
      status: apt.status,
      type: apt.type,
      siteId: apt.floor.block.site.id,
      blockId: apt.floor.block.id,
    })
    
    // Fetch dependencies
    fetchBlocks(apt.floor.block.site.id)
    fetchFloors(apt.floor.block.id)
    
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingApartment(null)
    setFormData({
      number: "",
      floorId: "",
      status: "EMPTY",
      type: "2+1",
      siteId: "",
      blockId: "",
    })
    setBlocks([])
    setFloors([])
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Daireler</h1>
          <p className="text-slate-400 mt-1 text-lg">Tüm daireleri görüntüleyin ve yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Daire
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Daire no, blok veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select value={filterSiteId} onValueChange={(value) => {
                setFilterSiteId(value)
                setFilterBlockId("all")
                if (value !== "all") fetchBlocks(value)
                else setBlocks([])
              }}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
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
              <Select value={filterBlockId} onValueChange={setFilterBlockId} disabled={filterSiteId === "all"}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="Blok Filtrele" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Bloklar</SelectItem>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>{block.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ModernCard>

      {filteredApartments.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-blue-50 mb-4">
            <Home className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Daire bulunamadı</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı daire yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Daire Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApartments.map((apt) => (
            <ModernCard key={apt.id} hover padding="none" className="overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-slate-700 to-slate-800 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-slate-800/50/20 hover:bg-slate-800/50/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(apt)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(apt.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/50">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                      Daire {apt.number}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
                      <Building2 className="h-3.5 w-3.5" />
                      {apt.floor.block.site.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-400">
                      <Building className="h-3.5 w-3.5" />
                      {apt.floor.block.name} - {apt.floor.name}
                    </div>
                  </div>
                  <ModernBadge variant={statusVariants[apt.status]} size="sm">
                    {statusLabels[apt.status]}
                  </ModernBadge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Soğuk Su</span>
                    </div>
                    <span className="text-sm font-bold text-white">{apt.number}001</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Sıcak Su</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Elektrik</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Doğalgaz</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <ModernButton className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" size="sm">
                    Sayaç Okumaları
                  </ModernButton>
                  <div className="grid grid-cols-2 gap-2">
                    <ModernButton className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700" size="sm" onClick={() => openEditDialog(apt)}>
                      Düzenle
                    </ModernButton>
                    <ModernButton className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700" size="sm" onClick={() => handleDelete(apt.id)}>
                      Sil
                    </ModernButton>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ModernButton className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700" size="sm">
                      QR Kod
                    </ModernButton>
                    <ModernButton className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700" size="sm">
                      Sil
                    </ModernButton>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-800/50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-slate-800/50 border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">
              {editingApartment ? "Daireyi Düzenle" : "Yeni Daire Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Site *</label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, siteId: value, blockId: "", floorId: "" })
                    fetchBlocks(value)
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
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
                <label className="text-sm font-semibold text-slate-200">Blok *</label>
                <Select
                  value={formData.blockId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, blockId: value, floorId: "" })
                    fetchFloors(value)
                  }}
                  disabled={!formData.siteId}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue placeholder="Blok seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>{block.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Kat *</label>
                <Select
                  value={formData.floorId}
                  onValueChange={(value) => setFormData({ ...formData, floorId: value })}
                  disabled={!formData.blockId}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue placeholder="Kat seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ModernInput
                label="Daire No *"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Örn: 12"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Tip</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1+0">1+0</SelectItem>
                    <SelectItem value="1+1">1+1</SelectItem>
                    <SelectItem value="2+1">2+1</SelectItem>
                    <SelectItem value="3+1">3+1</SelectItem>
                    <SelectItem value="4+1">4+1</SelectItem>
                    <SelectItem value="Dubleks">Dubleks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Durum</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
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

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingApartment ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
