import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Globe, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";
import {
  getSiteContent,
  saveSiteContent,
  resetToDefault,
  updateSiteContentSection,
  getDefaultSectionContent,
  type SiteContent,
  type Language,
  type HeroContent,
  type FeaturesContent,
  type HowItWorksContent,
  type CardTypesContent,
  type BenefitsContent,
  type PricingContent,
  type IndustriesContent,
  type FooterContent,
  type HeaderContent,
} from "@/lib/siteContentStorage";
import { HeroSectionForm } from "./SiteManagement/components/HeroSectionForm";
import { FeaturesSectionForm } from "./SiteManagement/components/FeaturesSectionForm";
import { HowItWorksSectionForm } from "./SiteManagement/components/HowItWorksSectionForm";
import { CardTypesSectionForm } from "./SiteManagement/components/CardTypesSectionForm";
import { BenefitsSectionForm } from "./SiteManagement/components/BenefitsSectionForm";
import { PricingSectionForm } from "./SiteManagement/components/PricingSectionForm";
import { IndustriesSectionForm } from "./SiteManagement/components/IndustriesSectionForm";
import { FooterSectionForm } from "./SiteManagement/components/FooterSectionForm";
import { HeaderSectionForm } from "./SiteManagement/components/HeaderSectionForm";

type SectionComponentProps<T> = {
  data: T;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  onChange: (value: T) => void;
};

interface SectionRegistryEntry<T> {
  component: React.ComponentType<SectionComponentProps<T>>;
  select: (content: SiteContent) => T;
  update: (value: T) => void;
}

