import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount)
}

export const floorAreaTypeLabels: Record<string, string> = {
  STAIRCASE: "Merdiven Boşluğu",
  ELEVATOR_PASSENGER: "Yolcu Asansörü",
  ELEVATOR_FREIGHT: "Yük Asansörü",
  ELEVATOR_SERVICE: "Servis Asansörü",
  METER_SHAFT: "Sayaç Şaftı",
  ELECTRICAL_ROOM: "Elektrik Odası",
  GARBAGE_AREA: "Çöp Alanı",
  FIRE_CABINET: "Yangın Dolabı",
  CORRIDOR: "Koridor",
  LOBBY: "Lobi",
  OTHER: "Diğer",
}

export const commonAreaTypeLabels: Record<string, string> = {
  PLAYGROUND: "Çocuk Oyun Parkı",
  SPA: "Spa",
  SAUNA: "Sauna",
  FITNESS: "Fitness",
  HAMMAM: "Hamam",
  GENERATOR: "Jeneratör",
  TRANSFORMER: "Trafo Merkezi",
  PARKING: "Açık Otopark",
  PARKING_INDOOR: "Kapalı Otopark",
  GARDEN: "Bahçe",
  POOL: "Havuz",
  MEETING_ROOM: "Toplantı Salonu",
  SECURITY: "Güvenlik",
  MANAGEMENT_OFFICE: "Yönetim Ofisi",
  WAREHOUSE: "Depo",
  OTHER: "Diğer",
}

export const issueStatusLabels: Record<string, string> = {
  OPEN: "Açık",
  IN_PROGRESS: "Devam Ediyor",
  WAITING: "Beklemede",
  RESOLVED: "Çözüldü",
  CLOSED: "Kapatıldı",
  CANCELLED: "İptal",
}

export const issuePriorityLabels: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
}

export const issueTypeLabels: Record<string, string> = {
  DEFICIENCY: "Eksiklik",
  MALFUNCTION: "Arıza",
  MAINTENANCE: "Bakım",
  COMPLAINT: "Şikayet",
  SUGGESTION: "Öneri",
  OTHER: "Diğer",
}

export const roleLabels: Record<string, string> = {
  ADMIN: "Yönetici",
  MANAGER: "Site Müdürü",
  TECHNICIAN: "Teknisyen",
  USER: "Kullanıcı",
  VIEWER: "İzleyici",
}

export const assetStatusLabels: Record<string, string> = {
  ACTIVE: "Aktif",
  INACTIVE: "Pasif",
  MAINTENANCE: "Bakımda",
  BROKEN: "Arızalı",
  DISPOSED: "Hurdaya Ayrıldı",
}
