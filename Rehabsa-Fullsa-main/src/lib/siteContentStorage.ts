// Site Content Storage Service
// Handles saving and loading site content from localStorage

import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';

export type Language = 'ar' | 'en';

// Type definitions for site content
export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
  requestDemo: string;
}

export interface FeatureItem {
  key: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: string;
  items: FeatureItem[];
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  subtitle: string;
  title: string;
  steps: Step[];
  imageAlt: string;
}

export interface CardType {
  id: string;
  title: string;
  name: string;
  description: string;
}

export interface CardTypesContent {
  title: string;
  types: CardType[];
}

export interface BenefitItem {
  key: string;
  title: string;
  description: string;
}

export interface BenefitsContent {
  title: string;
  items: BenefitItem[];
}

export interface PricingFeature {
  key: string;
  text: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  period: string;
  price: string;
  features: PricingFeature[];
  featured?: boolean;
}

export interface PricingContent {
  title: string;
  subtitle: string;
  mostPopular: string;
  getStarted: string;
  contactUs: string;
  plans: PricingPlan[];
}

export interface IndustryItem {
  key: string;
  name: string;
}

export interface IndustriesContent {
  subtitle: string;
  title: string;
  contactButton: string;
  items: IndustryItem[];
}

export interface FooterSocialLink {
  key: string;
  label: string;
  url: string;
}

export interface FooterContent {
  description: string;
  quickLinks: string;
  contactUs: string;
  followUs: string;
  copyright: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: FooterSocialLink[];
}

export interface HeaderContent {
  logo: string;
  requestDemo: string;
  language: string;
}

export interface SiteContent {
  hero: HeroContent;
  features: FeaturesContent;
  howItWorks: HowItWorksContent;
  cardTypes: CardTypesContent;
  benefits: BenefitsContent;
  pricing: PricingContent;
  industries: IndustriesContent;
  footer: FooterContent;
  header: HeaderContent;
}

const STORAGE_KEY_AR = 'site_content_ar';
const STORAGE_KEY_EN = 'site_content_en';

