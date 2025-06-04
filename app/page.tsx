import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight, Eye, Clock } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

async function getBlogPosts() {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  if (!posts || posts.length === 0) {
    return []
  }

  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", authorIds)

  const postsWithAuthors = posts.map((post) => ({
    ...post,
    author_name: profiles?.find((profile) => profile.id === post.author_id)?.full_name || "Anonim",
  }))

  return postsWithAuthors || []
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content?.split(" ").length || 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} dk`
}

export default async function HomePage() {
  const blogPosts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Kategoriler
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              Hakkında
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Teknoloji Dünyasının
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              En Güncel Haberleri
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Web geliştirme, mobil uygulamalar, yapay zeka ve daha fazlası hakkında uzman yazarlarımızdan en güncel
            içerikleri keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Ücretsiz Başla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline">
                Blog Yazılarını Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Son Blog Yazıları</h3>
            <p className="text-muted-foreground">En güncel teknoloji trendlerini ve ipuçlarını keşfedin</p>
          </div>

          {blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
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
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
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

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
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
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Henüz Blog Yazısı Yok</h3>
              <p className="text-muted-foreground mb-6">İlk blog yazısı yayınlandığında burada görünecek.</p>
              <Link href="/auth/register">
                <Button>Topluluğa Katıl</Button>
              </Link>
            </div>
          )}

          {blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Tüm Yazıları Görüntüle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Rakamlarla Blog</h3>
            <p className="text-muted-foreground">Büyüyen topluluğumuzun bir parçası olun</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {blogPosts.length}+
              </div>
              <div className="text-muted-foreground">Blog Yazısı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-muted-foreground">Aylık Okuyucu</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                2K+
              </div>
              <div className="text-muted-foreground">Topluluk Üyesi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Konu Başlığı</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Blog</h4>
              <p className="text-muted-foreground">
                Teknoloji dünyasının en güncel haberlerini ve trendlerini takip edin.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Kategoriler</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/categories/web-development" className="hover:text-foreground transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/categories/mobile-development" className="hover:text-foreground transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/categories/ai-ml" className="hover:text-foreground transition-colors">
                    AI & ML
                  </Link>
                </li>
                <li>
                  <Link href="/categories/backend" className="hover:text-foreground transition-colors">
                    Backend
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Sayfalar</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-foreground transition-colors">
                    Kategoriler
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hesap</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Kayıt Ol
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Blog. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
