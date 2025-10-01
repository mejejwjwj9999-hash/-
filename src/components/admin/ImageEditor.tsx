import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RotateCw, RotateCcw, Crop, Sliders, Palette, Type, 
  Download, Undo, Redo, ZoomIn, ZoomOut, Move,
  Square, Circle, Triangle, Minus, Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (editedImageUrl: string) => void;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0
  });

  const [cropMode, setCropMode] = useState(false);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (imageSrc && isOpen) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setOriginalImage(img);
        drawImage(img);
        saveToHistory();
      };
      img.src = imageSrc;
    }
  }, [imageSrc, isOpen]);

  const drawImage = (img?: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !originalImage) return;

    const imageToUse = img || originalImage;
    
    // تحديد حجم الكانفاس
    canvas.width = imageToUse.width;
    canvas.height = imageToUse.height;

    // مسح الكانفاس
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // تطبيق التحويلات
    ctx.save();
    
    // دوران
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // تطبيق الفلاتر
    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
    `;
    ctx.filter = filterString;

    // رسم الصورة
    ctx.drawImage(imageToUse, 0, 0);
    ctx.restore();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const prevImageData = history[historyIndex - 1];
      ctx.putImageData(prevImageData, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const nextImageData = history[historyIndex + 1];
      ctx.putImageData(nextImageData, 0, 0);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyFilter = (filterName: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    drawImage();
  };

  const rotateImage = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
    drawImage();
    saveToHistory();
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0
    });
    setRotation(0);
    drawImage();
    saveToHistory();
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onSave(url);
          toast({ title: "تم الحفظ", description: "تم حفظ الصورة المحررة بنجاح" });
          onClose();
        }
      }, 'image/png', 0.9);
    } catch (error) {
      toast({ 
        title: "خطأ", 
        description: "فشل في حفظ الصورة", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const presetFilters = [
    {
      name: 'طبيعي',
      values: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 0
      }
    },
    {
      name: 'دافئ',
      values: {
        brightness: 110,
        contrast: 105,
        saturation: 120,
        hue: 10,
        blur: 0,
        sepia: 20,
        grayscale: 0
      }
    },
    {
      name: 'بارد',
      values: {
        brightness: 95,
        contrast: 110,
        saturation: 90,
        hue: -10,
        blur: 0,
        sepia: 0,
        grayscale: 10
      }
    },
    {
      name: 'أبيض وأسود',
      values: {
        brightness: 100,
        contrast: 120,
        saturation: 0,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 100
      }
    },
    {
      name: 'عتيق',
      values: {
        brightness: 110,
        contrast: 90,
        saturation: 80,
        hue: 0,
        blur: 0,
        sepia: 40,
        grayscale: 20
      }
    }
  ];

  const applyPreset = (preset: typeof presetFilters[0]) => {
    setFilters(preset.values);
    drawImage();
    saveToHistory();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>محرر الصور المتقدم</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* منطقة المعاينة */}
          <div className="flex-1 bg-muted rounded-lg p-4 overflow-auto">
            <div className="flex justify-center items-center h-full">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border rounded shadow-lg"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
            
            {/* أدوات التحكم في العرض */}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 bg-background rounded text-sm">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* لوحة الأدوات */}
          <div className="w-80 bg-background rounded-lg p-4 overflow-auto">
            <Tabs defaultValue="filters" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="filters">فلاتر</TabsTrigger>
                <TabsTrigger value="adjust">تعديل</TabsTrigger>
                <TabsTrigger value="effects">تأثيرات</TabsTrigger>
                <TabsTrigger value="transform">تحويل</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">فلاتر جاهزة</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {presetFilters.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="h-auto py-2"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>السطوع: {filters.brightness}%</Label>
                    <Slider
                      value={[filters.brightness]}
                      onValueChange={([value]) => applyFilter('brightness', value)}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>التباين: {filters.contrast}%</Label>
                    <Slider
                      value={[filters.contrast]}
                      onValueChange={([value]) => applyFilter('contrast', value)}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>التشبع: {filters.saturation}%</Label>
                    <Slider
                      value={[filters.saturation]}
                      onValueChange={([value]) => applyFilter('saturation', value)}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>تدرج اللون: {filters.hue}°</Label>
                    <Slider
                      value={[filters.hue]}
                      onValueChange={([value]) => applyFilter('hue', value)}
                      min={-180}
                      max={180}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>التمويه: {filters.blur}px</Label>
                    <Slider
                      value={[filters.blur]}
                      onValueChange={([value]) => applyFilter('blur', value)}
                      min={0}
                      max={10}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>العتق: {filters.sepia}%</Label>
                    <Slider
                      value={[filters.sepia]}
                      onValueChange={([value]) => applyFilter('sepia', value)}
                      min={0}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>الرمادي: {filters.grayscale}%</Label>
                    <Slider
                      value={[filters.grayscale]}
                      onValueChange={([value]) => applyFilter('grayscale', value)}
                      min={0}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transform" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">الدوران</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => rotateImage(-90)}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 ml-2" />
                      90° يسار
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rotateImage(90)}
                      className="flex-1"
                    >
                      <RotateCw className="h-4 w-4 ml-2" />
                      90° يمين
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    إعادة تعيين الكل
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* أزرار الإجراءات */}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                إلغاء
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;