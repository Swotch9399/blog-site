-- Posts tablosuna updated_at kolonu ekleyelim (eğer yoksa)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Updated_at'i otomatik güncelleyen trigger oluşturalım
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ı posts tablosuna ekleyelim
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Slug'ların unique olmasını sağlayalım
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON posts(slug);

-- Posts tablosuna index'ler ekleyelim (performans için)
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_view_count_idx ON posts(view_count DESC);

-- Tags için GIN index (array arama için)
CREATE INDEX IF NOT EXISTS posts_tags_gin_idx ON posts USING GIN(tags);
