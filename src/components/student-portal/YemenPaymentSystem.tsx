import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Copy, 
  Upload, 
  Check, 
  AlertCircle,
  FileText,
  Clock,
  Star,
  ChevronRight,
  Download,
  Eye,
  Camera,
  QrCode
} from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface YemenPaymentSystemProps {
  onBack: () => void;
}

type PaymentStep = 'method' | 'details' | 'receipt' | 'confirmation';

const YemenPaymentSystem = ({ onBack }: YemenPaymentSystemProps) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [amount, setAmount] = useState<number>(500000);
  const [studentName, setStudentName] = useState('أحمد محمد علي');
  const [studentId, setStudentId] = useState('2024001');
  const [paymentFor, setPaymentFor] = useState('رسوم الفصل الدراسي الثاني');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [transferId, setTransferId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 'bank_transfer',
      title: 'التحويل البنكي',
      description: 'تحويل مباشر من حسابك البنكي',
      icon: Building2,
      popular: true,
      fee: '1000 ريال',
      processing: '1-2 ساعة'
    },
    {
      id: 'exchange_services',
      title: 'خدمات الصرافة',
      description: 'التحويل عبر الصرافات المحلية',
      icon: CreditCard,
      popular: true,
      fee: '2000 ريال',
      processing: '30 دقيقة'
    },
    {
      id: 'mobile_wallet',
      title: 'المحافظ الإلكترونية',
      description: 'الدفع عبر التطبيقات المصرفية',
      icon: Smartphone,
      popular: false,
      fee: '1500 ريال',
      processing: 'فوري'
    }
  ];

  const banks = [
    { id: 'kuraimi', name: 'بنك الكريمي الإسلامي', account: '4001234567890123', fees: '1000' },
    { id: 'cac', name: 'بنك التسليف التعاوني والزراعي', account: '3001234567890123', fees: '800' },
    { id: 'ahli', name: 'البنك الأهلي اليمني', account: '2001234567890123', fees: '1200' },
    { id: 'yemen_bank', name: 'بنك اليمن', account: '1001234567890123', fees: '1000' }
  ];

  const exchangeServices = [
    { id: 'najm', name: 'النجم للتحويلات', account: '4001234567890456', fees: '2000' },
    { id: 'dadia', name: 'دادية للصرافة', account: '3001234567890789', fees: '1800' },
    { id: 'hayel_saeed', name: 'هائل سعيد أنعم', account: '2001234567890123', fees: '2200' },
    { id: 'shamil', name: 'الشامل للصرافة', account: '1001234567890456', fees: '1900' }
  ];

  const mobileWallets = [
    { id: 'one_cash', name: 'ون كاش', number: '777123456', fees: '1500' },
    { id: 'jeeb', name: 'جيب', number: '735123456', fees: '1800' },
    { id: 'mobile_money', name: 'موبايل موني', number: '770123456', fees: '1600' }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} بنجاح`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      toast({
        title: "تم رفع الإيصال",
        description: "تم رفع إيصال الدفع بنجاح",
      });
    }
  };

  const handleSubmitPayment = () => {
    if (!receiptFile) {
      toast({
        title: "مطلوب إيصال الدفع",
        description: "يرجى رفع إيصال الدفع أولاً",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('confirmation');
    toast({
      title: "تم إرسال طلب الدفع",
      description: "سيتم مراجعة طلبك خلال 24 ساعة",
    });
  };

  const resetPayment = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setSelectedBank('');
    setReceiptFile(null);
    setTransferId('');
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'method', title: 'اختيار الطريقة' },
      { id: 'details', title: 'تفاصيل الدفع' },
      { id: 'receipt', title: 'رفع الإيصال' },
      { id: 'confirmation', title: 'التأكيد' }
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-2 ${
              currentStep === step.id ? 'text-university-blue' : 
              steps.findIndex(s => s.id === currentStep) > index ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step.id ? 'bg-university-blue text-white' :
                steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                {steps.findIndex(s => s.id === currentStep) > index ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-section-title">نظام الدفع الإلكتروني</h2>
          <p className="text-academic-gray">ادفع رسومك الدراسية بسهولة وأمان</p>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Payment Summary Card */}
      <div className="card-elevated bg-gradient-to-r from-university-blue to-university-blue-light text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{paymentFor}</h3>
            <p className="opacity-90">الطالب: {studentName}</p>
            <p className="opacity-90">رقم الطالب: {studentId}</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold">{amount.toLocaleString()}</div>
            <div className="opacity-90">ريال يمني</div>
          </div>
        </div>
      </div>

      {/* Step 1: Payment Method Selection */}
      {currentStep === 'method' && (
        <div className="space-y-6">
          <h3 className="text-card-title">اختر طريقة الدفع</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setCurrentStep('details');
                }}
                className={`card-elevated cursor-pointer transition-all hover:shadow-lg ${
                  method.popular ? 'ring-2 ring-university-gold' : ''
                }`}
              >
                {method.popular && (
                  <div className="bg-university-gold text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                    الأكثر استخداماً
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-university-blue-light rounded-lg flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{method.title}</h4>
                    <p className="text-academic-gray text-sm">{method.description}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>الرسوم:</span>
                    <span className="font-medium text-university-gold">{method.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وقت المعالجة:</span>
                    <span className="font-medium">{method.processing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Payment Details */}
      {currentStep === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-card-title">تفاصيل الدفع</h3>
            <button 
              onClick={() => setCurrentStep('method')}
              className="btn-ghost text-sm"
            >
              تغيير الطريقة
            </button>
          </div>

          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`card-elevated cursor-pointer transition-all ${
                      selectedBank === bank.id ? 'ring-2 ring-university-blue' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{bank.name}</h4>
                      <div className="text-sm text-university-gold font-medium">{bank.fees} ريال رسوم</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">رقم الحساب:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{bank.account}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(bank.account, 'رقم الحساب');
                            }}
                            className="text-university-blue hover:text-university-blue-dark"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedBank && (
                <div className="card-elevated bg-blue-50 border-l-4 border-university-blue">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-university-blue mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">تعليمات التحويل البنكي</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li>توجه إلى أي فرع من فروع البنك المختار</li>
                        <li>اطلب تحويل مبلغ {amount.toLocaleString()} ريال يمني</li>
                        <li>استخدم رقم الحساب المعروض أعلاه</li>
                        <li>اذكر "رسوم دراسية - جامعة آيلول" في خانة الغرض</li>
                        <li>احتفظ بإيصال التحويل لرفعه في الخطوة التالية</li>
                      </ol>
                      <div className="mt-4 p-3 bg-white rounded-lg">
                        <div className="text-sm font-medium mb-1">المعلومات المطلوبة:</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>اسم المستفيد: جامعة آيلول للعلوم والتكنولوجيا</div>
                          <div>رقم الطالب: {studentId}</div>
                          <div>اسم الطالب: {studentName}</div>
                          <div>الغرض: {paymentFor}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'exchange_services' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {exchangeServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedBank(service.id)}
                    className={`card-elevated cursor-pointer transition-all ${
                      selectedBank === service.id ? 'ring-2 ring-university-blue' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{service.name}</h4>
                      <div className="text-sm text-university-gold font-medium">{service.fees} ريال رسوم</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">رقم الحساب:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{service.account}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(service.account, 'رقم الحساب');
                            }}
                            className="text-university-blue hover:text-university-blue-dark"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedBank && (
                <div className="card-elevated bg-green-50 border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">تعليمات التحويل عبر الصرافة</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li>توجه إلى أقرب فرع من الصرافة المختارة</li>
                        <li>اطلب تحويل مبلغ {amount.toLocaleString()} ريال يمني</li>
                        <li>استخدم رقم الحساب المعروض أعلاه</li>
                        <li>قدم بياناتك الشخصية ورقم الطالب</li>
                        <li>احتفظ بإيصال التحويل لرفعه في الخطوة التالية</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'mobile_wallet' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {mobileWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedBank(wallet.id)}
                    className={`card-elevated cursor-pointer transition-all ${
                      selectedBank === wallet.id ? 'ring-2 ring-university-blue' : ''
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">{wallet.name}</h4>
                      <div className="text-2xl font-mono font-bold text-university-blue mb-2">
                        {wallet.number}
                      </div>
                      <div className="text-sm text-university-gold font-medium">{wallet.fees} ريال رسوم</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.number, 'رقم المحفظة');
                        }}
                        className="mt-3 btn-ghost text-sm flex items-center gap-1 mx-auto"
                      >
                        <Copy className="w-4 h-4" />
                        نسخ الرقم
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedBank && (
                <div className="card-elevated bg-purple-50 border-l-4 border-purple-500">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">تعليمات الدفع الإلكتروني</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li>افتح تطبيق المحفظة الإلكترونية</li>
                        <li>اختر "تحويل أموال" أو "تحويل"</li>
                        <li>أدخل الرقم المعروض أعلاه</li>
                        <li>أدخل المبلغ: {amount.toLocaleString()} ريال يمني</li>
                        <li>أكمل العملية واحتفظ برقم العملية</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedBank && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep('receipt')}
                className="btn-primary flex items-center gap-2"
              >
                التالي - رفع الإيصال
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Receipt Upload */}
      {currentStep === 'receipt' && (
        <div className="space-y-6">
          <h3 className="text-card-title">رفع إيصال الدفع</h3>
          
          <div className="card-elevated">
            <div className="text-center py-8">
              <Upload className="w-16 h-16 text-university-blue mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">ارفع إيصال الدفع</h4>
              <p className="text-academic-gray mb-6">
                يرجى رفع صورة واضحة لإيصال الدفع أو التحويل
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                اختيار ملف
              </button>
              
              <p className="text-sm text-academic-gray mt-4">
                الصيغ المدعومة: JPG, PNG, PDF (الحد الأقصى: 5MB)
              </p>
            </div>
            
            {receiptFile && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium text-green-800">تم رفع الملف بنجاح</div>
                    <div className="text-sm text-green-600">{receiptFile.name}</div>
                  </div>
                  <button
                    onClick={() => setReceiptFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card-elevated">
            <h4 className="font-semibold mb-4">معلومات إضافية (اختيارية)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم العملية/التحويل</label>
                <input
                  type="text"
                  value={transferId}
                  onChange={(e) => setTransferId(e.target.value)}
                  placeholder="أدخل رقم العملية إن وجد"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  placeholder="أي ملاحظات إضافية"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('details')}
              className="btn-ghost flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              السابق
            </button>
            <button
              onClick={handleSubmitPayment}
              className="btn-primary flex items-center gap-2"
            >
              إرسال الطلب
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 'confirmation' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">تم إرسال طلب الدفع بنجاح!</h3>
            <p className="text-academic-gray mb-6">
              سيتم مراجعة طلبك والتحقق من الدفع خلال 24 ساعة
            </p>
          </div>

          <div className="card-elevated">
            <h4 className="font-semibold mb-4">ملخص العملية</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>المبلغ:</span>
                <span className="font-medium">{amount.toLocaleString()} ريال يمني</span>
              </div>
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-medium">
                  {selectedMethod === 'bank_transfer' ? 'التحويل البنكي' :
                   selectedMethod === 'exchange_services' ? 'خدمات الصرافة' : 'المحافظ الإلكترونية'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>رقم المرجع:</span>
                <span className="font-medium font-mono">PAY-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ:</span>
                <span className="font-medium">{new Date().toLocaleDateString('ar-YE')}</span>
              </div>
            </div>
          </div>

          <div className="card-elevated bg-blue-50 border-l-4 border-university-blue">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-university-blue mt-1" />
              <div>
                <h4 className="font-semibold mb-2">الخطوات التالية</h4>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>سيتم مراجعة إيصال الدفع المرفوع</li>
                  <li>ستتلقى إشعاراً عند التأكيد</li>
                  <li>يمكنك متابعة حالة الطلب من "الشؤون المالية"</li>
                  <li>في حالة وجود استفسار، تواصل مع المحاسبة</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetPayment}
              className="btn-ghost"
            >
              دفع جديد
            </button>
            <button
              onClick={onBack}
              className="btn-primary"
            >
              العودة للخدمات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YemenPaymentSystem;
