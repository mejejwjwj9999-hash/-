import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  Plus,
  Minus,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactMethod {
  id: string;
  type: 'phone' | 'email' | 'address' | 'website' | 'hours';
  labelAr: string;
  labelEn: string;
  valueAr: string;
  valueEn: string;
  isPrimary: boolean;
}

interface ContactInfoEditorProps {
  contactMethods: ContactMethod[];
  onChange: (contactMethods: ContactMethod[]) => void;
}

const contactTypeOptions = [
  { value: 'phone', label: 'هاتف', labelEn: 'Phone', icon: Phone },
  { value: 'email', label: 'بريد إلكتروني', labelEn: 'Email', icon: Mail },
  { value: 'address', label: 'عنوان', labelEn: 'Address', icon: MapPin },
  { value: 'website', label: 'موقع إلكتروني', labelEn: 'Website', icon: Globe },
  { value: 'hours', label: 'ساعات العمل', labelEn: 'Working Hours', icon: Clock }
];

export const ContactInfoEditor: React.FC<ContactInfoEditorProps> = ({ 
  contactMethods, 
  onChange 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const addContactMethod = (type: ContactMethod['type']) => {
    const typeOption = contactTypeOptions.find(opt => opt.value === type);
    const newMethod: ContactMethod = {
      id: `contact-${Date.now()}`,
      type,
      labelAr: typeOption?.label || '',
      labelEn: typeOption?.labelEn || '',
      valueAr: '',
      valueEn: '',
      isPrimary: contactMethods.filter(cm => cm.type === type).length === 0
    };
    onChange([...contactMethods, newMethod]);
    setExpandedItems(prev => new Set([...prev, newMethod.id]));
  };

  const removeContactMethod = (id: string) => {
    onChange(contactMethods.filter(cm => cm.id !== id));
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const updateContactMethod = (id: string, field: keyof ContactMethod, value: string | boolean) => {
    onChange(contactMethods.map(cm => {
      if (cm.id === id) {
        // إذا تم تعيين هذا العنصر كأساسي، قم بإلغاء الأساسي من العناصر الأخرى من نفس النوع
        if (field === 'isPrimary' && value === true) {
          return { ...cm, [field]: value };
        }
        return { ...cm, [field]: value };
      } else if (field === 'isPrimary' && value === true) {
        // إلغاء الأساسي من العناصر الأخرى من نفس النوع
        const currentMethod = contactMethods.find(m => m.id === id);
        if (currentMethod && cm.type === currentMethod.type) {
          return { ...cm, isPrimary: false };
        }
      }
      return cm;
    }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getIconComponent = (type: ContactMethod['type']) => {
    const typeOption = contactTypeOptions.find(opt => opt.value === type);
    return typeOption?.icon || MapPin;
  };

  const formatDisplayValue = (method: ContactMethod) => {
    switch (method.type) {
      case 'phone':
        return method.valueAr || method.valueEn;
      case 'email':
        return method.valueAr || method.valueEn;
      case 'website':
        return method.valueAr || method.valueEn;
      case 'address':
        return method.valueAr || method.valueEn;
      case 'hours':
        return method.valueAr || method.valueEn;
      default:
        return method.valueAr || method.valueEn;
    }
  };

  // تجميع طرق الاتصال حسب النوع
  const groupedMethods = contactTypeOptions.reduce((acc, typeOption) => {
    acc[typeOption.value] = contactMethods.filter(cm => cm.type === typeOption.value);
    return acc;
  }, {} as Record<ContactMethod['type'], ContactMethod[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          معلومات الاتصال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          إدارة معلومات الاتصال الخاصة بالكلية مثل العناوين وأرقام الهواتف والبريد الإلكتروني
        </p>

        {/* Add New Contact Method */}
        <div className="flex flex-wrap gap-2">
          {contactTypeOptions.map(typeOption => {
            const IconComponent = typeOption.icon;
            const existingCount = groupedMethods[typeOption.value].length;
            
            return (
              <Button
                key={typeOption.value}
                variant="outline"
                size="sm"
                onClick={() => addContactMethod(typeOption.value as ContactMethod['type'])}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {typeOption.label}
                {existingCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {existingCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Contact Methods List */}
        <div className="space-y-4">
          {contactTypeOptions.map(typeOption => {
            const methods = groupedMethods[typeOption.value];
            if (methods.length === 0) return null;

            const IconComponent = typeOption.icon;

            return (
              <div key={typeOption.value} className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <IconComponent className="w-4 h-4" />
                  {typeOption.label}
                  <Badge variant="outline">{methods.length}</Badge>
                </h4>

                <div className="space-y-2">
                  <AnimatePresence>
                    {methods.map(method => {
                      const isExpanded = expandedItems.has(method.id);
                      const displayValue = formatDisplayValue(method);

                      return (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border rounded-lg overflow-hidden bg-card"
                        >
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleExpanded(method.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                {method.isPrimary && (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                    أساسي
                                  </Badge>
                                )}
                                <span className="font-medium text-sm">
                                  {method.labelAr || typeOption.label}
                                </span>
                              </div>
                              {displayValue && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {displayValue}
                                  </span>
                                  {(method.type === 'email' || method.type === 'phone' || method.type === 'website') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(displayValue);
                                      }}
                                      className="w-6 h-6 p-0"
                                    >
                                      {copiedValue === displayValue ? (
                                        <Check className="w-3 h-3 text-green-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </Button>
                                  )}
                                  {method.type === 'website' && displayValue && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(displayValue.startsWith('http') ? displayValue : `https://${displayValue}`, '_blank');
                                      }}
                                      className="w-6 h-6 p-0"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeContactMethod(method.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-4 border-t space-y-4"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <input
                                  type="checkbox"
                                  id={`${method.id}-primary`}
                                  checked={method.isPrimary}
                                  onChange={(e) => updateContactMethod(method.id, 'isPrimary', e.target.checked)}
                                  className="rounded"
                                />
                                <Label htmlFor={`${method.id}-primary`} className="text-sm">
                                  تعيين كطريقة اتصال أساسية لهذا النوع
                                </Label>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">التسمية (عربي)</Label>
                                  <Input
                                    value={method.labelAr}
                                    onChange={(e) => updateContactMethod(method.id, 'labelAr', e.target.value)}
                                    placeholder={typeOption.label}
                                    className="text-right text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">التسمية (إنجليزي)</Label>
                                  <Input
                                    value={method.labelEn}
                                    onChange={(e) => updateContactMethod(method.id, 'labelEn', e.target.value)}
                                    placeholder={typeOption.labelEn}
                                    className="text-sm"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">القيمة (عربي)</Label>
                                  {method.type === 'address' || method.type === 'hours' ? (
                                    <Textarea
                                      value={method.valueAr}
                                      onChange={(e) => updateContactMethod(method.id, 'valueAr', e.target.value)}
                                      placeholder={getPlaceholder(method.type, true)}
                                      className="text-right text-sm"
                                      rows={3}
                                    />
                                  ) : (
                                    <Input
                                      value={method.valueAr}
                                      onChange={(e) => updateContactMethod(method.id, 'valueAr', e.target.value)}
                                      placeholder={getPlaceholder(method.type, true)}
                                      className="text-right text-sm"
                                      type={method.type === 'email' ? 'email' : method.type === 'phone' ? 'tel' : 'text'}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs">القيمة (إنجليزي)</Label>
                                  {method.type === 'address' || method.type === 'hours' ? (
                                    <Textarea
                                      value={method.valueEn}
                                      onChange={(e) => updateContactMethod(method.id, 'valueEn', e.target.value)}
                                      placeholder={getPlaceholder(method.type, false)}
                                      className="text-sm"
                                      rows={3}
                                    />
                                  ) : (
                                    <Input
                                      value={method.valueEn}
                                      onChange={(e) => updateContactMethod(method.id, 'valueEn', e.target.value)}
                                      placeholder={getPlaceholder(method.type, false)}
                                      className="text-sm"
                                      type={method.type === 'email' ? 'email' : method.type === 'phone' ? 'tel' : 'text'}
                                    />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {contactMethods.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">لم يتم إضافة معلومات اتصال بعد</p>
            <p className="text-sm text-muted-foreground">
              استخدم الأزرار أعلاه لإضافة معلومات الاتصال الخاصة بالكلية
            </p>
          </div>
        )}

        {/* Preview */}
        {contactMethods.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3">معاينة معلومات الاتصال</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactTypeOptions.map(typeOption => {
                const primaryMethod = groupedMethods[typeOption.value].find(m => m.isPrimary);
                if (!primaryMethod) return null;

                const IconComponent = typeOption.icon;
                const displayValue = formatDisplayValue(primaryMethod);

                return (
                  <div key={typeOption.value} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">
                        {primaryMethod.labelAr || typeOption.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {displayValue || 'لم يتم تحديد القيمة'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getPlaceholder(type: ContactMethod['type'], isArabic: boolean): string {
  const placeholders = {
    phone: {
      ar: '+966 11 123 4567',
      en: '+966 11 123 4567'
    },
    email: {
      ar: 'info@college.edu.sa',
      en: 'info@college.edu.sa'
    },
    address: {
      ar: 'الرياض، المملكة العربية السعودية',
      en: 'Riyadh, Saudi Arabia'
    },
    website: {
      ar: 'www.college.edu.sa',
      en: 'www.college.edu.sa'
    },
    hours: {
      ar: 'الأحد - الخميس: 8:00 ص - 5:00 م',
      en: 'Sunday - Thursday: 8:00 AM - 5:00 PM'
    }
  };

  return placeholders[type][isArabic ? 'ar' : 'en'];
}