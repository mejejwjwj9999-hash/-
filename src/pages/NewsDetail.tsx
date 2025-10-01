
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { useNewsById } from '@/hooks/useNewsEvents';
import { supabase } from '@/integrations/supabase/client';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useNewsById(id || '');

  // Increment view count when article loads
  useEffect(() => {
    if (article?.id) {
      supabase.rpc('increment_news_views', { news_id: article.id });
    }
  }, [article?.id]);

  const handleShare = async () => {
    const shareData = {
      title: article?.title_ar,
      text: article?.summary_ar,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-university-blue mx-auto mb-4" />
          <p>جاري تحميل الخبر...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الخبر غير موجود</h1>
          <Link to="/media-center" className="btn-primary">
            العودة للمركز الإعلامي
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الخبر غير موجود</h1>
          <Link to="/media-center" className="btn-primary">
            العودة للمركز الإعلامي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-university-blue text-white py-8">
        <div className="container-custom">
          <Link to="/media-center" className="inline-flex items-center text-white hover:text-gray-200 mb-4">
            <ArrowLeft className="w-4 h-4 ml-2 rtl-flip" />
            العودة للمركز الإعلامي
          </Link>
          <h1 className="text-3xl font-bold">{article.title_ar}</h1>
        </div>
      </div>

      {/* Article Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
            <span className="inline-block px-3 py-1 bg-university-blue text-white text-sm font-semibold rounded-full">
              {article.type === 'news' ? 'أخبار' : 'إعلان'}
            </span>
            
            <div className="flex items-center gap-2 text-academic-gray">
              <Calendar className="w-4 h-4" />
              {new Date(article.created_at).toLocaleDateString('ar-YE')}
            </div>
            
            {article.created_by && (
              <div className="flex items-center gap-2 text-academic-gray">
                <User className="w-4 h-4" />
                كاتب الخبر
              </div>
            )}
            
            <div className="flex items-center gap-2 text-academic-gray">
              <Eye className="w-4 h-4" />
              {article.views_count || 0} مشاهدة
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-university-blue hover:text-university-blue-light transition-colors"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="mb-8">
              <img
                src={article.featured_image}
                alt={article.title_ar}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-medium"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none text-right">
            <div className="space-y-6 leading-relaxed">
              {article.content_ar ? (
                <div dangerouslySetInnerHTML={{ __html: article.content_ar }} />
              ) : (
                <p>{article.summary_ar}</p>
              )}
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-academic-gray">
                نُشر في {new Date(article.created_at).toLocaleDateString('ar-YE')}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-academic-gray">شاركه:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    فيسبوك
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title_ar)}`, '_blank')}
                    className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    تويتر
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title_ar + ' ' + window.location.href)}`, '_blank')}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    واتساب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
