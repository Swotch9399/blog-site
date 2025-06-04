"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Shield, Smartphone, Key, CheckCircle, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Simulated 2FA setup
  const qrCodeUrl =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiPlFSIEtvZHU8L3RleHQ+Cjwvc3ZnPgo="
  const secretKey = "JBSWY3DPEHPK3PXP"

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Simulated 2FA status check
        setTwoFactorEnabled(localStorage.getItem("2fa_enabled") === "true")
      } else {
        router.push("/auth/login")
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleEnable2FA = () => {
    setShowQRCode(true)
    setMessage("")
  }

  const handleVerify2FA = () => {
    // Simulated verification - in real app, this would verify with backend
    if (verificationCode === "123456" || verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      localStorage.setItem("2fa_enabled", "true")
      setShowQRCode(false)
      setVerificationCode("")
      setMessage("2FA başarıyla aktifleştirildi!")
    } else {
      setMessage("Geçersiz kod. Lütfen tekrar deneyin.")
    }
  }

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false)
    localStorage.setItem("2fa_enabled", "false")
    setMessage("2FA devre dışı bırakıldı.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard'a Dön
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Ayarlar</h1>
          </div>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Blog</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>Hesap bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Ad Soyad</Label>
                    <Input id="fullName" defaultValue={user?.user_metadata?.full_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                  </div>
                </div>
                <Button>Profili Güncelle</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Şifreyi Güncelle</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>İki Faktörlü Doğrulama (2FA)</span>
                  {twoFactorEnabled && (
                    <Badge variant="default" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aktif
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Hesabınızın güvenliğini artırmak için 2FA'yı etkinleştirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {!twoFactorEnabled && !showQRCode && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      İki faktörlü doğrulama, hesabınıza ek bir güvenlik katmanı ekler. Google Authenticator gibi bir
                      uygulama kullanarak giriş yaparken ek bir kod girmeniz gerekir.
                    </p>
                    <Button onClick={handleEnable2FA}>
                      <Smartphone className="h-4 w-4 mr-2" />
                      2FA'yı Etkinleştir
                    </Button>
                  </div>
                )}

                {showQRCode && (
                  <div className="space-y-4">
                    <div className="text-center space-y-4">
                      <p className="text-sm text-gray-600">Google Authenticator uygulamasıyla bu QR kodu tarayın:</p>
                      <div className="flex justify-center">
                        <img
                          src={qrCodeUrl || "/placeholder.svg"}
                          alt="2FA QR Code"
                          className="border rounded-lg"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Manuel giriş için gizli anahtar:</p>
                        <code className="text-sm font-mono">{secretKey}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Doğrulama Kodu</Label>
                      <Input
                        id="verificationCode"
                        placeholder="6 haneli kodu girin"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleVerify2FA}>
                        <Key className="h-4 w-4 mr-2" />
                        Doğrula ve Etkinleştir
                      </Button>
                      <Button variant="outline" onClick={() => setShowQRCode(false)}>
                        İptal
                      </Button>
                    </div>
                  </div>
                )}

                {twoFactorEnabled && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">2FA başarıyla etkinleştirildi</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Hesabınız artık iki faktörlü doğrulama ile korunuyor. Giriş yaparken Google Authenticator'dan kodu
                      girmeniz gerekecek.
                    </p>
                    <Button variant="destructive" onClick={handleDisable2FA}>
                      2FA'yı Devre Dışı Bırak
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Tercihleri</CardTitle>
                <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Bildirimleri</Label>
                    <p className="text-sm text-gray-600">Yeni yorumlar ve etkileşimler için email alın</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pazarlama Emailları</Label>
                    <p className="text-sm text-gray-600">Yeni özellikler ve güncellemeler hakkında bilgi alın</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Güvenlik Uyarıları</Label>
                    <p className="text-sm text-gray-600">Hesap güvenliği ile ilgili önemli bildirimler</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
