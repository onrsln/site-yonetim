"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Users,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Shield,
  Mail,
  Phone,
  User
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

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  image: string | null
  createdAt: string
}

const roleVariants: Record<string, "primary" | "secondary" | "success" | "warning" | "danger" | "info"> = {
  ADMIN: "danger",
  MANAGER: "warning",
  STAFF: "info",
  USER: "secondary",
}

const roleLabels: Record<string, string> = {
  ADMIN: "Yönetici",
  MANAGER: "Müdür",
  STAFF: "Personel",
  USER: "Kullanıcı",
}

export default function KullanicilarPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      const matchesRole = filterRole === "all" || user.role === filterRole
      return matchesSearch && matchesRole
    })
    setFilteredUsers(filtered)
  }, [searchQuery, filterRole, users])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchUsers()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" })
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Password is typically not populated for editing
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
    })
  }

  if (isLoading) {
    return <Loading className="min-h-[400px]" size="lg" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Kullanıcılar</h1>
          <p className="text-slate-400 mt-1 text-lg">Sistem kullanıcılarını ve yetkilerini yönetin</p>
        </div>
        <ModernButton onClick={() => { resetForm(); setIsDialogOpen(true); }} icon={<Plus className="w-5 h-5" />}>
          Yeni Kullanıcı
        </ModernButton>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Ad soyad veya e-posta ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Rol Filtrele" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {filteredUsers.length === 0 ? (
        <ModernCard className="flex flex-col items-center justify-center py-16 text-center" variant="bordered">
          <div className="p-4 rounded-full bg-blue-50 mb-4">
            <Users className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Kullanıcı bulunamadı</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Aradığınız kriterlere uygun kullanıcı bulunamadı.
          </p>
          <div className="mt-6">
            <ModernButton onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Kullanıcı Ekle
            </ModernButton>
          </div>
        </ModernCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <ModernCard key={user.id} hover padding="none" className="overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-slate-800/50/20 hover:bg-slate-800/50/30 text-white backdrop-blur-sm transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-slate-800/50 p-1 shadow-lg">
                    <div className="h-full w-full rounded-full bg-slate-800/50 flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt={user.name || ""} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-600 transition-colors">
                    {user.name || "İsimsiz Kullanıcı"}
                  </h3>
                  <div className="flex justify-center mt-2">
                    <ModernBadge variant={roleVariants[user.role] || "secondary"} size="sm">
                      {roleLabels[user.role] || user.role}
                    </ModernBadge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/10">
                    <div className="p-2 rounded-lg bg-slate-800/50 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">E-posta</p>
                      <p className="text-sm font-medium text-white truncate" title={user.email || ""}>
                        {user.email}
                      </p>
                    </div>
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
              {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <ModernInput
              label="Ad Soyad *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Ahmet Yılmaz"
              required
            />
            
            <ModernInput
              label="E-posta *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmet@ornek.com"
              required
            />

            {!editingUser && (
              <ModernInput
                label="Şifre *"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
                required
              />
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Rol</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 mt-4">
              <ModernButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton type="submit">
                {editingUser ? "Güncelle" : "Ekle"}
              </ModernButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
