import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Palette, Download, Upload, RefreshCw, Save, 
  Eye, Settings, Brush, Layers, Type, Sun, Moon,
  Zap, Star, Heart, Plus, Trash2, Copy, Check
} from 'lucide-react';
import { ColorPicker } from '@/components/editor/ColorPicker';
import { toast } from '@/hooks/use-toast';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  warning: string;
  success: string;
}

interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

interface ThemeSpacing {
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

interface CustomTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  darkMode: boolean;
  previewImage?: string;
  createdAt: Date;
  category: 'default' | 'custom' | 'preset';
}

interface ThemeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: CustomTheme;
  onThemeApply: (theme: CustomTheme) => void;
}

const DEFAULT_COLORS: ThemeColors = {
  primary: 'hsl(221.2 83.2% 53.3%)',
  secondary: 'hsl(210 40% 96%)',
  accent: 'hsl(210 40% 94%)',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222.2 84% 4.9%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215.4 16.3% 46.9%)',
  destructive: 'hsl(0 84.2% 60.2%)',
  warning: 'hsl(38 92% 50%)',
  success: 'hsl(142.1 76.2% 36.3%)'
};

const PRESET_THEMES: CustomTheme[] = [
  {
    id: 'modern-blue',
    name: 'الأزرق العصري',
    description: 'تصميم أزرق أنيق ومعاصر',
    category: 'preset',
    darkMode: false,
    createdAt: new Date(),
    colors: {
      ...DEFAULT_COLORS,
      primary: 'hsl(208 100% 47%)',
      accent: 'hsl(208 100% 92%)',
      secondary: 'hsl(208 19% 94%)'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625'
      }
    },
    spacing: {
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    }
  },
  {
    id: 'warm-orange',
    name: 'البرتقالي الدافئ',
    description: 'تصميم برتقالي دافئ ومريح',
    category: 'preset',
    darkMode: false,
    createdAt: new Date(),
    colors: {
      ...DEFAULT_COLORS,
      primary: 'hsl(24 100% 50%)',
      accent: 'hsl(24 100% 95%)',
      secondary: 'hsl(24 20% 94%)'
    },
    typography: {
      fontFamily: '"Cairo", sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625'
      }
    },
    spacing: {
      borderRadius: {
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    }
  },
  {
    id: 'dark-elegant',
    name: 'الداكن الأنيق',
    description: 'تصميم داكن أنيق ومتطور',
    category: 'preset',
    darkMode: true,
    createdAt: new Date(),
    colors: {
      primary: 'hsl(210 100% 60%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 15%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      card: 'hsl(222.2 84% 4.9%)',
      cardForeground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142.1 70.6% 45.3%)'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625'
      }
    },
    spacing: {
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    }
  }
];

