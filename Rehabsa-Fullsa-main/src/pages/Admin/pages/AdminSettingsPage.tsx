import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Save,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAdminSettingGroup, updateAdminSettingGroup } from "@/lib/api";

const defaultAdminSettings = {
  // General Settings
  siteName: "رحاب - نظام إدارة بطاقات الولاء",
  siteDescription: "منصة متقدمة لإدارة بطاقات الولاء الرقمية",
  defaultLanguage: "ar",
  timezone: "Asia/Riyadh",
  
  // Admin Settings
  adminName: "المسؤول الأعلى",
  adminEmail: "admin@rehabsa.com",
  adminPhone: "+966501234567",
  
  // Security Settings
  enableTwoFactor: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  
  // Notification Settings
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  
  // System Settings
  maintenanceMode: false,
  debugMode: false,
  autoBackup: true,
  backupFrequency: "daily",
  
  // Email Settings
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUsername: "noreply@rehabsa.com",
  smtpPassword: "********",
  smtpSecure: true,
  
  // SMS Settings
  smsProvider: "twilio",
  smsApiKey: "********",
  smsApiSecret: "********",
};

const createDefaultSettings = () => JSON.parse(JSON.stringify(defaultAdminSettings));

export function AdminSettingsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [showPassword, setShowPassword] = React.useState(false);
  const [settings, setSettings] = React.useState(createDefaultSettings);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAdminSettingGroup<typeof defaultAdminSettings>("admin_settings");
        if (response.data) {
          setSettings({
            ...createDefaultSettings(),
            ...response.data,
          });
        }
      } catch {
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [t]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateAdminSettingGroup("admin_settings", settings);
      toast.success(t("admin.settings.saveSuccess"));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = async () => {
    const defaults = createDefaultSettings();
    setSettings(defaults);
    try {
      await updateAdminSettingGroup("admin_settings", defaults);
      toast.success(t("admin.settings.resetSuccess"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Settings className="h-6 w-6" />
          {t("admin.settings.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveSettings} className={isRTL ? 'text-left' : 'text-right'} disabled={isSaving}>
            <span>{isSaving ? t("common.loading") : t("admin.settings.save")}</span>
            <Save className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
          <Button onClick={handleResetSettings} variant="outline" className={isRTL ? 'text-left' : 'text-right'} disabled={isSaving}>
            {t("admin.settings.reset")}
          </Button>
        </div>
      </div>
      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className="h-5 w-5" />
              {t("admin.settings.generalSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">{t("admin.settings.siteName")}</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">{t("admin.settings.siteDescription")}</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting("siteDescription", e.target.value)}
                rows={3}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">{t("admin.settings.defaultLanguage")}</Label>
              <select
                id="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={(e) => updateSetting("defaultLanguage", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{t("admin.settings.timezone")}</Label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Admin Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="h-5 w-5" />
              {t("admin.settings.adminSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">{t("admin.settings.adminName")}</Label>
              <Input
                id="adminName"
                value={settings.adminName}
                onChange={(e) => updateSetting("adminName", e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">{t("admin.settings.adminEmail")}</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting("adminEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPhone">{t("admin.settings.adminPhone")}</Label>
              <Input
                id="adminPhone"
                value={settings.adminPhone}
                onChange={(e) => updateSetting("adminPhone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="h-5 w-5" />
              {t("admin.settings.securitySettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="enableTwoFactor">{t("admin.settings.enableTwoFactor")}</Label>
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">{t("admin.settings.sessionTimeout")}</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">{t("admin.settings.maxLoginAttempts")}</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting("maxLoginAttempts", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">{t("admin.settings.passwordMinLength")}</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => updateSetting("passwordMinLength", parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="h-5 w-5" />
              {t("admin.settings.notificationSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="emailNotifications">{t("admin.settings.emailNotifications")}</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="smsNotifications">{t("admin.settings.smsNotifications")}</Label>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
              />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="pushNotifications">{t("admin.settings.pushNotifications")}</Label>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Database className="h-5 w-5" />
              {t("admin.settings.systemSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="maintenanceMode">{t("admin.settings.maintenanceMode")}</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
              />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="debugMode">{t("admin.settings.debugMode")}</Label>
              <Switch
                id="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) => updateSetting("debugMode", checked)}
              />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="autoBackup">{t("admin.settings.autoBackup")}</Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">{t("admin.settings.backupFrequency")}</Label>
              <select
                id="backupFrequency"
                value={settings.backupFrequency}
                onChange={(e) => updateSetting("backupFrequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="hourly">{t("admin.settings.hourly")}</option>
                <option value="daily">{t("admin.settings.daily")}</option>
                <option value="weekly">{t("admin.settings.weekly")}</option>
                <option value="monthly">{t("admin.settings.monthly")}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-5 w-5" />
              {t("admin.settings.emailSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">{t("admin.settings.smtpHost")}</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => updateSetting("smtpHost", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">{t("admin.settings.smtpPort")}</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => updateSetting("smtpPort", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">{t("admin.settings.smtpUsername")}</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => updateSetting("smtpUsername", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">{t("admin.settings.smtpPassword")}</Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showPassword ? "text" : "password"}
                  value={settings.smtpPassword}
                  onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="smtpSecure">{t("admin.settings.smtpSecure")}</Label>
              <Switch
                id="smtpSecure"
                checked={settings.smtpSecure}
                onCheckedChange={(checked) => updateSetting("smtpSecure", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
