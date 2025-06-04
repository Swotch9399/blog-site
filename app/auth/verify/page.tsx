"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyPage() {
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")
        const next = searchParams.get("next") ?? "/dashboard"

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })

          if (error) {
            setError(error.message)
          } else {
            setVerified(true)
            setTimeout(() => {
              router.push(next)
            }, 2000)
          }
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session) {
            setVerified(true)
            router.push("/dashboard")
          } else {
            setError("Geçersiz onay linki")
          }
        }
      } catch (err) {
        setError("Onay işlemi sırasında bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold bg-clip-text text-transparent">Blog</span>
          </Link>
          <CardTitle className="text-2xl">Email Onayı</CardTitle>
          <CardDescription>Hesabınız onaylanıyor...</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {loading && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Email adresiniz onaylanıyor...</p>
            </div>
          )}

          {!loading && verified && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-800">Başarılı!</h3>
                <p className="text-gray-600">
                  Email adresiniz başarıyla onaylandı. Dashboard'a yönlendiriliyorsunuz...
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard">Dashboard'a Git</Link>
              </Button>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Giriş Sayfasına Dön</Link>
                </Button>
                <p className="text-sm text-gray-600">
                  Yeni bir onay emaili almak için{" "}
                  <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
                    tekrar kayıt olun
                  </Link>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
