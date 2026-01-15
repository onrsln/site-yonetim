"use client"

import { useState, useEffect } from "react"
import { Plus, Building2, MapPin, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites")
      const data = await res.json()
      setSites(data)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siteler</h1>
          <p className="text-gray-500">Tüm siteleri görüntüleyin ve yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Site
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Henüz site yok</h3>
            <p className="text-gray-500 mb-4">İlk sitenizi ekleyerek başlayın</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Site Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      {site.city && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {site.district && `${site.district}, `}{site.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
                        className="text-red-600"
                        onClick={() => handleDelete(site.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {site.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {site.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {site._count.blocks} Blok
                  </Badge>
                  <Badge variant="secondary">
                    {site._count.commonAreas} Ortak Alan
                  </Badge>
                  {site._count.issues > 0 && (
                    <Badge variant="warning">
                      {site._count.issues} Eksiklik
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSite ? "Site Düzenle" : "Yeni Site Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örnek: Yeşil Vadi Sitesi"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">İl</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="İstanbul"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">İlçe</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Kadıköy"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Tam adres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Site hakkında kısa açıklama"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingSite ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
