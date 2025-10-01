
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryClientProvider_Custom from "./queryClient";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ScheduleNotificationProvider from "@/components/notifications/ScheduleNotificationProvider";
import { PreviewProvider } from "@/contexts/PreviewContext";
import { PreviewListener } from "@/components/preview/PreviewListener";
import 'react-quill/dist/quill.snow.css';
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import EditableIndex from "./pages/EditableIndex";
import EditableAbout from "@/components/pages/EditableAbout";
import EditableHistory from "@/components/pages/EditableHistory";
import EditableMediaCenter from "@/components/pages/EditableMediaCenter";
import EditableContact from "@/components/pages/EditableContact";
import EditableAccreditation from "@/components/pages/EditableAccreditation";
import EditableAdmissions from "@/components/pages/EditableAdmissions";
import EditableVisionMission from "@/components/pages/EditableVisionMission";
import EditableNursing from "@/components/pages/EditableNursing";
import EditablePharmacy from "@/components/pages/EditablePharmacy";
import EditableMidwifery from "@/components/pages/EditableMidwifery";
import EditableBusinessAdministration from "@/components/pages/EditableBusinessAdministration";
import EditableInformationTechnology from "@/components/pages/EditableInformationTechnology";
import EditableServices from "@/components/pages/EditableServices";
import EditableStudentAffairs from "@/components/pages/EditableStudentAffairs";
import About from "./pages/About";
import AboutPage from "./pages/AboutPage";
import VisionMissionPage from "./pages/VisionMission";
import History from "./pages/History";
import Academics from "./pages/Academics";
import { DynamicProgramPage } from "@/components/dynamic/DynamicProgramPage";
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
import AboutUs from "./pages/AboutUs";
import AboutSectionEditPage from "./pages/admin/about-sections/AboutSectionEditPage";
import { AboutCMSPage } from "./pages/admin/cms/AboutCMSPage";
import AboutCollege from "./pages/about/AboutCollege";
import AboutDeanMessage from "./pages/about/DeanMessage";
import AboutVisionMission from "./pages/about/VisionMission";
import BoardMembers from "./pages/about/BoardMembers";
import AboutQualityAssurance from "./pages/about/QualityAssurance";
import ScientificResearch from "./pages/about/ScientificResearch";
import DeanMessagePage from "./pages/DeanMessage";
import BoardOfDirectors from "./pages/BoardOfDirectors";
import QualityAssurancePage from "./pages/QualityAssurance";
import Research from "./pages/Research";
import StudentGuide from "./pages/StudentGuide";
import TransferPolicies from "./pages/TransferPolicies";
import StudentEthics from "./pages/StudentEthics";
import Auth from "./pages/Auth";
import MobileAuth from "./pages/MobileAuth";
import StudentPortalMobile from "./pages/StudentPortalMobile";
import TeacherPortal from "./pages/TeacherPortal";
import AdminRadical from "./pages/AdminRadical";
import AdminPortalMobile from "./pages/AdminPortalMobile";
import NotFound from "./pages/NotFound";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PreviewTest from "./pages/PreviewTest";
import ProgramsIndex from "./pages/ProgramsIndex";
import DepartmentsIndex from "./pages/DepartmentsIndex";
import TechScienceDepartment from "./pages/departments/TechScienceDepartment";
import AdminHumanitiesDepartment from "./pages/departments/AdminHumanitiesDepartment";
import MedicalDepartment from "./pages/departments/MedicalDepartment";
import RolesManagement from "./pages/admin/RolesManagement";

