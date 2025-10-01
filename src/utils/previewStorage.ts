// نظام إدارة معاينة المحتوى المؤقت
export interface PreviewContent {
  pageKey: string;
  elementKey: string;
  contentAr: string;
  contentEn: string;
  elementType: 'text' | 'rich_text' | 'image' | 'button';
  timestamp: number;
}

const PREVIEW_STORAGE_KEY = 'lovable_preview_content';

export class PreviewStorage {
  // حفظ محتوى للمعاينة
  static savePreviewContent(content: Omit<PreviewContent, 'timestamp'>): void {
    try {
      const previewData: PreviewContent = {
        ...content,
        timestamp: Date.now()
      };
      
      const existingData = this.getAllPreviewContent();
      const key = `${content.pageKey}:${content.elementKey}`;
      existingData[key] = previewData;
      
      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(existingData));
      
      // إطلاق حدث مخصص للتحديث الفوري
      window.dispatchEvent(new CustomEvent('previewContentUpdated', {
        detail: { pageKey: content.pageKey, elementKey: content.elementKey, content: previewData }
      }));
    } catch (error) {
      console.warn('فشل في حفظ محتوى المعاينة:', error);
    }
  }

  // جلب محتوى معين للمعاينة
  static getPreviewContent(pageKey: string, elementKey: string): PreviewContent | null {
    try {
      const allData = this.getAllPreviewContent();
      const key = `${pageKey}:${elementKey}`;
      return allData[key] || null;
    } catch (error) {
      console.warn('فشل في جلب محتوى المعاينة:', error);
      return null;
    }
  }

  // جلب جميع محتويات المعاينة
  static getAllPreviewContent(): Record<string, PreviewContent> {
    try {
      const data = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('فشل في جلب بيانات المعاينة:', error);
      return {};
    }
  }

  // مسح محتوى معين من المعاينة
  static clearPreviewContent(pageKey: string, elementKey: string): void {
    try {
      const allData = this.getAllPreviewContent();
      const key = `${pageKey}:${elementKey}`;
      delete allData[key];
      
      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.warn('فشل في مسح محتوى المعاينة:', error);
    }
  }

  // مسح جميع محتويات المعاينة
  static clearAllPreviewContent(): void {
    try {
      sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
    } catch (error) {
      console.warn('فشل في مسح جميع محتويات المعاينة:', error);
    }
  }

  // التحقق من وجود معاينة نشطة
  static hasActivePreview(): boolean {
    const allData = this.getAllPreviewContent();
    return Object.keys(allData).length > 0;
  }

  // التحقق من حالة المعاينة الحالية
  static isPreviewMode(): boolean {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('preview') === '1';
    } catch (error) {
      return false;
    }
  }

  // إنشاء URL للمعاينة
  static createPreviewUrl(path: string): string {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('preview', '1');
    // إضافة timestamp لضمان تحديث iframe
    url.searchParams.set('t', Date.now().toString());
    return url.toString();
  }

  // مراقب للتحديثات في الوقت الفعلي
  static onPreviewUpdate(callback: (data: { pageKey: string; elementKey: string; content: PreviewContent }) => void): () => void {
    const handleUpdate = (event: CustomEvent) => {
      callback(event.detail);
    };

    window.addEventListener('previewContentUpdated', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('previewContentUpdated', handleUpdate as EventListener);
    };
  }
}