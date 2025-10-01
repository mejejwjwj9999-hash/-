-- Create digital library resources table
CREATE TABLE public.admin_digital_library_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  author_ar TEXT,
  author_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('book', 'journal', 'thesis', 'database', 'article', 'document')),
  category TEXT NOT NULL CHECK (category IN ('pharmacy', 'nursing', 'it', 'business', 'midwifery', 'general')),
  subject_area TEXT,
  language TEXT NOT NULL DEFAULT 'ar' CHECK (language IN ('ar', 'en', 'both')),
  publication_year INTEGER,
  isbn TEXT,
  doi TEXT,
  file_url TEXT,
  file_size BIGINT,
  file_type TEXT,
  thumbnail_url TEXT,
  media_id UUID,
  access_level TEXT NOT NULL DEFAULT 'public' CHECK (access_level IN ('public', 'students', 'faculty', 'admin')),
  status content_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_digital_library_resources ENABLE ROW LEVEL SECURITY;

-- Public can view published resources based on access level
CREATE POLICY "Public can view published public resources" 
ON public.admin_digital_library_resources 
FOR SELECT 
USING (status = 'published' AND access_level = 'public');

-- Students can view published student/public resources
CREATE POLICY "Students can view published accessible resources" 
ON public.admin_digital_library_resources 
FOR SELECT 
USING (
  status = 'published' AND 
  access_level IN ('public', 'students') AND
  auth.uid() IS NOT NULL
);

-- Admins can manage all resources
CREATE POLICY "Admins can manage all digital library resources" 
ON public.admin_digital_library_resources 
FOR ALL 
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

-- Create function to increment counters
CREATE OR REPLACE FUNCTION public.increment_resource_counter(
  resource_id UUID, 
  counter_type TEXT
) 
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  IF counter_type = 'views' THEN
    UPDATE admin_digital_library_resources 
    SET views_count = COALESCE(views_count, 0) + 1
    WHERE id = resource_id AND status = 'published';
  ELSIF counter_type = 'downloads' THEN
    UPDATE admin_digital_library_resources 
    SET downloads_count = COALESCE(downloads_count, 0) + 1
    WHERE id = resource_id AND status = 'published';
  END IF;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_digital_library_resources_updated_at ON public.admin_digital_library_resources;
CREATE TRIGGER update_digital_library_resources_updated_at
  BEFORE UPDATE ON public.admin_digital_library_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();