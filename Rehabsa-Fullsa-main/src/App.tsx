import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDirection } from "@/hooks/useDirection";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { LoginPage } from "./pages/Auth/LoginPage";
import { AdminLoginPage } from "./pages/Auth/AdminLoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/Auth/ResetPasswordPage";
import { ContactPage } from "./pages/ContactPage";
import { AboutPage } from "./pages/AboutPage";
import { SubscribePage } from "./pages/SubscribePage";
import { SubscriptionSuccessPage } from "./pages/SubscriptionSuccessPage";
import { SubscriptionFailurePage } from "./pages/SubscriptionFailurePage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const AppContent = () => {
  useDirection(); // Handle RTL/LTR direction based on language
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/subscribe/:planId" element={<SubscribePage />} />
        <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
        <Route path="/subscription/failure" element={<SubscriptionFailurePage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
