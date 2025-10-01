import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, GraduationCap, FileText, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import ContactMessages from './ContactMessages';
import StudentRegistrationRequests from './StudentRegistrationRequests';
import { useContactMessages } from '@/hooks/useContactMessages';
import { useRegistrationRequests } from '@/hooks/useRegistrationRequests';

const RequestsManagement = () => {
  const { data: messages } = useContactMessages();
  const { data: registrationRequests } = useRegistrationRequests();

  // Statistics calculations
  const unreadMessages = messages?.filter(m => !m.is_read).length || 0;
  const pendingRegistrations = registrationRequests?.filter(r => r.status === 'pending').length || 0;
  const totalRequests = (messages?.length || 0) + (registrationRequests?.length || 0);
  
  const approvedRegistrations = registrationRequests?.filter(r => r.status === 'approved').length || 0;
  const rejectedRegistrations = registrationRequests?.filter(r => r.status === 'rejected').length || 0;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-university-blue mb-2">إدارة الطلبات والاستفسارات</h1>
        <p className="text-muted-foreground">
          نظام شامل لإدارة طلبات التسجيل ورسائل التواصل من الطلاب والزوار
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-r-4 border-r-university-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <FileText className="h-4 w-4 text-university-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-university-blue">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              جميع الطلبات والرسائل
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingRegistrations + unreadMessages}
            </div>
            <p className="text-xs text-muted-foreground">
              طلبات تحتاج مراجعة
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم القبول</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              طلبات تسجيل مقبولة
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الرفض</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              طلبات تسجيل مرفوضة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="registration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            طلبات التسجيل
            {pendingRegistrations > 0 && (
              <Badge variant="destructive" className="mr-1">
                {pendingRegistrations}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            رسائل التواصل
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="mr-1">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <StudentRegistrationRequests />
        </TabsContent>

        <TabsContent value="contact">
          <ContactMessages />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsManagement;