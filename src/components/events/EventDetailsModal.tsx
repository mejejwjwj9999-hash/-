import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, Clock, MapPin, Users, User, CheckCircle, Loader2 } from 'lucide-react';
import { useRegisterForEvent, useCheckRegistration } from '@/hooks/useEventRegistrations';
import { useProfile } from '@/hooks/useProfile';

interface EventDetailsModalProps {
  event: any;
  onClose: () => void;
}

const EventDetailsModal = ({ event, onClose }: EventDetailsModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const { data: profile } = useProfile();
  const { data: isRegistered, isLoading: checkingRegistration } = useCheckRegistration(event.id);
  const { mutate: registerForEvent, isPending } = useRegisterForEvent();

  React.useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || ''
      }));
    }
  }, [profile]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    registerForEvent({
      event_id: event.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!event) return null;

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
            <h2 className="text-2xl font-bold text-university-blue mb-2">{event.title_ar}</h2>
            <p className="text-body">{event.summary_ar}</p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-university-blue-light text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-center">معلومات الفعالية</h3>
                <div className="space-y-3">
                  {event.event_date && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">التاريخ</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(event.event_date).toLocaleDateString('ar-YE', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">الوقت</span>
                    </div>
                    <span className="text-sm font-medium">
                      {event.event_date ? new Date(event.event_date).toLocaleTimeString('ar-YE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '10:00 ص'}
                    </span>
                  </div>
                  
                  {event.event_location_ar && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">المكان</span>
                      </div>
                      <span className="text-sm font-medium">{event.event_location_ar}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Registration Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-center">حالة التسجيل</h3>
                {checkingRegistration ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : isRegistered ? (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">مسجل مسبقاً</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          جاري التسجيل...
                        </>
                      ) : (
                        'سجل الآن'
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Event Content */}
          {event.content_ar && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-center text-university-blue">تفاصيل الفعالية</h3>
              <div className="text-body text-right whitespace-pre-line">
                {event.content_ar}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-university-gold text-white p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-center">معلومات التواصل</h3>
            <div className="space-y-2 text-sm text-center">
              <div>للاستفسارات والمعلومات</div>
              <div className="font-bold">+967779553944</div>
              <div>aylolcollege@gmail.com</div>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center border-t pt-6">
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;