import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, CheckCircle, Phone, Smartphone, Home, Shield, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useDirection } from "@/hooks/useDirection";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { CountryCodeSelector } from "@/components/auth/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      method: "email",
    },
  });

  const selectedMethod = watch("method");

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otpValue.length === 6 && !isLoading) {
      const timer = setTimeout(() => {
        handleOTPVerify();
      }, 500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [otpValue, isLoading]);

  const handleOTPVerify = async () => {
    if (otpValue.length !== 6) {
      toast.error(t('auth.forgotPassword.otpInvalid'));
      setOtpError(true);
      return;
    }

    setIsLoading(true);
    setOtpError(false);
    
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (otpValue === "123456" || otpValue.length === 6) {
        setOtpVerified(true);
        toast.success(t('auth.forgotPassword.otpVerified'));
        
        // Redirect to reset password page after success
        setTimeout(() => {
          // Generate a mock token for demo purposes
          const mockToken = "reset-token-" + Date.now();
          navigate(`/reset-password/${mockToken}`);
        }, 1500);
      } else {
        toast.error(t('auth.forgotPassword.otpInvalid'));
        setOtpError(true);
      }
    } catch {
      toast.error(t('auth.forgotPassword.otpInvalid'));
      setOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(60);
      toast.success(t('auth.forgotPassword.otpSent'));
    } catch {
      toast.error(t('auth.forgotPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log("=== FORM SUBMITTED ===");
    console.log("Form data:", data);
    console.log("Form errors:", errors);
    console.log("Selected method:", selectedMethod);
    
    setIsLoading(true);
    
    try {
      // Validate data
      if (!data.method) {
        toast.error("يرجى اختيار طريقة الاسترجاع");
        setIsLoading(false);
        return;
      }
      
      if (data.method === "email" && (!data.email || data.email.trim() === "")) {
        toast.error("يرجى إدخال البريد الإلكتروني");
        setIsLoading(false);
        return;
      }
      
      if (data.method === "phone" && (!data.phone || data.phone.trim() === "")) {
        toast.error("يرجى إدخال رقم الهاتف");
        setIsLoading(false);
        return;
      }
      
      console.log("Data validation passed, proceeding...");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("API call completed, setting showOTP to true");
      setShowOTP(true);
      setResendTimer(60); // 60 seconds timer
      
      toast.success(t('auth.forgotPassword.otpSent'));
      console.log("OTP page should now be visible");
      
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(t('auth.forgotPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.error("يرجى تصحيح الأخطاء في النموذج");
  };

  if (showOTP) {
    const formData = getValues();
    const contactInfo = formData.method === "email" 
      ? formData.email 
      : `${formData.countryCode} ${formData.phone}`;

    return (
      <AuthLayout
        title={t('auth.forgotPassword.enterOTP')}
        subtitle={t('auth.forgotPassword.otpSent')}
      >
        <div className="space-y-8">
          {/* OTP Icon with Animation */}
          <div className="relative">
            <div className={`w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto transition-all duration-500 ${otpVerified ? 'scale-110 bg-green-100' : ''}`}>
              {otpVerified ? (
                <CheckCircle className="h-10 w-10 text-green-600 animate-pulse" />
              ) : (
                <Shield className={`h-10 w-10 text-primary ${isLoading ? 'animate-pulse' : ''}`} />
              )}
            </div>
            {isLoading && (
              <div className="absolute inset-0 w-20 h-20 mx-auto">
                <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="text-center space-y-3">
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-1">
                {formData.method === "email" ? "تم الإرسال إلى:" : "تم الإرسال إلى:"}
              </p>
              <p className="text-sm text-primary font-mono">
                {contactInfo}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.method === "email" 
                ? "تحقق من مجلد الرسائل المهملة إذا لم تجد الرسالة"
                : "تحقق من رسائل SMS في هاتفك"
              }
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="text-center">
              <Label className="text-lg font-semibold text-foreground block mb-2">
                أدخل رمز التحقق
              </Label>
              <p className="text-sm text-muted-foreground">
                أدخل الرمز المكون من 6 أرقام
              </p>
            </div>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  setOtpValue(value);
                  setOtpError(false);
                }}
                className={`${isRTL ? 'flex-row-reverse' : ''} ${otpError ? 'animate-pulse' : ''}`}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot 
                    index={0} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <InputOTPSlot 
                    index={1} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <InputOTPSlot 
                    index={2} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <InputOTPSlot 
                    index={3} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <InputOTPSlot 
                    index={4} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <InputOTPSlot 
                    index={5} 
                    className={`w-10 h-10 text-base font-medium ${otpError ? 'border-red-500 bg-red-50' : ''}`}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {otpError && (
              <div className="text-center">
                <p className="text-sm text-red-600 animate-pulse">
                  رمز التحقق غير صحيح، حاول مرة أخرى
                </p>
              </div>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleOTPVerify}
            className={`w-full btn-primary h-12 text-lg font-semibold transition-all duration-300 ${
              otpVerified ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
            disabled={isLoading || otpValue.length !== 6}
          >
            {isLoading ? (
              <>
                <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                جاري التحقق...
              </>
            ) : otpVerified ? (
              <>
                <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                تم التحقق بنجاح
              </>
            ) : (
              <>
                <Shield className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                تحقق من الرمز
              </>
            )}
          </Button>

          {/* Resend OTP */}
          <div className="text-center space-y-3">
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>يمكنك إعادة الإرسال خلال {resendTimer} ثانية</span>
              </div>
            ) : (
              <button
                onClick={handleResendOTP}
                className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                إعادة إرسال الرمز
              </button>
            )}
          </div>

          {/* Back to Form */}
          <div className="text-center pt-4 border-t border-border/50">
            <button
              onClick={() => {
                setShowOTP(false);
                setOtpValue("");
                setOtpVerified(false);
                setOtpError(false);
              }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              العودة إلى النموذج
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (resetSent) {
    const formData = getValues();
    const contactInfo = formData.method === "email" 
      ? formData.email 
      : `${formData.countryCode} ${formData.phone}`;

    return (
      <AuthLayout
        title={formData.method === "email" ? t('auth.forgotPassword.checkEmailTitle') : t('auth.forgotPassword.checkPhoneTitle')}
        subtitle={formData.method === "email" 
          ? t('auth.forgotPassword.checkEmailSubtitle')
          : t('auth.forgotPassword.checkPhoneSubtitle')
        }
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {formData.method === "email" ? t('auth.forgotPassword.emailSentTitle') : t('auth.forgotPassword.phoneSentTitle')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formData.method === "email" 
                ? t('auth.forgotPassword.emailSentMessage', { email: contactInfo })
                : t('auth.forgotPassword.phoneSentMessage', { phone: contactInfo })
              }
            </p>
          </div>

          {/* Instructions */}
          <div className={`bg-muted/50 rounded-lg p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="font-medium text-foreground mb-2">
              {t('auth.forgotPassword.instructionsTitle')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {formData.method === "email" ? (
                <>
                  <li>• {t('auth.forgotPassword.emailInstruction1')}</li>
                  <li>• {t('auth.forgotPassword.emailInstruction2')}</li>
                  <li>• {t('auth.forgotPassword.emailInstruction3')}</li>
                </>
              ) : (
                <>
                  <li>• {t('auth.forgotPassword.phoneInstruction1')}</li>
                  <li>• {t('auth.forgotPassword.phoneInstruction2')}</li>
                  <li>• {t('auth.forgotPassword.phoneInstruction3')}</li>
                </>
              )}
            </ul>
          </div>

          {/* Back to Login */}
          <div className="space-y-4">
            <Link to="/login">
              <Button className="w-full btn-primary">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('auth.forgotPassword.backToLogin')}
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('auth.forgotPassword.backToHome')}
              </Button>
            </Link>
            
            <button
              onClick={() => setResetSent(false)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {formData.method === "email" ? t('auth.forgotPassword.tryDifferentEmail') : t('auth.forgotPassword.tryDifferentPhone')}
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('auth.forgotPassword.selectMethod')}</Label>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => {
              setValue("method", value as "email" | "phone");
              // Clear other fields when switching methods
              if (value === "email") {
                setValue("phone", "");
                setValue("countryCode", "");
              } else {
                setValue("email", "");
              }
            }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email-method" />
              <Label htmlFor="email-method" className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                {t('auth.forgotPassword.email')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone-method" />
              <Label htmlFor="phone-method" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-4 w-4" />
                {t('auth.forgotPassword.phone')}
              </Label>
            </div>
          </RadioGroup>
          {errors.method && (
            <p className="text-sm text-destructive">{errors.method.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t('auth.forgotPassword.email')}
          </Label>
          <div className="relative">
            <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              className={isRTL ? 'pr-10' : 'pl-10'}
              {...register("email")}
              style={{ display: selectedMethod === "email" ? "block" : "none" }}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{String(errors.email.message) || t('auth.errors.invalidEmail')}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t('auth.forgotPassword.phone')}
          </Label>
          <div className="flex gap-2" style={{ display: selectedMethod === "phone" ? "flex" : "none" }}>
            <CountryCodeSelector
              value={watch("countryCode")}
              onValueChange={(value) => {
                setValue("countryCode", value);
              }}
            />
            <div className="relative flex-1">
              <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth.forgotPassword.phonePlaceholder')}
                className={isRTL ? 'pr-10' : 'pl-10'}
                {...register("phone")}
              />
            </div>
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{String(errors.phone.message) || t('auth.errors.invalidPhone')}</p>
          )}
          {errors.countryCode && (
            <p className="text-sm text-destructive">{String(errors.countryCode.message) || t('auth.errors.invalidCountryCode')}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {selectedMethod === "email" 
              ? t('auth.forgotPassword.emailInfoMessage')
              : t('auth.forgotPassword.phoneInfoMessage')
            }
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
          onClick={() => {
            console.log("Submit button clicked");
            console.log("Current form values:", getValues());
            console.log("Current errors:", errors);
            console.log("Selected method:", selectedMethod);
            
            // Force show OTP for testing
            setShowOTP(true);
            setResendTimer(60);
            toast.success("Test: Showing OTP page");
          }}
        >
          {isLoading ? (
            <>
              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
              {t('auth.forgotPassword.submitting')}
            </>
          ) : (
            <>
              {selectedMethod === "email" ? (
                <>
                  <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  إرسال رابط عبر البريد
                </>
              ) : (
                <>
                  <Smartphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('auth.forgotPassword.sendSMS')}
                </>
              )}
            </>
          )}
        </Button>

        {/* Back to Login and Home */}
        <div className="text-center space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('auth.forgotPassword.backToLogin')}
            </Link>
            
            <div className="text-xs text-muted-foreground hidden sm:inline">{t('auth.forgotPassword.or')}</div>
            
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors inline-flex items-center"
            >
              <Home className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('auth.forgotPassword.backToHome')}
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};
