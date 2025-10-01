
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Search, Filter, Loader2, Home, FileText } from 'lucide-react';
import { useNewsEvents } from '@/hooks/useNewsEvents';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: newsData, isLoading } = useNewsEvents('news');

  // Fallback to dummy data if no real data
  const fallbackNews = [
    {
      id: '1',
      title: 'افتتاح معامل جديدة لكلية الصيدلة',
      summary: 'تم افتتاح معامل حديثة مجهزة بأحدث التقنيات لتدريب طلاب الصيدلة على أعلى مستوى',
      date: '2024-01-15',
      author: 'إدارة الكلية',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 245,
      category: 'أخبار الكلية'
    },
    {
      id: '2',
      title: 'تخرج الدفعة الجديدة من طلاب التمريض',
      summary: 'تخرج 150 طالب وطالبة من كلية التمريض في حفل تخرج مهيب بحضور كبار المسؤولين',
      date: '2024-01-10',
      author: 'قسم الفعاليات',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 189,
      category: 'فعاليات'
    },
    {
      id: '3',
      title: 'ورشة عمل حول التكنولوجيا الطبية',
      summary: 'تنظم الكلية ورشة عمل متخصصة حول أحدث التطورات في التكنولوجيا الطبية',
      date: '2024-01-08',
      author: 'النشاط الطلابي',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 312,
      category: 'ورش عمل'
    },
    {
      id: '4',
      title: 'انطلاق فعاليات الأسبوع الثقافي الأول',
      summary: 'بدأت فعاليات الأسبوع الثقافي الأول بكلية أيلول بمشاركة واسعة من الطلاب والأساتذة',
      date: '2024-01-05',
      author: 'النشاط الطلابي',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 156,
      category: 'أنشطة طلابية'
    },
    {
      id: '5',
      title: 'توقيع اتفاقية تعاون مع مستشفى يريم العام',
      summary: 'وقعت الكلية اتفاقية تعاون استراتيجي مع مستشفى يريم العام لتوفير التدريب العملي',
      date: '2024-01-03',
      author: 'العلاقات العامة',
      image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 289,
      category: 'شراكات'
    },
    {
      id: '6',
      title: 'محاضرة علمية حول الطب الوقائي',
      summary: 'ألقى البروفيسور أحمد المحمدي محاضرة علمية حول أهمية الطب الوقائي في المجتمع',
      date: '2023-12-28',
      author: 'كلية الطب',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 178,
      category: 'محاضرات علمية'
    }
  ];

  const categories = [
    'all',
    'أخبار الكلية',
    'فعاليات',
    'ورش عمل',
    'أنشطة طلابية',
    'شراكات',
    'محاضرات علمية'
  ];

  const allNews = newsData && newsData.length > 0 ? 
    newsData.map(item => ({
      id: item.id,
      title: item.title_ar,
      summary: item.summary_ar || '',
      date: item.created_at,
      author: 'إدارة الكلية',
      image: item.featured_image || 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
      views: item.views_count || 0,
      category: item.type === 'news' ? 'أخبار' : 'إعلان'
    })) : fallbackNews;

  const filteredNews = allNews.filter(article => {
    const matchesSearch = article.title.includes(searchTerm) || article.summary.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={FileText}
        title="جميع الأخبار"
        subtitle="تابع آخر أخبار وفعاليات كلية أيلول الجامعية"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'جميع الأخبار', icon: FileText }
            ]}
          />
        }
      />

      {/* Filters */}
      <div className="bg-white shadow-soft py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث في الأخبار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-transparent"
                >
                  <option value="all">جميع الفئات</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="container-custom py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-university-blue" />
            <span className="mr-3">جاري تحميل الأخبار...</span>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="news-card block hover:shadow-university transition-all duration-300"
              >
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="news-image w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-university-blue text-white text-sm font-semibold rounded-full mb-3">
                    {article.category}
                  </span>
                  
                  <h3 className="text-card-title mb-3 hover:text-university-blue transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-body mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-academic-gray">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('ar-YE')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-academic-gray mb-4">لا توجد أخبار</h3>
            <p className="text-academic-gray">لم نجد أي أخبار تطابق معايير البحث المحددة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;