// Helper function to get default content from translation files
const getDefaultContent = (language: Language): SiteContent => {
  const translations = language === 'ar' ? arTranslations : enTranslations;

  // Extract Hero content
  const hero: HeroContent = {
    title: translations.hero?.title || '',
    subtitle: translations.hero?.subtitle || '',
    cta: translations.hero?.cta || '',
    requestDemo: translations.hero?.requestDemo || '',
  };

  // Extract Features content
  const features: FeaturesContent = {
    title: translations.features?.title || '',
    items: [
      {
        key: 'mobileCompatible',
        title: translations.features?.mobileCompatible?.title || '',
        description: translations.features?.mobileCompatible?.description || '',
      },
      {
        key: 'realTimeUpdates',
        title: translations.features?.realTimeUpdates?.title || '',
        description: translations.features?.realTimeUpdates?.description || '',
      },
      {
        key: 'easySetup',
        title: translations.features?.easySetup?.title || '',
        description: translations.features?.easySetup?.description || '',
      },
      {
        key: 'varietyCards',
        title: translations.features?.varietyCards?.title || '',
        description: translations.features?.varietyCards?.description || '',
      },
      {
        key: 'analytics',
        title: translations.features?.analytics?.title || '',
        description: translations.features?.analytics?.description || '',
      },
      {
        key: 'notifications',
        title: translations.features?.notifications?.title || '',
        description: translations.features?.notifications?.description || '',
      },
    ],
  };

  // Extract How It Works content
  const howItWorks: HowItWorksContent = {
    subtitle: translations.howItWorks?.subtitle || '',
    title: translations.howItWorks?.title || '',
    steps: [
      {
        number: '01',
        title: translations.howItWorks?.step1Title || '',
        description: translations.howItWorks?.step1Description || '',
      },
      {
        number: '02',
        title: translations.howItWorks?.step2Title || '',
        description: translations.howItWorks?.step2Description || '',
      },
      {
        number: '03',
        title: translations.howItWorks?.step3Title || '',
        description: translations.howItWorks?.step3Description || '',
      },
    ],
    imageAlt: translations.howItWorks?.imageAlt || '',
  };

  // Extract Card Types content
  const cardTypes: CardTypesContent = {
    title: translations.cardTypes?.title || '',
    types: [
      {
        id: 'stamps',
        title: translations.cardTypes?.stamps?.title || '',
        name: translations.cardTypes?.stamps?.name || '',
        description: translations.cardTypes?.stamps?.description || '',
      },
      {
        id: 'points',
        title: translations.cardTypes?.points?.title || '',
        name: translations.cardTypes?.points?.name || '',
        description: translations.cardTypes?.points?.description || '',
      },
      {
        id: 'cashback',
        title: translations.cardTypes?.cashback?.title || '',
        name: translations.cardTypes?.cashback?.name || '',
        description: translations.cardTypes?.cashback?.description || '',
      },
      {
        id: 'subscription',
        title: translations.cardTypes?.subscription?.title || '',
        name: translations.cardTypes?.subscription?.name || '',
        description: translations.cardTypes?.subscription?.description || '',
      },
      {
        id: 'discount',
        title: translations.cardTypes?.discount?.title || '',
        name: translations.cardTypes?.discount?.name || '',
        description: translations.cardTypes?.discount?.description || '',
      },
      {
        id: 'gift',
        title: translations.cardTypes?.gift?.title || '',
        name: translations.cardTypes?.gift?.name || '',
        description: translations.cardTypes?.gift?.description || '',
      },
      {
        id: 'membership',
        title: translations.cardTypes?.membership?.title || '',
        name: translations.cardTypes?.membership?.name || '',
        description: translations.cardTypes?.membership?.description || '',
      },
    ],
  };

  // Extract Benefits content
  const benefits: BenefitsContent = {
    title: translations.benefits?.title || '',
    items: [
      {
        key: 'customerRetention',
        title: translations.benefits?.customerRetention?.title || '',
        description: translations.benefits?.customerRetention?.description || '',
      },
      {
        key: 'increaseSales',
        title: translations.benefits?.increaseSales?.title || '',
        description: translations.benefits?.increaseSales?.description || '',
      },
      {
        key: 'improveExperience',
        title: translations.benefits?.improveExperience?.title || '',
        description: translations.benefits?.improveExperience?.description || '',
      },
      {
        key: 'saveTimeMoney',
        title: translations.benefits?.saveTimeMoney?.title || '',
        description: translations.benefits?.saveTimeMoney?.description || '',
      },
      {
        key: 'directCommunication',
        title: translations.benefits?.directCommunication?.title || '',
        description: translations.benefits?.directCommunication?.description || '',
      },
    ],
  };

  // Extract Pricing content
  const pricing: PricingContent = {
    title: translations.pricing?.title || '',
    subtitle: translations.pricing?.subtitle || '',
    mostPopular: translations.pricing?.mostPopular || '',
    getStarted: translations.pricing?.getStarted || '',
    contactUs: translations.pricing?.contactUs || '',
    plans: [
      {
        id: 'basic',
        name: translations.pricing?.basic?.name || '',
        period: translations.pricing?.basic?.period || '',
        price: '1000',
        featured: false,
        features: [
          { key: 'cardTypes', text: translations.pricing?.basic?.features?.cardTypes || '' },
          { key: 'managers', text: translations.pricing?.basic?.features?.managers || '' },
          { key: 'branches', text: translations.pricing?.basic?.features?.branches || '' },
          { key: 'unlimitedCards', text: translations.pricing?.basic?.features?.unlimitedCards || '' },
          { key: 'unlimitedNotifications', text: translations.pricing?.basic?.features?.unlimitedNotifications || '' },
          { key: 'welcomeFeature', text: translations.pricing?.basic?.features?.welcomeFeature || '' },
          { key: 'support', text: translations.pricing?.basic?.features?.support || '' },
        ],
      },
      {
        id: 'advanced',
        name: translations.pricing?.advanced?.name || '',
        period: translations.pricing?.advanced?.period || '',
        price: '2000',
        featured: true,
        features: [
          { key: 'cardTypes', text: translations.pricing?.advanced?.features?.cardTypes || '' },
          { key: 'managers', text: translations.pricing?.advanced?.features?.managers || '' },
          { key: 'branches', text: translations.pricing?.advanced?.features?.branches || '' },
          { key: 'unlimitedCards', text: translations.pricing?.advanced?.features?.unlimitedCards || '' },
          { key: 'unlimitedNotifications', text: translations.pricing?.advanced?.features?.unlimitedNotifications || '' },
          { key: 'welcomeFeature', text: translations.pricing?.advanced?.features?.welcomeFeature || '' },
          { key: 'support', text: translations.pricing?.advanced?.features?.support || '' },
        ],
      },
      {
        id: 'premium',
        name: translations.pricing?.premium?.name || '',
        period: '',
        price: translations.pricing?.premium?.price || '',
        featured: false,
        features: [
          { key: 'cardTypes', text: translations.pricing?.premium?.features?.cardTypes || '' },
          { key: 'managers', text: translations.pricing?.premium?.features?.managers || '' },
          { key: 'branches', text: translations.pricing?.premium?.features?.branches || '' },
          { key: 'unlimitedCards', text: translations.pricing?.premium?.features?.unlimitedCards || '' },
          { key: 'unlimitedNotifications', text: translations.pricing?.premium?.features?.unlimitedNotifications || '' },
          { key: 'welcomeFeature', text: translations.pricing?.premium?.features?.welcomeFeature || '' },
          { key: 'support', text: translations.pricing?.premium?.features?.support || '' },
        ],
      },
    ],
  };

  // Extract Industries content
  const industries: IndustriesContent = {
    subtitle: translations.industries?.subtitle || '',
    title: translations.industries?.title || '',
    contactButton: translations.industries?.contactButton || '',
    items: [
      { key: 'carWash', name: translations.industries?.carWash || '' },
      { key: 'cafes', name: translations.industries?.cafes || '' },
      { key: 'massageCenters', name: translations.industries?.massageCenters || '' },
      { key: 'beautyCenters', name: translations.industries?.beautyCenters || '' },
      { key: 'restaurants', name: translations.industries?.restaurants || '' },
      { key: 'healthClinics', name: translations.industries?.healthClinics || '' },
      { key: 'hairSalons', name: translations.industries?.hairSalons || '' },
      { key: 'gyms', name: translations.industries?.gyms || '' },
      { key: 'retailStores', name: translations.industries?.retailStores || '' },
      { key: 'more', name: translations.industries?.more || '' },
    ],
  };

  // Extract Footer content
  const footer: FooterContent = {
    description: translations.footer?.description || '',
    quickLinks: translations.footer?.quickLinks || '',
    contactUs: translations.footer?.contactUs || '',
    followUs: translations.footer?.followUs || '',
    copyright: translations.footer?.copyright || '',
    privacyPolicy: translations.footer?.privacyPolicy || '',
    termsOfService: translations.footer?.termsOfService || '',
    cookiePolicy: translations.footer?.cookiePolicy || '',
    phone: translations.footer?.phone || '',
    email: translations.footer?.email || '',
    address: translations.footer?.address || '',
    socialLinks: [
      {
        key: 'twitter',
        label: translations.footer?.twitter || 'Twitter',
        url: 'https://twitter.com/',
      },
      {
        key: 'linkedin',
        label: translations.footer?.linkedin || 'LinkedIn',
        url: 'https://linkedin.com/',
      },
      {
        key: 'instagram',
        label: translations.footer?.instagram || 'Instagram',
        url: 'https://instagram.com/',
      },
    ],
  };

  // Extract Header content
  const header: HeaderContent = {
    logo: translations.header?.logo || '',
    requestDemo: translations.header?.requestDemo || '',
    language: translations.header?.language || '',
  };

  return {
    hero,
    features,
    howItWorks,
    cardTypes,
    benefits,
    pricing,
    industries,
    footer,
    header,
  };
};

