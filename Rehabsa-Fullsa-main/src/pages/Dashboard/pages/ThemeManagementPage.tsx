import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Save,
  RotateCcw,
  Upload,
  LayoutDashboard,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { imageToBase64, hslToHex, hexToHsl, ColorScheme } from "@/lib/themeStorage";

export function ThemeManagementPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { theme, updateLogo, updateColors, resetTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);

  // Update local theme when global theme changes
  React.useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleLogoUpload = async (file: File | null) => {
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
      updateLogo("dashboard", base64);
      setLocalTheme((prev) => ({
        ...prev,
        logos: { ...prev.logos, dashboard: base64 },
      }));
      toast.success(t("admin.theme.logoUploaded"));
    } catch (error) {
      toast.error(t("admin.theme.uploadError"));
    }
  };

  const handleColorChange = (
    colorKey: keyof ColorScheme,
    hexValue: string
  ) => {
    const hslValue = hexToHsl(hexValue);
    setLocalTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        dashboard: {
          ...prev.colors.dashboard,
          [colorKey]: hslValue,
        },
      },
    }));
  };

  const handleSave = () => {
    // Apply all color changes
    updateColors("dashboard", localTheme.colors.dashboard);
    toast.success(t("admin.theme.saved"));
  };

  const handleReset = () => {
    resetTheme();
    setLocalTheme(theme);
    toast.success(t("admin.theme.reset"));
  };

  const handlePreview = () => {
    // Apply colors from localTheme (temporary changes) for preview
    const colors = localTheme.colors.dashboard;
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
    colorKey: keyof ColorScheme,
    label: string
  ) => {
    const currentColor = localTheme.colors.dashboard[colorKey];
    const hexColor = currentColor ? hslToHex(currentColor) : "#00CEC2";

    return (
      <div className="space-y-2" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
        <Label htmlFor={`dashboard-${colorKey}`} className="block" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
          {label}
        </Label>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            id={`dashboard-${colorKey}`}
            type="color"
            value={hexColor}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={hexColor}
            onChange={(e) => {
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                handleColorChange(colorKey, e.target.value);
              }
            }}
            className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
            dir="ltr"
            style={isRTL ? { direction: 'ltr', textAlign: 'left' } : {}}
          />
        </div>
      </div>
    );
  };

  const renderLogoUpload = () => {
    const currentLogo = localTheme.logos.dashboard;

    return (
      <Card style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
        <CardHeader style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-start" : ""}`} style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
            {isRTL ? (
              <>
                {t("admin.theme.dashboardLogo")}
                <LayoutDashboard className="h-5 w-5" />
              </>
            ) : (
              <>
                <LayoutDashboard className="h-5 w-5" />
                {t("admin.theme.dashboardLogo")}
              </>
            )}
          </CardTitle>
          <CardDescription style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
            {t("admin.theme.dashboardLogoDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`} style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
            <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
              {currentLogo ? (
                <img
                  src={currentLogo}
                  alt="dashboard logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
              <Label htmlFor="logo-upload-dashboard" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                    {isRTL ? (
                      <>
                        {t("admin.theme.uploadLogo")}
                        <Upload className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
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
                id="logo-upload-dashboard"
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-2" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
                {t("admin.theme.logoRequirements")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={isRTL ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left', direction: 'ltr' }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`} style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`} style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
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
          <Button onClick={handleSave} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            {isRTL ? (
              <>
                {t("admin.theme.save")}
                <Save className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                {t("admin.theme.save")}
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            {isRTL ? (
              <>
                {t("admin.theme.reset")}
                <RotateCcw className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
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

      <div className="space-y-6" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
        {/* Logo Upload */}
        {renderLogoUpload()}

        {/* Colors Section */}
        <Card style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
          <CardHeader style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
            <CardTitle style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
              {t("admin.theme.dashboardColors")}
            </CardTitle>
          </CardHeader>
          <CardContent style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
                {renderColorPicker("primary", t("admin.theme.primaryColor"))}
                {renderColorPicker("primaryForeground", t("admin.theme.primaryForeground"))}
                {renderColorPicker("secondary", t("admin.theme.secondaryColor"))}
                {renderColorPicker("secondaryForeground", t("admin.theme.secondaryForeground"))}
                {renderColorPicker("accent", t("admin.theme.accentColor"))}
                {renderColorPicker("accentForeground", t("admin.theme.accentForeground"))}
                {renderColorPicker("background", t("admin.theme.background"))}
                {renderColorPicker("foreground", t("admin.theme.foreground"))}
                {renderColorPicker("card", t("admin.theme.card"))}
                {renderColorPicker("cardForeground", t("admin.theme.cardForeground"))}
                {renderColorPicker("border", t("admin.theme.border"))}
                {renderColorPicker("input", t("admin.theme.input"))}
                {renderColorPicker("ring", t("admin.theme.ring"))}
                {renderColorPicker("muted", t("admin.theme.muted"))}
                {renderColorPicker("mutedForeground", t("admin.theme.mutedForeground"))}
                {renderColorPicker("destructive", t("admin.theme.destructive"))}
                {renderColorPicker("destructiveForeground", t("admin.theme.destructiveForeground"))}
              </div>

              {/* Sidebar Colors */}
              <div className="mt-6" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
                <h3 className="text-lg font-semibold mb-4" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
                  {t("admin.theme.sidebarColors")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
                  {renderColorPicker("sidebarBackground", t("admin.theme.sidebarBackground"))}
                  {renderColorPicker("sidebarForeground", t("admin.theme.sidebarForeground"))}
                  {renderColorPicker("sidebarPrimary", t("admin.theme.sidebarPrimary"))}
                  {renderColorPicker("sidebarPrimaryForeground", t("admin.theme.sidebarPrimaryForeground"))}
                  {renderColorPicker("sidebarAccent", t("admin.theme.sidebarAccent"))}
                  {renderColorPicker("sidebarAccentForeground", t("admin.theme.sidebarAccentForeground"))}
                  {renderColorPicker("sidebarBorder", t("admin.theme.sidebarBorder"))}
                  {renderColorPicker("sidebarRing", t("admin.theme.sidebarRing"))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Button */}
        <div className={`flex w-full ${isRTL ? "justify-start" : "justify-end"}`} style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}>
          <Button 
            onClick={handlePreview} 
            variant="outline" 
            style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}
          >
            {t("admin.theme.preview")}
          </Button>
        </div>
      </div>
    </div>
  );
}

