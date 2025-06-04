-- Email onayı sonrası giriş yapabilmek için auth policies'i düzeltelim

-- Önce mevcut policies'i kontrol edelim ve gerekirse güncelleyelim
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Yeni policies oluşturalım
CREATE POLICY "Users can view all profiles" ON profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Email onayı trigger'ını güncelleyelim
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı yeniden oluşturalım
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email onayı için gerekli ayarları yapalım
-- Bu ayarlar Supabase dashboard'dan da yapılabilir
UPDATE auth.config SET 
  enable_signup = true,
  enable_confirmations = true,
  confirm_email_change = true,
  enable_manual_linking = false;
