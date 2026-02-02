-- Reset domains that were analyzed without Wayback data
UPDATE domain_opportunities 
SET status = 'pending_analysis'
WHERE status = 'analyzed' 
  AND wayback_checked = false;