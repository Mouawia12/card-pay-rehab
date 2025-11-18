import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, ArrowLeft, Phone, Mail, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDirection } from "@/hooks/useDirection";
import { PlanConfig } from "@/lib/validations/subscription";

interface LocationState {
  error: string;
  plan: PlanConfig;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export const SubscriptionFailurePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const state = location.state as LocationState;
  
  // If no state data, redirect to pricing
  if (!state?.error || !state?.plan) {
    navigate('/#pricing');
    return null;
  }

  const { error, plan, userInfo } = state;

  const handleTryAgain = () => {
    // Navigate back to subscription page
    navigate(`/subscribe/${plan.id}`);
  };

  const handleContactSupport = () => {
    // In real implementation, this would open a support ticket or contact form
    window.open('mailto:support@bookk.com?subject=Payment Issue&body=Hello, I encountered a payment issue...', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Failure Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-red-600">
              {t('subscription.failure.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('subscription.failure.subtitle')}
            </p>
          </div>

          {/* Error Message */}
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || t('subscription.failure.message')}
            </AlertDescription>
          </Alert>

          {/* Plan Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t('subscription.selectedPlan')}
            </h2>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{t('subscription.planFeatures')}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">
                  {plan.price === 0 ? t('pricing.premium.price') : `${plan.price} ${plan.currency}`}
                </p>
                <p className="text-sm text-muted-foreground">/{plan.period}</p>
              </div>
            </div>
          </Card>

          {/* Common Reasons */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('subscription.failure.commonReasons')}
            </h2>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t('subscription.failure.reason1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t('subscription.failure.reason2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t('subscription.failure.reason3')}</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t('subscription.failure.reason4')}</span>
              </li>
            </ul>
          </Card>

          {/* User Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('subscription.userInfo', 'User Information')}
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('auth.register.fullName')}</p>
                <p className="font-medium">{userInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('auth.register.email')}</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('auth.register.phone')}</p>
                <p className="font-medium">{userInfo.phone}</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              onClick={handleTryAgain}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('subscription.failure.tryAgain')}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleContactSupport}
              className="flex-1"
              size="lg"
            >
              <Phone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('subscription.failure.contactSupport')}
            </Button>
          </div>

          {/* Back to Pricing */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              asChild
            >
              <Link to="/#pricing">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('subscription.failure.backToPricing')}
              </Link>
            </Button>
          </div>

          {/* Support Information */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="font-semibold mb-4">{t('subscription.needHelp', 'Need Help?')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">support@bookk.com</p>
                  <p className="text-xs text-muted-foreground">{t('subscription.emailSupport', 'Email Support')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">+249 111 638 872</p>
                  <p className="text-xs text-muted-foreground">{t('subscription.phoneSupport', 'Phone Support')}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {t('subscription.supportHours', 'Support available 24/7')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
