-- Migration: allow anon role to delete scrapbooks and photos
-- Used by the DELETE /api/scrapbooks endpoint for rollback cleanup on failed publish.
-- This app has no authentication; codes are 10-char nanoid (~59 bits entropy).
-- Intentionally permissive for a personal single-user gift app.

CREATE POLICY "Anyone can delete scrapbooks"
    ON scrapbooks FOR DELETE
    TO anon
    USING (true);

CREATE POLICY "Anyone can delete photos"
    ON photos FOR DELETE
    TO anon
    USING (true);
