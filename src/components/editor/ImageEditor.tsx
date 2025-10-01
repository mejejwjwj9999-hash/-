import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Image, Crop, RotateCw, Palette, Contrast, Sun, 
  Scissors, Undo, Redo, Download, Upload, Eye,
  Zap, Sparkles, Filter, Layers, Square, Circle,
  Save, X, Check, RefreshCw
} from 'lucide-react';
import { Canvas as FabricCanvas, Image as FabricImage, Circle as FabricCircle, Rect as FabricRect } from 'fabric';
import { toast } from '@/hooks/use-toast';

interface ImageEditorProps {
  imageUrl?: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  className?: string;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  vintage: number;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
}

const FILTER_PRESETS = [
  {
    name: 'الأصلي',
    filters: { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 0, vintage: 0 }
  },
  {
    name: 'مشرق',
    filters: { brightness: 20, contrast: 10, saturation: 15, hue: 0, blur: 0, sepia: 0, grayscale: 0, vintage: 0 }
  },
  {
    name: 'كلاسيكي',
    filters: { brightness: -10, contrast: 15, saturation: -20, hue: 0, blur: 0, sepia: 30, grayscale: 0, vintage: 40 }
  },
  {
    name: 'أبيض وأسود',
    filters: { brightness: 0, contrast: 20, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, vintage: 0 }
  },
  {
    name: 'دافئ',
    filters: { brightness: 10, contrast: 5, saturation: 10, hue: 10, blur: 0, sepia: 20, grayscale: 0, vintage: 0 }
  },
  {
    name: 'بارد',
    filters: { brightness: 0, contrast: 10, saturation: -10, hue: -15, blur: 0, sepia: 0, grayscale: 0, vintage: 0 }
  }
];

