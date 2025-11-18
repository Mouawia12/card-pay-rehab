import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, Users, Shield, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export const TermsOfService = () => {
  const { t } = useTranslation();
  const { getLogo } = useTheme();

  const sections = [
    {
      icon: FileText,
      title: t('termsOfService.sections.acceptance.title'),
      content: t('termsOfService.sections.acceptance.content')
    },
    {
      icon: Users,
      title: t('termsOfService.sections.userAccounts.title'),
      content: t('termsOfService.sections.userAccounts.content')
    },
    {
      icon: Shield,
      title: t('termsOfService.sections.acceptableUse.title'),
      content: t('termsOfService.sections.acceptableUse.content')
    },
    {
      icon: Scale,
      title: t('termsOfService.sections.intellectualProperty.title'),
      content: t('termsOfService.sections.intellectualProperty.content')
    },
    {
      icon: AlertTriangle,
      title: t('termsOfService.sections.liability.title'),
      content: t('termsOfService.sections.liability.content')
    },
    {
      icon: Phone,
      title: t('termsOfService.sections.contact.title'),
      content: t('termsOfService.sections.contact.content')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <img 
                src={getLogo('website')} 
                alt={t('header.logo')} 
                className="h-16 w-auto"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('termsOfService.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('termsOfService.subtitle')}
            </p>
            
            <div className="text-sm text-muted-foreground">
              {t('termsOfService.lastUpdated')}: {t('termsOfService.updateDate')}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-2 hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-inverse" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                  <AlertTriangle className="h-8 w-8" />
                  {t('termsOfService.importantNotice.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  {t('termsOfService.importantNotice.content').split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {t('termsOfService.cta.title')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('termsOfService.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@bookk.com"
                className="btn-primary rounded-full px-8 py-3 text-center"
              >
                {t('termsOfService.cta.emailButton')}
              </a>
              <a 
                href="tel:+249111638872"
                className="btn-secondary rounded-full px-8 py-3 text-center"
              >
                {t('termsOfService.cta.phoneButton')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
