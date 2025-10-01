import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  GraduationCap,
  Stethoscope,
  Calculator,
  Microscope,
  BookOpen,
  Computer,
  Heart,
  Users,
  Building2,
  Briefcase,
  Globe,
  Lightbulb,
  Target,
  Trophy,
  Star,
  Shield,
  Cpu,
  Database,
  Code,
  Paintbrush,
  Camera,
  Music,
  Palette,
  Gamepad2,
  Headphones,
  Video,
  Zap,
  Atom,
  FlaskConical,
  Dna,
  TreePine,
  Leaf,
  Mountain,
  Waves,
  Sun,
  Search,
  Beaker,
  Settings
} from 'lucide-react';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  label?: string;
  variant?: 'button' | 'inline';
}

const iconOptions = [
  { name: 'graduation-cap', icon: GraduationCap, label: 'تعليم عام' },
  { name: 'stethoscope', icon: Stethoscope, label: 'طب' },
  { name: 'calculator', icon: Calculator, label: 'رياضيات' },
  { name: 'microscope', icon: Microscope, label: 'علوم مختبرية' },
  { name: 'book-open', icon: BookOpen, label: 'أدب وعلوم إنسانية' },
  { name: 'computer', icon: Computer, label: 'حاسوب وتقنية' },
  { name: 'heart', icon: Heart, label: 'تمريض وصحة' },
  { name: 'users', icon: Users, label: 'خدمة اجتماعية' },
  { name: 'building-2', icon: Building2, label: 'هندسة وعمارة' },
  { name: 'briefcase', icon: Briefcase, label: 'إدارة أعمال' },
  { name: 'globe', icon: Globe, label: 'علوم اجتماعية' },
  { name: 'lightbulb', icon: Lightbulb, label: 'ابتكار وإبداع' },
  { name: 'target', icon: Target, label: 'أهداف وإنجازات' },
  { name: 'trophy', icon: Trophy, label: 'تفوق وجوائز' },
  { name: 'star', icon: Star, label: 'تميز' },
  { name: 'shield', icon: Shield, label: 'أمن وحماية' },
  { name: 'cpu', icon: Cpu, label: 'هندسة حاسوب' },
  { name: 'database', icon: Database, label: 'قواعد بيانات' },
  { name: 'code', icon: Code, label: 'برمجة' },
  { name: 'paint-brush', icon: Paintbrush, label: 'فنون جميلة' },
  { name: 'camera', icon: Camera, label: 'تصوير وإعلام' },
  { name: 'music', icon: Music, label: 'موسيقى' },
  { name: 'palette', icon: Palette, label: 'تصميم' },
  { name: 'gamepad-2', icon: Gamepad2, label: 'تطوير الألعاب' },
  { name: 'headphones', icon: Headphones, label: 'صوتيات' },
  { name: 'video', icon: Video, label: 'إنتاج مرئي' },
  { name: 'zap', icon: Zap, label: 'كهرباء وطاقة' },
  { name: 'atom', icon: Atom, label: 'فيزياء' },
  { name: 'flask-conical', icon: FlaskConical, label: 'كيمياء' },
  { name: 'dna', icon: Dna, label: 'بيولوجيا ووراثة' },
  { name: 'tree-pine', icon: TreePine, label: 'علوم بيئية' },
  { name: 'leaf', icon: Leaf, label: 'زراعة' },
  { name: 'mountain', icon: Mountain, label: 'جغرافيا' },
  { name: 'waves', icon: Waves, label: 'علوم بحرية' },
  { name: 'sun', icon: Sun, label: 'طاقة متجددة' },
  { name: 'search', icon: Search, label: 'بحث وتطوير' },
  { name: 'beaker', icon: Beaker, label: 'كيمياء حيوية' },
  { name: 'settings', icon: Settings, label: 'هندسة صناعية' }
];

export const IconSelector: React.FC<IconSelectorProps> = ({ 
  selectedIcon, 
  onIconSelect, 
  label = 'اختيار الأيقونة',
  variant = 'button' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentIcon = iconOptions.find(icon => icon.name === selectedIcon);
  const CurrentIconComponent = currentIcon?.icon || GraduationCap;

  const filteredIcons = iconOptions.filter(icon => 
    icon.label.includes(searchTerm) || icon.name.includes(searchTerm)
  );

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        <Label>{label}</Label>
        <div className="grid grid-cols-8 gap-2 p-3 border rounded-lg bg-muted/20 max-h-32 overflow-y-auto">
          {iconOptions.map((icon) => {
            const IconComponent = icon.icon;
            return (
              <button
                key={icon.name}
                type="button"
                onClick={() => onIconSelect(icon.name)}
                className={`p-2 rounded-md border transition-all hover:bg-background ${
                  selectedIcon === icon.name ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'
                }`}
                title={icon.label}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <CurrentIconComponent className="w-4 h-4" />
            {currentIcon?.label || 'اختر أيقونة'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>اختيار الأيقونة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <Input
                placeholder="ابحث عن أيقونة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir="rtl"
              />
            </div>
            
            <div className="grid grid-cols-6 gap-3 max-h-96 overflow-y-auto">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.icon;
                return (
                  <Card 
                    key={icon.name}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedIcon === icon.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleIconSelect(icon.name)}
                  >
                    <CardContent className="p-3 text-center">
                      <IconComponent className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-xs truncate">{icon.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};