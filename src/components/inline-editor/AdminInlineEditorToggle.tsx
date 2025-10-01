import React, { useState } from 'react';
import { Edit3, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface AdminInlineEditorToggleProps {
  onToggleEditMode?: (isEditing: boolean) => void;
}

export const AdminInlineEditorToggle: React.FC<AdminInlineEditorToggleProps> = ({
  onToggleEditMode
}) => {
  const [user, setUser] = React.useState<any>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { data: isAdmin } = useIsAdmin(user?.id);

  if (!isAdmin) {
    return null;
  }

  const handleToggleEditMode = () => {
    setIsEditorMode(!isEditorMode);
    onToggleEditMode?.(!isEditorMode);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex flex-col items-end gap-3">
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg border min-w-[280px]">
                  <h4 className="font-semibold mb-4 text-right">إعدادات التحرير</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-mode" className="text-sm">وضع التحرير المباشر</Label>
                      <Switch
                        id="edit-mode"
                        checked={isEditorMode}
                        onCheckedChange={handleToggleEditMode}
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-right">
                      {isEditorMode 
                        ? 'يمكنك الآن تحرير محتوى الصفحة مباشرة' 
                        : 'وضع العرض العادي للزوار'
                      }
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant={showSettings ? "default" : "outline"}
              onClick={() => setShowSettings(!showSettings)}
              className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50 border-2"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button
              size="sm"
              variant={isEditorMode ? "default" : "outline"}
              onClick={handleToggleEditMode}
              className={`h-14 w-14 rounded-full shadow-lg transition-all ${
                isEditorMode 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-white hover:bg-gray-50 border-2'
              }`}
            >
              {isEditorMode ? (
                <Eye className="h-6 w-6" />
              ) : (
                <Edit3 className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Status Indicator */}
      {isEditorMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-40"
        >
          <Card className="px-4 py-2 bg-primary/90 text-primary-foreground shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <Edit3 className="h-4 w-4" />
              <span>وضع التحرير نشط</span>
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
};