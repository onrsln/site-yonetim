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
  MapPin,
  Calendar,
  User,
  MessageSquare
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernTextarea } from "@/components/ui/modern-textarea"
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

const priorityVariants: Record<string, "secondary" | "info" | "warning" | "danger"> = {
  LOW: "secondary",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
}

const statusVariants: Record<string, "warning" | "info" | "primary" | "success" | "secondary" | "danger"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  WAITING: "primary",
  RESOLVED: "success",
  CLOSED: "secondary",
  CANCELLED: "danger",
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Eksiklikler</h1>
          <p className="text-gray-500 mt-1 text-lg">Tüm eksiklikleri ve arızaları yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Eksiklik
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Eksiklik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-white"
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Durum" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {Object.entries(issueStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Öncelik" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Öncelikler</SelectItem>
                {Object.entries(issuePriorityLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Eksiklik bulunamadı</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Henüz kayıtlı eksiklik yok veya filtrelerinize uygun sonuç bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Eksiklik Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid gap-4">
          {filteredIssues.map((issue) => (
            <ModernCard key={issue.id} hover padding="md" className="group border-l-4" style={{ 
              borderLeftColor: issue.priority === 'URGENT' ? '#ef4444' : 
                             issue.priority === 'HIGH' ? '#f59e0b' : 
                             issue.priority === 'MEDIUM' ? '#3b82f6' : '#94a3b8' 
            }}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <ModernBadge variant={priorityVariants[issue.priority]} size="sm">
                      {issuePriorityLabels[issue.priority]}
                    </ModernBadge>
                    <ModernBadge variant={statusVariants[issue.status]} size="sm">
                      {issueStatusLabels[issue.status]}
                    </ModernBadge>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                      {issueTypeLabels[issue.type]}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                    {issue.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocationText(issue)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {issue.createdBy.name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateTime(issue.createdAt)}
                    </div>
                    {issue.media.length > 0 && (
                      <div className="flex items-center gap-1.5 text-primary-600">
                        <Camera className="h-3.5 w-3.5" />
                        {issue.media.length} medya
                      </div>
                    )}
                    {issue._count.comments > 0 && (
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {issue._count.comments} yorum
                      </div>
                    )}
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
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(issue.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <ModernButton size="sm" variant="ghost" className="hidden md:flex" asChild>
                    <Link href={`/eksiklikler/${issue.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      İncele
                    </Link>
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      {/* New Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">Yeni Eksiklik Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <ModernInput
              label="Başlık *"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Eksiklik başlığı"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tür</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
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
                <label className="text-sm font-semibold text-gray-700">Öncelik</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
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
                <label className="text-sm font-semibold text-gray-700">Site</label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, siteId: value, blockId: "" })
                    fetchBlocks(value)
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
                <label className="text-sm font-semibold text-gray-700">Blok</label>
                <Select
                  value={formData.blockId}
                  onValueChange={(value) => setFormData({ ...formData, blockId: value })}
                  disabled={!formData.siteId}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-white">
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

            <ModernTextarea
              label="Açıklama"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Eksiklik hakkında detaylı açıklama"
              rows={4}
            />

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">Ekle</ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
