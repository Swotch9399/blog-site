# Blog

Modern blog sitesi - Next.js, Supabase ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- 🌙 Gece/Gündüz tema desteği
- 📱 Responsive tasarım
- 📝 Blog yazısı oluşturma ve düzenleme
- 🏷️ Kategori ve etiket sistemi
- 👤 Kullanıcı profilleri
- 📊 Dashboard paneli

## Kurulum

### 1. Projeyi klonlayın

\`\`\`bash
git clone <repo-url>
cd blog
\`\`\`

### 2. Bağımlılıkları yükleyin

\`\`\`bash
npm install
\`\`\`

### 3. Supabase kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. `.env.local` dosyası oluşturun:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Veritabanı kurulumu

Supabase SQL Editor'da `scripts/create-tables.sql` dosyasını çalıştırın.

### 5. Projeyi çalıştırın

\`\`\`bash
npm run dev
\`\`\`

Site `http://localhost:3000` adresinde çalışacaktır.

## Kullanım

1. Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. Email onayını tamamlayın
3. Dashboard'a giriş yapın
4. İlk blog yazınızı oluşturun

## Teknolojiler

- **Framework**: Next.js 14
- **Veritabanı**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
