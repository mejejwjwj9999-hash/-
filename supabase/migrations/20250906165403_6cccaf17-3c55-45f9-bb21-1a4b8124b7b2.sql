-- Create table for event registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  student_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'registered',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event registrations
CREATE POLICY "Students can register for events"
ON public.event_registrations
FOR INSERT
WITH CHECK (
  student_id = get_current_student_id() 
  OR student_id IS NULL -- Allow non-students to register
);

CREATE POLICY "Students can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (
  student_id = get_current_student_id()
  OR student_id IS NULL
);

CREATE POLICY "Admins can manage all registrations"
ON public.event_registrations
FOR ALL
USING (has_admin_access(auth.uid()));

-- Add foreign key constraint (referencing admin_news_events table where type = 'event')
ALTER TABLE public.event_registrations 
ADD CONSTRAINT fk_event_registrations_event_id 
FOREIGN KEY (event_id) REFERENCES public.admin_news_events(id) ON DELETE CASCADE;

-- Add foreign key constraint for student_id
ALTER TABLE public.event_registrations 
ADD CONSTRAINT fk_event_registrations_student_id 
FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON DELETE SET NULL;

-- Add trigger for updated_at
CREATE TRIGGER update_event_registrations_updated_at
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_student_id ON public.event_registrations(student_id);