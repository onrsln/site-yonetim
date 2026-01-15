"use client"

import { useState } from "react"
import {
  Settings,
  Bell,
  Lock,
  User,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Save,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard } from "@/components/ui/modern-card"
import { ModernInput } from "@/components/ui/modern-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"

export default function AyarlarPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock settings state
  const [settings, setSettings] = useState({
    theme: "system",
    language: "tr",
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success toast (to be implemented)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Ayarlar</h1>
          <p className="text-gray-500 mt-1 text-lg">Sistem ve hesap tercihlerinizi yapılandırın</p>
        </div>
        <ModernButton onClick={handleSave} loading={isLoading} icon={<Save className="w-5 h-5" />}>
          Değişiklikleri Kaydet
        </ModernButton>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-white/50 p-1 rounded-xl border border-gray-200">
          <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            <User className="w-4 h-4 mr-2" />
            Hesap
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            <Palette className="w-4 h-4 mr-2" />
            Görünüm
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Güvenlik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6">
            <ModernCard title="Profil Bilgileri">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                    Fotoğrafı Değiştir
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModernInput
                      label="Ad Soyad"
                      defaultValue={session?.user?.name || ""}
                      icon={<User className="w-4 h-4" />}
                    />
                    <ModernInput
                      label="E-posta"
                      defaultValue={session?.user?.email || ""}
                      icon={<Mail className="w-4 h-4" />}
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dil</label>
                      <Select defaultValue={settings.language} onValueChange={(v) => setSettings({...settings, language: v})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tr">Türkçe</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Saat Dilimi</label>
                      <Select defaultValue="europe-istanbul">
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe-istanbul">(GMT+3) İstanbul</SelectItem>
                          <SelectItem value="europe-london">(GMT+0) London</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <ModernCard title="Bildirim Tercihleri" className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="space-y-0.5">
                <label className="text-base font-medium text-gray-900">E-posta Bildirimleri</label>
                <p className="text-sm text-gray-500">Önemli güncellemeleri e-posta ile al</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked: boolean) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="space-y-0.5">
                <label className="text-base font-medium text-gray-900">Push Bildirimleri</label>
                <p className="text-sm text-gray-500">Tarayıcı üzerinden anlık bildirim al</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked: boolean) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="space-y-0.5">
                <label className="text-base font-medium text-gray-900">Haftalık Rapor</label>
                <p className="text-sm text-gray-500">Haftalık özet raporunu pazar günleri al</p>
              </div>
              <Switch
                checked={settings.weeklyReport}
                onCheckedChange={(checked: boolean) => setSettings({...settings, weeklyReport: checked})}
              />
            </div>
          </ModernCard>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="grid gap-6">
            <ModernCard title="Tema Ayarları">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setSettings({...settings, theme: 'light'})}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Sun className="w-8 h-8 text-orange-500" />
                  <span className="font-medium">Açık</span>
                </button>
                <button
                  onClick={() => setSettings({...settings, theme: 'dark'})}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Moon className="w-8 h-8 text-indigo-500" />
                  <span className="font-medium">Koyu</span>
                </button>
                <button
                  onClick={() => setSettings({...settings, theme: 'system'})}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Monitor className="w-8 h-8 text-gray-500" />
                  <span className="font-medium">Sistem</span>
                </button>
              </div>
            </ModernCard>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <ModernCard title="Güvenlik Ayarları">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium text-gray-900">İki Faktörlü Doğrulama (2FA)</label>
                    <p className="text-sm text-gray-500">Hesabınız için ek güvenlik katmanı</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked: boolean) => setSettings({...settings, twoFactorAuth: checked})}
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900">Şifre Değiştir</h3>
                  <div className="grid gap-4 max-w-md">
                    <ModernInput
                      type="password"
                      placeholder="Mevcut Şifre"
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <ModernInput
                      type="password"
                      placeholder="Yeni Şifre"
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <ModernInput
                      type="password"
                      placeholder="Yeni Şifre (Tekrar)"
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <ModernButton variant="secondary" className="w-full">
                      Şifreyi Güncelle
                    </ModernButton>
                  </div>
                </div>
              </div>
            </ModernCard>

            <ModernCard title="Oturum Ayarları">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-base font-medium text-gray-900">Otomatik Oturum Kapatma</label>
                  <p className="text-sm text-gray-500">Hareketsiz kaldıktan sonra oturumu sonlandır</p>
                </div>
                <Select defaultValue={settings.sessionTimeout} onValueChange={(v) => setSettings({...settings, sessionTimeout: v})}>
                  <SelectTrigger className="w-32 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Dakika</SelectItem>
                    <SelectItem value="30">30 Dakika</SelectItem>
                    <SelectItem value="60">1 Saat</SelectItem>
                    <SelectItem value="never">Asla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </ModernCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