export function SiteManagementPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [activeLanguage, setActiveLanguage] = useState<Language>("ar");
  const [content, setContent] = useState<SiteContent>(() => getSiteContent("ar"));
  const navigate = useNavigate();
  const { section: sectionParam } = useParams<{ section?: string }>();

  const sectionItems = useMemo(
    () => [
      { value: "hero", label: t("admin.siteManagement.sections.hero") },
      { value: "features", label: t("admin.siteManagement.sections.features") },
      { value: "howItWorks", label: t("admin.siteManagement.sections.howItWorks") },
      { value: "cardTypes", label: t("admin.siteManagement.sections.cardTypes") },
      { value: "benefits", label: t("admin.siteManagement.sections.benefits") },
      { value: "pricing", label: t("admin.siteManagement.sections.pricing") },
      { value: "industries", label: t("admin.siteManagement.sections.industries") },
      { value: "footer", label: t("admin.siteManagement.sections.footer") },
      { value: "header", label: t("admin.siteManagement.sections.header") },
    ],
    [t],
  );
  const languageLabel = activeLanguage === "ar" ? "العربية" : "English";

  useEffect(() => {
    const defaultSectionValue = sectionItems[0]?.value ?? "hero";

    if (!sectionParam) {
      navigate(`/admin/site-management/${defaultSectionValue}`, { replace: true });
      setActiveSection(defaultSectionValue);
      return;
    }

    const matchedSection = sectionItems.find((item) => item.value === sectionParam);

    if (matchedSection) {
      setActiveSection(matchedSection.value);
    } else {
      navigate(`/admin/site-management/${defaultSectionValue}`, { replace: true });
      setActiveSection(defaultSectionValue);
    }
  }, [sectionParam, sectionItems, navigate]);

  const handleLanguageChange = (newLanguage: Language) => {
    saveSiteContent(activeLanguage, content);
    setContent(getSiteContent(newLanguage));
    setActiveLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    const nextLanguage: Language = activeLanguage === "ar" ? "en" : "ar";
    handleLanguageChange(nextLanguage);
  };

  const handleSave = () => {
    try {
      saveSiteContent(activeLanguage, content);
      toast.success(t("common.success"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleReset = () => {
    const defaults = resetToDefault(activeLanguage);
    setContent(defaults);
    toast.success(t("common.success"));
  };

  const updateContent = useCallback(<K extends keyof SiteContent>(section: K, data: SiteContent[K]) => {
    setContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  const handleSaveSection = useCallback(
    (section: keyof SiteContent) => {
      try {
        updateSiteContentSection(activeLanguage, section, content[section]);
        toast.success(t("common.success"));
      } catch (error) {
        toast.error(t("common.error"));
      }
    },
    [activeLanguage, content, t],
  );

  const handleResetSection = useCallback(
    (section: keyof SiteContent) => {
      try {
        const defaults = getDefaultSectionContent(activeLanguage, section);
        updateContent(section, defaults);
        updateSiteContentSection(activeLanguage, section, defaults);
        toast.success(t("common.success"));
      } catch (error) {
        toast.error(t("common.error"));
      }
    },
    [activeLanguage, t, updateContent],
  );

  const sectionRegistry = useMemo<Record<string, SectionRegistryEntry<unknown>>>(
    () =>
      ({
        hero: {
          component: HeroSectionForm,
          select: (data: SiteContent) => data.hero,
          update: (value: HeroContent) => updateContent("hero", value),
        },
        features: {
          component: FeaturesSectionForm,
          select: (data: SiteContent) => data.features,
          update: (value: FeaturesContent) => updateContent("features", value),
        },
        howItWorks: {
          component: HowItWorksSectionForm,
          select: (data: SiteContent) => data.howItWorks,
          update: (value: HowItWorksContent) => updateContent("howItWorks", value),
        },
        cardTypes: {
          component: CardTypesSectionForm,
          select: (data: SiteContent) => data.cardTypes,
          update: (value: CardTypesContent) => updateContent("cardTypes", value),
        },
        benefits: {
          component: BenefitsSectionForm,
          select: (data: SiteContent) => data.benefits,
          update: (value: BenefitsContent) => updateContent("benefits", value),
        },
        pricing: {
          component: PricingSectionForm,
          select: (data: SiteContent) => data.pricing,
          update: (value: PricingContent) => updateContent("pricing", value),
        },
        industries: {
          component: IndustriesSectionForm,
          select: (data: SiteContent) => data.industries,
          update: (value: IndustriesContent) => updateContent("industries", value),
        },
        footer: {
          component: FooterSectionForm,
          select: (data: SiteContent) => data.footer,
          update: (value: FooterContent) => updateContent("footer", value),
        },
        header: {
          component: HeaderSectionForm,
          select: (data: SiteContent) => data.header,
          update: (value: HeaderContent) => updateContent("header", value),
        },
      }),
    [updateContent],
  );

  const isSectionKey = (value: string): value is keyof SiteContent => value in sectionRegistry;
  const currentSectionKey = isSectionKey(activeSection) ? activeSection : "hero";
  const currentSectionLabel =
    sectionItems.find((item) => item.value === currentSectionKey)?.label ?? "";
  const activeEntry = sectionRegistry[currentSectionKey];
  const SectionComponent = activeEntry?.component;
  const sectionData = activeEntry?.select(content);

  return (
    <div
      className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
          {isRTL ? (
            <>
              {t("admin.siteManagement.title")}
              <Globe className="h-6 w-6" />
            </>
          ) : (
            <>
              <Globe className="h-6 w-6" />
              {t("admin.siteManagement.title")}
            </>
          )}
        </h1>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button onClick={toggleLanguage} variant="outline" className="flex items-center">
            {isRTL ? (
              <>
                {languageLabel}
                <Globe className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 ml-2" />
                {languageLabel}
              </>
            )}
          </Button>
          <Button onClick={handleSave} className="flex items-center">
            {isRTL ? (
              <>
                {t("common.save")}
                <Save className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                {t("common.save")}
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex items-center">
            {isRTL ? (
              <>
                {t("common.reset")}
                <RotateCcw className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 ml-2" />
                {t("common.reset")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div
          className={cn(
            "mb-4 flex items-center justify-between gap-3",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}
        >
          <h2 className={`text-lg font-semibold ${isRTL ? "text-right" : "text-left"}`}>
            {currentSectionLabel}
          </h2>
          <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "flex-row")}>
            <Button
              size="sm"
              onClick={() => handleSaveSection(currentSectionKey as keyof SiteContent)}
              className="flex items-center gap-2"
            >
              {isRTL ? (
                <>
                  {t("common.save")}
                  <Save className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("common.save")}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleResetSection(currentSectionKey as keyof SiteContent)}
              className="flex items-center gap-2"
            >
              {isRTL ? (
                <>
                  {t("common.reset")}
                  <RotateCcw className="h-4 w-4" />
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  {t("common.reset")}
                </>
              )}
            </Button>
          </div>
        </div>
        {SectionComponent && sectionData !== undefined ? (
          <SectionComponent
            data={sectionData as unknown}
            isRTL={isRTL}
            t={t}
            onChange={activeEntry.update as (value: unknown) => void}
          />
        ) : null}
      </div>
    </div>
  );
}

