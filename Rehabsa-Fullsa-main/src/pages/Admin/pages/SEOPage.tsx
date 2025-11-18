import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminStatsCard } from "../components/StatsCard";
import {
  Search,
  Eye,
  FileText,
  Settings,
  BarChart3,
  CheckCircle,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data for SEO settings
const seoSettings = {
  general: {
    siteName: "Rehabsa",
    siteDescription: "منصة إدارة المتاجر والمشاريع التجارية",
    siteDescriptionEn: "Store and business management platform",
    siteUrl: "https://rehabsa.com",
    siteLanguage: "ar",
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "en"],
    timezone: "Asia/Riyadh",
    currency: "SAR"
  },
  metaTags: {
    title: "Rehabsa - منصة إدارة المتاجر",
    titleEn: "Rehabsa - Store Management Platform",
    description: "منصة شاملة لإدارة المتاجر والمشاريع التجارية مع حلول متقدمة للعملاء والموظفين",
    descriptionEn: "Comprehensive platform for managing stores and business projects with advanced solutions for customers and employees",
    keywords: "إدارة متاجر, نقاط البيع, عملاء, موظفين, تقنية",
    keywordsEn: "store management, POS, customers, employees, technology",
    author: "Rehabsa Team",
    robots: "index, follow",
    canonicalUrl: "https://rehabsa.com",
    viewport: "width=device-width, initial-scale=1.0"
  },
  schema: {
    enabled: true,
    organization: {
      name: "Rehabsa",
      url: "https://rehabsa.com",
      logo: "https://rehabsa.com/logo.png",
      description: "منصة إدارة المتاجر والمشاريع التجارية",
      descriptionEn: "Store and business management platform",
      contactPoint: {
        telephone: "+966501234567",
        contactType: "customer service",
        email: "support@rehabsa.com"
      },
      address: {
        streetAddress: "شارع الملك فهد",
        addressLocality: "الرياض",
        addressRegion: "منطقة الرياض",
        postalCode: "12345",
        addressCountry: "SA"
      }
    },
    website: {
      name: "Rehabsa",
      url: "https://rehabsa.com",
      description: "منصة إدارة المتاجر والمشاريع التجارية",
      descriptionEn: "Store and business management platform"
    }
  },
  sitemap: {
    enabled: true,
    lastModified: "2024-12-20",
    changeFrequency: "weekly",
    priority: 0.8,
    includeImages: true,
    includeBlog: true,
    includeStores: true,
    customUrls: [
      { url: "/features", priority: 0.9, changeFrequency: "monthly" },
      { url: "/pricing", priority: 0.9, changeFrequency: "monthly" },
      { url: "/contact", priority: 0.7, changeFrequency: "monthly" }
    ]
  },
  robots: {
    enabled: true,
    userAgent: "*",
    allow: ["/", "/admin", "/api"],
    disallow: ["/private", "/temp", "/uploads"],
    crawlDelay: 1,
    sitemap: "https://rehabsa.com/sitemap.xml"
  },
  analytics: {
    googleAnalytics: {
      enabled: true,
      trackingId: "GA-XXXXXXXXX",
      enhancedEcommerce: true,
      customDimensions: []
    },
    googleTagManager: {
      enabled: true,
      containerId: "GTM-XXXXXXX"
    },
    facebookPixel: {
      enabled: false,
      pixelId: ""
    }
  },
  performance: {
    enabled: true,
    compression: true,
    minification: true,
    caching: true,
    cdnEnabled: false,
    lazyLoading: true,
    imageOptimization: true
  }
};

const seoStats = {
  totalPages: 25,
  indexedPages: 23,
  metaTagsComplete: 20,
  missingMetaTags: 5,
  averageLoadTime: 2.3,
  mobileFriendly: 22,
  sslEnabled: true,
  lastCrawl: "2024-12-20"
};