function App() {
  return (
    <QueryClientProvider_Custom>
      <TooltipProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <PreviewProvider>
              <PreviewListener />
              <ScheduleNotificationProvider>
                <Toaster />
                <Sonner />
              <Routes>
              {/* المسارات العامة مع Layout */}
               <Route path="/" element={<Layout><Index /></Layout>} />
               <Route path="/edit" element={<Layout><EditableIndex /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/about/edit" element={<Layout><EditableAbout /></Layout>} />
               <Route path="/vision-mission" element={<Layout><VisionMissionPage /></Layout>} />
               <Route path="/vision-mission/edit" element={<Layout><EditableVisionMission /></Layout>} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/history/edit" element={<Layout><EditableHistory /></Layout>} />
               <Route path="/academics" element={<Layout><Academics /></Layout>} />
               <Route path="/pharmacy" element={<Navigate to="/programs/pharmacy" replace />} />
               <Route path="/pharmacy/edit" element={<Layout><EditablePharmacy /></Layout>} />
               <Route path="/nursing" element={<Layout><Nursing /></Layout>} />
               <Route path="/nursing/edit" element={<Layout><EditableNursing /></Layout>} />
               <Route path="/midwifery" element={<Layout><Midwifery /></Layout>} />
               <Route path="/midwifery/edit" element={<Layout><EditableMidwifery /></Layout>} />
               <Route path="/information-technology" element={<Layout><InformationTechnology /></Layout>} />
               <Route path="/information-technology/edit" element={<Layout><EditableInformationTechnology /></Layout>} />
               <Route path="/business-administration" element={<Layout><BusinessAdministration /></Layout>} />
               <Route path="/business-administration/edit" element={<Layout><EditableBusinessAdministration /></Layout>} />
              <Route path="/admissions" element={<Layout><Admissions /></Layout>} />
              <Route path="/admissions/edit" element={<Layout><EditableAdmissions /></Layout>} />
              <Route path="/academic-calendar" element={<Layout><AcademicCalendar /></Layout>} />
                <Route path="/student-affairs" element={<Layout><StudentAffairs /></Layout>} />
                <Route path="/student-affairs/edit" element={<Layout><EditableStudentAffairs /></Layout>} />
               <Route path="/student-life" element={<Layout><StudentLife /></Layout>} />
               <Route path="/services" element={<Layout><Services /></Layout>} />
               <Route path="/services/edit" element={<Layout><EditableServices /></Layout>} />
              <Route path="/digital-library" element={<Layout><DigitalLibrary /></Layout>} />
              <Route path="/media-center" element={<Layout><MediaCenter /></Layout>} />
              <Route path="/media-center/edit" element={<Layout><EditableMediaCenter /></Layout>} />
              <Route path="/news" element={<Layout><AllNews /></Layout>} />
              <Route path="/news/:id" element={<Layout><NewsDetail /></Layout>} />
              <Route path="/accreditation" element={<Layout><Accreditation /></Layout>} />
              <Route path="/accreditation/edit" element={<Layout><EditableAccreditation /></Layout>} />
               <Route path="/contact" element={<Layout><Contact /></Layout>} />
               <Route path="/contact/edit" element={<Layout><EditableContact /></Layout>} />
               <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
               <Route path="/dean-message" element={<Layout><DeanMessagePage /></Layout>} />
               <Route path="/board-of-directors" element={<Layout><BoardOfDirectors /></Layout>} />
               <Route path="/quality-assurance" element={<Layout><QualityAssurancePage /></Layout>} />
               <Route path="/research" element={<Layout><Research /></Layout>} />
               <Route path="/student-guide" element={<Layout><StudentGuide /></Layout>} />
               <Route path="/transfer-policies" element={<Layout><TransferPolicies /></Layout>} />
               <Route path="/student-ethics" element={<Layout><StudentEthics /></Layout>} />
               <Route path="/terms-of-use" element={<Layout><TermsOfUse /></Layout>} />
               <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
               
               {/* المسارات الخاصة بدون Layout */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/mobile-auth" element={<MobileAuth />} />
              <Route path="/student-portal/*" element={<StudentPortalMobile />} />
               <Route path="/teacher-portal/*" element={<TeacherPortal />} />
               <Route path="/admin" element={<AdminRadical />} />
                <Route path="/admin/roles" element={<RolesManagement />} />
                <Route path="/admin/about-sections/:sectionKey/edit" element={<AboutSectionEditPage />} />
                <Route path="/admin/cms/*" element={<AboutCMSPage />} />
               <Route path="/admin/:section" element={<AdminRadical />} />
               <Route path="/admin-mobile/*" element={<AdminPortalMobile />} />
               <Route path="/preview-test" element={<PreviewTest />} />
                
                {/* About Sections Public Routes */}
                <Route path="/about/college" element={<Layout><AboutCollege /></Layout>} />
                <Route path="/about/dean-message" element={<Layout><AboutDeanMessage /></Layout>} />
                <Route path="/about/vision-mission" element={<Layout><AboutVisionMission /></Layout>} />
                <Route path="/about/board-members" element={<Layout><BoardMembers /></Layout>} />
                <Route path="/about/quality-assurance" element={<Layout><AboutQualityAssurance /></Layout>} />
                <Route path="/about/research" element={<Layout><ScientificResearch /></Layout>} />
                <Route path="/about/:sectionKey" element={<Layout><AboutPage /></Layout>} />
               
               {/* Dynamic Programs Routes */}
               <Route path="/programs" element={<Layout><ProgramsIndex /></Layout>} />
               <Route path="/programs/:programKey" element={<Layout><DynamicProgramPage /></Layout>} />
               
               {/* Departments Routes */}
               <Route path="/departments" element={<Layout><DepartmentsIndex /></Layout>} />
               <Route path="/departments/tech-science" element={<Layout><TechScienceDepartment /></Layout>} />
               <Route path="/departments/admin-humanities" element={<Layout><AdminHumanitiesDepartment /></Layout>} />
               <Route path="/departments/medical" element={<Layout><MedicalDepartment /></Layout>} />
               
               {/* صفحة 404 */}
               <Route path="*" element={<NotFound />} />
                </Routes>
              </ScheduleNotificationProvider>
            </PreviewProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider_Custom>
  );
}

export default App;
