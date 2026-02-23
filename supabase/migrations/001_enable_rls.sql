-- Enable Row Level Security on both tables
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- 1. Enable RLS
ALTER TABLE public.scrapbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 2. Scrapbook policies
-- Anyone can create scrapbooks (the app is anonymous/public)
CREATE POLICY "Anyone can create scrapbooks"
    ON public.scrapbooks
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Anyone can read published scrapbooks (needed for the /scrapbook/[code] page)
CREATE POLICY "Anyone can read published scrapbooks"
    ON public.scrapbooks
    FOR SELECT
    TO anon
    USING (is_published = true);

-- Service role can do everything (needed for server-side operations)
CREATE POLICY "Service role full access to scrapbooks"
    ON public.scrapbooks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Photo policies
-- Anyone can insert photos (uploaded client-side after scrapbook creation)
CREATE POLICY "Anyone can insert photos"
    ON public.photos
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Anyone can read photos for published scrapbooks
CREATE POLICY "Anyone can read photos of published scrapbooks"
    ON public.photos
    FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM public.scrapbooks
            WHERE scrapbooks.id = photos.scrapbook_id
            AND scrapbooks.is_published = true
        )
    );

-- Service role can do everything
CREATE POLICY "Service role full access to photos"
    ON public.photos
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Storage: photos bucket
-- Note: Storage RLS is managed separately in the Supabase dashboard
-- under Storage → Policies. Recommended policies:
--   - INSERT: allow anon (for uploads)
--   - SELECT: allow anon (for public URL access)
--   - DELETE: deny anon (only service_role can delete)
