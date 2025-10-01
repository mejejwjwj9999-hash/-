import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Save } from 'lucide-react';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement?: HTMLElement | null;
  onStyleChange?: (styles: Record<string, string>) => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({ 
  isOpen, 
  onClose, 
  selectedElement, 
  onStyleChange 
}) => {
  const [styles, setStyles] = useState({
    fontSize: '16',
    fontFamily: 'inherit',
    color: '#000000',
    backgroundColor: 'transparent'
  });

  const handleStyleChange = (property: string, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    onStyleChange?.(newStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            لوحة التصميم
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>حجم الخط</Label>
            <Input
              type="number"
              value={styles.fontSize}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            />
          </div>
          <div>
            <Label>لون النص</Label>
            <Input
              type="color"
              value={styles.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
          <Button onClick={onClose} className="w-full gap-2">
            <Save className="h-4 w-4" />
            حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};