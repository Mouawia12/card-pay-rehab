import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminContent } from "./components/AdminContent";
import { StoresPage } from "./pages/StoresPage";
import { StoreDetailsPage } from "./pages/StoreDetailsPage";
import { StoreFormPage } from "./pages/StoreFormPage";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { MarketingPage } from "./pages/MarketingPage";
import { UsersPage } from "./pages/UsersPage";
import { PlansPage } from "./pages/PlansPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SystemLogsPage } from "./pages/SystemLogsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";
import { BlogCategoriesPage } from "./pages/BlogCategoriesPage";
import { SEOPage } from "./pages/SEOPage";
import { ThemeManagementPage } from "./pages/ThemeManagementPage";
import { SiteManagementPage } from "./pages/SiteManagementPage";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

export default function Admin() {
  const { isRTL, language } = useDirection();
  const { applyTheme } = useTheme();

  useEffect(() => {
    applyTheme('admin');
  }, [applyTheme]);

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"} 
      lang={language} 
      className={`${isRTL ? 'font-arabic' : 'font-sans'} flex h-screen bg-gradient-to-br from-background to-muted/30`}
    >
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<AdminContent />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/stores/add" element={<StoreFormPage />} />
              <Route path="/stores/:id" element={<StoreDetailsPage />} />
              <Route path="/stores/:id/edit" element={<StoreFormPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/system-logs" element={<SystemLogsPage />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailsPage />} />
              <Route path="/blog-categories" element={<BlogCategoriesPage />} />
              <Route path="/seo" element={<SEOPage />} />
              <Route path="/theme" element={<ThemeManagementPage />} />
              <Route path="/site-management/:section?" element={<SiteManagementPage />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
