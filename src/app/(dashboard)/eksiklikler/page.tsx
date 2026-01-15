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
  MessageSquare,
  Upload,
  Video,
  X
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
  DialogDescription,
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
    status: "OPEN",
    siteId: "",
    blockId: "",
    assignedToId: "",
  })
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedVideos, setSelectedVideos] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

  useEffect(() => {
    fetchIssues()
    fetchSites()
    fetchUsers()
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

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    setSelectedImages(prev => [...prev, ...files])
    
    // Create preview URLs for all files
    const previews = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })
    )
    
    setImagePreview(prev => [...prev, ...previews])
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedVideos(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // First create the issue
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newIssue = await res.json()
        
        // If there are images or videos, upload them
        if (selectedImages.length > 0 || selectedVideos.length > 0) {
          const uploadFormData = new FormData()
          
          selectedImages.forEach((image) => {
            uploadFormData.append("images", image)
          })
          
          selectedVideos.forEach((video) => {
            uploadFormData.append("videos", video)
          })
          
          // Upload media to the issue
          await fetch(`/api/issues/${newIssue.id}/media`, {
            method: "POST",
            body: uploadFormData,
          })
        }
        
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
      status: "OPEN",
      siteId: "",
      blockId: "",
      assignedToId: "",
    })
    setBlocks([])
    setSelectedImages([])
    setSelectedVideos([])
    setImagePreview([])
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Eksiklikler</h1>
          <p className="text-slate-400 mt-1 text-lg">Tüm eksiklikleri ve arızaları yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Eksiklik
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Eksiklik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
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
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
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
          <h3 className="text-xl font-semibold text-white">Eksiklik bulunamadı</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
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
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-white/10">
                      {issueTypeLabels[issue.type]}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-600 transition-colors">
                    {issue.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocationText(issue)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
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

                <div className="flex items-center gap-2 md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 transition-colors">
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
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 bg-slate-800/50 border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">Yeni Eksiklik Ekle</DialogTitle>
            <DialogDescription className="text-slate-400">
              Eksiklik veya arıza bilgilerini girin. Fotoğraf ve video ekleyebilirsiniz.
            </DialogDescription>
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
                <label className="text-sm font-semibold text-slate-200">Tür</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
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
                <label className="text-sm font-semibold text-slate-200">Öncelik</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
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
                <label className="text-sm font-semibold text-slate-200">Site</label>
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
                <label className="text-sm font-semibold text-slate-200">Blok</label>
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

            <ModernTextarea
              label="Açıklama"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Eksiklik hakkında detaylı açıklama"
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
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
                    {Object.entries(issueStatusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Teknisyen Ata</label>
                <Select
                  value={formData.assignedToId}
                  onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fotoğraf Yükleme */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Fotoğraflar</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-500/50 bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all">
                  <Camera className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-300">Fotoğraf Ekle</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Yükleme */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Videolar</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all">
                  <Video className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-300">Video Ekle</span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
                {selectedVideos.length > 0 && (
                  <div className="space-y-2">
                    {selectedVideos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-white/10">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-300 truncate">{video.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="p-1 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