// Get site content for a specific language
export const getSiteContent = (language: Language): SiteContent => {
  const storageKey = language === 'ar' ? STORAGE_KEY_AR : STORAGE_KEY_EN;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      const defaults = getDefaultContent(language);
      return {
        hero: { ...defaults.hero, ...parsed.hero },
        features: {
          ...defaults.features,
          ...parsed.features,
          items: parsed.features?.items || defaults.features.items,
        },
        howItWorks: {
          ...defaults.howItWorks,
          ...parsed.howItWorks,
          steps: parsed.howItWorks?.steps || defaults.howItWorks.steps,
        },
        cardTypes: {
          ...defaults.cardTypes,
          ...parsed.cardTypes,
          types: parsed.cardTypes?.types || defaults.cardTypes.types,
        },
        benefits: {
          ...defaults.benefits,
          ...parsed.benefits,
          items: parsed.benefits?.items || defaults.benefits.items,
        },
        pricing: {
          ...defaults.pricing,
          ...parsed.pricing,
          plans: parsed.pricing?.plans || defaults.pricing.plans,
        },
        industries: {
          ...defaults.industries,
          ...parsed.industries,
          items: parsed.industries?.items || defaults.industries.items,
        },
        footer: {
          ...defaults.footer,
          ...parsed.footer,
          socialLinks: defaults.footer.socialLinks.map((defaultLink, index) => {
            const parsedLinks = parsed.footer?.socialLinks;
            if (Array.isArray(parsedLinks)) {
              const matchingByKey = parsedLinks.find((link: FooterSocialLink) => link?.key === defaultLink.key);
              const fallbackLink = matchingByKey ?? parsedLinks[index];
              return {
                ...defaultLink,
                ...fallbackLink,
              };
            }
            return defaultLink;
          }),
        },
        header: { ...defaults.header, ...parsed.header },
      };
    }
  } catch (error) {
    console.error(`Error loading site content for ${language}:`, error);
  }
  
  return getDefaultContent(language);
};

// Save site content for a specific language
export const saveSiteContent = (language: Language, content: SiteContent): void => {
  const storageKey = language === 'ar' ? STORAGE_KEY_AR : STORAGE_KEY_EN;
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(content));
  } catch (error) {
    console.error(`Error saving site content for ${language}:`, error);
    throw error;
  }
};

// Reset site content to defaults for a specific language
export const resetToDefault = (language: Language): SiteContent => {
  const defaults = getDefaultContent(language);
  saveSiteContent(language, defaults);
  return defaults;
};

// Get default content for a specific section
export const getDefaultSectionContent = <K extends keyof SiteContent>(
  language: Language,
  section: K,
): SiteContent[K] => {
  const defaults = getDefaultContent(language);
  return defaults[section];
};

// Get all site content (both languages)
export const getAllContent = (): { ar: SiteContent; en: SiteContent } => {
  return {
    ar: getSiteContent('ar'),
    en: getSiteContent('en'),
  };
};

// Update a specific section of site content
export const updateSiteContentSection = <K extends keyof SiteContent>(
  language: Language,
  section: K,
  data: SiteContent[K]
): void => {
  const currentContent = getSiteContent(language);
  const updatedContent = {
    ...currentContent,
    [section]: data,
  };
  saveSiteContent(language, updatedContent);
};

