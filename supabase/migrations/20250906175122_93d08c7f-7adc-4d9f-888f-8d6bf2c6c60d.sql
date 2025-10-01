-- Create media storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'application/pdf',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mpeg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for media files
CREATE POLICY "Allow public read access to media files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-media');

CREATE POLICY "Allow authenticated users to upload media files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'site-media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their media files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'site-media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their media files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'site-media' AND auth.role() = 'authenticated');