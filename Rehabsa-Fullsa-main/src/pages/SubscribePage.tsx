import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle, AlertCircle, User, Mail, Phone, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentGateway } from "@/components/payment/PaymentGateway";
import { useDirection } from "@/hooks/useDirection";
import { PLAN_CONFIG, PaymentData } from "@/lib/validations/subscription";
import { toast } from "sonner";

export const SubscribePage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Check if planId is valid
  const validPlanIds = ['basic', 'advanced', 'premium'] as const;
  const currentPlanId = planId as typeof validPlanIds[number];
  
  if (!planId || !validPlanIds.includes(currentPlanId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('subscription.invalidPlan', 'Invalid Plan')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('subscription.invalidPlanMessage', 'The selected plan is not available.')}
            </p>
            <Button asChild>
              <Link to="/#pricing">{t('subscription.backToPricing')}</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const plan = PLAN_CONFIG[currentPlanId];

  // Mock coupons data - في التطبيق الحقيقي، سيتم جلبها من API
  const availableCoupons = [
    {
      id: "coupon-1",
      code: "SAVE20",
      type: "percentage",
      value: 20,
      minPurchase: 100,
      status: "نشط",
      planId: "all", // أو "plan-1", "plan-2", etc.
      startDate: "2024-01-01",
      endDate: "2025-12-31",
    },
    {
      id: "coupon-2",
      code: "WELCOME50",
      type: "fixed",
      value: 50,
      minPurchase: 200,
      status: "نشط",
      planId: "all",
      startDate: "2024-06-01",
      endDate: "2025-06-01",
    },
    {
      id: "coupon-3",
      code: "SUMMER30",
      type: "percentage",
      value: 30,
      minPurchase: 150,
      status: "نشط",
      planId: "all",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
    },
    {
      id: "coupon-4",
      code: "DISCOUNT30",
      type: "fixed",
      value: 30,
      minPurchase: 0,
      status: "نشط",
      planId: "all",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
    },
  ];

  const planMapping: Record<string, string> = {
    basic: "plan-1",
    advanced: "plan-2",
    premium: "plan-3",
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error(t('subscription.couponCodeRequired', 'يرجى إدخال كود الكوبون'));
      return;
    }

    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase().trim()
    );

    if (!coupon) {
      toast.error(t('subscription.invalidCoupon', 'كود الكوبون غير صحيح'));
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    // التحقق من حالة الكوبون
    if (coupon.status !== "نشط") {
      toast.error(t('subscription.couponNotActive', 'الكوبون غير نشط'));
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    // التحقق من تاريخ الكوبون
    const today = new Date().toISOString().split('T')[0];
    if (coupon.startDate > today || coupon.endDate < today) {
      toast.error(t('subscription.couponExpired', 'الكوبون منتهي الصلاحية'));
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    // التحقق من الباقة
    const currentPlanIdMapped = planMapping[currentPlanId];
    if (coupon.planId !== "all" && coupon.planId !== currentPlanIdMapped) {
      toast.error(t('subscription.couponNotApplicable', 'الكوبون غير قابل للتطبيق على هذه الباقة'));
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    // التحقق من الحد الأدنى للشراء
    if (plan.price < coupon.minPurchase) {
      toast.error(
        t('subscription.minPurchaseRequired', { amount: coupon.minPurchase, currency: plan.currency })
      );
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    // حساب الخصم
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (plan.price * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // التأكد من أن الخصم لا يتجاوز السعر الأصلي
    discount = Math.min(discount, plan.price);

    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
    toast.success(t('subscription.couponApplied', 'تم تطبيق الكوبون بنجاح!'));
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.info(t('subscription.couponRemoved', 'تم إزالة الكوبون'));
  };

  const finalPrice = plan.price - discountAmount;

  useEffect(() => {
    // Simulate authentication check
    // In real implementation, this would check JWT token or session
    const checkAuthentication = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call to check authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll simulate a logged-in user
        // In real implementation, you would check actual authentication state
        const mockUser = {
          fullName: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+966501234567'
        };
        
        setIsAuthenticated(true);
        setUserInfo(mockUser);
        
      } catch {
        setIsAuthenticated(false);
        // Redirect to login with return URL
        const currentUrl = `/subscribe/${planId}`;
        navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [planId, navigate]);

  const handlePaymentSuccess = (paymentData: PaymentData) => {
    // In real implementation, you would save the subscription data
    console.log('Payment successful:', paymentData);
    
    // Redirect to success page with payment data
    navigate('/subscription/success', {
      state: {
        paymentData,
        plan: plan,
        userInfo
      }
    });
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    
    // Redirect to failure page with error
    navigate('/subscription/failure', {
      state: {
        error,
        plan: plan,
        userInfo
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <User className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('subscription.loginRequired')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('subscription.loginRequiredMessage')}
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to={`/login?redirect=${encodeURIComponent(`/subscribe/${planId}`)}`}>
                  {t('subscription.loginNow')}
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/#pricing">{t('subscription.backToPricing')}</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/#pricing')}
            className={`mb-4 ${isRTL ? 'ml-auto' : 'mr-auto'}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('subscription.backToPricing')}
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('subscription.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('subscription.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                {t('subscription.selectedPlan')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">{t(plan.nameKey)}</h3>
                  <div className={`text-right ${isRTL ? 'text-left' : 'text-right'}`}>
                    {discountAmount > 0 ? (
                      <div>
                        <p className="text-lg line-through text-muted-foreground">
                          {plan.price} {plan.currency}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {finalPrice} {plan.currency}
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-primary">
                        {plan.price === 0 ? t('pricing.premium.price') : `${plan.price} ${plan.currency}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">/{plan.period}</p>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="couponCode" className={isRTL ? 'text-left font-arabic' : 'text-left'}>
                    {t('subscription.couponCode', 'كود الكوبون')}
                  </Label>
                  {!appliedCoupon ? (
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={t('subscription.couponCodePlaceholder', 'أدخل كود الكوبون')}
                        className={isRTL ? 'text-right font-arabic' : 'text-left'}
                        dir={isRTL ? "ltr" : "ltr"}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                      />
                      <Button onClick={handleApplyCoupon} variant="outline" className={isRTL ? 'font-arabic' : ''}>
                        <Tag className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('subscription.applyCoupon', 'تطبيق')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {appliedCoupon.type === "percentage" 
                            ? `-${appliedCoupon.value}%` 
                            : `-${appliedCoupon.value} ${plan.currency}`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className={`text-sm text-green-600 dark:text-green-400 pt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('subscription.discountApplied', { amount: discountAmount, currency: plan.currency })}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('subscription.planFeatures')}</h4>
                  <ul className="space-y-2">
                    {plan.features.map((featureKey, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{t(featureKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* User Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('subscription.userInfo', 'User Information')}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userInfo.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userInfo.phone}</span>
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('subscription.securityNotice', 'Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.')}
              </AlertDescription>
            </Alert>
          </div>

          {/* Payment Form */}
          <div>
            <PaymentGateway
              planId={currentPlanId}
              amount={finalPrice}
              currency={plan.currency}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
