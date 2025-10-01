
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryClientProvider_Custom from "./queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import VisionMission from "./pages/VisionMission";
import History from "./pages/History";
import Academics from "./pages/Academics";
import Pharmacy from "./pages/Pharmacy";
import Nursing from "./pages/Nursing";
import Midwifery from "./pages/Midwifery";
import InformationTechnology from "./pages/InformationTechnology";
import BusinessAdministration from "./pages/BusinessAdministration";
import Admissions from "./pages/Admissions";
import AcademicCalendar from "./pages/AcademicCalendar";
import StudentAffairs from "./pages/StudentAffairs";
import StudentLife from "./pages/StudentLife";
import Services from "./pages/Services";
import DigitalLibrary from "./pages/DigitalLibrary";
import MediaCenter from "./pages/MediaCenter";
import AllNews from "./pages/AllNews";
import NewsDetail from "./pages/NewsDetail";
import Accreditation from "./pages/Accreditation";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
// import StudentPortalFixed from "./pages/StudentPortalFixed";
import StudentPortalMobile from "./pages/StudentPortalMobile";
import AdminFixed from "./pages/AdminFixed";
import NotFound from "./pages/NotFound";

function AppOptimized() {
  return (
    <QueryClientProvider_Custom>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              {/* المسارات العامة مع Layout */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/vision-mission" element={<Layout><VisionMission /></Layout>} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/academics" element={<Layout><Academics /></Layout>} />
              <Route path="/pharmacy" element={<Layout><Pharmacy /></Layout>} />
              <Route path="/nursing" element={<Layout><Nursing /></Layout>} />
              <Route path="/midwifery" element={<Layout><Midwifery /></Layout>} />
              <Route path="/information-technology" element={<Layout><InformationTechnology /></Layout>} />
              <Route path="/business-administration" element={<Layout><BusinessAdministration /></Layout>} />
              <Route path="/admissions" element={<Layout><Admissions /></Layout>} />
              <Route path="/academic-calendar" element={<Layout><AcademicCalendar /></Layout>} />
              <Route path="/student-affairs" element={<Layout><StudentAffairs /></Layout>} />
              <Route path="/student-life" element={<Layout><StudentLife /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/digital-library" element={<Layout><DigitalLibrary /></Layout>} />
              <Route path="/media-center" element={<Layout><MediaCenter /></Layout>} />
              <Route path="/news" element={<Layout><AllNews /></Layout>} />
              <Route path="/news/:id" element={<Layout><NewsDetail /></Layout>} />
              <Route path="/accreditation" element={<Layout><Accreditation /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              
              {/* المسارات الخاصة بدون Layout */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/student-portal/*" element={<StudentPortalMobile />} />
              <Route path="/admin/*" element={<AdminFixed />} />
              
              {/* صفحة 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider_Custom>
  );
}

export default AppOptimized;
