-- Add verification columns to hosting_reviews table
ALTER TABLE hosting_reviews 
ADD COLUMN IF NOT EXISTS customer_duration VARCHAR(20),
ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS verification_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- Create index for better performance on company reviews queries
CREATE INDEX IF NOT EXISTS idx_reviews_company_status ON hosting_reviews(company_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON hosting_reviews(helpful_count DESC);

-- Create table for tracking helpful votes
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES hosting_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index for helpful votes (one vote per review per user/IP)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_helpful_vote 
ON review_helpful_votes(review_id, user_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_helpful_vote_ip 
ON review_helpful_votes(review_id, ip_address) 
WHERE user_id IS NULL;

-- Enable RLS on helpful votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view helpful votes
CREATE POLICY "Anyone can view helpful votes"
ON review_helpful_votes
FOR SELECT
USING (true);

-- Policy: Authenticated users can add helpful votes
CREATE POLICY "Users can add helpful votes"
ON review_helpful_votes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Anonymous users can add helpful votes (tracked by IP)
CREATE POLICY "Anonymous can add helpful votes"
ON review_helpful_votes
FOR INSERT
TO anon
WITH CHECK (true);

-- Function to increment helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hosting_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = NEW.review_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-increment helpful count
DROP TRIGGER IF EXISTS trigger_increment_helpful ON review_helpful_votes;
CREATE TRIGGER trigger_increment_helpful
AFTER INSERT ON review_helpful_votes
FOR EACH ROW
EXECUTE FUNCTION increment_review_helpful_count();