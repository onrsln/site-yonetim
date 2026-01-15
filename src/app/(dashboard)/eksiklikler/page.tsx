"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  AlertTriangle,
  Filter,
  Search,
  Camera,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  issueStatusLabels,
  issuePriorityLabels,
  issueTypeLabels,
  formatDateTime,
} from "@/lib/utils"
import Link from "next/link"

interface Issue {
  id: string
  title: string
  description: string | null
  type: string
  priority: string
  status: string
  createdAt: string
  site: { name: string } | null
  block: { name: string } | null
  floor: { name: string } | null
  apartment: { number: string } | null
  floorArea: { name: string } | null
  commonArea: { name: string } | null
  createdBy: { name: string }
  assignedTo: { name: string } | null
  media: { url: string; type: string }[]
  _count: { comments: number }
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
}

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  WAITING: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
}

export default function EksikliklerPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sites, setSites] = useState<{ id: string; name: string }[]>([])
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "DEFICIENCY",
    priority: "MEDIUM",
    siteId: "",
    blockId: "",
  })

  useEffect(() => {
    fetchIssues()
    fetchSites()
  }, [])

  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/issues")
      const data = await res.json()
      setIssues(data)
    } catch (error) {
      console.error("Error fetching issues:", error)
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
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchIssues()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error creating issue:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu eksikliği silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/issues/${id}`, { method: "DELETE" })
      fetchIssues()
    } catch (error) {
      console.error("Error deleting issue:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "DEFICIENCY",
      priority: "MEDIUM",
      siteId: "",
      blockId: "",
    })
    setBlocks([])
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus
    const matchesPriority = filterPriority === "all" || issue.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getLocationText = (issue: Issue) => {
    const parts = []
    if (issue.site) parts.push(issue.site.name)
    if (issue.block) parts.push(issue.block.name)
    if (issue.floor) parts.push(issue.floor.name)
    if (issue.apartment) parts.push(`Daire ${issue.apartment.number}`)
    if (issue.floorArea) parts.push(issue.floorArea.name)
    if (issue.commonArea) parts.push(issue.commonArea.name)
    return parts.join(" > ") || "Konum belirtilmemiş"
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eksiklikler</h1>
          <p className="text-gray-500">Tüm eksiklikleri ve arızaları yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Eksiklik
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Eksiklik ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {Object.entries(issueStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Öncelik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Öncelikler</SelectItem>
                {Object.entries(issuePriorityLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Eksiklik bulunamadı</h3>
            <p className="text-gray-500 mb-4">Henüz kayıtlı eksiklik yok veya filtrelerinize uygun sonuç yok</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Eksiklik Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={priorityColors[issue.priority]}>
                        {issuePriorityLabels[issue.priority]}
                      </Badge>
                      <Badge className={statusColors[issue.status]}>
                        {issueStatusLabels[issue.status]}
                      </Badge>
                      <Badge variant="outline">
                        {issueTypeLabels[issue.type]}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">{issue.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{getLocationText(issue)}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Oluşturan: {issue.createdBy.name}</span>
                      <span>{formatDateTime(issue.createdAt)}</span>
                      {issue.media.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {issue.media.length} medya
                        </span>
                      )}
                      {issue._count.comments > 0 && (
                        <span>{issue._count.comments} yorum</span>
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
                        <Link href={`/eksiklikler/${issue.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Detay
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/eksiklikler/${issue.id}/duzenle`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Düzenle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(issue.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Yeni Eksiklik Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Eksiklik başlığı"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tür</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(issueTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Öncelik</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(issuePriorityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site</Label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, siteId: value, blockId: "" })
                    fetchBlocks(value)
                  }}
                >
                  <SelectTrigger>
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
                <Label>Blok</Label>
                <Select
                  value={formData.blockId}
                  onValueChange={(value) => setFormData({ ...formData, blockId: value })}
                  disabled={!formData.siteId}
                >
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Eksiklik hakkında detaylı açıklama"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
