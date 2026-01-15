"use client"

import { useState } from "react"
import {
  Plus,
  DollarSign,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet
} from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for development
const mockTransactions = [
  {
    id: "1",
    type: "INCOME",
    category: "DUES",
    amount: 15000,
    description: "Aidat tahsilatı - Ocak 2024",
    date: "2024-02-15",
    site: "Yeşil Vadi Sitesi",
    paymentMethod: "BANK_TRANSFER"
  },
  {
    id: "2",
    type: "EXPENSE",
    category: "MAINTENANCE",
    amount: 3500,
    description: "Asansör bakım ücreti",
    date: "2024-02-14",
    site: "Yeşil Vadi Sitesi",
    paymentMethod: "CASH"
  },
  {
    id: "3",
    type: "INCOME",
    category: "PARKING",
    amount: 2000,
    description: "Otopark kira geliri",
    date: "2024-02-13",
    site: "Mavi Su Konutları",
    paymentMethod: "BANK_TRANSFER"
  },
  {
    id: "4",
    type: "EXPENSE",
    category: "UTILITIES",
    amount: 8500,
    description: "Elektrik faturası",
    date: "2024-02-12",
    site: "Yeşil Vadi Sitesi",
    paymentMethod: "BANK_TRANSFER"
  }
]

const transactionTypes = {
  INCOME: { label: "Gelir", variant: "success" as const, icon: ArrowUpRight },
  EXPENSE: { label: "Gider", variant: "danger" as const, icon: ArrowDownRight },
}

const categoryLabels: Record<string, string> = {
  DUES: "Aidat",
  PARKING: "Otopark",
  MAINTENANCE: "Bakım",
  UTILITIES: "Faturalar",
  SALARY: "Maaş",
  OTHER: "Diğer",
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Nakit",
  BANK_TRANSFER: "Banka Transferi",
  CREDIT_CARD: "Kredi Kartı",
  CHECK: "Çek",
}

export default function FinansPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense

  // Filtered data
  const filteredTransactions = transactions.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.site.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Finans Yönetimi</h1>
          <p className="text-slate-400 mt-1 text-lg">Gelir, gider ve mali durumu takip edin</p>
        </div>
        <ModernButton onClick={() => setIsDialogOpen(true)} icon={<Plus className="w-5 h-5" />}>
          Yeni İşlem
        </ModernButton>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <ModernCard padding="md" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Toplam Gelir</p>
              <p className="text-3xl font-bold text-green-600 mt-1">₺{totalIncome.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-400 mt-1">Bu ay</p>
            </div>
            <div className="p-4 rounded-xl bg-green-100">
              <ArrowUpRight className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard padding="md" className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Toplam Gider</p>
              <p className="text-3xl font-bold text-red-600 mt-1">₺{totalExpense.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-400 mt-1">Bu ay</p>
            </div>
            <div className="p-4 rounded-xl bg-red-100">
              <ArrowDownRight className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard padding="md" className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Net Bakiye</p>
              <p className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                ₺{balance.toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-slate-400 mt-1">Güncel durum</p>
            </div>
            <div className={`p-4 rounded-xl ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <Wallet className={`h-8 w-8 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard padding="md" className="bg-slate-800/50/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Açıklama veya site ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="bg-slate-800/50"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50 focus:ring-2 focus:ring-primary-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Tür Filtrele" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="INCOME">Gelir</SelectItem>
                <SelectItem value="EXPENSE">Gider</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModernCard>

      {/* Transactions List */}
      <div className="grid gap-4">
        {filteredTransactions.map((transaction) => {
          const typeConfig = transactionTypes[transaction.type as keyof typeof transactionTypes]
          const Icon = typeConfig.icon
          
          return (
            <ModernCard key={transaction.id} hover padding="md" className="group border-l-4" style={{
              borderLeftColor: transaction.type === 'INCOME' ? '#22c55e' : '#ef4444'
            }}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Icon className={`h-6 w-6 ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <ModernBadge variant={typeConfig.variant} size="sm">
                        {typeConfig.label}
                      </ModernBadge>
                      <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-white/10">
                        {categoryLabels[transaction.category]}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-600 transition-colors">
                      {transaction.description}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {transaction.site}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(transaction.date).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        {paymentMethodLabels[transaction.paymentMethod]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₺{transaction.amount.toLocaleString('tr-TR')}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </ModernCard>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-slate-800/50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-white/10">
            <DialogTitle className="text-xl font-bold text-white">Yeni Mali İşlem</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">İşlem Türü</label>
                <Select defaultValue="INCOME">
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Gelir</SelectItem>
                    <SelectItem value="EXPENSE">Gider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Kategori</label>
                <Select defaultValue="DUES">
                  <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="Tutar (₺)"
                type="number"
                placeholder="0.00"
                icon={<DollarSign className="w-4 h-4" />}
              />
              <ModernInput
                label="Tarih"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Ödeme Yöntemi</label>
              <Select defaultValue="BANK_TRANSFER">
                <SelectTrigger className="h-12 rounded-xl border-2 border-white/10 bg-slate-800/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentMethodLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ModernTextarea
              label="Açıklama"
              placeholder="İşlem hakkında detaylar..."
              rows={3}
            />

            <DialogFooter className="gap-2 mt-4">
              <ModernButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                İptal
              </ModernButton>
              <ModernButton onClick={() => setIsDialogOpen(false)}>
                Kaydet
              </ModernButton>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
