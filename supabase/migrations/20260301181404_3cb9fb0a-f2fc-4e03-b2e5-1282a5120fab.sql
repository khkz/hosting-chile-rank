
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS uptime_guarantee text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS has_ssl_free boolean DEFAULT false;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS has_migration_free boolean DEFAULT false;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS description_editorial text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS pros text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS cons text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS unique_selling_point text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS data_confidence jsonb DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS last_scraped_at timestamptz;
