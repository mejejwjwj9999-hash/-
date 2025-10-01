
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import RealTimeNotificationsOptimized from "@/components/notifications/RealTimeNotificationsOptimized";

// Main Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import StudentLife from "./pages/StudentLife";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Academic Programs
import BusinessAdministration from "./pages/BusinessAdministration";
import InformationTechnology from "./pages/InformationTechnology";
import Nursing from "./pages/Nursing";
import Pharmacy from "./pages/Pharmacy";
import Midwifery from "./pages/Midwifery";

// About Pages
import VisionMission from "./pages/VisionMission";
import History from "./pages/History";
import Accreditation from "./pages/Accreditation";

// Services Pages
import StudentAffairs from "./pages/StudentAffairs";
import DigitalLibrary from "./pages/DigitalLibrary";
import AcademicCalendar from "./pages/AcademicCalendar";

// News & Media
import AllNews from "./pages/AllNews";
import NewsDetail from "./pages/NewsDetail";
import MediaCenter from "./pages/MediaCenter";

// Portals - Using the improved version
import StudentPortalImproved from "./pages/StudentPortalImproved";
import AdminResponsive from "./pages/AdminResponsive";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error?.message?.includes('JWT')) return false;
        return failureCount < 2;
      },
    },
  },
});

const AppFinal = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <RealTimeNotificationsOptimized />
          <BrowserRouter>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/student-life" element={<StudentLife />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />

              {/* Academic Programs */}
              <Route path="/programs/business-administration" element={<BusinessAdministration />} />
              <Route path="/programs/information-technology" element={<InformationTechnology />} />
              <Route path="/programs/nursing" element={<Nursing />} />
              <Route path="/programs/pharmacy" element={<Pharmacy />} />
              <Route path="/programs/midwifery" element={<Midwifery />} />

              {/* About Subpages */}
              <Route path="/about/vision-mission" element={<VisionMission />} />
              <Route path="/about/history" element={<History />} />
              <Route path="/about/accreditation" element={<Accreditation />} />

              {/* Services Subpages */}
              <Route path="/services/student-affairs" element={<StudentAffairs />} />
              <Route path="/services/digital-library" element={<DigitalLibrary />} />
              <Route path="/services/academic-calendar" element={<AcademicCalendar />} />

              {/* News & Media */}
              <Route path="/news" element={<AllNews />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/media" element={<MediaCenter />} />

              {/* Portals - Using improved versions */}
              <Route path="/student-portal" element={<StudentPortalImproved />} />
              <Route path="/admin" element={<AdminResponsive />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppFinal;
