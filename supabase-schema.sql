-- =============================================
-- POLICE LINE SECONDARY SCHOOL — JASHORE
-- Supabase Database Schema
-- 
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================


-- ---- TABLE: notes (বিদায় বার্তা) ----
CREATE TABLE IF NOT EXISTS notes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  batch       TEXT NOT NULL,
  message     TEXT NOT NULL,
  approved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- TABLE: products (বিদ্যালয়ের পণ্য) ----
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'অন্যান্য',
  price       INTEGER NOT NULL DEFAULT 0,
  in_stock    BOOLEAN DEFAULT TRUE,
  emoji       TEXT DEFAULT '📦',
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- TABLE: contact_messages (যোগাযোগ বার্তা) ----
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- TABLE: subscribers (ইমেইল নিবন্ধন) ----
CREATE TABLE IF NOT EXISTS subscribers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE notes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers        ENABLE ROW LEVEL SECURITY;


-- NOTES policies
-- Anyone can READ approved notes
CREATE POLICY "Public can read approved notes"
  ON notes FOR SELECT
  USING (approved = TRUE);

-- Anyone can INSERT (submit) notes (pending by default)
CREATE POLICY "Anyone can submit notes"
  ON notes FOR INSERT
  WITH CHECK (approved = FALSE);

-- Only service_role (admin) can UPDATE/approve notes
-- (This is handled server-side; anon key cannot update)


-- PRODUCTS policies
-- Anyone can READ products
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (TRUE);


-- CONTACT MESSAGES policies
-- Anyone can INSERT
CREATE POLICY "Anyone can send contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);


-- SUBSCRIBERS policies
-- Anyone can INSERT
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (TRUE);


-- =============================================
-- SAMPLE DATA (Optional — delete if not needed)
-- =============================================

INSERT INTO notes (name, batch, message, approved) VALUES
  ('রাহেলা পারভীন', 'SSC ''২৩', 'এই বিদ্যালয় আমার জীবনের সেরা সময়গুলো দিয়েছে। প্রতিটি শিক্ষকের ভালোবাসা চিরকাল মনে থাকবে।', TRUE),
  ('সাইফুল ইসলাম',  'SSC ''২৪', 'পুলিশ লাইন স্কুল শুধু পড়াশোনা না, জীবনে কীভাবে এগিয়ে যেতে হয় তা শিখিয়েছে।', TRUE),
  ('নুসরাত জাহান',  'SSC ''২৪', 'এই স্কুলের প্রতিটি কোণে আমার স্মৃতি জড়িয়ে আছে। বিদায়ের দিনে চোখে জল এসেছিল।', TRUE);

INSERT INTO products (name, category, price, in_stock, emoji) VALUES
  ('স্কুল ইউনিফর্ম (ছেলে)',  'পোশাক',     650,  TRUE,  '👕'),
  ('স্কুল ইউনিফর্ম (মেয়ে)',  'পোশাক',     700,  TRUE,  '👗'),
  ('স্কুল ব্যাগ',             'স্টেশনারি', 850,  TRUE,  '🎒'),
  ('বই সেট (Class IX)',        'বই',        1200, TRUE,  '📚'),
  ('বই সেট (Class X)',         'বই',        1200, FALSE, '📖'),
  ('জ্যামিতি বক্স',           'স্টেশনারি', 180,  TRUE,  '📐'),
  ('কলম সেট (১২টি)',           'স্টেশনারি', 120,  TRUE,  '✏️'),
  ('স্কুল টাই',               'পোশাক',     150,  TRUE,  '👔');
