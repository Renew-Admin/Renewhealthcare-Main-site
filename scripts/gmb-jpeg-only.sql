-- ============================================================================
-- GMB: every post image is a JPG
-- ============================================================================
-- The admin panel converts uploads AND pasted links to JPEG before storing
-- them, so "ImageURL" should only ever hold a .jpg. This locks that rule in at
-- the storage and database layers.
--
-- Run the steps in order in the Supabase SQL editor. Step 3 is deliberately
-- separate — read its warning before running it.

-- ---------------------------------------------------------------------------
-- 1. Restrict the bucket to JPEG, at Google's 5 MB post-image ceiling.
--    Existing non-JPG objects keep serving fine; this only governs new uploads.
-- ---------------------------------------------------------------------------
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg'],
    file_size_limit    = 5242880
WHERE id = 'gmb-posts';


-- ---------------------------------------------------------------------------
-- 2. List rows that still point at a non-JPG image. Run this BEFORE step 3.
--
--    Re-upload each one through the admin panel (open the post, pick the image
--    again or paste its link, save). Do NOT rewrite .webp to .jpg with an
--    UPDATE: the stored object is still a WebP, so a renamed URL would 404.
-- ---------------------------------------------------------------------------
SELECT id, "Title", "Location", "ImageURL"
FROM public.gmb_posts
WHERE "ImageURL" !~* '\.jpe?g($|\?)'
ORDER BY "PostDate" DESC;


-- ---------------------------------------------------------------------------
-- 3. Once step 2 returns zero rows, enforce the format for good.
--    If you would rather not touch old rows, swap the ADD CONSTRAINT line for
--    the NOT VALID variant below it — new and updated rows are then checked,
--    existing ones are left alone.
-- ---------------------------------------------------------------------------
ALTER TABLE public.gmb_posts
  DROP CONSTRAINT IF EXISTS gmb_posts_imageurl_is_jpg;

ALTER TABLE public.gmb_posts
  ADD CONSTRAINT gmb_posts_imageurl_is_jpg
  CHECK ("ImageURL" ~* '^https?://.+\.jpe?g($|\?)');

-- Grandfather old rows instead:
-- ALTER TABLE public.gmb_posts
--   ADD CONSTRAINT gmb_posts_imageurl_is_jpg
--   CHECK ("ImageURL" ~* '^https?://.+\.jpe?g($|\?)') NOT VALID;


-- ---------------------------------------------------------------------------
-- Rollback, if the constraint ever gets in the way
-- ---------------------------------------------------------------------------
-- ALTER TABLE public.gmb_posts DROP CONSTRAINT IF EXISTS gmb_posts_imageurl_is_jpg;
-- UPDATE storage.buckets
-- SET allowed_mime_types = NULL
-- WHERE id = 'gmb-posts';