const ASPECT_RATIOS = [
  { label: 'حر', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:2', value: 3/2 },
  { label: '2:3', value: 2/3 }
];

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  onSave,
  onCancel,
  isOpen,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  
  const [activeTab, setActiveTab] = useState('filters');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    vintage: 0
  });
  
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspectRatio: 0
  });
  
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize fabric canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa'
    });

    fabricCanvasRef.current = canvas;

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [isOpen]);

  // Load image when URL changes
  useEffect(() => {
    if (!imageUrl || !fabricCanvasRef.current) return;

    setIsLoading(true);
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      
      FabricImage.fromURL(imageUrl).then((fabricImg) => {
        if (!fabricCanvasRef.current) return;
        
        // Scale image to fit canvas
        const canvas = fabricCanvasRef.current;
        const scale = Math.min(
          canvas.getWidth() / fabricImg.width!,
          canvas.getHeight() / fabricImg.height!
        );
        
        fabricImg.scale(scale);
        fabricImg.set({
          left: canvas.getWidth() / 2 - (fabricImg.width! * scale) / 2,
          top: canvas.getHeight() / 2 - (fabricImg.height! * scale) / 2
        });
        
        canvas.clear();
        canvas.add(fabricImg);
        canvas.renderAll();
        
        // Add to history
        addToHistory();
        setIsLoading(false);
      });
    };
    
    img.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'خطأ في تحميل الصورة',
        description: 'تعذر تحميل الصورة المحددة',
        variant: 'destructive'
      });
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  const addToHistory = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const newHistory = [...history.slice(0, historyIndex + 1), dataURL];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const applyFilters = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (!activeObject || activeObject.type !== 'image') return;

    const fabricImg = activeObject as FabricImage;
    
    // Create filter string
    const filterString = [
      filters.brightness !== 0 && `brightness(${100 + filters.brightness}%)`,
      filters.contrast !== 0 && `contrast(${100 + filters.contrast}%)`,
      filters.saturation !== 0 && `saturate(${100 + filters.saturation}%)`,
      filters.hue !== 0 && `hue-rotate(${filters.hue}deg)`,
      filters.blur !== 0 && `blur(${filters.blur}px)`,
      filters.sepia !== 0 && `sepia(${filters.sepia}%)`,
      filters.grayscale !== 0 && `grayscale(${filters.grayscale}%)`
    ].filter(Boolean).join(' ');

    // Apply filters (Note: Fabric.js has built-in filters but CSS filters are simpler for this demo)
    if (filterString) {
      fabricImg.filters = [];
      
      // Add brightness filter
      if (filters.brightness !== 0) {
        // For Fabric.js, we'd use specific filter classes
        // This is a simplified version - in production you'd use proper Fabric filters
      }
    }

    canvas.renderAll();
  }, [filters]);

  const handleFilterChange = useCallback((filterType: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const applyFilterPreset = useCallback((preset: typeof FILTER_PRESETS[0]) => {
    setFilters(preset.filters);
  }, []);

  const cropImage = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (!activeObject || activeObject.type !== 'image') return;

    // Create crop rectangle
    const cropRect = new FabricRect({
      left: cropSettings.x,
      top: cropSettings.y,
      width: cropSettings.width,
      height: cropSettings.height,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      evented: true
    });

    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();
  }, [cropSettings]);

  const rotateImage = useCallback((angle: number) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (!activeObject) return;

    activeObject.rotate(activeObject.angle! + angle);
    canvas.renderAll();
    
    setRotation(prev => prev + angle);
    addToHistory();
  }, [addToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && history[historyIndex - 1]) {
      const prevDataURL = history[historyIndex - 1];
      
      const img = new window.Image();
      img.onload = () => {
        FabricImage.fromURL(prevDataURL).then((fabricImg) => {
          if (!fabricCanvasRef.current) return;
          
          fabricCanvasRef.current.clear();
          fabricCanvasRef.current.add(fabricImg);
          fabricCanvasRef.current.renderAll();
        });
      };
      img.src = prevDataURL;
      
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
      const nextDataURL = history[historyIndex + 1];
      
      const img = new window.Image();
      img.onload = () => {
        FabricImage.fromURL(nextDataURL).then((fabricImg) => {
          if (!fabricCanvasRef.current) return;
          
          fabricCanvasRef.current.clear();
          fabricCanvasRef.current.add(fabricImg);
          fabricCanvasRef.current.renderAll();
        });
      };
      img.src = nextDataURL;
      
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    setIsLoading(true);
    
    // Apply current filters
    applyFilters();
    
    setTimeout(() => {
      const editedImageUrl = fabricCanvasRef.current!.toDataURL({
        format: 'png',
        quality: 0.9,
        multiplier: 1
      });
      
      onSave(editedImageUrl);
      setIsLoading(false);
      
      toast({
        title: 'تم حفظ الصورة',
        description: 'تم حفظ التعديلات بنجاح'
      });
    }, 100);
  }, [applyFilters, onSave]);

  const resetFilters = useCallback(() => {
    setFilters({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      vintage: 0
    });
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const timer = setTimeout(applyFilters, 100);
    return () => clearTimeout(timer);
  }, [filters, applyFilters]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            محرر الصور المتقدم
          </DialogTitle>
          <DialogDescription>
            تحرير وتخصيص الصورة باستخدام أدوات التحرير المتقدمة
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              
              <Badge variant="secondary">
                {history.length > 0 ? `${historyIndex + 1}/${history.length}` : '0/0'}
              </Badge>
            </div>
            
            <div className="flex-1 border rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  جاري التحميل...
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full border border-border rounded"
                />
              )}
            </div>
          </div>

          {/* Tools Panel */}
          <Card className="w-80 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">أدوات التحرير</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="filters">
                    <Filter className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="crop">
                    <Crop className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="adjust">
                    <Sun className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>

                {/* Filters Tab */}
                <TabsContent value="filters" className="space-y-4">
                  <div className="space-y-3">
                    <Label>الفلاتر الجاهزة</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {FILTER_PRESETS.map((preset, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => applyFilterPreset(preset)}
                          className="text-xs"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>فلاتر مخصصة</Label>
                    
                    {Object.entries(filters).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">
                            {key === 'brightness' && 'السطوع'}
                            {key === 'contrast' && 'التباين'}
                            {key === 'saturation' && 'التشبع'}
                            {key === 'hue' && 'اللون'}
                            {key === 'blur' && 'التشويش'}
                            {key === 'sepia' && 'بني داكن'}
                            {key === 'grayscale' && 'رمادي'}
                            {key === 'vintage' && 'كلاسيكي'}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {value}
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => 
                            handleFilterChange(key as keyof FilterSettings, newValue)
                          }
                          min={key === 'blur' ? 0 : -100}
                          max={100}
                          step={1}
                        />
                      </div>
                    ))}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      إعادة تعيين
                    </Button>
                  </div>
                </TabsContent>

                {/* Crop Tab */}
                <TabsContent value="crop" className="space-y-4">
                  <div className="space-y-3">
                    <Label>نسبة العرض إلى الارتفاع</Label>
                    <Select
                      value={cropSettings.aspectRatio?.toString() || '0'}
                      onValueChange={(value) => 
                        setCropSettings(prev => ({ 
                          ...prev, 
                          aspectRatio: parseFloat(value) || undefined 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASPECT_RATIOS.map((ratio) => (
                          <SelectItem key={ratio.label} value={ratio.value.toString()}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>إعدادات القص</Label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={cropSettings.x}
                          onChange={(e) =>
                            setCropSettings(prev => ({ 
                              ...prev, 
                              x: parseInt(e.target.value) || 0 
                            }))
                          }
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={cropSettings.y}
                          onChange={(e) =>
                            setCropSettings(prev => ({ 
                              ...prev, 
                              y: parseInt(e.target.value) || 0 
                            }))
                          }
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">العرض</Label>
                        <Input
                          type="number"
                          value={cropSettings.width}
                          onChange={(e) =>
                            setCropSettings(prev => ({ 
                              ...prev, 
                              width: parseInt(e.target.value) || 0 
                            }))
                          }
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">الارتفاع</Label>
                        <Input
                          type="number"
                          value={cropSettings.height}
                          onChange={(e) =>
                            setCropSettings(prev => ({ 
                              ...prev, 
                              height: parseInt(e.target.value) || 0 
                            }))
                          }
                          className="text-xs"
                        />
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={cropImage}
                      className="w-full gap-2"
                    >
                      <Scissors className="h-4 w-4" />
                      تطبيق القص
                    </Button>
                  </div>
                </TabsContent>

                {/* Adjust Tab */}
                <TabsContent value="adjust" className="space-y-4">
                  <div className="space-y-4">
                    <Label>التدوير</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rotateImage(-90)}
                        className="flex-1"
                      >
                        <RotateCw className="h-4 w-4 rotate-180" />
                        90°-
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rotateImage(90)}
                        className="flex-1"
                      >
                        <RotateCw className="h-4 w-4" />
                        90°+
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">دوران مخصص</Label>
                        <span className="text-xs text-muted-foreground">
                          {rotation}°
                        </span>
                      </div>
                      <Slider
                        value={[rotation]}
                        onValueChange={([angle]) => {
                          const diff = angle - rotation;
                          rotateImage(diff);
                        }}
                        min={-180}
                        max={180}
                        step={1}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            حفظ التعديلات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};