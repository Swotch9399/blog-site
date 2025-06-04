import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Code, Smartphone, Brain, Server, Palette, Shield } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

async function getCategoriesWithCounts() {
  const supabase = createServerClient()

  // Get all published posts with their categories
  const { data: posts, error } = await supabase.from("posts").select("category, id").eq("published", true)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // Count posts by category
  const categoryCounts =
    posts?.reduce((acc: Record<string, number>, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {}) || {}

  // Define categories with their metadata
  const categories = [
    {
      name: "Web Development",
      slug: "web-development",
      description: "React, Next.js, Vue.js ve modern web teknolojileri",
      icon: Code,
      color: "bg-blue-500",
    },
    {
      name: "Mobile Development",
      slug: "mobile-development",
      description: "React Native, Flutter ve mobil uygulama geliştirme",
      icon: Smartphone,
      color: "bg-green-500",
    },
    {
      name: "AI & ML",
      slug: "ai-ml",
      description: "Yapay zeka, Machine Learning ve Deep Learning konuları",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      name: "Backend",
      slug: "backend",
      description: "Node.js, Python, API geliştirme ve veritabanları",
      icon: Server,
      color: "bg-red-500",
    },
    {
      name: "Design",
      slug: "design",
      description: "UI/UX tasarım prensipleri, Figma, kullanıcı deneyimi",
      icon: Palette,
      color: "bg-pink-500",
    },
    {
      name: "Security",
      slug: "security",
      description: "Güvenlik, etik hacking ve veri koruma",
      icon: Shield,
      color: "bg-orange-500",
    },
  ]

  // Add post counts to categories
  return categories.map((category) => ({
    ...category,
    postCount: categoryCounts[category.name] || 0,
  }))
}

async function getRecentPostsByCategory() {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      category,
      created_at,
      author_id
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(18) // 3 posts per category max

  if (error) {
    console.error("Error fetching recent posts:", error)
    return {}
  }

  if (!posts || posts.length === 0) {
    return {}
  }

  // Get author information
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", authorIds)

  // Group posts by category
  const postsByCategory = posts.reduce((acc: Record<string, any[]>, post) => {
    if (!acc[post.category]) {
      acc[post.category] = []
    }
    if (acc[post.category].length < 3) {
      // Max 3 posts per category
      acc[post.category].push({
        ...post,
        author_name: profiles?.find((profile) => profile.id === post.author_id)?.full_name || "Anonim",
      })
    }
    return acc
  }, {})

  return postsByCategory
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()
  const recentPostsByCategory = await getRecentPostsByCategory()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <span className="text-xl font-bold bg-clip-text text-transparent">Blog</span>
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
            Kategoriler
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              İlgi Alanınızı Keşfedin
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Teknolojinin farklı alanlarında uzmanlaşmış içeriklerimizi keşfedin. Her kategori, o alanda en güncel
            trendleri ve pratik bilgileri içerir.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Kategori ara..." className="pl-10" />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow group cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="group-hover:text-blue-600 transition-colors">{category.name}</CardTitle>
                        <Badge variant="secondary">{category.postCount} yazı</Badge>
                      </div>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentPostsByCategory[category.name] && recentPostsByCategory[category.name].length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Son Yazılar:</h4>
                        {recentPostsByCategory[category.name].map((post, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 flex-1 mr-2">
                              {post.title}
                            </span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {new Date(post.created_at).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">Henüz yazı yok</p>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4">
                      {category.postCount > 0 ? "Tüm Yazıları Gör" : "Yakında"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Etiketler</h2>
            <p className="text-gray-600">En çok okunan konular</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "Python",
              "Node.js",
              "Supabase",
              "Tailwind CSS",
              "AI",
              "Machine Learning",
              "Flutter",
              "React Native",
              "Vue.js",
              "Angular",
              "Docker",
              "Kubernetes",
              "AWS",
              "Firebase",
              "MongoDB",
              "PostgreSQL",
            ].map((tag, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
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
                  <Link href="/categories/web-development" className="hover:text-white transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/categories/mobile-development" className="hover:text-white transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/categories/ai-ml" className="hover:text-white transition-colors">
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