export function SEOPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const [settings, setSettings] = React.useState(seoSettings);
  const [activeTab, setActiveTab] = React.useState("general");

  const handleSaveSettings = () => {
    toast.success(t("admin.seo.settingsSaved"));
  };

  const handleTestSEO = () => {
    toast.success(t("admin.seo.testCompleted"));
  };

  const handleGenerateSitemap = () => {
    toast.success(t("admin.seo.sitemapGenerated"));
  };

  const _handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("admin.seo.copiedToClipboard"));
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seo-settings.json';
    link.click();
    toast.success(t("admin.seo.settingsExported"));
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast.success(t("admin.seo.settingsImported"));
        } catch {
          toast.error(t("admin.seo.invalidFile"));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Search className="h-6 w-6" />
          {t("admin.seo.title")}
        </h1>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button variant="outline" onClick={handleTestSEO}>
            <Eye className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            {t("admin.seo.testSEO")}
          </Button>
          <Button onClick={handleSaveSettings}>
            <Settings className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            {t("admin.seo.saveSettings")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.seo.totalPages")}
          value={seoStats.totalPages}
          icon={FileText}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.seo.indexedPages")}
          value={seoStats.indexedPages}
          icon={CheckCircle}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.seo.metaTagsComplete")}
          value={seoStats.metaTagsComplete}
          icon={Search}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.seo.averageLoadTime")}
          value={`${seoStats.averageLoadTime}s`}
          icon={BarChart3}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* SEO Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="general">{t("admin.seo.general")}</TabsTrigger>
          <TabsTrigger value="meta">{t("admin.seo.metaTags")}</TabsTrigger>
          <TabsTrigger value="schema">{t("admin.seo.schema")}</TabsTrigger>
          <TabsTrigger value="sitemap">{t("admin.seo.sitemap")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("admin.seo.analytics")}</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.seo.generalSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="siteName" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.siteName")} *
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, siteName: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.siteUrl")} *
                  </Label>
                  <Input
                    id="siteUrl"
                    value={settings.general.siteUrl}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, siteUrl: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.siteDescription")} *
                </Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                      general: { ...prev.general, siteDescription: e.target.value }
                  }))}
                  className={`${isRTL ? 'text-right' : 'text-left'}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescriptionEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.siteDescriptionEn")}
                </Label>
                <Textarea
                  id="siteDescriptionEn"
                  value={settings.general.siteDescriptionEn}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                      general: { ...prev.general, siteDescriptionEn: e.target.value }
                  }))}
                  className={`${isRTL ? 'text-right' : 'text-left'}`}
                  rows={3}
                />
              </div>

              <div className={`grid grid-cols-3 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.defaultLanguage")}
                  </Label>
                  <Select value={settings.general.defaultLanguage} onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, defaultLanguage: value }
                    }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.timezone")}
                  </Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, timezone: value }
                    }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.currency")}
                  </Label>
                  <Select value={settings.general.currency} onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, currency: value }
                    }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">SAR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meta Tags */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.seo.metaTagsSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.metaTitle")} *
                  </Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTags.title}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, title: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {settings.metaTags.title.length}/60 {t("admin.seo.characters")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitleEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.metaTitleEn")}
                  </Label>
                  <Input
                    id="metaTitleEn"
                    value={settings.metaTags.titleEn}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, titleEn: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {settings.metaTags.titleEn.length}/60 {t("admin.seo.characters")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.metaDescription")} *
                </Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaTags.description}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    metaTags: { ...prev.metaTags, description: e.target.value }
                  }))}
                  className={`${isRTL ? 'text-right' : 'text-left'}`}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {settings.metaTags.description.length}/160 {t("admin.seo.characters")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescriptionEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.metaDescriptionEn")}
                </Label>
                <Textarea
                  id="metaDescriptionEn"
                  value={settings.metaTags.descriptionEn}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    metaTags: { ...prev.metaTags, descriptionEn: e.target.value }
                  }))}
                  className={`${isRTL ? 'text-right' : 'text-left'}`}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {settings.metaTags.descriptionEn.length}/160 {t("admin.seo.characters")}
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="keywords" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.keywords")}
                  </Label>
                  <Input
                    id="keywords"
                    value={settings.metaTags.keywords}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, keywords: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.seo.keywordsPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywordsEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.keywordsEn")}
                  </Label>
                  <Input
                    id="keywordsEn"
                    value={settings.metaTags.keywordsEn}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, keywordsEn: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.seo.keywordsEnPlaceholder")}
                  />
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="author" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.author")}
                  </Label>
                  <Input
                    id="author"
                    value={settings.metaTags.author}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, author: e.target.value }
                    }))}
                    className={`${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="robots" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.robots")}
                  </Label>
                  <Select value={settings.metaTags.robots} onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      metaTags: { ...prev.metaTags, robots: value }
                    }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">index, follow</SelectItem>
                      <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                      <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                      <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema */}
        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.seo.schemaMarkup")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.enableSchema")}
                </Label>
                <Switch
                  checked={settings.schema.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    schema: { ...prev.schema, enabled: checked }
                  }))}
                />
              </div>

              {settings.schema.enabled && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.seo.organizationSchema")}
                    </h4>
                    
                    <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="space-y-2">
                        <Label htmlFor="orgName" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                          {t("admin.seo.organizationName")}
                        </Label>
                        <Input
                          id="orgName"
                          value={settings.schema.organization.name}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schema: {
                              ...prev.schema,
                              organization: { ...prev.schema.organization, name: e.target.value }
                            }
                          }))}
                          className={`${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgUrl" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                          {t("admin.seo.organizationUrl")}
                        </Label>
                        <Input
                          id="orgUrl"
                          value={settings.schema.organization.url}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schema: {
                              ...prev.schema,
                              organization: { ...prev.schema.organization, url: e.target.value }
                            }
                          }))}
                          className={`${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orgDescription" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.seo.organizationDescription")}
                      </Label>
                      <Textarea
                        id="orgDescription"
                        value={settings.schema.organization.description}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schema: {
                            ...prev.schema,
                            organization: { ...prev.schema.organization, description: e.target.value }
                          }
                        }))}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sitemap */}
        <TabsContent value="sitemap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.sitemapSettings")}
                </span>
                <Button onClick={handleGenerateSitemap} size="sm">
                  <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  {t("admin.seo.generateSitemap")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.seo.enableSitemap")}
                </Label>
                <Switch
                  checked={settings.sitemap.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    sitemap: { ...prev.sitemap, enabled: checked }
                  }))}
                />
              </div>

              {settings.sitemap.enabled && (
                <div className="space-y-4">
                  <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="space-y-2">
                      <Label htmlFor="changeFrequency" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.seo.changeFrequency")}
                      </Label>
                      <Select value={settings.sitemap.changeFrequency} onValueChange={(value) => 
                        setSettings(prev => ({
                          ...prev,
                          sitemap: { ...prev.sitemap, changeFrequency: value }
                        }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.seo.priority")}
                      </Label>
                      <Input
                        id="priority"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.sitemap.priority}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sitemap: { ...prev.sitemap, priority: parseFloat(e.target.value) }
                        }))}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.seo.includeContent")}
                    </Label>
                    <div className={`grid grid-cols-3 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Switch
                          checked={settings.sitemap.includeImages}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, includeImages: checked }
                          }))}
                        />
                        <Label className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t("admin.seo.includeImages")}
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Switch
                          checked={settings.sitemap.includeBlog}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, includeBlog: checked }
                          }))}
                        />
                        <Label className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t("admin.seo.includeBlog")}
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Switch
                          checked={settings.sitemap.includeStores}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, includeStores: checked }
                          }))}
                        />
                        <Label className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t("admin.seo.includeStores")}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <BarChart3 className="h-5 w-5" />
                  {t("admin.seo.googleAnalytics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.enableGA")}
                  </Label>
                  <Switch
                    checked={settings.analytics.googleAnalytics.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics,
                        googleAnalytics: { ...prev.analytics.googleAnalytics, enabled: checked }
                      }
                    }))}
                  />
                </div>

                {settings.analytics.googleAnalytics.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="gaTrackingId" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.seo.gaTrackingId")}
                    </Label>
                    <Input
                      id="gaTrackingId"
                      value={settings.analytics.googleAnalytics.trackingId}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          googleAnalytics: { ...prev.analytics.googleAnalytics, trackingId: e.target.value }
                        }
                      }))}
                      className={`${isRTL ? 'text-right' : 'text-left'}`}
                      placeholder="GA-XXXXXXXXX"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Google Tag Manager */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Settings className="h-5 w-5" />
                  {t("admin.seo.googleTagManager")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.seo.enableGTM")}
                  </Label>
                  <Switch
                    checked={settings.analytics.googleTagManager.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics,
                        googleTagManager: { ...prev.analytics.googleTagManager, enabled: checked }
                      }
                    }))}
                  />
                </div>

                {settings.analytics.googleTagManager.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="gtmContainerId" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.seo.gtmContainerId")}
                    </Label>
                    <Input
                      id="gtmContainerId"
                      value={settings.analytics.googleTagManager.containerId}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          googleTagManager: { ...prev.analytics.googleTagManager, containerId: e.target.value }
                        }
                      }))}
                      className={`${isRTL ? 'text-right' : 'text-left'}`}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export/Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
            {t("admin.seo.exportImport")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              {t("admin.seo.exportSettings")}
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                {t("admin.seo.importSettings")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
