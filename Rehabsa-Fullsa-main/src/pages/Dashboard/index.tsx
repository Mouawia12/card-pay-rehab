import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardContent } from "./components/DashboardContent";
import { CardsPage } from "./pages/CardsPage";
import { CreateCardPage } from "./pages/CreateCardPage";
import { ViewCardPage } from "./pages/ViewCardPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { CustomersPage } from "./pages/CustomersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ManagersPage } from "./pages/ManagersPage";
import { LogsPage } from "./pages/LogsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { LocationsPage } from "./pages/LocationsPage";
// Customer Pages
import { ViewCustomerPage } from "./pages/ViewCustomerPage";
import { AddCustomerPage } from "./pages/AddCustomerPage";
import { EditCustomerPage } from "./pages/EditCustomerPage";
// Product Pages
import { ViewProductPage } from "./pages/ViewProductPage";
import { AddProductPage } from "./pages/AddProductPage";
import { EditProductPage } from "./pages/EditProductPage";
import { ThemeManagementPage } from "./pages/ThemeManagementPage";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

export default function Dashboard() {
  const { isRTL, language } = useDirection();
  const { applyTheme } = useTheme();

  useEffect(() => {
    applyTheme('dashboard');
  }, [applyTheme]);

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"} 
      lang={language} 
      className={`${isRTL ? 'font-arabic' : 'font-sans'} flex h-screen bg-gradient-to-br from-background to-muted/30`}
    >
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/cards/templates" element={<TemplatesPage />} />
              <Route path="/cards/create" element={<CreateCardPage />} />
              <Route path="/cards/:id" element={<ViewCardPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/view/:id" element={<ViewCustomerPage />} />
              <Route path="/customers/add" element={<AddCustomerPage />} />
              <Route path="/customers/edit/:id" element={<EditCustomerPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/view/:id" element={<ViewProductPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/products/edit/:id" element={<EditProductPage />} />
              <Route path="/managers" element={<ManagersPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/theme" element={<ThemeManagementPage />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
