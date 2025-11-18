import { z } from "zod";

// Schema for login form
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  rememberMe: z.boolean().optional(),
});

// Schema for registration form
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "الاسم الكامل مطلوب")
    .min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9]{8,15}$/, "يرجى إدخال رقم هاتف صحيح"),
  countryCode: z
    .string()
    .min(1, "مفتاح الدولة مطلوب"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم"
    ),
  confirmPassword: z
    .string()
    .min(1, "تأكيد كلمة المرور مطلوب"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "يجب الموافقة على الشروط والأحكام"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

// Schema for forgot password form
export const forgotPasswordSchema = z.object({
  method: z.enum(["email", "phone"], {
    required_error: "يرجى اختيار طريقة الاسترجاع",
  }),
  email: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === "email") {
        if (!val || val.length === 0) {
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      }
      return true;
    }, "يرجى إدخال بريد إلكتروني صحيح"),
  phone: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === "phone") {
        if (!val || val.length === 0) {
          return false;
        }
        const phoneRegex = /^[0-9]{8,15}$/;
        return phoneRegex.test(val);
      }
      return true;
    }, "يرجى إدخال رقم هاتف صحيح"),
  countryCode: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === "phone") {
        return val && val.length > 0;
      }
      return true;
    }, "مفتاح الدولة مطلوب"),
});

// Schema for reset password form
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم"
    ),
  confirmPassword: z
    .string()
    .min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

// Type definitions
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
