import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginApi } from "@/lib/api";

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const redirectUrl = searchParams.get("redirect");

  const getRoleRedirect = (role?: string | null) => {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
      case "admin":
        return "/admin";
      case "merchant":
      case "staff":
        return "/dashboard";
      case "customer":
        return "/";
      default:
        return "/dashboard";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await loginApi(data.email, data.password);
      toast.success(t('auth.login.successMessage'));

      const targetRoute = redirectUrl || getRoleRedirect(result.user?.role);
      navigate(targetRoute, { replace: true });
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error?.message || t('auth.login.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t('auth.login.email')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.login.emailPlaceholder')}
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            {t('auth.login.password')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.login.passwordPlaceholder')}
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
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              {...register("rememberMe", { valueAsBoolean: true })}
            />
            <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
              {t('auth.login.rememberMe')}
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {t('auth.login.forgotPassword')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('auth.login.registerNow')}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
