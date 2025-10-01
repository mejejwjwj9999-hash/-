-- Create function to increment news views
CREATE OR REPLACE FUNCTION increment_news_views(news_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE admin_news_events 
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = news_id AND status = 'published';
END;
$$;