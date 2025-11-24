import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginApi } from "@/lib/api";

export const AdminLoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.info("[AdminLogin] submitting", data.email);
    try {
      const result = await loginApi(data.email, data.password);
      const role = result.user?.role?.toLowerCase();
      if (role !== "admin") {
        toast.error(t('auth.admin.login.errorMessage'));
        setErrorMessage(t('auth.admin.login.errorMessage'));
        return;
      }

      toast.success(t('auth.admin.login.successMessage'));
      const redirectParam = searchParams.get("redirect");
      const target = redirectParam ? decodeURIComponent(redirectParam) : "/admin";
      navigate(target, { replace: true });
    } catch (error: any) {
      console.error("Admin login failed", error);
      const msg = error?.message || t('auth.admin.login.errorMessage');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
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

  const onError = (formErrors: typeof errors) => {
    const firstError =
      formErrors.email?.message ||
      formErrors.password?.message ||
      t('auth.admin.login.errorMessage');
    console.warn("[AdminLogin] validation error", formErrors);
    toast.error(String(firstError));
  };

  const submit = handleSubmit(onSubmit, onError);

  return (
    <AuthLayout
      title={t('auth.admin.login.title')}
      subtitle={t('auth.admin.login.subtitle')}
    >
      <div className="space-y-6">
        {/* Admin Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('auth.admin.login.adminAccess')}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4" autoComplete="on">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('auth.admin.login.email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.admin.login.emailPlaceholder')}
                className="pl-10"
                autoComplete="email"
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
              {t('auth.admin.login.password')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.admin.login.passwordPlaceholder')}
                className="pl-10 pr-10"
                autoComplete="current-password"
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
                {t('auth.admin.login.rememberMe')}
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t('auth.admin.login.forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? t('auth.admin.login.submitting') : t('auth.admin.login.submit')}
          </Button>
          {errorMessage && (
            <p className="text-sm text-destructive text-center">{errorMessage}</p>
          )}

          {/* Back to Regular Login */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.admin.login.notAdmin')}{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t('auth.admin.login.backToLogin')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
