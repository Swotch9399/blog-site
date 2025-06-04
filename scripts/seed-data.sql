-- Insert sample blog posts
INSERT INTO posts (title, slug, content, excerpt, author_id, published, category, tags) VALUES
(
  'Next.js 15 ile Modern Web Geliştirme',
  'nextjs-15-modern-web-gelistirme',
  'Next.js 15 ile gelen yenilikler ve modern web geliştirme teknikleri hakkında detaylı bir rehber...',
  'Next.js 15''in yeni özelliklerini keşfedin ve modern web uygulamaları geliştirmeye başlayın.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  'Web Development',
  ARRAY['nextjs', 'react', 'web-development']
),
(
  'Supabase ile Hızlı Backend Geliştirme',
  'supabase-hizli-backend-gelistirme',
  'Supabase kullanarak nasıl hızlı ve güvenli backend servisleri oluşturabileceğinizi öğrenin...',
  'Supabase kullanarak nasıl hızlı ve güvenli backend servisleri oluşturabileceğinizi öğrenin.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  'Backend',
  ARRAY['supabase', 'backend', 'database']
),
(
  'Tailwind CSS ile Responsive Tasarım',
  'tailwind-css-responsive-tasarim',
  'Tailwind CSS kullanarak mobil uyumlu ve modern arayüzler tasarlamayı öğrenin...',
  'Tailwind CSS kullanarak mobil uyumlu ve modern arayüzler tasarlamayı öğrenin.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  'Design',
  ARRAY['tailwind', 'css', 'design', 'responsive']
);

-- Create a function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
