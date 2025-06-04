-- Fix the foreign key relationship between posts and profiles
-- This ensures Supabase recognizes the relationship properly

-- First, let's make sure all posts have valid author_ids that exist in profiles
-- Create profiles for any users that don't have them
INSERT INTO profiles (id, full_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'Anonim Kullanıcı')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- Now update any posts that might have invalid author_ids
-- Point them to existing profiles
UPDATE posts 
SET author_id = (SELECT id FROM profiles LIMIT 1)
WHERE author_id NOT IN (SELECT id FROM profiles);

-- Drop the existing foreign key constraint if it exists
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_profiles_fkey;

-- Add the proper foreign key constraint
ALTER TABLE posts ADD CONSTRAINT posts_author_profiles_fkey 
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);

-- Refresh the schema cache (this helps Supabase recognize relationships)
NOTIFY pgrst, 'reload schema';
