"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Building2,
  Building,
  Home
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

interface Floor {
  id: string
  name: string
  number: number
  blockId: string
  block: {
    id: string
    name: string
    site: {
      id: string
      name: string
    }
  }
  _count: {
    apartments: number
    floorAreas: number
  }
}

interface Site {
  id: string
  name: string
}

interface Block {
  id: string
  name: string
}

export default function KatlarPage() {
  const [floors, setFloors] = useState<Floor[]>([])
  const [filteredFloors, setFilteredFloors] = useState<Floor[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSiteId, setFilterSiteId] = useState<string>("all")
  const [filterBlockId, setFilterBlockId] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    siteId: "",
    blockId: "",
  })

  useEffect(() => {
    fetchFloors()
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = floors.filter(floor => {
      const matchesSearch = floor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          floor.block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          floor.block.site.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesSite = filterSiteId === "all" || floor.block.site.id === filterSiteId
      const matchesBlock = filterBlockId === "all" || floor.block.id === filterBlockId
      
      return matchesSearch && matchesSite && matchesBlock
    })
    setFilteredFloors(filtered)
  }, [searchQuery, filterSiteId, filterBlockId, floors])

  const fetchFloors = async () => {
    try {
      const res = await fetch("/api/floors")
      const data = await res.json()
      setFloors(data)
      setFilteredFloors(data)
    } catch (error) {
      console.error("Error fetching floors:", error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingFloor ? `/api/floors/${editingFloor.id}` : "/api/floors"
      const method = editingFloor ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          number: parseInt(formData.number),
          blockId: formData.blockId,
        }),
      })

      if (res.ok) {
        fetchFloors()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving floor:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu katı silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/floors/${id}`, { method: "DELETE" })
      fetchFloors()
    } catch (error) {
      console.error("Error deleting floor:", error)
    }
  }

  const openEditDialog = (floor: Floor) => {
    setEditingFloor(floor)
    setFormData({
      name: floor.name,
      number: floor.number.toString(),
      siteId: floor.block.site.id,
      blockId: floor.block.id,
    })
    
    fetchBlocks(floor.block.site.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingFloor(null)
    setFormData({
      name: "",
      number: "",
      siteId: "",
      blockId: "",
    })
    setBlocks([])
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Katlar</h1>
          <p className="text-slate-400 mt-1 text-lg">Tüm katları görüntüleyin ve yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Kat
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Kat adı, blok veya site ara..."
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

      {filteredFloors.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-orange-50 mb-4">
            <Layers className="h-12 w-12 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Kat bulunamadı</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı kat yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Kat Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFloors.map((floor) => (
            <ModernCard key={floor.id} hover padding="none" className="overflow-hidden group">
              <div className="h-20 bg-gradient-to-br from-orange-400 to-pink-500 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-slate-800/50/20 hover:bg-slate-800/50/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(floor)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(floor.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-slate-800/50 shadow-md border border-white/10">
                    <Layers className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-600 transition-colors">
                    {floor.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
                    <Building2 className="h-3.5 w-3.5" />
                    {floor.block.site.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-400">
                    <Building className="h-3.5 w-3.5" />
                    {floor.block.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Home className="h-4 w-4" />
                      <span className="text-xs font-medium">Daireler</span>
                    </div>
                    <span className="text-lg font-bold text-white">{floor._count.apartments}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Layers className="h-4 w-4" />
                      <span className="text-xs font-medium">Alanlar</span>
                    </div>
                    <span className="text-lg font-bold text-white">{floor._count.floorAreas}</span>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-800/50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">
              {editingFloor ? "Katı Düzenle" : "Yeni Kat Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Site *</label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, siteId: value, blockId: "" })
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
                  onValueChange={(value) => setFormData({ ...formData, blockId: value })}
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
              <ModernInput
                label="Kat Adı *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: 1. Kat"
                required
              />
              <ModernInput
                label="Kat Numarası *"
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Örn: 1"
                required
              />
            </div>

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingFloor ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
