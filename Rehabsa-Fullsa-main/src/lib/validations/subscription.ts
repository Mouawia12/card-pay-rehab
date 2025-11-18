import { z } from "zod";

// Schema for subscription form data
export const subscriptionSchema = z.object({
  // Plan information
  planId: z.enum(['basic', 'advanced', 'premium'], {
    required_error: "Plan selection is required",
  }),
  
  // User information
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  
  email: z.string()
    .email("Please enter a valid email address"),
  
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  
  // Payment information
  cardNumber: z.string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be less than 19 digits")
    .regex(/^[0-9\s]+$/, "Card number can only contain numbers and spaces"),
  
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Please enter expiry date in MM/YY format"),
  
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^[0-9]+$/, "CVV can only contain numbers"),
  
  cardholderName: z.string()
    .min(2, "Cardholder name must be at least 2 characters")
    .max(100, "Cardholder name must be less than 100 characters"),
  
  billingAddress: z.string()
    .min(10, "Billing address must be at least 10 characters")
    .max(200, "Billing address must be less than 200 characters"),
  
  // Terms agreement
  agreeTerms: z.boolean()
    .refine((val) => val === true, "You must agree to the terms and conditions"),
  
  agreePrivacy: z.boolean()
    .refine((val) => val === true, "You must agree to the privacy policy"),
});

// Schema for payment processing
export const paymentSchema = z.object({
  amount: z.number()
    .positive("Amount must be positive"),
  
  currency: z.string()
    .length(3, "Currency must be 3 characters (e.g., SAR)"),
  
  planId: z.enum(['basic', 'advanced', 'premium']),
  
  userId: z.string()
    .min(1, "User ID is required"),
  
  paymentMethod: z.enum(['card', 'bank_transfer', 'wallet'], {
    required_error: "Payment method is required",
  }),
  
  // Tokenized card data (from payment gateway)
  cardToken: z.string()
    .min(1, "Card token is required"),
  
  // Optional metadata
  metadata: z.record(z.string()).optional(),
});

// Schema for subscription confirmation
export const subscriptionConfirmationSchema = z.object({
  subscriptionId: z.string()
    .min(1, "Subscription ID is required"),
  
  paymentId: z.string()
    .min(1, "Payment ID is required"),
  
  status: z.enum(['active', 'pending', 'failed', 'cancelled']),
  
  startDate: z.date(),
  
  endDate: z.date(),
  
  planId: z.enum(['basic', 'advanced', 'premium']),
  
  amount: z.number()
    .positive("Amount must be positive"),
  
  currency: z.string()
    .length(3, "Currency must be 3 characters"),
});

// Type definitions
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type SubscriptionConfirmationData = z.infer<typeof subscriptionConfirmationSchema>;

// Plan configuration
export const PLAN_CONFIG = {
  basic: {
    id: 'basic',
    nameKey: 'pricing.basic.name',
    price: 1000,
    currency: 'SAR',
    period: 'annually',
    features: [
      'pricing.basic.features.cardTypes',
      'pricing.basic.features.managers',
      'pricing.basic.features.branches',
      'pricing.basic.features.unlimitedCards',
      'pricing.basic.features.unlimitedNotifications',
      'pricing.basic.features.welcomeFeature',
      'pricing.basic.features.support'
    ]
  },
  advanced: {
    id: 'advanced',
    nameKey: 'pricing.advanced.name',
    price: 2000,
    currency: 'SAR',
    period: 'annually',
    features: [
      'pricing.advanced.features.cardTypes',
      'pricing.advanced.features.managers',
      'pricing.advanced.features.branches',
      'pricing.advanced.features.unlimitedCards',
      'pricing.advanced.features.unlimitedNotifications',
      'pricing.advanced.features.welcomeFeature',
      'pricing.advanced.features.support'
    ]
  },
  premium: {
    id: 'premium',
    nameKey: 'pricing.premium.name',
    price: 0, // Custom pricing
    currency: 'SAR',
    period: 'annually',
    features: [
      'pricing.premium.features.cardTypes',
      'pricing.premium.features.managers',
      'pricing.premium.features.branches',
      'pricing.premium.features.unlimitedCards',
      'pricing.premium.features.unlimitedNotifications',
      'pricing.premium.features.welcomeFeature',
      'pricing.premium.features.support'
    ]
  }
} as const;

export type PlanId = keyof typeof PLAN_CONFIG;
export type PlanConfig = typeof PLAN_CONFIG[PlanId];
