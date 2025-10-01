import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const AdminMobileSchedules = () => {
  return (
    <div className="space-y-4 p-4 pb-20">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-university-blue" />
          <h1 className="text-xl font-bold text-university-blue">إدارة الجداول</h1>
        </div>
      </div>

      <Card className="text-center py-8">
        <CardContent>
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">قريباً - إدارة الجداول الدراسية</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMobileSchedules;