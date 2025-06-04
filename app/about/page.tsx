import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Target, Heart, Award } from "lucide-react"

const teamMembers = [
  {
    name: "Ahmet Yılmaz",
    role: "Kurucu & Baş Editör",
    bio: "10+ yıllık web geliştirme deneyimi. React, Next.js ve modern web teknolojileri uzmanı.",
    avatar: "/placeholder.svg?height=100&width=100",
    specialties: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Zeynep Kaya",
    role: "Backend Uzmanı",
    bio: "Supabase, Node.js ve veritabanı sistemleri konularında uzman. Açık kaynak projelere katkıda bulunuyor.",
    avatar: "/placeholder.svg?height=100&width=100",
    specialties: ["Supabase", "Node.js", "PostgreSQL"],
  },
  {
    name: "Mehmet Demir",
    role: "UI/UX Tasarımcı",
    bio: "Modern ve kullanıcı dostu arayüzler tasarlıyor. Tailwind CSS ve design systems konularında uzman.",
    avatar: "/placeholder.svg?height=100&width=100",
    specialties: ["UI/UX", "Tailwind CSS", "Figma"],
  },
]

const values = [
  {
    icon: Target,
    title: "Kaliteli İçerik",
    description: "Her yazımızı titizlikle araştırıyor ve en güncel bilgileri paylaşıyoruz.",
  },
  {
    icon: Users,
    title: "Topluluk Odaklı",
    description: "Geliştiriciler topluluğuna değer katmak ve birlikte öğrenmek önceliğimiz.",
  },
  {
    icon: Heart,
    title: "Açık Kaynak Ruhu",
    description: "Bilgiyi paylaşmaya ve açık kaynak projelere katkıda bulunmaya inanıyoruz.",
  },
  {
    icon: Award,
    title: "Sürekli Gelişim",
    description: "Teknoloji hızla değişiyor, biz de sürekli öğreniyor ve gelişiyoruz.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Blog</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hakkımızda
            <span className="block">Blog Hikayesi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            2020 yılında kurulan Blog, Türkiye'nin en güncel teknoloji içeriklerini sunan platformlardan biri. Amacımız,
            geliştiriciler ve teknoloji meraklıları için kaliteli, anlaşılır ve pratik içerikler üretmek.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Misyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Türkiye'deki geliştiriciler ve teknoloji meraklıları için en güncel, kaliteli ve pratik içerikleri
                  üretmek. Karmaşık teknolojileri anlaşılır bir dille açıklayarak, herkesin teknoloji dünyasına kolayca
                  adapte olmasını sağlamak.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Vizyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Türkiye'nin en büyük ve en güvenilir teknoloji içerik platformu olmak. Geliştiriciler topluluğunun
                  buluşma noktası haline gelerek, bilgi paylaşımını ve işbirliğini teşvik etmek.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-gray-600">Bizi yönlendiren temel ilkeler</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-gray-600">Blog'u hayata geçiren yetenekli ekip</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rakamlarla Blog</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Blog Yazısı" },
              { number: "10K+", label: "Aylık Okuyucu" },
              { number: "2K+", label: "Topluluk Üyesi" },
              { number: "50+", label: "Konu Başlığı" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Topluluğumuza Katılın</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            En güncel teknoloji haberlerini kaçırmayın. Ücretsiz hesap oluşturun ve premium içeriklere erişin.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Hemen Başlayın
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <h4 className="text-xl font-bold">Blog</h4>
              </div>
              <p className="text-gray-400">Teknoloji dünyasının en güncel haberlerini ve trendlerini takip edin.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Kategoriler</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    AI & ML
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Sayfalar</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Kategoriler
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hesap</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white transition-colors">
                    Kayıt Ol
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Blog. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
