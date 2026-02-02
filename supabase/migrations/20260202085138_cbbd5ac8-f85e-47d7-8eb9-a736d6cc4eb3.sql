-- Add wayback_checked column to track if Wayback API was consulted
ALTER TABLE domain_opportunities 
ADD COLUMN IF NOT EXISTS wayback_checked BOOLEAN DEFAULT FALSE;

-- Reset domains that were "analyzed" but never actually checked Wayback
UPDATE domain_opportunities 
SET status = 'pending_analysis', wayback_checked = false
WHERE status = 'analyzed' 
  AND wayback_snapshots = 0 
  AND had_website = false;