
import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, Newspaper, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNewsEvents } from '@/hooks/useNewsEvents';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import { DynamicContent } from './DynamicContent';

const NewsEvents = () => {
  const { data: newsData, isLoading: newsLoading } = useNewsEvents('news');
  const { data: eventsData, isLoading: eventsLoading } = useNewsEvents('event');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Fallback news items if no data from database
  const fallbackNews = [
    {
      id: 'fallback-1',
      title_ar: 'افتتاح معامل جديدة لكلية الصيدلة',
      summary_ar: 'تم افتتاح معامل حديثة مجهزة بأحدث التقنيات لتدريب طلاب الصيدلة على أعلى مستوى',
      created_at: '2024-01-15T10:00:00Z',
      type: 'news',
      featured_image: null
    },
    {
      id: 'fallback-2', 
      title_ar: 'تخرج الدفعة الجديدة من طلاب التمريض',
      summary_ar: 'تخرج 150 طالب وطالبة من كلية التمريض في حفل تخرج مهيب بحضور كبار المسؤولين',
      created_at: '2024-01-10T10:00:00Z',
      type: 'news',
      featured_image: null
    }
  ];
  
  const newsItems = newsData && newsData.length > 0 ? newsData : fallbackNews;
  const eventItems = eventsData && eventsData.length > 0 ? eventsData : [];
  
  const getDefaultImage = () => 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="w-8 h-8 text-university-blue" />
              <h2 className="text-section-title">
                <DynamicContent 
                  pageKey="homepage" 
                  elementKey="news_title" 
                  fallback="آخر الأخبار"
                  as="span"
                />
              </h2>
            </div>

            <div className="space-y-8">
              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
                  <span className="mr-3">جاري تحميل الأخبار...</span>
                </div>
              ) : (
                newsItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className={`news-card animate-fadeInUp block hover:shadow-university transition-all duration-300`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Image */}
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={item.featured_image || getDefaultImage()}
                        alt={item.title_ar}
                        className="news-image w-full h-48 md:h-32 object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-university-blue text-white px-2 py-1 rounded-full">
                          {item.type === 'news' ? 'أخبار' : 'إعلان'}
                        </span>
                        <span className="text-small text-academic-gray">
                          {new Date(item.created_at).toLocaleDateString('ar-YE')}
                        </span>
                      </div>
                      
                      <h3 className="text-card-title mb-2 line-clamp-2">{item.title_ar}</h3>
                      <p className="text-body mb-4 line-clamp-3">{item.summary_ar}</p>
                      
                      <span className="btn-ghost group inline-flex items-center">
                        <span>اقرأ المزيد</span>
                        <ArrowLeft className="w-4 h-4 mr-2 rtl-flip group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
              )}
            </div>

            {/* View All News Button */}
            <div className="text-center mt-8">
              <Link to="/news" className="btn-primary">
                <DynamicContent 
                  pageKey="homepage" 
                  elementKey="news_view_all" 
                  fallback="عرض جميع الأخبار"
                  as="span"
                />
              </Link>
            </div>
          </div>

          {/* Events Sidebar */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-8 h-8 text-university-blue" />
              <h2 className="text-section-title">
                <DynamicContent 
                  pageKey="homepage" 
                  elementKey="events_title" 
                  fallback="الفعاليات القادمة"
                  as="span"
                />
              </h2>
            </div>

            <div className="space-y-6">
              {eventsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-university-blue" />
                  <span className="mr-3 text-sm">جاري تحميل الفعاليات...</span>
                </div>
              ) : eventItems.length > 0 ? (
                eventItems.slice(0, 3).map((event, index) => (
                  <div
                    key={event.id}
                    className={`card-elevated border-r-4 border-university-gold animate-fadeInUp cursor-pointer hover:shadow-lg transition-shadow`}
                    style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <h3 className="text-card-title mb-3 text-right">{event.title_ar}</h3>
                    
                    <div className="space-y-2 text-right">
                      {event.event_date && (
                        <div className="flex items-center justify-end gap-2 text-small text-academic-gray">
                          <span>{new Date(event.event_date).toLocaleDateString('ar-YE')}</span>
                          <Calendar className="w-4 h-4" />
                        </div>
                      )}
                      
                      {event.event_date && (
                        <div className="flex items-center justify-end gap-2 text-small text-academic-gray">
                          <span>{new Date(event.event_date).toLocaleTimeString('ar-YE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      
                      {event.event_location_ar && (
                        <div className="text-small text-academic-gray">
                          <span>{event.event_location_ar}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      className="btn-ghost mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      تفاصيل الفعالية والتسجيل
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-academic-gray">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد فعاليات قادمة حالياً</p>
                </div>
              )}
            </div>

            {/* View Calendar Button */}
            <div className="mt-8">
              <Link to="/academic-calendar" className="btn-secondary w-full">
                <DynamicContent 
                  pageKey="homepage" 
                  elementKey="view_academic_calendar" 
                  fallback="عرض التقويم الأكاديمي"
                  as="span"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default NewsEvents;
