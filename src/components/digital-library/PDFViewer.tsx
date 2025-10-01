import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Maximize,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Configure PDF.js worker to use a local bundled worker (reliable, no CDN)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
}

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
  isFullscreen?: boolean;
  onClose?: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  fileUrl, 
  fileName = 'document.pdf',
  isFullscreen = false,
  onClose 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    loadPDF();
  }, [fileUrl]);

  useEffect(() => {
    if (pdf && currentPage) {
      renderPage();
    }
  }, [pdf, currentPage, scale, rotation]);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowFallback(false);
      
      console.log('Loading PDF from:', fileUrl);
      
      // Ensure worker is configured before loading
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
      }
      
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });
      
      const pdfDoc = await loadingTask.promise;
      console.log('PDF loaded successfully:', pdfDoc);
      
      setPdf(pdfDoc);
      setTotalPages(pdfDoc.numPages);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('فشل في تحميل ملف PDF');
      // Show iframe fallback after PDF.js fails
      setShowFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async () => {
    if (!pdf || !canvasRef.current) return;
    
    try {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      const viewport = page.getViewport({ scale, rotation });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Clear canvas before rendering
      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(Math.min(scale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(Math.max(scale - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  // Fallback PDF viewer using iframe
  const FallbackViewer = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 bg-muted border-b">
        <div className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">عارض PDF البديل</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadFile}>
            <Download className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1">
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={`عارض PDF - ${fileName}`}
        />
      </div>
    </div>
  );

  const ViewerContent = () => {
    if (showFallback) {
      return <FallbackViewer />;
    }

    return (
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-muted border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {loading ? '...' : `${currentPage} من ${totalPages}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={loading}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={loading}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotate} disabled={loading}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* PDF Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">جاري تحميل المستند...</span>
            </div>
          )}
          
          {error && !showFallback && (
            <div className="text-center space-y-4">
              <div className="text-red-600 dark:text-red-400">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm opacity-75 mt-1">سيتم تحويلك للعارض البديل</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={loadPDF}>
                  إعادة المحاولة
                </Button>
                <Button variant="secondary" onClick={() => setShowFallback(true)}>
                  استخدام العارض البديل
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && pdf && (
            <canvas 
              ref={canvasRef}
              className="max-w-full max-h-full shadow-lg rounded border"
            />
          )}
        </div>
      </div>
    );
  };

  if (isFullscreen) {
    return (
      <Dialog open={true} onOpenChange={() => onClose?.()}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          <DialogTitle className="sr-only">
            عارض PDF - {fileName}
          </DialogTitle>
          <ViewerContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <ViewerContent />
    </Card>
  );
};