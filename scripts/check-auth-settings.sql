-- Supabase auth ayarlarını kontrol etmek için SQL sorguları

-- 1. Mevcut auth config'i kontrol et
SELECT * FROM auth.config;

-- 2. User'ların email_confirmed_at durumunu kontrol et
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Profiles tablosundaki kullanıcıları kontrol et
SELECT 
  p.id,
  p.full_name,
  u.email,
  u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- 4. RLS policies'i kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'posts', 'comments');
