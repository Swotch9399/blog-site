-- Kategorilere göre daha fazla örnek blog yazısı ekleyelim

DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Test kullanıcısının ID'sini alalım
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@blog.com' LIMIT 1;
    
    -- Eğer kullanıcı varsa, kategorilere göre yazılar ekleyelim
    IF test_user_id IS NOT NULL THEN
        
        -- Mobile Development yazıları
        INSERT INTO posts (title, slug, content, excerpt, author_id, published, category, tags, view_count) VALUES
        (
            'React Native ile Cross-Platform Uygulama Geliştirme',
            'react-native-cross-platform-uygulama',
            '<h2>React Native Nedir?</h2><p>React Native, Facebook tarafından geliştirilen ve tek kod tabanı ile hem iOS hem de Android uygulamaları geliştirmeyi sağlayan bir framework''tür.</p><h2>Avantajları</h2><ul><li>Tek kod tabanı</li><li>Native performans</li><li>Hızlı geliştirme</li></ul>',
            'React Native kullanarak hem iOS hem Android için uygulama geliştirmeyi öğrenin.',
            test_user_id,
            true,
            'Mobile Development',
            ARRAY['react-native', 'mobile', 'cross-platform', 'ios', 'android'],
            456
        ),
        (
            'Flutter vs React Native: Hangisini Seçmeli?',
            'flutter-vs-react-native-karsilastirma',
            '<h2>Flutter ve React Native Karşılaştırması</h2><p>İki popüler cross-platform framework''ün detaylı karşılaştırması.</p><h2>Performans</h2><p>Flutter Dart dilini kullanırken, React Native JavaScript kullanır.</p>',
            'Flutter ve React Native arasındaki farkları keşfedin ve projeniz için doğru seçimi yapın.',
            test_user_id,
            true,
            'Mobile Development',
            ARRAY['flutter', 'react-native', 'comparison', 'mobile'],
            789
        ),
        
        -- AI & ML yazıları
        (
            'ChatGPT API ile Akıllı Chatbot Geliştirme',
            'chatgpt-api-chatbot-gelistirme',
            '<h2>ChatGPT API Kullanımı</h2><p>OpenAI''ın ChatGPT API''sini kullanarak akıllı chatbot''lar geliştirmeyi öğrenin.</p><h2>Temel Özellikler</h2><ul><li>Doğal dil işleme</li><li>Bağlam anlama</li><li>Çoklu dil desteği</li></ul>',
            'ChatGPT API kullanarak güçlü chatbot''lar oluşturmayı öğrenin.',
            test_user_id,
            true,
            'AI & ML',
            ARRAY['chatgpt', 'api', 'ai', 'chatbot', 'openai'],
            1234
        ),
        (
            'Machine Learning ile Veri Analizi',
            'machine-learning-veri-analizi',
            '<h2>Machine Learning Temelleri</h2><p>Veri analizi için machine learning algoritmalarını kullanmayı öğrenin.</p><h2>Popüler Algoritmalar</h2><ul><li>Linear Regression</li><li>Decision Trees</li><li>Neural Networks</li></ul>',
            'Machine learning algoritmaları ile veri analizine giriş yapın.',
            test_user_id,
            true,
            'AI & ML',
            ARRAY['machine-learning', 'data-analysis', 'python', 'algorithms'],
            567
        ),
        
        -- Backend yazıları
        (
            'Node.js ile RESTful API Geliştirme',
            'nodejs-restful-api-gelistirme-rehberi',
            '<h2>RESTful API Nedir?</h2><p>REST mimarisi kullanarak API geliştirme prensiplerini öğrenin.</p><h2>Express.js ile API</h2><p>Express.js framework''ü kullanarak hızlı API geliştirme.</p>',
            'Node.js ve Express.js kullanarak profesyonel RESTful API''ler geliştirin.',
            test_user_id,
            true,
            'Backend',
            ARRAY['nodejs', 'express', 'api', 'rest', 'backend'],
            890
        ),
        (
            'PostgreSQL Veritabanı Optimizasyonu',
            'postgresql-veritabani-optimizasyonu',
            '<h2>PostgreSQL Performans İpuçları</h2><p>PostgreSQL veritabanınızın performansını artırmak için pratik yöntemler.</p><h2>İndeksleme Stratejileri</h2><p>Doğru indeks kullanımı ile sorgu performansını artırın.</p>',
            'PostgreSQL veritabanınızı optimize etmek için ipuçları ve teknikler.',
            test_user_id,
            true,
            'Backend',
            ARRAY['postgresql', 'database', 'optimization', 'performance'],
            345
        ),
        
        -- Design yazıları
        (
            'Modern UI/UX Tasarım Trendleri 2024',
            'modern-ui-ux-tasarim-trendleri-2024',
            '<h2>2024 Tasarım Trendleri</h2><p>Bu yılın en popüler UI/UX tasarım trendlerini keşfedin.</p><h2>Minimalizm ve Fonksiyonellik</h2><p>Sade tasarımların gücü ve kullanıcı deneyimi üzerindeki etkisi.</p>',
            '2024 yılının en güncel UI/UX tasarım trendlerini keşfedin.',
            test_user_id,
            true,
            'Design',
            ARRAY['ui', 'ux', 'design', 'trends', '2024'],
            678
        ),
        (
            'Figma ile Prototyping: Başlangıç Rehberi',
            'figma-prototyping-baslangic-rehberi',
            '<h2>Figma Nedir?</h2><p>Figma ile tasarım ve prototipleme süreçlerini öğrenin.</p><h2>Temel Özellikler</h2><ul><li>Collaborative design</li><li>Component systems</li><li>Interactive prototypes</li></ul>',
            'Figma kullanarak profesyonel tasarımlar ve prototipler oluşturun.',
            test_user_id,
            true,
            'Design',
            ARRAY['figma', 'prototyping', 'design', 'ui'],
            432
        ),
        
        -- Security yazıları
        (
            'Web Uygulaması Güvenliği: OWASP Top 10',
            'web-uygulamasi-guvenligi-owasp-top-10',
            '<h2>OWASP Top 10 Nedir?</h2><p>Web uygulamalarındaki en yaygın güvenlik açıklarını öğrenin.</p><h2>Injection Saldırıları</h2><p>SQL injection ve diğer injection saldırılarından korunma yöntemleri.</p>',
            'Web uygulamalarınızı güvenli hale getirmek için OWASP Top 10 rehberini inceleyin.',
            test_user_id,
            true,
            'Security',
            ARRAY['security', 'owasp', 'web-security', 'cybersecurity'],
            765
        ),
        (
            'İki Faktörlü Doğrulama (2FA) Implementasyonu',
            'iki-faktorlu-dogrulama-2fa-implementasyonu',
            '<h2>2FA Nedir?</h2><p>İki faktörlü doğrulama sistemlerinin nasıl çalıştığını ve nasıl implement edileceğini öğrenin.</p><h2>TOTP Algoritması</h2><p>Time-based One-Time Password algoritmasının detayları.</p>',
            'Uygulamalarınıza güvenli 2FA sistemi entegre etmeyi öğrenin.',
            test_user_id,
            true,
            'Security',
            ARRAY['2fa', 'authentication', 'security', 'totp'],
            543
        )
        ON CONFLICT (slug) DO NOTHING;
        
    END IF;
END $$;
