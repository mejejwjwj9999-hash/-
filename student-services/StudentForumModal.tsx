
import React, { useState } from 'react';
import { MessageCircle, Users, Send, Heart, MessageSquare, Share2, X, Plus, Search, Filter } from 'lucide-react';

interface StudentForumModalProps {
  onClose: () => void;
}

const StudentForumModal = ({ onClose }: StudentForumModalProps) => {
  const [activeTab, setActiveTab] = useState('recent');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const forumPosts = [
    {
      id: 1,
      author: 'أحمد محمد',
      avatar: '👨‍🎓',
      college: 'كلية الصيدلة',
      title: 'سؤال حول امتحان الكيمياء العضوية',
      content: 'هل يمكن لأحد مساعدتي في فهم آلية التفاعل في الباب الثالث؟',
      timestamp: '5 دقائق',
      likes: 12,
      replies: 5,
      tags: ['كيمياء', 'امتحانات']
    },
    {
      id: 2,
      author: 'فاطمة علي',
      avatar: '👩‍🎓',
      college: 'كلية التمريض',
      title: 'مشاركة ملخص درس التشريح',
      content: 'قمت بإعداد ملخص شامل لدرس التشريح، يمكنكم تحميله من الرابط أدناه',
      timestamp: '30 دقيقة',
      likes: 28,
      replies: 12,
      tags: ['تشريح', 'ملخصات']
    },
    {
      id: 3,
      author: 'سعد يحيى',
      avatar: '👨‍💻',
      college: 'كلية تقنية المعلومات',
      title: 'مجموعة برمجة للمشاريع الجماعية',
      content: 'أبحث عن زملاء للعمل على مشروع تطوير تطبيق محمول للجامعة',
      timestamp: '2 ساعة',
      likes: 15,
      replies: 8,
      tags: ['برمجة', 'مشاريع']
    }
  ];

  const categories = [
    { id: 'recent', name: 'الأحدث', count: 45 },
    { id: 'popular', name: 'الأكثر شعبية', count: 23 },
    { id: 'questions', name: 'الأسئلة', count: 67 },
    { id: 'resources', name: 'المصادر', count: 34 },
    { id: 'projects', name: 'المشاريع', count: 18 }
  ];

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      // هنا يتم إضافة المنشور الجديد
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            منتدى الطلاب
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewPost(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              منشور جديد
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في المنتدى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 mb-3">الفئات</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`w-full text-right p-3 rounded-lg transition-colors flex items-center justify-between ${
                    activeTab === category.id
                      ? 'bg-university-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === category.id ? 'bg-white text-university-blue' : 'bg-gray-200'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* إحصائيات سريعة */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-3">إحصائيات المنتدى</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>المنشورات:</span>
                  <span className="font-medium">187</span>
                </div>
                <div className="flex justify-between">
                  <span>الأعضاء النشطون:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span>الردود اليوم:</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {showNewPost && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3">إنشاء منشور جديد</h3>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="شارك أفكارك مع زملائك الطلاب..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  rows={4}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleNewPost}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    نشر
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {forumPosts.map((post) => (
                <div key={post.id} className="card-elevated hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{post.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{post.author}</h4>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-university-blue">{post.college}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-university-blue-light text-white text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-university-blue transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.replies} ردود</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-university-blue transition-colors">
                            <Share2 className="w-4 h-4" />
                            مشاركة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForumModal;
