-- Add technologies and social media fields to hosting_companies
ALTER TABLE hosting_companies
ADD COLUMN technologies TEXT[] DEFAULT '{}',
ADD COLUMN social_media JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN hosting_companies.technologies IS 'Array of technologies used (e.g., cPanel, LiteSpeed, CloudLinux, etc.)';
COMMENT ON COLUMN hosting_companies.social_media IS 'JSON object with social media URLs: {facebook, twitter, instagram, linkedin, youtube}';