"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Video,
  MessageSquare,
  Edit,
  Trash2
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernBadge } from "@/components/ui/modern-badge"
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
  updatedAt: string
  site: { name: string } | null
  block: { name: string } | null
  floor: { name: string } | null
  apartment: { number: string } | null
  floorArea: { name: string } | null
  commonArea: { name: string } | null
  createdBy: { name: string; email: string }
  assignedTo: { name: string; email: string } | null
  media: { id: string; url: string; type: string }[]
  comments: { id: string; content: string; createdAt: string; user: { name: string } }[]
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

export default function EksiklikDetayPage() {
  const params = useParams()
  const router = useRouter()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchIssue(params.id as string)
    }
  }, [params.id])

  const fetchIssue = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`)
      if (res.ok) {
        const data = await res.json()
        setIssue(data)
      } else {
        router.push("/eksiklikler")
      }
    } catch (error) {
      console.error("Error fetching issue:", error)
      router.push("/eksiklikler")
    } finally {
      setIsLoading(false)
    }
  }

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

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Eksiklik Bulunamadı</h2>
        <p className="text-slate-400 mb-6">Bu eksiklik silinmiş veya mevcut değil.</p>
        <ModernButton asChild>
          <Link href="/eksiklikler">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Eksikliklere Dön
          </Link>
        </ModernButton>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <ModernButton variant="ghost" size="sm" asChild>
          <Link href="/eksiklikler">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Link>
        </ModernButton>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Eksiklik Detayı
          </h1>
        </div>
        <ModernButton variant="secondary" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Düzenle
        </ModernButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Info */}
          <ModernCard padding="lg">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
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

              <h2 className="text-2xl font-bold text-white">{issue.title}</h2>

              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{getLocationText(issue)}</span>
              </div>

              {issue.description && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Açıklama</h3>
                  <p className="text-slate-400 whitespace-pre-wrap">{issue.description}</p>
                </div>
              )}
            </div>
          </ModernCard>

          {/* Media */}
          {issue.media.length > 0 && (
            <ModernCard padding="lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-cyan-400" />
                Medya ({issue.media.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.media.map((media) => (
                  <div key={media.id} className="relative group">
                    {media.type === "IMAGE" ? (
                      <img
                        src={media.url}
                        alt="Issue media"
                        className="w-full h-32 object-cover rounded-lg border border-white/10"
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-center">
                        <Video className="h-8 w-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ModernCard>
          )}

          {/* Comments */}
          <ModernCard padding="lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              Yorumlar ({issue.comments.length})
            </h3>
            {issue.comments.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Henüz yorum yok</p>
            ) : (
              <div className="space-y-4">
                {issue.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-lg bg-slate-800/30 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">{comment.user.name}</span>
                      <span className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </ModernCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <ModernCard padding="lg">
            <h3 className="text-lg font-bold text-white mb-4">Detaylar</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Oluşturan</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-white">{issue.createdBy.name}</span>
                </div>
              </div>

              {issue.assignedTo && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Atanan</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white">{issue.assignedTo.name}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Oluşturma Tarihi</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-white">{formatDateTime(issue.createdAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Son Güncelleme</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-white">{formatDateTime(issue.updatedAt)}</span>
                </div>
              </div>
            </div>
          </ModernCard>

          {/* Actions */}
          <ModernCard padding="lg">
            <h3 className="text-lg font-bold text-white mb-4">İşlemler</h3>
            <div className="space-y-2">
              <ModernButton className="w-full" variant="primary" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Çözüldü Olarak İşaretle
              </ModernButton>
              <ModernButton className="w-full" variant="secondary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </ModernButton>
              <ModernButton className="w-full" variant="danger" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
