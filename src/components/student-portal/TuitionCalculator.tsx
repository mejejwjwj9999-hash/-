
import React, { useState, useEffect } from 'react';
import { Calculator, BookOpen, Award, DollarSign, Info } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const TuitionCalculator = () => {
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [creditHours, setCreditHours] = useState(15);
  const [hasScholarship, setHasScholarship] = useState(false);
  const [scholarshipPercentage, setScholarshipPercentage] = useState(0);
  const [additionalFees, setAdditionalFees] = useState({
    lab: false,
    library: false,
    activities: false,
    graduation: false
  });
  const [calculatedFees, setCalculatedFees] = useState(null);
  const { toast } = useToast();

  const colleges = [
    { id: 'pharmacy', name: 'كلية الصيدلة', baseFee: 100000 },
    { id: 'nursing', name: 'كلية التمريض', baseFee: 80000 },
    { id: 'midwifery', name: 'كلية القبالة', baseFee: 80000 },
    { id: 'it', name: 'كلية تكنولوجيا المعلومات', baseFee: 75000 },
    { id: 'business', name: 'كلية إدارة الأعمال', baseFee: 70000 }
  ];

  const years = [
    { id: 'first', name: 'السنة الأولى', multiplier: 1 },
    { id: 'second', name: 'السنة الثانية', multiplier: 1.1 },
    { id: 'third', name: 'السنة الثالثة', multiplier: 1.2 },
    { id: 'fourth', name: 'السنة الرابعة', multiplier: 1.3 },
    { id: 'fifth', name: 'السنة الخامسة', multiplier: 1.4 }
  ];

  const feeStructure = {
    lab: { name: 'رسوم المختبرات', amount: 150000 },
    library: { name: 'رسوم المكتبة', amount: 50000 },
    activities: { name: 'رسوم الأنشطة', amount: 75000 },
    graduation: { name: 'رسوم التخرج', amount: 200000 }
  };

  const scholarshipTypes = [
    { value: 10, name: 'منحة جزئية - 10%' },
    { value: 25, name: 'منحة متوسطة - 25%' },
    { value: 50, name: 'منحة كبيرة - 50%' },
    { value: 75, name: 'منحة ممتازة - 75%' },
    { value: 100, name: 'منحة كاملة - 100%' }
  ];

  const calculateFees = () => {
    if (!selectedCollege || !selectedYear) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى اختيار الكلية والسنة الدراسية",
        variant: "destructive"
      });
      return;
    }

    const college = colleges.find(c => c.id === selectedCollege);
    const year = years.find(y => y.id === selectedYear);

    if (!college || !year) return;

    // حساب الرسوم الأساسية
    const baseTuition = college.baseFee * creditHours * year.multiplier;

    // حساب الرسوم الإضافية
    let additionalFeesTotal = 0;
    Object.keys(additionalFees).forEach(key => {
      if (additionalFees[key]) {
        additionalFeesTotal += feeStructure[key].amount;
      }
    });

    const subtotal = baseTuition + additionalFeesTotal;

    // حساب المنحة
    const scholarshipDiscount = hasScholarship ? (subtotal * scholarshipPercentage / 100) : 0;
    const totalAfterScholarship = subtotal - scholarshipDiscount;

    setCalculatedFees({
      baseTuition,
      additionalFees: additionalFeesTotal,
      subtotal,
      scholarshipDiscount,
      total: totalAfterScholarship,
      perCreditHour: college.baseFee * year.multiplier
    });
  };

  useEffect(() => {
    if (selectedCollege && selectedYear) {
      calculateFees();
    }
  }, [selectedCollege, selectedYear, creditHours, hasScholarship, scholarshipPercentage, additionalFees]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-university-blue" />
        <h2 className="text-section-title">حاسبة الرسوم الدراسية</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card-elevated">
          <h3 className="text-card-title mb-6">معلومات الطالب</h3>
          
          <div className="space-y-4">
            {/* College Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">الكلية</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              >
                <option value="">اختر الكلية</option>
                {colleges.map(college => (
                  <option key={college.id} value={college.id}>
                    {college.name} - {college.baseFee.toLocaleString()} ريال/ساعة
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">السنة الدراسية</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              >
                <option value="">اختر السنة الدراسية</option>
                {years.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Credit Hours */}
            <div>
              <label className="block text-sm font-medium mb-2">
                عدد الساعات المعتمدة (المعدل: 15 ساعة)
              </label>
              <input
                type="number"
                min="6"
                max="21"
                value={creditHours}
                onChange={(e) => setCreditHours(parseInt(e.target.value) || 15)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              />
              <p className="text-xs text-academic-gray mt-1">
                الحد الأدنى: 6 ساعات، الحد الأقصى: 21 ساعة
              </p>
            </div>

            {/* Scholarship */}
            <div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={hasScholarship}
                  onChange={(e) => setHasScholarship(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">لدي منحة دراسية</span>
              </label>
              
              {hasScholarship && (
                <select
                  value={scholarshipPercentage}
                  onChange={(e) => setScholarshipPercentage(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                >
                  <option value="0">اختر نوع المنحة</option>
                  {scholarshipTypes.map(scholarship => (
                    <option key={scholarship.value} value={scholarship.value}>
                      {scholarship.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Additional Fees */}
            <div>
              <label className="block text-sm font-medium mb-3">الرسوم الإضافية</label>
              <div className="space-y-2">
                {Object.entries(feeStructure).map(([key, fee]) => (
                  <label key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={additionalFees[key]}
                        onChange={(e) => setAdditionalFees(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">{fee.name}</span>
                    </div>
                    <span className="text-sm font-medium text-university-blue">
                      {fee.amount.toLocaleString()} ريال
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Results */}
        <div className="space-y-6">
          {calculatedFees && (
            <div className="card-elevated">
              <h3 className="text-card-title mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-university-blue" />
                تفاصيل الرسوم المحسوبة
              </h3>
              
              <div className="space-y-4">
                {/* Per Credit Hour */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>تكلفة الساعة الواحدة</span>
                  <span className="font-bold text-university-blue">
                    {calculatedFees.perCreditHour.toLocaleString()} ريال
                  </span>
                </div>

                {/* Base Tuition */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>الرسوم الدراسية الأساسية ({creditHours} ساعة)</span>
                  <span className="font-bold">
                    {calculatedFees.baseTuition.toLocaleString()} ريال
                  </span>
                </div>

                {/* Additional Fees */}
                {calculatedFees.additionalFees > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>الرسوم الإضافية</span>
                    <span className="font-bold">
                      {calculatedFees.additionalFees.toLocaleString()} ريال
                    </span>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between items-center p-3 bg-university-blue-light text-white rounded-lg">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">
                    {calculatedFees.subtotal.toLocaleString()} ريال
                  </span>
                </div>

                {/* Scholarship Discount */}
                {calculatedFees.scholarshipDiscount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">خصم المنحة ({scholarshipPercentage}%)</span>
                    <span className="font-bold text-green-600">
                      -{calculatedFees.scholarshipDiscount.toLocaleString()} ريال
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center p-4 bg-university-gold text-white rounded-lg">
                  <span className="text-lg font-semibold">المجموع النهائي</span>
                  <span className="text-2xl font-bold">
                    {calculatedFees.total.toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Plan Suggestion */}
          {calculatedFees && (
            <div className="card-elevated">
              <h3 className="text-card-title mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-university-blue" />
                اقتراح خطة الدفع
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>دفعة واحدة (خصم 5%)</span>
                  <span className="font-bold text-green-600">
                    {(calculatedFees.total * 0.95).toLocaleString()} ريال
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>قسطين (بداية كل فصل)</span>
                  <span className="font-bold">
                    {(calculatedFees.total / 2).toLocaleString()} ريال × 2
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>4 أقساط شهرية</span>
                  <span className="font-bold">
                    {(calculatedFees.total / 4).toLocaleString()} ريال × 4
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-university-blue mt-0.5" />
                  <div className="text-sm text-university-blue">
                    <strong>ملاحظة:</strong> يمكن تطبيق خصم إضافي للطلاب المتفوقين أو في حالات خاصة. 
                    تواصل مع الشؤون المالية لمزيد من التفاصيل.
                  </div>
                </div>
              </div>
            </div>
          )}

          {!calculatedFees && (
            <div className="card-elevated text-center py-12">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-academic-gray">
                اختر الكلية والسنة الدراسية لحساب الرسوم
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuitionCalculator;
