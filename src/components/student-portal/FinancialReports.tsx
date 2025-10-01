
import React, { useState } from 'react';
import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const FinancialReports = () => {
  const [selectedReport, setSelectedReport] = useState('summary');
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const { toast } = useToast();

  const reportTypes = [
    { id: 'summary', name: 'كشف مالي شامل', icon: FileText },
    { id: 'payments', name: 'تقرير المدفوعات', icon: TrendingUp },
    { id: 'analysis', name: 'تحليل مالي', icon: BarChart3 },
    { id: 'breakdown', name: 'تفصيل الرسوم', icon: PieChart }
  ];

  const timePeriods = [
    { value: 'current-year', label: 'العام الحالي 2024/2025' },
    { value: 'last-year', label: 'العام السابق 2023/2024' },
    { value: 'all-time', label: 'جميع السنوات' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const financialData = {
    summary: {
      totalTuition: 2500000,
      totalPaid: 1750000,
      remainingBalance: 750000,
      scholarships: 250000,
      lateFees: 0,
      refunds: 0
    },
    paymentsByMonth: [
      { month: 'سبتمبر', amount: 1250000 },
      { month: 'أكتوبر', amount: 350000 },
      { month: 'نوفمبر', amount: 150000 },
      { month: 'ديسمبر', amount: 0 }
    ],
    feeBreakdown: [
      { category: 'رسوم دراسية', amount: 2000000, percentage: 80 },
      { category: 'رسوم مختبرات', amount: 300000, percentage: 12 },
      { category: 'رسوم أنشطة', amount: 150000, percentage: 6 },
      { category: 'رسوم أخرى', amount: 50000, percentage: 2 }
    ]
  };

  const handleDownloadReport = (reportType) => {
    toast({
      title: "تحميل التقرير",
      description: `جاري تحضير تقرير ${reportTypes.find(r => r.id === reportType)?.name} للتحميل`,
    });
  };

  const handleEmailReport = (reportType) => {
    toast({
      title: "إرسال التقرير",
      description: `سيتم إرسال التقرير إلى بريدك الإلكتروني`,
    });
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'summary':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-university-blue text-white p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">إجمالي الرسوم</h4>
                <p className="text-3xl font-bold">{financialData.summary.totalTuition.toLocaleString()}</p>
                <p className="text-sm opacity-90">ريال يمني</p>
              </div>
              
              <div className="bg-green-600 text-white p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">المدفوع</h4>
                <p className="text-3xl font-bold">{financialData.summary.totalPaid.toLocaleString()}</p>
                <p className="text-sm opacity-90">
                  {((financialData.summary.totalPaid / financialData.summary.totalTuition) * 100).toFixed(1)}% من الإجمالي
                </p>
              </div>
              
              <div className="bg-red-600 text-white p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">المتبقي</h4>
                <p className="text-3xl font-bold">{financialData.summary.remainingBalance.toLocaleString()}</p>
                <p className="text-sm opacity-90">ريال يمني</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right py-3 px-4">البند</th>
                    <th className="text-center py-3 px-4">المبلغ</th>
                    <th className="text-center py-3 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">إجمالي الرسوم الدراسية</td>
                    <td className="text-center py-3 px-4">{financialData.summary.totalTuition.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">المنح والخصومات</td>
                    <td className="text-center py-3 px-4 text-green-600">-{financialData.summary.scholarships.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">مطبق</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">المبلغ المدفوع</td>
                    <td className="text-center py-3 px-4 text-green-600">{financialData.summary.totalPaid.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">مدفوع</span>
                    </td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="py-3 px-4 font-semibold">الرصيد المتبقي</td>
                    <td className="text-center py-3 px-4 font-bold text-red-600">{financialData.summary.remainingBalance.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">مستحق</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">تقرير المدفوعات الشهرية</h4>
              <div className="space-y-3">
                {financialData.paymentsByMonth.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>{payment.month} 2024</span>
                    <span className="font-bold text-university-blue">
                      {payment.amount.toLocaleString()} ريال
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>إجمالي المدفوعات</span>
                  <span className="text-green-600">
                    {financialData.paymentsByMonth.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">معدل الدفع</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-university-blue mb-2">
                    {((financialData.summary.totalPaid / financialData.summary.totalTuition) * 100).toFixed(1)}%
                  </div>
                  <p className="text-academic-gray">من إجمالي الرسوم</p>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">متوسط الدفعة الشهرية</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-university-blue mb-2">
                    {(financialData.summary.totalPaid / 4).toLocaleString()}
                  </div>
                  <p className="text-academic-gray">ريال يمني</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'breakdown':
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">تفصيل الرسوم حسب النوع</h4>
              <div className="space-y-4">
                {financialData.feeBreakdown.map((fee, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{fee.category}</span>
                      <span className="font-bold">{fee.amount.toLocaleString()} ريال</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-university-blue h-2 rounded-full"
                        style={{ width: `${fee.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-academic-gray text-right">
                      {fee.percentage}% من الإجمالي
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-university-blue" />
        <h2 className="text-section-title">التقارير المالية</h2>
      </div>

      {/* Report Controls */}
      <div className="card-elevated">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">نوع التقرير</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              >
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الفترة الزمنية</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              >
                {timePeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadReport(selectedReport)}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل PDF
            </button>
            
            <button
              onClick={() => handleEmailReport(selectedReport)}
              className="btn-ghost flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              إرسال بالبريد
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div>
          {renderReportContent()}
        </div>
      </div>

      {/* Quick Report Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => {
              setSelectedReport(report.id);
              handleDownloadReport(report.id);
            }}
            className="card-elevated text-center hover:shadow-lg transition-shadow p-6"
          >
            <report.icon className="w-12 h-12 text-university-blue mx-auto mb-4" />
            <h4 className="font-semibold mb-2">{report.name}</h4>
            <p className="text-sm text-academic-gray">تحميل سريع</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FinancialReports;
