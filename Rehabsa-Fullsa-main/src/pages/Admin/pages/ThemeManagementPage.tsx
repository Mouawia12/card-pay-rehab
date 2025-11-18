import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Save,
  RotateCcw,
  Upload,
  Globe,
  Shield,
  LayoutDashboard,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { imageToBase64, hslToHex, hexToHsl, ColorScheme } from "@/lib/themeStorage";

export function ThemeManagementPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { theme, updateLogo, updateColors, resetTheme, applyTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"website" | "admin" | "dashboard">("website");
  const [localTheme, setLocalTheme] = useState(theme);

  // Update local theme when global theme changes
  React.useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleLogoUpload = async (type: "website" | "admin" | "dashboard", file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("admin.theme.invalidImageType"));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("admin.theme.imageTooLarge"));
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      updateLogo(type, base64);
      setLocalTheme((prev) => ({
        ...prev,
        logos: { ...prev.logos, [type]: base64 },
      }));
      toast.success(t("admin.theme.logoUploaded"));
    } catch (error) {
      toast.error(t("admin.theme.uploadError"));
    }
  };

  const handleColorChange = (
    type: "website" | "admin" | "dashboard",
    colorKey: keyof ColorScheme,
    hexValue: string
  ) => {
    const hslValue = hexToHsl(hexValue);
    setLocalTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [type]: {
          ...prev.colors[type],
          [colorKey]: hslValue,
        },
      },
    }));
  };

  const handleSave = () => {
    // Apply all color changes
    Object.entries(localTheme.colors).forEach(([type, colors]) => {
      updateColors(type as "website" | "admin" | "dashboard", colors);
    });
    toast.success(t("admin.theme.saved"));
  };

  const handleReset = () => {
    resetTheme();
    setLocalTheme(theme);
    toast.success(t("admin.theme.reset"));
  };

  const handlePreview = (type: "website" | "admin" | "dashboard") => {
    // Apply colors from localTheme (temporary changes) for preview
    const colors = localTheme.colors[type];
    const root = document.documentElement;

    // Apply colors directly to CSS variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.input);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--destructive', colors.destructive);
    root.style.setProperty('--destructive-foreground', colors.destructiveForeground);
    
    // Sidebar colors
    if (colors.sidebarBackground) {
      root.style.setProperty('--sidebar-background', colors.sidebarBackground);
    }
    if (colors.sidebarForeground) {
      root.style.setProperty('--sidebar-foreground', colors.sidebarForeground);
    }
    if (colors.sidebarPrimary) {
      root.style.setProperty('--sidebar-primary', colors.sidebarPrimary);
    }
    if (colors.sidebarPrimaryForeground) {
      root.style.setProperty('--sidebar-primary-foreground', colors.sidebarPrimaryForeground);
    }
    if (colors.sidebarAccent) {
      root.style.setProperty('--sidebar-accent', colors.sidebarAccent);
    }
    if (colors.sidebarAccentForeground) {
      root.style.setProperty('--sidebar-accent-foreground', colors.sidebarAccentForeground);
    }
    if (colors.sidebarBorder) {
      root.style.setProperty('--sidebar-border', colors.sidebarBorder);
    }
    if (colors.sidebarRing) {
      root.style.setProperty('--sidebar-ring', colors.sidebarRing);
    }

    toast.success(t("admin.theme.previewApplied"));
  };

  const renderColorPicker = (
    type: "website" | "admin" | "dashboard",
    colorKey: keyof ColorScheme,
    label: string
  ) => {
    const currentColor = localTheme.colors[type][colorKey];
    const hexColor = currentColor ? hslToHex(currentColor) : "#00CEC2";

    return (
      <div className="space-y-2">
        <Label htmlFor={`${type}-${colorKey}`} className={isRTL ? "text-right block" : "text-left block"}>
          {label}
        </Label>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            id={`${type}-${colorKey}`}
            type="color"
            value={hexColor}
            onChange={(e) => handleColorChange(type, colorKey, e.target.value)}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={hexColor}
            onChange={(e) => {
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                handleColorChange(type, colorKey, e.target.value);
              }
            }}
            className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
            dir="ltr"
          />
        </div>
      </div>
    );
  };

  const renderLogoUpload = (type: "website" | "admin" | "dashboard", label: string, icon: React.ReactNode) => {
    const currentLogo = localTheme.logos[type];

    return (
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
            {icon}
            {label}
          </CardTitle>
          <CardDescription className={isRTL ? "text-right" : "text-left"}>
            {t(`admin.theme.${type}LogoDescription`)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
              {currentLogo ? (
                <img
                  src={currentLogo}
                  alt={`${type} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <Label htmlFor={`logo-upload-${type}`} className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span className="flex items-center">
                    {isRTL ? (
                      <>
                        {t("admin.theme.uploadLogo")}
                        <Upload className="h-4 w-4 mr-2" />
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 ml-2" />
                        {t("admin.theme.uploadLogo")}
                      </>
                    )}
                  </span>
                </Button>
              </Label>
              <Input
                id={`logo-upload-${type}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(type, e.target.files?.[0] || null)}
                className="hidden"
              />
              <p className={`text-sm text-muted-foreground mt-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("admin.theme.logoRequirements")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderColorSection = (type: "website" | "admin" | "dashboard") => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderColorPicker(type, "primary", t("admin.theme.primaryColor"))}
          {renderColorPicker(type, "primaryForeground", t("admin.theme.primaryForeground"))}
          {renderColorPicker(type, "secondary", t("admin.theme.secondaryColor"))}
          {renderColorPicker(type, "secondaryForeground", t("admin.theme.secondaryForeground"))}
          {renderColorPicker(type, "accent", t("admin.theme.accentColor"))}
          {renderColorPicker(type, "accentForeground", t("admin.theme.accentForeground"))}
          {renderColorPicker(type, "background", t("admin.theme.background"))}
          {renderColorPicker(type, "foreground", t("admin.theme.foreground"))}
          {renderColorPicker(type, "card", t("admin.theme.card"))}
          {renderColorPicker(type, "cardForeground", t("admin.theme.cardForeground"))}
          {renderColorPicker(type, "border", t("admin.theme.border"))}
          {renderColorPicker(type, "input", t("admin.theme.input"))}
          {renderColorPicker(type, "ring", t("admin.theme.ring"))}
          {renderColorPicker(type, "muted", t("admin.theme.muted"))}
          {renderColorPicker(type, "mutedForeground", t("admin.theme.mutedForeground"))}
          {renderColorPicker(type, "destructive", t("admin.theme.destructive"))}
          {renderColorPicker(type, "destructiveForeground", t("admin.theme.destructiveForeground"))}
        </div>

        {/* Sidebar Colors */}
        {(type === "admin" || type === "dashboard") && (
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? "text-right" : "text-left"}`}>
              {t("admin.theme.sidebarColors")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderColorPicker(type, "sidebarBackground", t("admin.theme.sidebarBackground"))}
              {renderColorPicker(type, "sidebarForeground", t("admin.theme.sidebarForeground"))}
              {renderColorPicker(type, "sidebarPrimary", t("admin.theme.sidebarPrimary"))}
              {renderColorPicker(type, "sidebarPrimaryForeground", t("admin.theme.sidebarPrimaryForeground"))}
              {renderColorPicker(type, "sidebarAccent", t("admin.theme.sidebarAccent"))}
              {renderColorPicker(type, "sidebarAccentForeground", t("admin.theme.sidebarAccentForeground"))}
              {renderColorPicker(type, "sidebarBorder", t("admin.theme.sidebarBorder"))}
              {renderColorPicker(type, "sidebarRing", t("admin.theme.sidebarRing"))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
          {isRTL ? (
            <>
              {t("admin.theme.title")}
              <Palette className="h-6 w-6" />
            </>
          ) : (
            <>
              <Palette className="h-6 w-6" />
              {t("admin.theme.title")}
            </>
          )}
        </h1>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button onClick={handleSave} className="flex items-center">
            {isRTL ? (
              <>
                {t("admin.theme.save")}
                <Save className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                {t("admin.theme.save")}
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex items-center">
            {isRTL ? (
              <>
                {t("admin.theme.reset")}
                <RotateCcw className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 ml-2" />
                {t("admin.theme.reset")}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="website" className="flex items-center">
            {isRTL ? (
              <>
                {t("admin.theme.website")}
                <Globe className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 ml-2" />
                {t("admin.theme.website")}
              </>
            )}
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center">
            {isRTL ? (
              <>
                {t("admin.theme.admin")}
                <Shield className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 ml-2" />
                {t("admin.theme.admin")}
              </>
            )}
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center">
            {isRTL ? (
              <>
                {t("admin.theme.dashboard")}
                <LayoutDashboard className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <LayoutDashboard className="h-4 w-4 ml-2" />
                {t("admin.theme.dashboard")}
              </>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Website Tab */}
        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.websiteLogo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogoUpload("website", t("admin.theme.websiteLogo"), <Globe className="h-5 w-5" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.websiteColors")}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderColorSection("website")}</CardContent>
          </Card>
          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <Button onClick={() => handlePreview("website")} variant="outline">
              {t("admin.theme.preview")}
            </Button>
          </div>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.adminLogo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogoUpload("admin", t("admin.theme.adminLogo"), <Shield className="h-5 w-5" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.adminColors")}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderColorSection("admin")}</CardContent>
          </Card>
          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <Button onClick={() => handlePreview("admin")} variant="outline">
              {t("admin.theme.preview")}
            </Button>
          </div>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.dashboardLogo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogoUpload("dashboard", t("admin.theme.dashboardLogo"), <LayoutDashboard className="h-5 w-5" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>
                {t("admin.theme.dashboardColors")}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderColorSection("dashboard")}</CardContent>
          </Card>
          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <Button onClick={() => handlePreview("dashboard")} variant="outline">
              {t("admin.theme.preview")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

