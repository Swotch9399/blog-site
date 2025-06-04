-- Görüntülenme sayılarını güncellemek için fonksiyon
CREATE OR REPLACE FUNCTION increment_post_view_count(post_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE slug = post_slug AND published = true;
END;
$$ LANGUAGE plpgsql;

-- Popüler yazıları getirmek için view
CREATE OR REPLACE VIEW popular_posts AS
SELECT 
    p.*,
    pr.full_name as author_name,
    pr.avatar_url as author_avatar
FROM posts p
LEFT JOIN profiles pr ON p.author_id = pr.id
WHERE p.published = true
ORDER BY p.view_count DESC, p.created_at DESC;

-- Son yazıları getirmek için view
CREATE OR REPLACE VIEW recent_posts AS
SELECT 
    p.*,
    pr.full_name as author_name,
    pr.avatar_url as author_avatar
FROM posts p
LEFT JOIN profiles pr ON p.author_id = pr.id
WHERE p.published = true
ORDER BY p.created_at DESC;
