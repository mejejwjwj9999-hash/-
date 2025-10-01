
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { X, Calendar, Clock, MapPin, Users, User, CheckCircle } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface EventDetailsModalProps {
  event: any;
  onClose: () => void;
}

const EventDetailsModal = ({ event, onClose }: EventDetailsModalProps) => {
  const { toast } = useToast();

  const handleRegister = () => {
    if (event.registered >= event.capacity) {
      toast({
        title: "الفعالية مكتملة",
        description: "عذراً، لقد اكتملت الأماكن المتاحة لهذه الفعالية",
      });
      return;
    }

    toast({
      title: "تم التسجيل بنجاح",
      description: `تم تسجيلك في فعالية "${event.title}". ستصلك رسالة تأكيد قريباً.`,
    });
    onClose();
  };

  if (!event) return null;

  const progressPercentage = (event.registered / event.capacity) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center justify-between">
            <span>تفاصيل الفعالية</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Event Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-university-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-university-blue mb-2">{event.title}</h2>
            <p className="text-body">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-university-blue-light text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-center">معلومات الفعالية</h3>
                <div className="space-y-3" dir="rtl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('ar-YE', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">التاريخ</span>
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">الوقت</span>
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">المكان</span>
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.organizer}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">المنظم</span>
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Registration Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-center">حالة التسجيل</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>المسجلون</span>
                    <span className="font-bold text-university-blue">{event.registered}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>السعة الكاملة</span>
                    <span className="font-bold text-university-blue">{event.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        progressPercentage >= 90 ? 'bg-red-500' : 
                        progressPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-academic-gray">
                    {Math.round(progressPercentage)}% مكتمل
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-university-gold text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-center">معلومات التواصل</h3>
                <div className="space-y-2 text-sm text-center">
                  <div>للاستفسارات والمعلومات</div>
                  <div className="font-bold">+967779553944</div>
                  <div>aylolcollege@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Agenda */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-center text-university-blue">جدول الفعالية</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded border-r-4 border-university-blue">
                <div className="text-sm">
                  <div className="font-medium">استقبال وتسجيل المشاركين</div>
                  <div className="text-academic-gray">القاعة الرئيسية</div>
                </div>
                <div className="text-university-blue font-bold">9:30 - 10:00</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border-r-4 border-university-gold">
                <div className="text-sm">
                  <div className="font-medium">بداية الفعالية والكلمة الترحيبية</div>
                  <div className="text-academic-gray">عميد الكلية</div>
                </div>
                <div className="text-university-blue font-bold">10:00 - 10:15</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border-r-4 border-university-red">
                <div className="text-sm">
                  <div className="font-medium">المحتوى الرئيسي للفعالية</div>
                  <div className="text-academic-gray">محاضرة أو ورشة عمل</div>
                </div>
                <div className="text-university-blue font-bold">10:15 - 12:00</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border-r-4 border-green-500">
                <div className="text-sm">
                  <div className="font-medium">جلسة نقاش وأسئلة</div>
                  <div className="text-academic-gray">تفاعل مع المشاركين</div>
                </div>
                <div className="text-university-blue font-bold">12:00 - 12:30</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border-r-4 border-purple-500">
                <div className="text-sm">
                  <div className="font-medium">اختتام وتوزيع الشهادات</div>
                  <div className="text-academic-gray">صور تذكارية</div>
                </div>
                <div className="text-university-blue font-bold">12:30 - 13:00</div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-400">
            <h3 className="font-bold mb-3 text-center text-yellow-800">متطلبات الحضور</h3>
            <ul className="space-y-2 text-sm" dir="rtl">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-right">إحضار الهوية الطلابية أو بطاقة الهوية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-right">الالتزام بالحضور في الوقت المحدد</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-right">إحضار دفتر ملاحظات وقلم</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-right">الالتزام بآداب الحضور والمشاركة</span>
              </li>
            </ul>
          </div>

          {/* Registration */}
          <div className="text-center border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">هل تريد المشاركة؟</h3>
              <p className="text-body text-sm">
                انضم إلى هذه الفعالية المميزة واستفد من المحتوى القيم
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleRegister}
                className={`btn-primary ${
                  event.registered >= event.capacity 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 transition-transform'
                }`}
                disabled={event.registered >= event.capacity}
              >
                {event.registered >= event.capacity ? 'الفعالية مكتملة' : 'سجل الآن'}
              </button>
              <button onClick={onClose} className="btn-ghost">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
