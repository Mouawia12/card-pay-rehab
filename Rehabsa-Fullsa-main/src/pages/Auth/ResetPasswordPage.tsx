import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Lock, CheckCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useDirection } from "@/hooks/useDirection";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { token } = useParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Reset password data:", { ...data, token });
      setIsSuccess(true);
      toast.success(t('auth.resetPassword.successMessage'));
    } catch {
      toast.error(t('auth.resetPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title={t('auth.resetPassword.successTitle')}
        subtitle={t('auth.resetPassword.successSubtitle')}
      >
        <div className="text-center space-y-8">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto">
              <div className="w-full h-full border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t('auth.resetPassword.passwordUpdatedTitle')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('auth.resetPassword.passwordUpdatedMessage')}
            </p>
          </div>

          {/* Login Button */}
          <Link to="/login">
            <Button className="w-full btn-primary">
              {t('auth.resetPassword.loginNow')}
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
    >
      <div className="space-y-6">
        {/* Security Icon */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('auth.resetPassword.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t('auth.resetPassword.newPassword')}
            </Label>
            <div className="relative">
              <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              {t('auth.resetPassword.confirmPassword')}
            </Label>
            <div className="relative">
              <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 text-sm">
              {t('auth.resetPassword.requirementsTitle')}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {t('auth.resetPassword.requirement1')}</li>
              <li>• {t('auth.resetPassword.requirement2')}</li>
              <li>• {t('auth.resetPassword.requirement3')}</li>
              <li>• {t('auth.resetPassword.requirement4')}</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('auth.resetPassword.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
