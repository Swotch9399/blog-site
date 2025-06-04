import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Calendar, User, Eye, Clock, Filter } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

// Category mapping
const categoryMap: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-development": "Mobile Development",
  "ai-ml": "AI & ML",
  backend: "Backend",
  design: "Design",
  security: "Security",
  frontend: "Frontend",
  devops: "DevOps",
  database: "Database",
  other: "Other",
}

async function getCategoryPosts(categoryName: string, sortBy = "newest") {
  const supabase = createServerClient()

  let query = supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      category,
      tags,
      view_count,
      created_at,
      author_id
    `)
    .eq("published", true)
    .eq("category", categoryName)

  // Apply sorting
  switch (sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "popular":
      query = query.order("view_count", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching category posts:", error)
    return []
  }

  if (!posts || posts.length === 0) {
    return []
  }

  // Get author information
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", authorIds)

  // Combine posts with author information
  const postsWithAuthors = posts.map((post) => ({
    ...post,
    author_name: profiles?.find((profile) => profile.id === post.author_id)?.full_name || "Anonim",
  }))

  return postsWithAuthors
}

async function getCategoryStats(categoryName: string) {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("view_count, created_at")
    .eq("published", true)
    .eq("category", categoryName)

  if (error || !posts) {
    return {
      totalPosts: 0,
      totalViews: 0,
      avgViewsPerPost: 0,
    }
  }

  const totalPosts = posts.length
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)
  const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0

  return {
    totalPosts,
    totalViews,
    avgViewsPerPost,
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content?.split(" ").length || 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} dk`
}

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    search?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = categoryMap[params.slug]

  if (!categoryName) {
    notFound()
  }

  const sortBy = searchParams.sort || "newest"
  const searchTerm = searchParams.search || ""

  const posts = await getCategoryPosts(categoryName, sortBy)
  const stats = await getCategoryStats(categoryName)

  // Filter posts by search term if provided
  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : posts

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/categories">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kategoriler
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
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{categoryName}</h1>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {categoryName} kategorisindeki en güncel yazıları keşfedin ve teknoloji dünyasındaki gelişmeleri takip edin.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-blue-100 text-sm">Toplam Yazı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Toplam Görüntülenme</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.avgViewsPerPost}</div>
              <div className="text-blue-100 text-sm">Ortalama Görüntülenme</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Yazı ara..." className="pl-10" defaultValue={searchTerm} />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Sırala:</span>
              </div>
              <Select defaultValue={sortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">En Yeni</SelectItem>
                  <SelectItem value="oldest">En Eski</SelectItem>
                  <SelectItem value="popular">En Popüler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {filteredPosts.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm ? `"${searchTerm}" için arama sonuçları` : `${categoryName} Yazıları`}
                </h2>
                <p className="text-gray-600">
                  {filteredPosts.length} yazı bulundu
                  {searchTerm && ` "${searchTerm}" araması için`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{calculateReadTime(post.excerpt || "")}</span>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
                            </div>
                            {post.view_count > 0 && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{post.view_count}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "Arama sonucu bulunamadı" : "Bu kategoride henüz yazı yok"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Farklı anahtar kelimeler deneyin veya filtreleri değiştirin"
                  : "Bu kategoride yakında yeni yazılar yayınlanacak"}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/categories">
                  <Button variant="outline">Diğer Kategoriler</Button>
                </Link>
                <Link href="/">
                  <Button>Ana Sayfa</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Diğer Kategoriler</h2>
            <p className="text-gray-600">İlginizi çekebilecek diğer konuları keşfedin</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryMap)
              .filter(([slug, name]) => name !== categoryName)
              .slice(0, 6)
              .map(([slug, name]) => (
                <Link key={slug} href={`/categories/${slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
                      <Button variant="outline" size="sm">
                        Keşfet
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
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
