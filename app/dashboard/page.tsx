"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { Settings, LogOut, Plus, BookOpen, TrendingUp, Search, Edit, Trash2, Eye } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  view_count: number
  created_at: string
  category: string
  tags: string[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchUserPosts(user.id)
      } else {
        router.push("/auth/login")
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const fetchUserPosts = async (userId: string) => {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
    } else {
      setPosts(posts || [])
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
      const { error } = await supabase.from("posts").delete().eq("id", postId)

      if (error) {
        console.error("Error deleting post:", error)
      } else {
        setPosts(posts.filter((post) => post.id !== postId))
      }
    }
  }

  const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
    const { error } = await supabase.from("posts").update({ published: !currentStatus }).eq("id", postId)

    if (error) {
      console.error("Error updating post:", error)
    } else {
      setPosts(posts.map((post) => (post.id === postId ? { ...post, published: !currentStatus } : post)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    draftPosts: posts.filter((p) => !p.published).length,
    totalViews: posts.reduce((sum, post) => sum + (post.view_count || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Blog</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard/new-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yazı
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Hoş geldin, {user?.user_metadata?.full_name || "Kullanıcı"}!
              </h1>
              <p className="text-muted-foreground">Blog yazılarınızı yönetin ve yeni içerikler oluşturun.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Toplam Yazı</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalPosts}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Yayında</p>
                  <p className="text-3xl font-bold text-foreground">{stats.publishedPosts}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taslak</p>
                  <p className="text-3xl font-bold text-foreground">{stats.draftPosts}</p>
                </div>
                <Edit className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Toplam Görüntülenme</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Blog Yazılarım</CardTitle>
              <CardDescription>Yazılarınızı yönetin, düzenleyin veya yeni yazı oluşturun</CardDescription>
            </div>
            <Link href="/dashboard/new-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yazı
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Yazı ara..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-foreground">{post.title}</h4>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Yayında" : "Taslak"}
                        </Badge>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
                        <span>{post.view_count || 0} görüntülenme</span>
                        {post.tags && post.tags.length > 0 && <span>{post.tags.slice(0, 2).join(", ")}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/dashboard/edit-post/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => togglePublishStatus(post.id, post.published)}>
                        {post.published ? "Gizle" : "Yayınla"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "Arama sonucu bulunamadı" : "Henüz yazı yok"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? "Farklı anahtar kelimeler deneyin"
                    : "İlk blog yazınızı oluşturun ve paylaşmaya başlayın"}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/new-post">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Yazınızı Oluşturun
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
