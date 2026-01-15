"use client"

import { useState, useEffect } from "react"
import { Plus, Building2, MapPin, MoreHorizontal, Pencil, Trash2, Eye, Building, Search } from "lucide-react"
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
import { Loading } from "@/components/ui/loading"
import Link from "next/link"

interface Site {
  id: string
  name: string
  address: string | null
  city: string | null
  district: string | null
  description: string | null
  _count: {
    blocks: number
    commonAreas: number
    issues: number
  }
}

export default function SitelerPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    description: "",
  })

  useEffect(() => {
    fetchSites()
  }, [])

  useEffect(() => {
    const filtered = sites.filter(site => 
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.district?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredSites(filtered)
  }, [searchQuery, sites])

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites")
      const data = await res.json()
      setSites(data)
      setFilteredSites(data)
    } catch (error) {
      console.error("Error fetching sites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingSite ? `/api/sites/${editingSite.id}` : "/api/sites"
      const method = editingSite ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchSites()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving site:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu siteyi silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/sites/${id}`, { method: "DELETE" })
      fetchSites()
    } catch (error) {
      console.error("Error deleting site:", error)
    }
  }

  const openEditDialog = (site: Site) => {
    setEditingSite(site)
    setFormData({
      name: site.name,
      address: site.address || "",
      city: site.city || "",
      district: site.district || "",
      description: site.description || "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingSite(null)
    setFormData({ name: "", address: "", city: "", district: "", description: "" })
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Siteler</h1>
          <p className="text-gray-500 mt-1 text-lg">Tüm siteleri görüntüleyin ve yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Site
        </ModernButton>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <ModernInput 
          placeholder="Site ara..." 
          icon={<Search className="w-5 h-5" />} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredSites.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-gray-50 mb-4">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {searchQuery ? "Sonuç bulunamadı" : "Henüz site yok"}
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            {searchQuery 
              ? `"${searchQuery}" araması için sonuç bulunamadı.` 
              : "Sistemde kayıtlı site bulunmuyor. Yeni bir site ekleyerek başlayın."}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                İlk Siteyi Ekle
              </ModernButton>
            </div>
          )}
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <ModernCard key={site.id} hover padding="none" className="overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/siteler/${site.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Görüntüle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(site)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(site.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute -bottom-6 left-6">
                  <div className="p-3 rounded-xl bg-white shadow-md border border-gray-100">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="pt-10 px-6 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{site.name}</h3>
                  {site.city && (
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {site.district && `${site.district}, `}{site.city}
                    </p>
                  )}
                </div>
                
                {site.description && (
                  <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                    {site.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                    <Building className="h-4 w-4" />
                    {site._count.blocks} Blok
                  </div>
                  {site._count.issues > 0 && (
                    <ModernBadge variant="warning" size="sm">
                      {site._count.issues} Eksiklik
                    </ModernBadge>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <Link href={`/siteler/${site.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Detayları Gör
                    <Eye className="h-4 w-4" />
                  </Link>
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
              {editingSite ? "Siteyi Düzenle" : "Yeni Site Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <ModernInput
              label="Site Adı *"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örnek: Yeşil Vadi Sitesi"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="İl"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="İstanbul"
              />
              <ModernInput
                label="İlçe"
                id="district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Kadıköy"
              />
            </div>
            <ModernInput
              label="Adres"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Tam adres"
            />
            <ModernTextarea
              label="Açıklama"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Site hakkında kısa açıklama"
              rows={3}
            />
            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingSite ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
