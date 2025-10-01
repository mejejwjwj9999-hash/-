import React from 'react';
import { DynamicContent, useDynamicContent } from '@/components/DynamicContent';
import { InlineEditWrapper } from './InlineEditWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface EditableContentProps {
  pageKey: string;
  elementKey: string;
  elementType?: 'text' | 'rich_text' | 'image' | 'button' | 'icon' | 'stat' | 'layout' | 'background' | 'animation';
  fallback?: React.ReactNode;
  language?: 'ar' | 'en';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const EditableContent: React.FC<EditableContentProps> = ({
  pageKey,
  elementKey,
  elementType = 'text',
  fallback = null,
  language = 'ar',
  className = '',
  as = 'div'
}) => {
  // Get current user
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { data: isAdmin } = useIsAdmin(user?.id);
  const { data: content } = useDynamicContent(pageKey, elementKey, language);

  // For non-admin users, just show the regular DynamicContent
  if (!isAdmin) {
    return (
      <DynamicContent
        pageKey={pageKey}
        elementKey={elementKey}
        fallback={fallback}
        language={language}
        className={className}
        as={as}
      />
    );
  }

  // For admin users, wrap with inline editing capabilities
  return (
    <InlineEditWrapper
      pageKey={pageKey}
      elementKey={elementKey}
      elementType={elementType}
      className={className}
      contentAr={content?.content_ar}
      contentEn={content?.content_en}
      metadata={content?.metadata}
    >
      <DynamicContent
        pageKey={pageKey}
        elementKey={elementKey}
        fallback={fallback}
        language={language}
        className={className}
        as={as}
      />
    </InlineEditWrapper>
  );
};