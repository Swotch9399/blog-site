import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Share2, Heart, MessageCircle, Eye } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

async function getBlogPost(slug: string) {
  const supabase = createServerClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      view_count,
      created_at,
      updated_at,
      author_id
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  // Get author information separately
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("id", post.author_id)
    .single()

  // Increment view count
  await supabase
    .from("posts")
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq("id", post.id)

  return {
    ...post,
    author: profile || { full_name: "Anonim", bio: null, avatar_url: null },
  }
}

async function getRelatedPosts(currentPostId: string, category: string) {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      created_at,
      author_id
    `)
    .eq("published", true)
    .eq("category", category)
    .neq("id", currentPostId)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching related posts:", error)
    return []
  }

  if (!posts || posts.length === 0) {
    return []
  }

  // Get author information separately
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", authorIds)

  // Combine posts with author information
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

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category)

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge>{post.category}</Badge>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{calculateReadTime(post.content || "")}</span>
                </div>
                <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>
                <CardDescription className="text-lg">{post.excerpt}</CardDescription>

                {/* Author & Meta */}
                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={post.author?.avatar_url || "/placeholder.svg"}
                        alt={post.author?.full_name || "Yazar"}
                      />
                      <AvatarFallback>{(post.author?.full_name || "A").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author?.full_name || "Anonim Yazar"}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.created_at).toLocaleDateString("tr-TR")}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {(post.view_count || 0).toLocaleString()} görüntülenme
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Beğen
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <p className="text-gray-600">İçerik yükleniyor...</p>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Author Bio */}
                {post.author && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={post.author.avatar_url || "/placeholder.svg"}
                            alt={post.author.full_name || "Yazar"}
                          />
                          <AvatarFallback className="text-lg">
                            {(post.author.full_name || "A").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{post.author.full_name || "Anonim Yazar"}</h3>
                          <p className="text-gray-600 mb-3">
                            {post.author.bio || "Bu yazar hakkında henüz bilgi eklenmemiş."}
                          </p>
                          <Button variant="outline" size="sm">
                            Yazarı Takip Et
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Yorumlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Yorum yapmak için giriş yapın</p>
                  <Link href="/auth/login">
                    <Button className="mt-4">Giriş Yap</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>İlgili Yazılar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <Link href={`/blog/${relatedPost.slug}`} className="block hover:text-blue-600 transition-colors">
                        <h4 className="font-medium mb-2">{relatedPost.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(relatedPost.created_at).toLocaleDateString("tr-TR")}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedPost.author_name}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle>Bülten</CardTitle>
                <CardDescription>Yeni yazılardan haberdar olun</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="email"
                  placeholder="Email adresiniz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Button className="w-full" size="sm">
                  Abone Ol
                </Button>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Popüler Etiketler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "JavaScript", "CSS", "Node.js"].map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
