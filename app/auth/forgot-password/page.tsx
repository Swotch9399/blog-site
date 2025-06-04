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
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        setMessage(error.message)
      } else {
        setIsSuccess(true)
        setMessage("Şifre sıfırlama linki email adresinize gönderildi.")
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
          <Link href="/auth/login" className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold bg-clip-text text-transparent">Blog</span>
          </Link>
          <CardTitle className="text-2xl">Şifre Sıfırla</CardTitle>
          <CardDescription>
            {isSuccess
              ? "Email adresinizi kontrol edin"
              : "Email adresinizi girin, size şifre sıfırlama linki gönderelim"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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

              {message && !isSuccess && (
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600">
                Email gelmedi mi? Spam klasörünüzü kontrol edin veya birkaç dakika bekleyip tekrar deneyin.
              </p>
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
