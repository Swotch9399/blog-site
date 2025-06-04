"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Save, Eye, Plus, X } from "lucide-react"

const categories = [
  "Web Development",
  "Mobile Development",
  "Backend",
  "Frontend",
  "DevOps",
  "AI & ML",
  "Design",
  "Database",
  "Security",
  "Other",
]

export default function NewPostPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [newTag, setNewTag] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [] as string[],
    published: false,
  })

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/auth/login")
      }
    }

    getUser()
  }, [router])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (published: boolean) => {
    if (!formData.title || !formData.content || !formData.category) {
      setMessage("Lütfen tüm gerekli alanları doldurun")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase.from("posts").insert([
        {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          author_id: user.id,
          published,
        },
      ])

      if (error) {
        setMessage(error.message)
      } else {
        setMessage(published ? "Yazı başarıyla yayınlandı!" : "Yazı taslak olarak kaydedildi!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Yeni Blog Yazısı</h1>
          </div>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Blog</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Yeni Blog Yazısı Oluştur</CardTitle>
            <CardDescription>Yeni bir blog yazısı yazın ve topluluğunuzla paylaşın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                placeholder="Blog yazınızın başlığı"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="blog-yazisi-url"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
              />
              <p className="text-sm text-gray-500">URL: /blog/{formData.slug || "blog-yazisi-url"}</p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Özet</Label>
              <Textarea
                id="excerpt"
                placeholder="Yazınızın kısa bir özeti (isteğe bağlı)"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Etiketler</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Etiket ekle"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">İçerik *</Label>
              <Textarea
                id="content"
                placeholder="Blog yazınızın içeriğini buraya yazın..."
                rows={15}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-gray-500">
                HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;,
                &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;code&gt;, &lt;pre&gt;
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Button onClick={() => handleSubmit(false)} disabled={loading} variant="outline" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Kaydediliyor..." : "Taslak Olarak Kaydet"}
              </Button>
              <Button onClick={() => handleSubmit(true)} disabled={loading} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Yayınlanıyor..." : "Yayınla"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
