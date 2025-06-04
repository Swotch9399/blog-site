-- Örnek blog yazıları ekleyelim (eğer henüz yoksa)

-- Önce bir test kullanıcısı oluşturalım (eğer yoksa)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'test@blog.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Test Yazar"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Test kullanıcısının ID'sini alalım
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@blog.com' LIMIT 1;
    
    -- Eğer kullanıcı varsa, profil oluşturalım
    IF test_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, full_name, bio)
        VALUES (
            test_user_id,
            'Test Yazar',
            'Teknoloji alanında uzman yazar. Web geliştirme, mobil uygulamalar ve yapay zeka konularında deneyimli.'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            bio = EXCLUDED.bio;
            
        -- Örnek blog yazıları ekleyelim
        INSERT INTO posts (title, slug, content, excerpt, author_id, published, category, tags, view_count) VALUES
        (
            'Next.js 15 ile Modern Web Geliştirme',
            'nextjs-15-modern-web-gelistirme',
            '<h2>Giriş</h2><p>Next.js 15, React tabanlı web uygulamaları geliştirmek için en güçlü framework''lerden biri olmaya devam ediyor. Bu yazıda, Next.js 15''in getirdiği yenilikleri ve modern web geliştirme tekniklerini inceleyeceğiz.</p><h2>Yeni Özellikler</h2><p>Next.js 15 ile birlikte gelen en önemli özellikler şunlar:</p><ul><li><strong>Turbopack:</strong> Webpack''e alternatif olarak geliştirilen yeni bundler</li><li><strong>App Router:</strong> Geliştirilmiş routing sistemi</li><li><strong>Server Components:</strong> Daha iyi performans için server-side rendering</li></ul>',
            'Next.js 15''in yeni özelliklerini keşfedin ve modern web uygulamaları geliştirmeye başlayın.',
            test_user_id,
            true,
            'Web Development',
            ARRAY['nextjs', 'react', 'web-development', 'javascript'],
            1247
        ),
        (
            'Supabase ile Hızlı Backend Geliştirme',
            'supabase-hizli-backend-gelistirme',
            '<h2>Supabase Nedir?</h2><p>Supabase, Firebase''e açık kaynak alternatif olarak geliştirilen bir Backend-as-a-Service (BaaS) platformudur. PostgreSQL veritabanı, gerçek zamanlı abonelikler, kimlik doğrulama ve dosya depolama gibi özellikleri tek bir platformda sunar.</p><h2>Temel Özellikler</h2><ul><li>PostgreSQL veritabanı</li><li>Gerçek zamanlı güncellemeler</li><li>Kimlik doğrulama sistemi</li><li>Row Level Security (RLS)</li></ul>',
            'Supabase kullanarak nasıl hızlı ve güvenli backend servisleri oluşturabileceğinizi öğrenin.',
            test_user_id,
            true,
            'Backend',
            ARRAY['supabase', 'backend', 'database', 'postgresql'],
            892
        ),
        (
            'React Server Components ile Performans Optimizasyonu',
            'react-server-components-performans',
            '<h2>Server Components Nedir?</h2><p>React Server Components, React uygulamalarında performansı artırmak için kullanılan yeni bir yaklaşımdır. Bu bileşenler sunucuda render edilir ve istemciye HTML olarak gönderilir.</p><h2>Avantajları</h2><ul><li>Daha hızlı sayfa yükleme</li><li>Daha az JavaScript bundle boyutu</li><li>SEO dostu</li></ul>',
            'React Server Components''in nasıl çalıştığını ve performans avantajlarını keşfedin.',
            test_user_id,
            true,
            'Web Development',
            ARRAY['react', 'server-components', 'performance', 'nextjs'],
            654
        ),
        (
            'TypeScript ile Tip Güvenli Kod Yazma',
            'typescript-tip-guvenli-kod',
            '<h2>TypeScript''in Avantajları</h2><p>TypeScript, JavaScript''e statik tip kontrolü ekleyen bir programlama dilidir. Büyük projelerde kod kalitesini artırır ve hataları geliştirme aşamasında yakalar.</p><h2>Temel Tipler</h2><ul><li>string, number, boolean</li><li>Array ve Object tipleri</li><li>Union ve Intersection tipleri</li></ul>',
            'TypeScript kullanarak daha güvenli ve sürdürülebilir kod yazmayı öğrenin.',
            test_user_id,
            true,
            'Web Development',
            ARRAY['typescript', 'javascript', 'type-safety', 'development'],
            423
        ),
        (
            'Tailwind CSS ile Hızlı UI Geliştirme',
            'tailwind-css-hizli-ui-gelistirme',
            '<h2>Tailwind CSS Nedir?</h2><p>Tailwind CSS, utility-first yaklaşımı benimseyen bir CSS framework''üdür. Önceden tanımlanmış CSS sınıfları kullanarak hızlı ve tutarlı arayüzler oluşturmanızı sağlar.</p><h2>Avantajları</h2><ul><li>Hızlı geliştirme</li><li>Tutarlı tasarım</li><li>Özelleştirilebilir</li></ul>',
            'Tailwind CSS kullanarak modern ve responsive arayüzler tasarlamayı öğrenin.',
            test_user_id,
            true,
            'Design',
            ARRAY['tailwind', 'css', 'design', 'ui', 'responsive'],
            789
        ),
        (
            'Node.js ile RESTful API Geliştirme',
            'nodejs-restful-api-gelistirme',
            '<h2>RESTful API Nedir?</h2><p>REST (Representational State Transfer), web servisleri için bir mimari stildir. Node.js ile RESTful API''ler geliştirerek ölçeklenebilir backend servisleri oluşturabilirsiniz.</p><h2>Temel Prensipler</h2><ul><li>HTTP metodları (GET, POST, PUT, DELETE)</li><li>Stateless yapı</li><li>JSON veri formatı</li></ul>',
            'Node.js kullanarak profesyonel RESTful API''ler geliştirmeyi öğrenin.',
            test_user_id,
            true,
            'Backend',
            ARRAY['nodejs', 'api', 'rest', 'backend', 'express'],
            567
        )
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;
