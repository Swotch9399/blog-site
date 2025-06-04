import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"

export function SupabaseSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Supabase Email Ayarları Rehberi
          </CardTitle>
          <CardDescription>
            Email doğrulama linklerinin doğru URL'e yönlendirmesi için Supabase Dashboard'da yapılması gereken ayarlar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Önemli:</strong> Bu ayarları Supabase Dashboard'dan yapmanız gerekiyor. Kod değişiklikleri yeterli
              değil!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">1. Site URL Ayarları</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Supabase Dashboard → Settings → General</p>
                <div className="space-y-1">
                  <p>
                    <strong>Site URL:</strong>
                  </p>
                  <Badge variant="outline">Development: http://localhost:3000</Badge>
                  <Badge variant="outline">Production: https://yourdomain.com</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2. Redirect URLs</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Supabase Dashboard → Authentication → URL Configuration</p>
                <div className="space-y-1">
                  <p>
                    <strong>Redirect URLs (her satıra bir tane):</strong>
                  </p>
                  <code className="block text-xs bg-white p-2 rounded border">
                    http://localhost:3000/auth/verify
                    <br />
                    http://localhost:3000/auth/reset-password
                    <br />
                    https://yourdomain.com/auth/verify
                    <br />
                    https://yourdomain.com/auth/reset-password
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">3. Email Templates</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Supabase Dashboard → Authentication → Email Templates</p>

                <div className="space-y-3">
                  <div>
                    <p>
                      <strong>Confirm signup template:</strong>
                    </p>
                    <code className="block text-xs bg-white p-2 rounded border">
                      Subject: Blog - Email Adresinizi Onaylayın
                      <br />
                      <br />
                      Body:
                      <br />
                      {`<h2>Blog'a Hoş Geldiniz!</h2>
<p>Hesabınızı aktifleştirmek için aşağıdaki linke tıklayın:</p>
<a href="{{ .ConfirmationURL }}">Email Adresimi Onayla</a>
<p>Bu link 24 saat geçerlidir.</p>`}
                    </code>
                  </div>

                  <div>
                    <p>
                      <strong>Reset password template:</strong>
                    </p>
                    <code className="block text-xs bg-white p-2 rounded border">
                      Subject: Blog - Şifre Sıfırlama
                      <br />
                      <br />
                      Body:
                      <br />
                      {`<h2>Şifre Sıfırlama Talebi</h2>
<p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
<a href="{{ .ConfirmationURL }}">Şifremi Sıfırla</a>
<p>Bu link 1 saat geçerlidir.</p>`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4. Auth Ayarları</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Supabase Dashboard → Authentication → Settings</p>
                <div className="space-y-1">
                  <p>
                    <strong>Aktif edilmesi gerekenler:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Enable email confirmations ✅</li>
                    <li>Enable signup ✅</li>
                    <li>Confirm email change ✅</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">5. Test Etme</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-800">Ayarları test etmek için:</p>
                    <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
                      <li>Yeni bir hesap oluşturun</li>
                      <li>Email'inizi kontrol edin</li>
                      <li>Email'deki linke tıklayın</li>
                      <li>Doğru URL'e yönlendirildiğini kontrol edin</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              <strong>Supabase Dashboard'a erişmek için:</strong>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                https://supabase.com/dashboard
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
