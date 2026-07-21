-- ============================================================================
-- GMB Posts Table & Storage Bucket Setup for Supabase
-- ============================================================================

-- 1. Create `gmb_posts` table
CREATE TABLE IF NOT EXISTS public.gmb_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "PostDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "TimeSchedule" TEXT NOT NULL DEFAULT '10:00 AM (Asia/Kolkata)',
    "Title" TEXT NOT NULL,
    "Caption" TEXT NOT NULL,
    "ImageURL" TEXT NOT NULL,
    "CTAUrl" TEXT,
    "Location" TEXT NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'Scheduled',
    "PostedAt" TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure column exists if table already created
ALTER TABLE public.gmb_posts ADD COLUMN IF NOT EXISTS "TimeSchedule" TEXT DEFAULT '10:00 AM (Asia/Kolkata)';

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.gmb_posts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for gmb_posts
CREATE POLICY "Allow public read access to gmb_posts"
    ON public.gmb_posts
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated admin full access to gmb_posts"
    ON public.gmb_posts
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Fallback policy for anon full access if anon admin writes are used
CREATE POLICY "Allow anon insert update delete access to gmb_posts"
    ON public.gmb_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Create dedicated `gmb-posts` Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gmb-posts', 'gmb-posts', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS policies for `gmb-posts` bucket
CREATE POLICY "Public Read Access for gmb-posts bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gmb-posts');

CREATE POLICY "Upload Access for gmb-posts bucket"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'gmb-posts');

CREATE POLICY "Update/Delete Access for gmb-posts bucket"
    ON storage.objects
    FOR ALL
    USING (bucket_id = 'gmb-posts');
