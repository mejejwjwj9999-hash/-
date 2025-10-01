import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Share2, Search, Image, Video, FileText, Loader2, Play, Home } from 'lucide-react';
import { useNewsEvents } from '@/hooks/useNewsEvents';
import { useImages, useVideos } from '@/hooks/useMediaLibrary';
import { DynamicContent } from '@/components/DynamicContent';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const MediaCenter = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch data from database
  const { data: newsData, isLoading: newsLoading } = useNewsEvents('news');
  const { data: eventsData, isLoading: eventsLoading } = useNewsEvents('event');
  const { data: imagesData, isLoading: imagesLoading } = useImages();
  const { data: videosData, isLoading: videosLoading } = useVideos();

  // Filter news based on search term
  const filteredNews = newsData?.filter(article => 
    article.title_ar?.includes(searchTerm) || 
    article.summary_ar?.includes(searchTerm)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={FileText}
        title="المركز الإعلامي"
        subtitle="تابع آخر أخبار الكلية والفعاليات والإنجازات الأكاديمية"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'المركز الإعلامي', icon: FileText }
            ]}
          />
        }
      />

      {/* Navigation Tabs */}
      <section className="py-8 bg-white shadow-soft">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {[{
            id: 'news',
            label: 'الأخبار',
            icon: FileText
          }, {
            id: 'events',
            label: 'الفعاليات',
            icon: Calendar
          }, {
            id: 'gallery',
            label: 'معرض الصور',
            icon: Image
          }, {
            id: 'videos',
            label: 'مقاطع الفيديو',
            icon: Video
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id ? 'bg-university-blue text-white shadow-medium' : 'bg-gray-100 text-university-blue hover:bg-university-blue-light hover:bg-opacity-10'}`}>
                <tab.icon className="w-5 h-5 ml-2" />
                {tab.label}
              </button>)}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 bg-academic-gray-light">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-academic-gray w-5 h-5" />
              <input type="text" placeholder="ابحث في المحتوى..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding">
        <div className="container-custom">
          {/* News Section */}
          {activeTab === 'news' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-section-title mb-4">آخر الأخبار</h2>
                <div className="w-24 h-1 bg-university-blue mx-auto"></div>
              </div>
              
              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
                  <span className="mr-3">جاري تحميل الأخبار...</span>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                  {filteredNews.map((article) => (
                    <Link key={article.id} to={`/news/${article.id}`} className="news-card block hover:shadow-university transition-all duration-300">
                      <div className="overflow-hidden rounded-t-lg">
                        <img 
                          src={article.featured_image || 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800'} 
                          alt={article.title_ar} 
                          className="news-image w-full h-48 object-cover" 
                        />
                      </div>
                      
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 bg-university-blue-light bg-opacity-10 text-university-blue text-sm font-semibold rounded-full mb-3">
                          {article.type === 'news' ? 'أخبار' : 'إعلان'}
                        </span>
                        
                        <h3 className="text-card-title mb-3 hover:text-university-blue transition-colors">
                          {article.title_ar}
                        </h3>
                        
                        <p className="text-body mb-4 line-clamp-3">
                          {article.summary_ar}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-academic-gray">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 ml-1" />
                            {new Date(article.created_at).toLocaleDateString('ar-YE')}
                          </div>
                          {article.is_featured && (
                            <span className="text-xs bg-university-gold text-white px-2 py-1 rounded-full">
                              مميز
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center text-sm text-academic-gray">
                            <Eye className="w-4 h-4 ml-1" />
                            {article.views_count || 0} مشاهدة
                          </div>
                          <button className="flex items-center text-university-blue hover:text-university-blue-light transition-colors">
                            <Share2 className="w-4 h-4 ml-1" />
                            مشاركة
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Section */}
          {activeTab === 'events' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-section-title mb-4">الفعاليات القادمة</h2>
                <div className="w-24 h-1 bg-university-blue mx-auto"></div>
              </div>
              
              {eventsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
                  <span className="mr-3">جاري تحميل الفعاليات...</span>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  {eventsData?.map((event) => (
                    <div key={event.id} className="card-elevated hover:shadow-university transition-all duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/4 p-6 bg-university-blue text-white text-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                          <Calendar className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-lg font-bold">
                            {event.event_date ? new Date(event.event_date).toLocaleDateString('ar-YE') : 'قريباً'}
                          </div>
                          <div className="text-sm opacity-90">
                            {event.event_date ? new Date(event.event_date).toLocaleTimeString('ar-YE', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : ''}
                          </div>
                        </div>
                        
                        <div className="md:w-3/4 p-6">
                          <h3 className="text-card-title mb-3">{event.title_ar}</h3>
                          <p className="text-body mb-4">{event.summary_ar}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-academic-gray">
                            <div>
                              <strong>المكان:</strong> {event.event_location_ar || 'سيتم تحديده'}
                            </div>
                            <div>
                              <strong>النوع:</strong> {event.type === 'event' ? 'فعالية' : 'مؤتمر'}
                            </div>
                          </div>
                          
                          <button className="mt-4 btn-primary">
                            التسجيل في الفعالية
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gallery Section */}
          {activeTab === 'gallery' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-section-title mb-4">معرض الصور</h2>
                <div className="w-24 h-1 bg-university-blue mx-auto"></div>
              </div>
              
              {imagesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
                  <span className="mr-3">جاري تحميل الصور...</span>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {imagesData?.map((image) => (
                    <div key={image.id} className="relative overflow-hidden rounded-lg shadow-medium hover:shadow-large transition-all duration-300">
                      <img 
                        src={image.file_path} 
                        alt={image.alt_text_ar || image.file_name} 
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white text-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <h4 className="font-semibold">{image.alt_text_ar || image.file_name}</h4>
                          <p className="text-sm">{image.description_ar}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos Section */}
          {activeTab === 'videos' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-section-title mb-4">مقاطع الفيديو</h2>
                <div className="w-24 h-1 bg-university-blue mx-auto"></div>
              </div>
              
              {videosLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
                  <span className="mr-3">جاري تحميل الفيديوهات...</span>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videosData?.map((video) => (
                    <div key={video.id} className="card-elevated hover:shadow-university transition-all duration-300">
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center overflow-hidden">
                          {video.file_path ? (
                            <video 
                              className="w-full h-full object-cover"
                              poster={video.file_path}
                            >
                              <source src={video.file_path} type="video/mp4" />
                            </video>
                          ) : (
                            <Video className="w-16 h-16 text-gray-500" />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          فيديو
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-university-blue mb-2">
                          {video.alt_text_ar || video.file_name}
                        </h4>
                        <p className="text-sm text-academic-gray mb-2">
                          {video.description_ar}
                        </p>
                        <div className="flex items-center justify_between text-sm text-academic-gray">
                          <span>{video.usage_count || 0} مشاهدة</span>
                          <button className="text-university-blue hover:text-university-blue-light">
                            مشاهدة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MediaCenter;