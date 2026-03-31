-- Migration: restrict anonymous DELETE to recent records only (5-minute window)
-- Replaces the overly permissive "anyone can delete anything" policies from 002.
-- This limits rollback cleanup to scrapbooks/photos created within the last 5 minutes.

DROP POLICY IF EXISTS "Anyone can delete scrapbooks" ON scrapbooks;
DROP POLICY IF EXISTS "Anyone can delete photos" ON photos;

CREATE POLICY "Anon can delete recent scrapbooks"
    ON scrapbooks FOR DELETE
    TO anon
    USING (created_at > now() - interval '5 minutes');

CREATE POLICY "Anon can delete recent photos"
    ON photos FOR DELETE
    TO anon
    USING (created_at > now() - interval '5 minutes');
