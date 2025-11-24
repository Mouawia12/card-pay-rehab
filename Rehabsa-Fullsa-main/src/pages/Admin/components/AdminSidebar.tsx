import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  Receipt,
  BookOpen,
  Search,
  Megaphone,
  Palette,
  Globe,
  ChevronDown,
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getLogo } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getMenuItems = () => [
    {
      title: t("admin.sidebar.dashboard"),
      icon: LayoutDashboard,
      url: "/admin",
    },
    {
      title: t("admin.sidebar.stores"),
      icon: Store,
      url: "/admin/stores",
    },
    {
      title: t("admin.sidebar.users"),
      icon: Users,
      url: "/admin/users",
    },
    {
      title: t("admin.sidebar.subscriptions"),
      icon: CreditCard,
      url: "/admin/subscriptions",
    },
    {
      title: t("admin.sidebar.marketing"),
      icon: Megaphone,
      url: "/admin/marketing",
    },
    {
      title: t("admin.sidebar.plans"),
      icon: Shield,
      url: "/admin/plans",
    },
    {
      title: t("admin.sidebar.blog"),
      icon: BookOpen,
      url: "/admin/blog",
    },
    {
      title: t("admin.sidebar.seo"),
      icon: Search,
      url: "/admin/seo",
    },
    {
      title: t("admin.sidebar.reports"),
      icon: Receipt,
      url: "/admin/reports",
    },
    {
      title: t("admin.sidebar.analytics"),
      icon: BarChart3,
      url: "/admin/analytics",
    },
    {
      title: t("admin.sidebar.systemLogs"),
      icon: FileText,
      url: "/admin/system-logs",
    },
    {
      title: t("admin.sidebar.settings"),
      icon: Settings,
      url: "/admin/settings",
    },
    {
      title: t("admin.sidebar.theme"),
      icon: Palette,
      url: "/admin/theme",
    },
  ];

  const menuItems = getMenuItems();
  const siteManagementBasePath = "/admin/site-management";
  const isSiteManagementActive = location.pathname.startsWith(siteManagementBasePath);
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(isSiteManagementActive);
  const siteManagementSections = useMemo(
    () => [
      { value: "hero", label: t("admin.sidebar.siteManagementSections.hero") },
      { value: "features", label: t("admin.sidebar.siteManagementSections.features") },
      { value: "howItWorks", label: t("admin.sidebar.siteManagementSections.howItWorks") },
      { value: "cardTypes", label: t("admin.sidebar.siteManagementSections.cardTypes") },
      { value: "benefits", label: t("admin.sidebar.siteManagementSections.benefits") },
      { value: "pricing", label: t("admin.sidebar.siteManagementSections.pricing") },
      { value: "industries", label: t("admin.sidebar.siteManagementSections.industries") },
      { value: "footer", label: t("admin.sidebar.siteManagementSections.footer") },
      { value: "header", label: t("admin.sidebar.siteManagementSections.header") },
    ],
    [t],
  );
  const sectionFromPath = location.pathname.startsWith(`${siteManagementBasePath}/`)
    ? location.pathname.slice(siteManagementBasePath.length + 1)
    : "";
  const normalizedActiveSection =
    sectionFromPath || siteManagementSections[0]?.value || "hero";

  useEffect(() => {
    if (isSiteManagementActive) {
      setIsSiteMenuOpen(true);
    }
  }, [isSiteManagementActive]);

  const handleSiteMenuToggle = () => {
    setIsSiteMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      window.location.href = "/admin/login";
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
              src={getLogo('admin')} 
              alt="Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-medium text-muted-foreground px-3 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("admin.sidebar.mainMenu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  onClick={handleSiteMenuToggle}
                  isActive={isSiteManagementActive}
                  aria-expanded={isSiteMenuOpen}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground",
                    isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-1 items-center gap-3",
                      isRTL ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {isRTL ? (
                      <>
                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden text-right">
                          {t("admin.sidebar.siteManagement")}
                        </span>
                        <Globe className="w-5 h-5 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden text-left">
                          {t("admin.sidebar.siteManagement")}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                      isSiteMenuOpen ? "rotate-180" : "",
                    )}
                  />
                </SidebarMenuButton>
                <SidebarMenuSub
                  className={cn(
                    !isSiteMenuOpen && "hidden",
                    isRTL ? "border-r border-l-0" : "",
                  )}
                >
                  {siteManagementSections.map((section) => {
                    const sectionPath = `${siteManagementBasePath}/${section.value}`;
                    const isActiveSection =
                      isSiteManagementActive && normalizedActiveSection === section.value;

                    return (
                      <SidebarMenuSubItem key={section.value}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActiveSection}
                          className={cn(isRTL ? "justify-end" : "justify-start")}
                        >
                          <Link
                            to={sectionPath}
                            className={cn(
                              "flex w-full items-center",
                              isRTL ? "flex-row-reverse text-right" : "flex-row text-left",
                            )}
                            onClick={() => setIsSiteMenuOpen(true)}
                          >
                            <span className="truncate">{section.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
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
                    {isLoggingOut ? t("admin.sidebar.loggingOut") : t("admin.sidebar.logout")}
                  </span>
                  <LogOut className={`w-5 h-5 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                </>
              ) : (
                <>
                  <LogOut className={`w-5 h-5 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                  <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-left`}>
                    {isLoggingOut ? t("admin.sidebar.loggingOut") : t("admin.sidebar.logout")}
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
