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
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

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
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg lg:hidden"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">SiteYönetim</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="mx-auto">
              <Building2 className="h-8 w-8 text-blue-600" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-blue-600")} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || "Kullanıcı"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <Link href="/bildirimler">
                    <Bell className="h-4 w-4 mr-2" />
                    Bildirimler
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/giris" })}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/giris" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
