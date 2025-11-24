import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { logoutApi } from "@/lib/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  Users,
  Package,
  MapPin,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  Palette,
} from "lucide-react";

export function DashboardSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getLogo } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getMenuItems = () => [
    {
      title: t("dashboard.sidebar.dashboard"),
      icon: LayoutDashboard,
      url: "/dashboard",
    },
    {
      title: t("dashboard.sidebar.cards"),
      icon: CreditCard,
      url: "/dashboard/cards",
    },
    {
      title: t("dashboard.sidebar.notifications"),
      icon: Bell,
      url: "/dashboard/notifications",
    },
    {
      title: t("dashboard.sidebar.customers"),
      icon: Users,
      url: "/dashboard/customers",
    },
    {
      title: t("dashboard.sidebar.products"),
      icon: Package,
      url: "/dashboard/products",
    },
    {
      title: t("dashboard.sidebar.locations"),
      icon: MapPin,
      url: "/dashboard/locations",
    },
    {
      title: t("dashboard.sidebar.managers"),
      icon: UserCheck,
      url: "/dashboard/managers",
    },
    {
      title: t("dashboard.sidebar.logs"),
      icon: FileText,
      url: "/dashboard/logs",
    },
    {
      title: t("dashboard.sidebar.settings"),
      icon: Settings,
      url: "/dashboard/settings",
    },
    {
      title: t("dashboard.sidebar.theme"),
      icon: Palette,
      url: "/dashboard/theme",
    },
  ];

  const menuItems = getMenuItems();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <Sidebar 
      className={`${isRTL ? 'font-arabic' : 'font-sans'}`}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-center">
          <div className="relative">
            <img 
              src={getLogo('dashboard')} 
              alt="Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-medium text-muted-foreground px-3 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("dashboard.sidebar.mainMenu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
                  >
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
                    >
                      {isRTL ? (
                        <>
                          <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-right`}>
                            {item.title}
                          </span>
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                        </>
                      ) : (
                        <>
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-left`}>
                            {item.title}
                          </span>
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarSeparator />
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                isLoggingOut 
                  ? 'text-red-500 bg-red-100 cursor-not-allowed opacity-75' 
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              } ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
            >
              {isRTL ? (
                <>
                  <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-right`}>
                    {isLoggingOut ? t("dashboard.sidebar.loggingOut") : t("dashboard.sidebar.logout")}
                  </span>
                  <LogOut className={`w-5 h-5 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                </>
              ) : (
                <>
                  <LogOut className={`w-5 h-5 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                  <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-left`}>
                    {isLoggingOut ? t("dashboard.sidebar.loggingOut") : t("dashboard.sidebar.logout")}
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
