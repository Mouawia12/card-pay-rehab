import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// SEO Configuration - يمكن ربطها بقاعدة البيانات لاحقاً
const seoConfig = {
  site: {
    name: "Rehabsa",
    url: "https://rehabsa.com",
    logo: "https://rehabsa.com/logo.png",
    description: "منصة شاملة لإدارة المتاجر والمشاريع التجارية مع حلول متقدمة للعملاء والموظفين",
    descriptionEn: "Comprehensive platform for managing stores and business projects with advanced solutions for customers and employees",
    keywords: "إدارة متاجر, نقاط البيع, عملاء, موظفين, تقنية, POS, store management",
    keywordsEn: "store management, POS, customers, employees, technology, business solutions",
    author: "Rehabsa Team",
    language: "ar",
    locale: "ar_SA",
    timezone: "Asia/Riyadh"
  },
  social: {
    facebook: "https://facebook.com/rehabsa",
    twitter: "https://twitter.com/rehabsa",
    linkedin: "https://linkedin.com/company/rehabsa",
    instagram: "https://instagram.com/rehabsa",
    youtube: "https://youtube.com/rehabsa"
  },
  contact: {
    email: "info@rehabsa.com",
    phone: "+966501234567",
    address: "الرياض، المملكة العربية السعودية"
  },
  analytics: {
    googleAnalytics: "GA-XXXXXXXXX",
    googleTagManager: "GTM-XXXXXXX",
    facebookPixel: ""
  }
};

interface SEOProps {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  keywords?: string;
  keywordsEn?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
  alternateHreflang?: { hreflang: string; href: string }[];
  structuredData?: any;
}

export function SEO({
  title,
  titleEn,
  description,
  descriptionEn,
  keywords,
  keywordsEn,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  canonical,
  alternateHreflang,
  structuredData
}: SEOProps) {
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";
  
  // تحديد العنوان والوصف والكلمات المفتاحية حسب اللغة
  const finalTitle = isArabic ? (title || seoConfig.site.name) : (titleEn || title || seoConfig.site.name);
  const finalDescription = isArabic ? (description || seoConfig.site.description) : (descriptionEn || description || seoConfig.site.descriptionEn);
  const finalKeywords = isArabic ? (keywords || seoConfig.site.keywords) : (keywordsEn || keywords || seoConfig.site.keywordsEn);
  
  // URL الكامل
  const fullUrl = url ? `${seoConfig.site.url}${url}` : seoConfig.site.url;
  
  // صورة افتراضية
  const defaultImage = image || `${seoConfig.site.url}/og-image.jpg`;
  
  // Structured Data افتراضي
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seoConfig.site.name,
    "url": seoConfig.site.url,
    "logo": seoConfig.site.logo,
    "description": isArabic ? seoConfig.site.description : seoConfig.site.descriptionEn,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": seoConfig.contact.phone,
      "contactType": "customer service",
      "email": seoConfig.contact.email
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "الرياض",
      "addressRegion": "منطقة الرياض",
      "addressCountry": "SA"
    },
    "sameAs": Object.values(seoConfig.social)
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author || seoConfig.site.author} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="language" content={currentLanguage} />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Alternate Language Links */}
      {alternateHreflang && alternateHreflang.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={seoConfig.site.name} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={isArabic ? "ar_SA" : "en_US"} />
      
      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rehabsa" />
      <meta name="twitter:creator" content="@rehabsa" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={defaultImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoConfig.site.name} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Google Analytics */}
      {seoConfig.analytics.googleAnalytics && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${seoConfig.analytics.googleAnalytics}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoConfig.analytics.googleAnalytics}', {
                page_title: '${finalTitle}',
                page_location: '${fullUrl}',
                custom_map: {
                  'custom_parameter_1': '${currentLanguage}'
                }
              });
            `}
          </script>
        </>
      )}
      
      {/* Google Tag Manager */}
      {seoConfig.analytics.googleTagManager && (
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${seoConfig.analytics.googleTagManager}');
            `}
          </script>
        </>
      )}
    </Helmet>
  );
}

// مكون مساعد لإنشاء Structured Data للمقالات
export function ArticleStructuredData({
  title,
  titleEn,
  description,
  descriptionEn,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  section,
  tags
}: {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
  section?: string;
  tags?: string[];
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": isArabic ? title : (titleEn || title),
    "description": isArabic ? description : (descriptionEn || description),
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": seoConfig.site.name,
      "logo": {
        "@type": "ImageObject",
        "url": seoConfig.site.logo
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "image": image || `${seoConfig.site.url}/og-image.jpg`,
    "url": `${seoConfig.site.url}${url}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${seoConfig.site.url}${url}`
    },
    "articleSection": section,
    "keywords": tags?.join(", ")
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}

// مكون مساعد لإنشاء Structured Data للمنتجات
export function ProductStructuredData({
  name,
  nameEn,
  description,
  descriptionEn,
  image,
  price,
  currency = "SAR",
  availability = "InStock",
  brand = seoConfig.site.name,
  sku,
  url
}: {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
  sku?: string;
  url: string;
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": isArabic ? name : (nameEn || name),
    "description": isArabic ? description : (descriptionEn || description),
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "url": `${seoConfig.site.url}${url}`
    },
    "sku": sku,
    "url": `${seoConfig.site.url}${url}`
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}

// مكون مساعد لإنشاء Structured Data للمتاجر
export function StoreStructuredData({
  name,
  nameEn,
  description,
  descriptionEn,
  address,
  phone,
  email,
  hours,
  image,
  url
}: {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  address: string;
  phone: string;
  email: string;
  hours?: string;
  image?: string;
  url: string;
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": isArabic ? name : (nameEn || name),
    "description": isArabic ? description : (descriptionEn || description),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressCountry": "SA"
    },
    "telephone": phone,
    "email": email,
    "openingHours": hours,
    "image": image || `${seoConfig.site.url}/store-default.jpg`,
    "url": `${seoConfig.site.url}${url}`
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}

export default SEO;
