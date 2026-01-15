"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  LayoutDashboard,
  Building,
  Layers,
  Home,
  MapPin,
  Package,
  AlertTriangle,
  Wrench,
  Gauge,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Menu,
  X,
  CreditCard,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { ModernButton } from "@/components/ui/modern-button"

const menuItems = [
  {
    title: "Ana Sayfa",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Siteler",
    href: "/siteler",
    icon: Building2,
  },
  {
    title: "Bloklar",
    href: "/bloklar",
    icon: Building,
  },
  {
    title: "Katlar",
    href: "/katlar",
    icon: Layers,
  },
  {
    title: "Daireler",
    href: "/daireler",
    icon: Home,
  },
  {
    title: "Ortak Alanlar",
    href: "/ortak-alanlar",
    icon: MapPin,
  },
  {
    title: "Demirbaşlar",
    href: "/demirbaslar",
    icon: Package,
  },
  {
    title: "Eksiklikler",
    href: "/eksiklikler",
    icon: AlertTriangle,
  },
  {
    title: "Bakım",
    href: "/bakim",
    icon: Wrench,
  },
  {
    title: "Sayaçlar",
    href: "/sayaclar",
    icon: Gauge,
  },
  {
    title: "Finans",
    href: "/finans",
    icon: CreditCard,
  },
  {
    title: "Raporlar",
    href: "/raporlar",
    icon: FileText,
  },
  {
    title: "Kullanıcılar",
    href: "/kullanicilar",
    icon: Users,
  },
  {
    title: "Ayarlar",
    href: "/ayarlar",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-soft lg:hidden border border-white/20"
      >
        {isMobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-100 transition-all duration-300 flex flex-col shadow-soft",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 tracking-tight block leading-none">Site</span>
                <span className="font-medium text-sm text-gray-500 tracking-wide">Yönetim</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                    )}
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-200", 
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                    {!isCollapsed && isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          {!isCollapsed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-sm">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 text-white font-bold ring-2 ring-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {session?.user?.name || "Kullanıcı"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ModernButton
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs h-9 bg-white"
                  onClick={() => {/* Bildirimler */}}
                >
                  <Bell className="h-3.5 w-3.5 mr-1.5" />
                  Bildirim
                </ModernButton>
                <ModernButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs h-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => signOut({ callbackUrl: "/giris" })}
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Çıkış
                </ModernButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 text-white font-bold ring-2 ring-white cursor-pointer hover:scale-105 transition-transform" title={session?.user?.name || "Kullanıcı"}>
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/giris" })}
                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
