import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, Download, ArrowRight, Calendar, CreditCard, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/hooks/useDirection";
import { PaymentData, PlanConfig } from "@/lib/validations/subscription";

interface LocationState {
  paymentData: PaymentData;
  plan: PlanConfig;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export const SubscriptionSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const state = location.state as LocationState;
  
  // If no state data, redirect to pricing
  if (!state?.paymentData || !state?.plan) {
    navigate('/#pricing');
    return null;
  }

  const { paymentData, plan, userInfo } = state;
  
  // Calculate subscription dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadInvoice = () => {
    // In real implementation, this would generate and download a PDF invoice
    console.log('Downloading invoice for payment:', paymentData);
    // For now, just show a success message
    alert(t('subscription.success.downloadInvoice') + ' - ' + t('common.success'));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-green-600">
              {t('subscription.success.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('subscription.success.subtitle')}
            </p>
          </div>

          {/* Success Message */}
          <Card className="p-6 mb-6">
            <div className="text-center">
              <p className="text-lg mb-4">
                {t('subscription.success.message')}
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {plan.name}
              </Badge>
            </div>
          </Card>

          {/* Subscription Details */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('subscription.success.subscriptionDetails')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('subscription.success.planName')}</p>
                  <p className="font-medium">{plan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('subscription.success.startDate')}</p>
                  <p className="font-medium">{formatDate(startDate)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('subscription.success.endDate')}</p>
                  <p className="font-medium">{formatDate(endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('subscription.success.amount')}</p>
                  <p className="font-medium text-primary text-lg">
                    {paymentData.amount} {paymentData.currency}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t('subscription.paymentDetails')}
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('subscription.paymentMethod')}</p>
                <p className="font-medium capitalize">{paymentData.paymentMethod}</p>
              </div>
              {paymentData.metadata?.cardLast4 && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('subscription.cardNumber')}</p>
                  <p className="font-medium">**** **** **** {paymentData.metadata.cardLast4}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t('subscription.transactionId', 'Transaction ID')}</p>
                <p className="font-medium font-mono text-sm">{paymentData.cardToken}</p>
              </div>
            </div>
          </Card>

          {/* User Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              className="flex-1"
              size="lg"
            >
              <Link to="/dashboard">
                {t('subscription.success.goToDashboard')}
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownloadInvoice}
              className="flex-1"
              size="lg"
            >
              <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('subscription.success.downloadInvoice')}
            </Button>
          </div>

          {/* Additional Information */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="font-semibold mb-2">{t('subscription.nextSteps', 'Next Steps')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t('subscription.nextStep1', 'You will receive a confirmation email shortly')}</li>
              <li>• {t('subscription.nextStep2', 'Access your dashboard to start using the features')}</li>
              <li>• {t('subscription.nextStep3', 'Contact support if you need any assistance')}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
