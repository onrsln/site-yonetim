"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { FullPageLoading } from "@/components/ui/loading"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  if (status === "loading") {
    return <FullPageLoading />
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
