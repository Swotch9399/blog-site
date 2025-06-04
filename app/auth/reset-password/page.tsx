"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Lock, CheckCircle, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have the necessary tokens
    const access_token = searchParams.get("access_token")
    const refresh_token = searchParams.get("refresh_token")

    if (!access_token || !refresh_token) {
      setMessage("Geçersiz şifre sıfırlama linki")
    }
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Şifreler eşleşmiyor")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage("Şifre en az 6 karakter olmalıdır")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setIsSuccess(true)
        setMessage("Şifreniz başarıyla güncellendi!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold">Blog</span>
          </Link>
          <CardTitle className="text-2xl">Yeni Şifre Belirle</CardTitle>
          <CardDescription>Hesabınız için yeni bir şifre oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="En az 6 karakter"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {message && !isSuccess && (
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600">Dashboard'a yönlendiriliyorsunuz...</p>
            </div>
          )}

          <div className="mt-6 text-center">
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
