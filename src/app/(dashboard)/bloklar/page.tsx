"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Building,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Search,
  Building2,
  Layers,
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
import Link from "next/link"

interface Block {
  id: string
  name: string
  siteId: string
  site: {
    name: string
  }
  _count: {
    floors: number
    apartments: number
    issues: number
  }
}

interface Site {
  id: string
  name: string
}

export default function BloklarPage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSiteId, setFilterSiteId] = useState<string>("all")
  
  const [formData, setFormData] = useState({
    name: "",
    siteId: "",
  })

  useEffect(() => {
    fetchBlocks()
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = blocks.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          block.site.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSite = filterSiteId === "all" || block.siteId === filterSiteId
      return matchesSearch && matchesSite
    })
    setFilteredBlocks(filtered)
  }, [searchQuery, filterSiteId, blocks])

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/blocks")
      const data = await res.json()
      setBlocks(data)
      setFilteredBlocks(data)
    } catch (error) {
      console.error("Error fetching blocks:", error)
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
      const url = editingBlock ? `/api/blocks/${editingBlock.id}` : "/api/blocks"
      const method = editingBlock ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchBlocks()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving block:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bloğu silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/blocks/${id}`, { method: "DELETE" })
      fetchBlocks()
    } catch (error) {
      console.error("Error deleting block:", error)
    }
  }

  const openEditDialog = (block: Block) => {
    setEditingBlock(block)
    setFormData({
      name: block.name,
      siteId: block.siteId,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingBlock(null)
    setFormData({ name: "", siteId: "" })
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Bloklar</h1>
          <p className="text-slate-400 mt-1 text-lg">Tüm blokları görüntüleyin ve yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Blok
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Blok veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterSiteId} onValueChange={setFilterSiteId}>
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
        </div>
      </ModernCard>

      {filteredBlocks.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-indigo-50 mb-4">
            <Building className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Blok bulunamadı</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı blok yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Blok Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlocks.map((block) => (
            <ModernCard key={block.id} hover padding="none" className="overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-slate-800/50/20 hover:bg-slate-800/50/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(block)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(block.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-slate-800/50 shadow-md border border-white/10">
                    <Building className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="pt-10 px-6 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-600 transition-colors">{block.name}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    {block.site.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Layers className="h-4 w-4" />
                      <span className="text-xs font-medium">Katlar</span>
                    </div>
                    <span className="text-lg font-bold text-white">{block._count.floors}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Home className="h-4 w-4" />
                      <span className="text-xs font-medium">Daireler</span>
                    </div>
                    <span className="text-lg font-bold text-white">{block._count.apartments}</span>
                  </div>
                </div>

                {block._count.issues > 0 && (
                  <div className="mt-4">
                    <ModernBadge variant="warning" size="sm" className="w-full justify-center">
                      {block._count.issues} Aktif Eksiklik
                    </ModernBadge>
                  </div>
                )}
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-800/50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">
              {editingBlock ? "Bloğu Düzenle" : "Yeni Blok Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Site *</label>
              <Select
                value={formData.siteId}
                onValueChange={(value) => setFormData({ ...formData, siteId: value })}
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

            <ModernInput
              label="Blok Adı *"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örnek: A Blok"
              required
            />

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingBlock ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
