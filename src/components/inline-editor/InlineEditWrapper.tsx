import React, { ReactNode, useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInlineEditor } from '@/contexts/InlineEditorContext';
import { InlineEditor } from './InlineEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface InlineEditWrapperProps {
  children: ReactNode;
  pageKey: string;
  elementKey: string;
  elementType: 'text' | 'rich_text' | 'image' | 'button' | 'icon' | 'stat' | 'layout' | 'background' | 'animation';
  className?: string;
  contentAr?: string;
  contentEn?: string;
  metadata?: any;
}

export const InlineEditWrapper: React.FC<InlineEditWrapperProps> = ({
  children,
  pageKey,
  elementKey,
  elementType,
  className = '',
  contentAr,
  contentEn,
  metadata
}) => {
  const [user, setUser] = useState<any>(null);
  const { data: isAdmin } = useIsAdmin(user?.id);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);
  const { isEditing, editingElement, setEditing } = useInlineEditor();
  const [isHovered, setIsHovered] = useState(false);

  const elementId = `${pageKey}-${elementKey}`;
  const isThisElementEditing = editingElement === elementId;

  if (!isAdmin) {
    return <>{children}</>;
  }

  const handleEditClick = () => {
    if (!isThisElementEditing) {
      setEditing(elementId, true);
    }
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ scrollSnapStop: 'normal' }}
    >
      <AnimatePresence mode="wait">
        {isThisElementEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <InlineEditor
              pageKey={pageKey}
              elementKey={elementKey}
              elementType={elementType}
              initialContentAr={contentAr}
              initialContentEn={contentEn}
              initialMetadata={metadata}
              onCancel={() => setEditing(null, false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {children}
            
            {/* Edit Button */}
            <AnimatePresence>
              {(isHovered || isEditing) && !isThisElementEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-2 z-10"
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleEditClick}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md border border-border/50"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};