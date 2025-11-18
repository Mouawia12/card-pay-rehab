import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { CountryCodeSelector } from "@/components/auth/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export const RegisterPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Register data:", data);
      toast.success(t('auth.register.successMessage'));
      
      // Redirect to login page or dashboard
      // navigate('/login');
    } catch {
      toast.error(t('auth.register.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            {t('auth.register.fullName')}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder={t('auth.register.fullNamePlaceholder')}
              className="pl-10"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t('auth.register.email')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.register.emailPlaceholder')}
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t('auth.register.phone')}
          </Label>
          <div className="flex gap-2">
            <CountryCodeSelector
              value={watch("countryCode")}
              onValueChange={(value) => {
                // Update the form value
                const event = { target: { value } };
                register("countryCode").onChange(event);
              }}
            />
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth.register.phonePlaceholder')}
                className="pl-10"
                {...register("phone")}
              />
            </div>
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
          {errors.countryCode && (
            <p className="text-sm text-destructive">{errors.countryCode.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            {t('auth.register.password')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.register.passwordPlaceholder')}
              className="pl-10 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            {t('auth.register.confirmPassword')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              className="pl-10 pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeTerms"
              {...register("agreeTerms")}
              className="mt-1"
            />
            <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.register.agreeTerms')}{" "}
              <Link
                to="/terms-of-service"
                className="text-primary hover:text-primary/80 underline"
              >
                {t('auth.register.termsLink')}
              </Link>
            </Label>
          </div>
          {errors.agreeTerms && (
            <p className="text-sm text-destructive">{errors.agreeTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.register.haveAccount')}{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('auth.register.loginNow')}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
