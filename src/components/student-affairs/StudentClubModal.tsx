
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { X, Users, Calendar, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface StudentClubModalProps {
  club: any;
  onClose: () => void;
}

const StudentClubModal = ({ club, onClose }: StudentClubModalProps) => {
  const { toast } = useToast();

  const handleJoinClub = () => {
    toast({
      title: "طلب الانضمام",
      description: `تم إرسال طلب انضمامك إلى ${club.name}. سيتم التواصل معك قريباً.`,
    });
    onClose();
  };

  if (!club) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className={`w-12 h-12 ${club.bgColor} rounded-full flex items-center justify-center`}>
                <club.icon className={`w-6 h-6 ${club.color}`} />
              </div>
              {club.name}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Club Info */}
          <div className={`${club.bgColor} p-6 rounded-lg`}>
            <h3 className="text-lg font-bold mb-3 text-right">نبذة عن النادي</h3>
            <p className="text-body text-right mb-4">{club.description}</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm" dir="rtl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-university-blue flex-shrink-0" />
                <span className="text-right">{club.members} عضو</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-university-blue flex-shrink-0" />
                <span className="text-right">{club.meeting}</span>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-right">أنشطة النادي</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {club.activities.map((activity: string, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                  <span className="text-university-blue font-medium">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinator Info */}
          <div className="bg-university-blue-light text-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-right">معلومات التواصل</h3>
            <div className="space-y-2 text-sm" dir="rtl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="text-right">{club.coordinator}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-right">aylolcollege@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-right">+967779553944</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-right">مميزات العضوية</h3>
            <ul className="space-y-2 text-sm text-right" dir="rtl">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                <span className="text-right">المشاركة في جميع الأنشطة والفعاليات</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                <span className="text-right">الحصول على شهادات مشاركة معتمدة</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                <span className="text-right">تطوير المهارات الشخصية والمهنية</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                <span className="text-right">فرص التواصل والتشبيك مع الزملاء</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                <span className="text-right">إمكانية القيادة وتولي مناصب إدارية</span>
              </li>
            </ul>
          </div>

          {/* Join Form */}
          <div className="border-t pt-6">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">هل تريد الانضمام؟</h3>
              <p className="text-body mb-6">
                انضم إلى {club.name} وكن جزءاً من مجتمع طلابي نشط ومتميز
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleJoinClub} className="btn-primary">
                  انضم الآن
                </button>
                <button onClick={onClose} className="btn-ghost">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentClubModal;
