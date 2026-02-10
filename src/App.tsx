import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SchoolLogin from "./pages/SchoolLogin";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SchoolsManagement from "./pages/management/SchoolsManagement";
import ClassesManagement from "./pages/management/ClassesManagement";
import StudentsManagement from "./pages/management/StudentsManagement";
import TeachersManagement from "./pages/management/TeachersManagement";
import AnalyticsPage from "./pages/management/AnalyticsPage";
import MyClassesPage from "./pages/teacher/MyClassesPage";
import AttendancePage from "./pages/teacher/AttendancePage";
import GradesPage from "./pages/teacher/GradesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<SchoolLogin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/:schoolSlug/login" element={<SchoolLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/schools" element={<ProtectedRoute allowedRoles={["super_admin"]}><SchoolsManagement /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute allowedRoles={["super_admin"]}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/dashboard/teachers" element={<ProtectedRoute allowedRoles={["school_admin"]}><TeachersManagement /></ProtectedRoute>} />
            <Route path="/dashboard/classes" element={<ProtectedRoute allowedRoles={["school_admin"]}><ClassesManagement /></ProtectedRoute>} />
            <Route path="/dashboard/students" element={<ProtectedRoute allowedRoles={["school_admin"]}><StudentsManagement /></ProtectedRoute>} />
            <Route path="/dashboard/my-classes" element={<ProtectedRoute allowedRoles={["teacher"]}><MyClassesPage /></ProtectedRoute>} />
            <Route path="/dashboard/attendance" element={<ProtectedRoute allowedRoles={["teacher"]}><AttendancePage /></ProtectedRoute>} />
            <Route path="/dashboard/grades" element={<ProtectedRoute allowedRoles={["teacher"]}><GradesPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
