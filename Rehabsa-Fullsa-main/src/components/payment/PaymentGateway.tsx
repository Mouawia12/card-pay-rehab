import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDirection } from "@/hooks/useDirection";
import { PaymentData, PLAN_CONFIG } from "@/lib/validations/subscription";

interface PaymentGatewayProps {
  planId: 'basic' | 'advanced' | 'premium';
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: PaymentData) => void;
  onPaymentFailure: (error: string) => void;
  isLoading?: boolean;
}

export const PaymentGateway = ({
  planId,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentFailure,
  isLoading = false
}: PaymentGatewayProps) => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = t('subscription.cardNumber') + ' ' + t('common.error');
    }

    // Expiry date validation
    if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = t('subscription.expiryDate') + ' ' + t('common.error');
    }

    // CVV validation
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = t('subscription.cvv') + ' ' + t('common.error');
    }

    // Cardholder name validation
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = t('subscription.cardholderName') + ' ' + t('common.error');
    }

    // Billing address validation
    if (!formData.billingAddress || formData.billingAddress.length < 10) {
      newErrors.billingAddress = t('subscription.billingAddress') + ' ' + t('common.error');
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('subscription.agreeTerms') + ' ' + t('common.error');
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = t('subscription.privacyPolicy') + ' ' + t('common.error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!validateForm()) {
      toast.error(t('subscription.paymentDetails') + ' ' + t('common.error'));
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing with Moyasar/Tap Payments/Paymob
      // In real implementation, you would integrate with the actual payment gateway
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment
      const paymentData: PaymentData = {
        amount,
        currency,
        planId,
        userId: 'current-user-id', // This would come from auth context
        paymentMethod: 'card',
        cardToken: 'token_' + Date.now(), // This would come from payment gateway
        metadata: {
          cardLast4: formData.cardNumber.slice(-4),
          cardholderName: formData.cardholderName,
          billingAddress: formData.billingAddress
        }
      };

      onPaymentSuccess(paymentData);
      toast.success(t('subscription.success.title'));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('subscription.failure.message');
      onPaymentFailure(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const plan = PLAN_CONFIG[planId];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">{t('subscription.paymentDetails')}</h3>
      </div>

      {/* Plan Summary */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">{t(plan.nameKey)}</h4>
            <p className="text-sm text-muted-foreground">{t('subscription.planFeatures')}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {amount} {currency}
            </p>
            <p className="text-sm text-muted-foreground">/{plan.period}</p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber">{t('subscription.cardNumber')}</Label>
          <div className="relative">
            <CreditCard className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              id="cardNumber"
              type="text"
              placeholder={t('subscription.cardNumberPlaceholder')}
              className={isRTL ? 'pr-10' : 'pl-10'}
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-sm text-destructive">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">{t('subscription.expiryDate')}</Label>
            <Input
              id="expiryDate"
              type="text"
              placeholder={t('subscription.expiryDatePlaceholder')}
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className="text-sm text-destructive">{errors.expiryDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">{t('subscription.cvv')}</Label>
            <Input
              id="cvv"
              type="text"
              placeholder={t('subscription.cvvPlaceholder')}
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-sm text-destructive">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholderName">{t('subscription.cardholderName')}</Label>
          <Input
            id="cardholderName"
            type="text"
            placeholder={t('subscription.cardholderNamePlaceholder')}
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          />
          {errors.cardholderName && (
            <p className="text-sm text-destructive">{errors.cardholderName}</p>
          )}
        </div>

        {/* Billing Address */}
        <div className="space-y-2">
          <Label htmlFor="billingAddress">{t('subscription.billingAddress')}</Label>
          <Input
            id="billingAddress"
            type="text"
            placeholder={t('subscription.billingAddressPlaceholder')}
            value={formData.billingAddress}
            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
          />
          {errors.billingAddress && (
            <p className="text-sm text-destructive">{errors.billingAddress}</p>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          {t('subscription.securityNotice', 'Your payment information is encrypted and secure. We do not store your card details.')}
        </AlertDescription>
      </Alert>

      {/* Terms Agreement */}
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={formData.agreeTerms}
            onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
            className="mt-1"
          />
          <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
            {t('subscription.agreeTerms')}{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">
              {t('subscription.termsAndConditions')}
            </a>
          </Label>
        </div>
        {errors.agreeTerms && (
          <p className="text-sm text-destructive">{errors.agreeTerms}</p>
        )}

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
            className="mt-1"
          />
          <Label htmlFor="agreePrivacy" className="text-sm leading-relaxed">
            {t('subscription.agreeTerms')}{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              {t('subscription.privacyPolicy')}
            </a>
          </Label>
        </div>
        {errors.agreePrivacy && (
          <p className="text-sm text-destructive">{errors.agreePrivacy}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={processPayment}
        disabled={isProcessing || isLoading}
        className="w-full btn-primary"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {t('subscription.processing')}
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            {t('subscription.confirmSubscription')}
          </>
        )}
      </Button>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {t('subscription.acceptedCards', 'We accept all major credit cards')}
        </p>
        <div className="flex justify-center space-x-2">
          <div className="bg-muted px-3 py-1 rounded text-xs font-medium">Visa</div>
          <div className="bg-muted px-3 py-1 rounded text-xs font-medium">Mastercard</div>
          <div className="bg-muted px-3 py-1 rounded text-xs font-medium">Mada</div>
        </div>
      </div>
    </Card>
  );
};
