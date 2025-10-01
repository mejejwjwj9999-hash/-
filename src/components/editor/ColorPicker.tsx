import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  isOpen, 
  onClose, 
  onColorSelect,
  selectedColor = '#000000'
}) => {
  const [currentColor, setCurrentColor] = useState(selectedColor);

  const predefinedColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  const applyColor = () => {
    onColorSelect?.(currentColor);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            منتقي الألوان
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>اللون الحالي</Label>
            <Input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>
          <Button onClick={applyColor} className="w-full">
            تطبيق اللون
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};