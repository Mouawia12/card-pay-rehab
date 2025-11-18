import { useTranslation } from "react-i18next";
import {
  Target,
  Users,
  Award,
  Heart,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StatContent = {
  number: string;
  label: string;
  description: string;
};

type ValueContent = {
  title: string;
  description: string;
};

type FeatureContent = {
  title: string;
  description: string;
  benefits: string[];
};

type TeamMemberContent = {
  name: string;
  role: string;
  description: string;
};

type ContactCardContent = {
  title: string;
  value: string;
};

type HeroContent = {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

type MissionContent = {
  badge: string;
  title: string;
  description: string;
  items: string[];
  visionTitle: string;
  visionDescription: string;
};

type ValuesSectionContent = {
  badge: string;
  title: string;
  description: string;
  items: ValueContent[];
};

type ServicesSectionContent = {
  badge: string;
  title: string;
  description: string;
  items: FeatureContent[];
};

type TeamSectionContent = {
  badge: string;
  title: string;
  description: string;
  members: TeamMemberContent[];
};

type CtaContent = {
  title: string;
  description: string;
  primary: string;
  secondary: string;
};

type ContactSectionContent = {
  cards: ContactCardContent[];
};

export const AboutPage = () => {
  const { t } = useTranslation();

  const hero = t("aboutPage.hero", { returnObjects: true }) as HeroContent;
  const statsContent = t("aboutPage.stats", { returnObjects: true }) as StatContent[];
  const mission = t("aboutPage.mission", { returnObjects: true }) as MissionContent;
  const valuesSection = t("aboutPage.values", { returnObjects: true }) as ValuesSectionContent;
  const servicesSection = t("aboutPage.services", { returnObjects: true }) as ServicesSectionContent;
  const teamSection = t("aboutPage.team", { returnObjects: true }) as TeamSectionContent;
  const cta = t("aboutPage.cta", { returnObjects: true }) as CtaContent;
  const contactSection = t("aboutPage.contact", { returnObjects: true }) as ContactSectionContent;

  const statsIcons = [
    <Users className="h-8 w-8" />,
    <Award className="h-8 w-8" />,
    <Globe className="h-8 w-8" />,
    <TrendingUp className="h-8 w-8" />
  ];

  const stats = statsContent.map((stat, index) => ({
    ...stat,
    icon: statsIcons[index] ?? statsIcons[statsIcons.length - 1]
  }));

  const valuesIcons = [
    <Heart className="h-6 w-6" />,
    <Shield className="h-6 w-6" />,
    <Zap className="h-6 w-6" />,
    <Users className="h-6 w-6" />
  ];

  const values = valuesSection.items.map((value, index) => ({
    ...value,
    icon: valuesIcons[index] ?? valuesIcons[valuesIcons.length - 1]
  }));

  const features = servicesSection.items;
  const teamMembers = teamSection.members;

  const contactIcons = [
    <Phone className="h-6 w-6" />,
    <Mail className="h-6 w-6" />,
    <MapPin className="h-6 w-6" />
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {hero.badge}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary px-8 py-3 text-lg">
                {hero.primaryCta}
              </Button>
              <Button variant="outline" className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary/10">
                {hero.secondaryCta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </h3>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {mission.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {mission.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {mission.description}
              </p>
              <div className="space-y-4">
                {mission.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <p className="text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {mission.visionTitle}
                  </h3>
                  <p className="text-muted-foreground">
                    {mission.visionDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {valuesSection.badge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {valuesSection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {valuesSection.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {servicesSection.badge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {servicesSection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {servicesSection.description}
            </p>
          </div>
          
          <div className="space-y-12">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-10 w-10 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {teamSection.badge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {teamSection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {teamSection.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              className="px-8 py-3 text-lg bg-white text-primary hover:bg-white/90"
            >
              {cta.primary}
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-3 text-lg border-white text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4 mr-2" />
              {cta.secondary}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactSection.cards.map((card, index) => (
              <Card key={index} className="text-center border-border">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {contactIcons[index] ?? contactIcons[contactIcons.length - 1]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {card.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