export const ThemeBuilder: React.FC<ThemeBuilderProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeApply
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [workingTheme, setWorkingTheme] = useState<CustomTheme>(
    currentTheme || {
      id: 'custom-' + Date.now(),
      name: 'تصميم مخصص',
      description: 'تصميم مخصص جديد',
      category: 'custom',
      darkMode: false,
      createdAt: new Date(),
      colors: DEFAULT_COLORS,
      typography: {
        fontFamily: '"Inter", sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.625'
        }
      },
      spacing: {
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem'
        }
      }
    }
  );

  const [savedThemes, setSavedThemes] = useState<CustomTheme[]>([]);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // تحميل التصاميم المحفوظة
  useEffect(() => {
    const saved = localStorage.getItem('theme-builder-themes');
    if (saved) {
      setSavedThemes(JSON.parse(saved));
    }
  }, []);

  // تحديث لون في التصميم
  const updateColor = useCallback((colorKey: keyof ThemeColors, color: string) => {
    setWorkingTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color
      }
    }));
  }, []);

  // تحديث خط في التصميم
  const updateTypography = useCallback((section: keyof ThemeTypography, key: string, value: string) => {
    setWorkingTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [section]: typeof prev.typography[section] === 'object' 
          ? { ...prev.typography[section], [key]: value }
          : value
      }
    }));
  }, []);

  // تحديث مسافات في التصميم
  const updateSpacing = useCallback((section: keyof ThemeSpacing, key: string, value: string) => {
    setWorkingTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [section]: { ...prev.spacing[section], [key]: value }
      }
    }));
  }, []);

  // تطبيق تصميم جاهز
  const applyPreset = useCallback((preset: CustomTheme) => {
    setWorkingTheme({
      ...preset,
      id: 'custom-' + Date.now(),
      category: 'custom'
    });
    toast({
      title: 'تم تطبيق التصميم',
      description: `تم تطبيق تصميم: ${preset.name}`
    });
  }, []);

  // حفظ التصميم
  const saveTheme = useCallback(() => {
    const name = prompt('اسم التصميم:', workingTheme.name);
    if (!name) return;

    const savedTheme = {
      ...workingTheme,
      name,
      id: 'custom-' + Date.now(),
      createdAt: new Date()
    };

    const updatedThemes = [...savedThemes, savedTheme];
    setSavedThemes(updatedThemes);
    localStorage.setItem('theme-builder-themes', JSON.stringify(updatedThemes));

    toast({
      title: 'تم الحفظ',
      description: `تم حفظ التصميم: ${name}`
    });
  }, [workingTheme, savedThemes]);

  // تصدير التصميم
  const exportTheme = useCallback(() => {
    const themeCSS = generateThemeCSS(workingTheme);
    const blob = new Blob([themeCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workingTheme.name.replace(/\s+/g, '-')}-theme.css`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'تم التصدير',
      description: 'تم تصدير ملف CSS للتصميم'
    });
  }, [workingTheme]);

  // تطبيق التصميم
  const applyTheme = useCallback(() => {
    onThemeApply(workingTheme);
    onClose();
    toast({
      title: 'تم تطبيق التصميم',
      description: 'تم تطبيق التصميم على المحرر'
    });
  }, [workingTheme, onThemeApply, onClose]);

  // إنشاء CSS للتصميم
  const generateThemeCSS = (theme: CustomTheme): string => {
    const { colors, typography, spacing } = theme;
    
    return `
/* تصميم ${theme.name} */
:root {
  /* الألوان */
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --card: ${colors.card};
  --card-foreground: ${colors.cardForeground};
  --border: ${colors.border};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  --destructive: ${colors.destructive};
  --warning: ${colors.warning};
  --success: ${colors.success};
  
  /* الخطوط */
  --font-family: ${typography.fontFamily};
  --font-size-xs: ${typography.fontSize.xs};
  --font-size-sm: ${typography.fontSize.sm};
  --font-size-base: ${typography.fontSize.base};
  --font-size-lg: ${typography.fontSize.lg};
  --font-size-xl: ${typography.fontSize.xl};
  --font-size-2xl: ${typography.fontSize['2xl']};
  --font-size-3xl: ${typography.fontSize['3xl']};
  --font-size-4xl: ${typography.fontSize['4xl']};
  
  /* المسافات */
  --border-radius-sm: ${spacing.borderRadius.sm};
  --border-radius-md: ${spacing.borderRadius.md};
  --border-radius-lg: ${spacing.borderRadius.lg};
  --border-radius-xl: ${spacing.borderRadius.xl};
  
  --spacing-xs: ${spacing.spacing.xs};
  --spacing-sm: ${spacing.spacing.sm};
  --spacing-md: ${spacing.spacing.md};
  --spacing-lg: ${spacing.spacing.lg};
  --spacing-xl: ${spacing.spacing.xl};
  --spacing-2xl: ${spacing.spacing['2xl']};
}

body {
  font-family: var(--font-family);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
    `;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              منشئ التصاميم المخصصة
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportTheme}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveTheme}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={applyTheme}>
                تطبيق التصميم
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                إغلاق
              </Button>
            </div>
          </div>
          <CardDescription>
            إنشاء وتخصيص تصاميم فريدة للمحرر
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex gap-4">
          {/* منطقة التحكم */}
          <div className="w-80 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="spacing">
                  <Layers className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <Star className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              {/* تبويب الألوان */}
              <TabsContent value="colors" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {Object.entries(workingTheme.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0"
                            style={{ backgroundColor: value }}
                            onClick={() => setShowColorPicker(key)}
                          />
                          <Input
                            value={value}
                            onChange={(e) => updateColor(key as keyof ThemeColors, e.target.value)}
                            className="w-32 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* تبويب الخطوط */}
              <TabsContent value="typography" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div>
                      <Label>نوع الخط</Label>
                      <Select
                        value={workingTheme.typography.fontFamily}
                        onValueChange={(value) => updateTypography('fontFamily', '', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='"Inter", sans-serif'>Inter</SelectItem>
                          <SelectItem value='"Cairo", sans-serif'>Cairo</SelectItem>
                          <SelectItem value='"Amiri", serif'>Amiri</SelectItem>
                          <SelectItem value='"Noto Sans Arabic", sans-serif'>Noto Sans Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">أحجام الخطوط</Label>
                      {Object.entries(workingTheme.typography.fontSize).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-xs">{key}</Label>
                          <Input
                            value={value}
                            onChange={(e) => updateTypography('fontSize', key, e.target.value)}
                            className="w-20 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* تبويب المسافات */}
              <TabsContent value="spacing" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">انحناء الزوايا</Label>
                      {Object.entries(workingTheme.spacing.borderRadius).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-xs">{key}</Label>
                          <Input
                            value={value}
                            onChange={(e) => updateSpacing('borderRadius', key, e.target.value)}
                            className="w-20 text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">المسافات</Label>
                      {Object.entries(workingTheme.spacing.spacing).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-xs">{key}</Label>
                          <Input
                            value={value}
                            onChange={(e) => updateSpacing('spacing', key, e.target.value)}
                            className="w-20 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* تبويب التصاميم الجاهزة */}
              <TabsContent value="presets" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">التصاميم الجاهزة</Label>
                      {PRESET_THEMES.map((preset) => (
                        <Card key={preset.id} className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-sm">{preset.name}</h4>
                              <p className="text-xs text-muted-foreground">{preset.description}</p>
                            </div>
                            <Button size="sm" onClick={() => applyPreset(preset)}>
                              تطبيق
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {Object.values(preset.colors).slice(0, 6).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-sm border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {savedThemes.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-2 block">التصاميم المحفوظة</Label>
                          {savedThemes.map((theme) => (
                            <Card key={theme.id} className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-sm">{theme.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {theme.createdAt.toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline" onClick={() => applyPreset(theme)}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    onClick={() => {
                                      const filtered = savedThemes.filter(t => t.id !== theme.id);
                                      setSavedThemes(filtered);
                                      localStorage.setItem('theme-builder-themes', JSON.stringify(filtered));
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {Object.values(theme.colors).slice(0, 6).map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded-sm border"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* منطقة المعاينة */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">المعاينة المباشرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="space-y-4 p-4 border rounded-lg"
                  style={{
                    '--primary': workingTheme.colors.primary,
                    '--secondary': workingTheme.colors.secondary,
                    '--accent': workingTheme.colors.accent,
                    '--background': workingTheme.colors.background,
                    '--foreground': workingTheme.colors.foreground,
                    '--card': workingTheme.colors.card,
                    '--card-foreground': workingTheme.colors.cardForeground,
                    '--border': workingTheme.colors.border,
                    '--muted': workingTheme.colors.muted,
                    '--muted-foreground': workingTheme.colors.mutedForeground,
                    fontFamily: workingTheme.typography.fontFamily,
                    backgroundColor: workingTheme.colors.background,
                    color: workingTheme.colors.foreground,
                    borderRadius: workingTheme.spacing.borderRadius.lg
                  } as React.CSSProperties}
                >
                  {/* عينة من العناصر */}
                  <h1 style={{ fontSize: workingTheme.typography.fontSize['3xl'], fontWeight: workingTheme.typography.fontWeight.bold }}>
                    عنوان رئيسي
                  </h1>
                  <p style={{ fontSize: workingTheme.typography.fontSize.base, color: workingTheme.colors.mutedForeground }}>
                    هذا نص تجريبي لمعاينة التصميم الجديد. يمكنك رؤية كيف تبدو الألوان والخطوط معاً.
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      style={{
                        backgroundColor: workingTheme.colors.primary,
                        color: workingTheme.colors.background,
                        padding: workingTheme.spacing.spacing.md,
                        borderRadius: workingTheme.spacing.borderRadius.md,
                        border: 'none',
                        fontWeight: workingTheme.typography.fontWeight.medium
                      }}
                    >
                      زر أساسي
                    </button>
                    <button 
                      style={{
                        backgroundColor: 'transparent',
                        color: workingTheme.colors.primary,
                        padding: workingTheme.spacing.spacing.md,
                        borderRadius: workingTheme.spacing.borderRadius.md,
                        border: `1px solid ${workingTheme.colors.primary}`,
                        fontWeight: workingTheme.typography.fontWeight.medium
                      }}
                    >
                      زر ثانوي  
                    </button>
                  </div>

                  <div 
                    style={{
                      backgroundColor: workingTheme.colors.card,
                      padding: workingTheme.spacing.spacing.lg,
                      borderRadius: workingTheme.spacing.borderRadius.lg,
                      border: `1px solid ${workingTheme.colors.border}`
                    }}
                  >
                    <h3 style={{ fontSize: workingTheme.typography.fontSize.lg, marginBottom: workingTheme.spacing.spacing.sm }}>
                      بطاقة تجريبية
                    </h3>
                    <p style={{ fontSize: workingTheme.typography.fontSize.sm, color: workingTheme.colors.mutedForeground }}>
                      محتوى البطاقة هنا...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        {/* منتقي الألوان */}
        <ColorPicker
          isOpen={showColorPicker !== null}
          onClose={() => setShowColorPicker(null)}
          onColorSelect={(color) => {
            if (showColorPicker) {
              updateColor(showColorPicker as keyof ThemeColors, color);
            }
          }}
          selectedColor={showColorPicker ? workingTheme.colors[showColorPicker as keyof ThemeColors] : undefined}
        />
      </Card>
    </div>
  );
};