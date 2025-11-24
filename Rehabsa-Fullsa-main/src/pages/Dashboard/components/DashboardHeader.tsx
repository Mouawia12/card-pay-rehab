import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "@/lib/api";

export function DashboardHeader() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header className={`sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-card/95 backdrop-blur-md shadow-md px-4 ${isRTL ? 'font-arabic' : 'font-sans'} flex-shrink-0`} dir={isRTL ? "rtl" : "ltr"}>
      <SidebarTrigger className={isRTL ? "-ml-1" : "-mr-1"} />
      
      <div className={`flex flex-1 items-center gap-2 px-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="relative flex-1 max-w-sm">
          <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={t("dashboard.header.searchPlaceholder")}
            className={`${isRTL ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>
      
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <LanguageSwitcher />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate("/dashboard/notifications")}
          title={t("dashboard.header.notifications") || "الإشعارات"}
        >
          <Bell className="h-4 w-4" />
          <span className={`absolute -top-1 ${isRTL ? '-right-1' : '-left-1'} h-3 w-3 rounded-full bg-red-500 text-xs text-primary-foreground flex items-center justify-center`}>
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt={t("dashboard.header.userAlt")} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className={`text-sm font-medium leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboard.header.userName")}
                </p>
                <p className={`text-xs leading-none text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboard.header.userEmail")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={isRTL ? "text-right" : "text-left"}
              onClick={() => navigate("/dashboard/settings")}
            >
              {t("dashboard.header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isRTL ? "text-right" : "text-left"}
              onClick={() => navigate("/dashboard/settings")}
            >
              {t("dashboard.header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleLogout}
              className={`text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {t("dashboard.header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
