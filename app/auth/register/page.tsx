"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setIsSuccess(true)
        setMessage("Kayıt başarılı! Lütfen email adresinizi kontrol edin ve hesabınızı onaylayın.")
      }
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Email Onayı Gerekli</CardTitle>
            <CardDescription>Hesabınız başarıyla oluşturuldu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>{email}</strong> adresine bir onay emaili gönderdik. Hesabınızı aktifleştirmek için
                emailinizdeki linke tıklayın.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Email gelmedi mi? Spam klasörünüzü kontrol edin.</p>
              <Link href="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold">Blog</span>
          </Link>
          <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
          <CardDescription>Blog topluluğuna katılın ve en güncel içeriklere erişin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Adınız ve soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {message && (
              <Alert variant={isSuccess ? "default" : "destructive"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
