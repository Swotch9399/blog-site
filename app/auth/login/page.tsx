"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setMessage("Lütfen önce email adresinizi onaylayın. Kayıt olurken gönderilen emaildeki linke tıklayın.")
        } else {
          setMessage(error.message)
        }
      } else {
        router.push("/dashboard")
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
          <CardTitle className="text-2xl">Giriş Yap</CardTitle>
          <CardDescription>Hesabınıza giriş yapın ve içeriklere erişin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {message && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Şifrenizi mi unuttunuz?
            </Link>
            <p className="text-sm text-muted-foreground">
              Hesabınız yok mu?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Kayıt olun
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
