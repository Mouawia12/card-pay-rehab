import axios, { AxiosError, type Method } from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set. Please add it to your .env file.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "خطأ من الخادم";
    if (error.response) {
      const data: any = error.response.data;
      message = data?.message || `${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      message = "تعذر الاتصال بالخادم، تحقق من تشغيل الباكند والمنفذ";
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

interface FetchOptions {
  token?: string | null;
  method?: Method;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  business_id?: number | null;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = options.token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
  const response = await api.request<T>({
    url: path,
    method: options.method ?? "GET",
    params: options.params,
    data: options.data,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  return response.data as T;
}

export async function loginApi(email: string, password: string) {
  console.info("[loginApi] calling /auth/login", API_BASE_URL);
  const result = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", result.token);
    localStorage.setItem("auth_user", JSON.stringify(result.user));
  }

  return result;
}

export async function logoutApi() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }
}

export interface CardTemplateRecord {
  id: number;
  name: string;
  title?: string | null;
  description?: string | null;
  bgColor?: string | null;
  bgOpacity?: number | null;
  bgImage?: string | null;
  textColor?: string | null;
  cardType?: number;
  totalStages: number;
  activeStampType?: string | null;
  inactiveStampType?: string | null;
  cardDescription?: string | null;
  howToEarnStamp?: string | null;
  companyName?: string | null;
  termsOfUse?: string | null;
  sourceCompanyName?: string | null;
  sourceEmail?: string | null;
  phoneNumber?: string | null;
  countryCode?: string | null;
  colors?: Record<string, string> | null;
}

export interface CardRecord {
  id: number;
  name: string;
  title?: string | null;
  description?: string | null;
  card_code: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  bg_color?: string | null;
  bg_opacity?: number | null;
  bg_image?: string | null;
  text_color?: string | null;
  status?: string | null;
  current_stage?: number | null;
  total_stages: number;
  customers_count?: number | null;
  settings?: Record<string, unknown> | null;
  registration_url?: string | null;
  qr_template_url?: string | null;
}

export interface CardPayload {
  name: string;
  title?: string | null;
  description?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  bg_color?: string | null;
  bg_opacity?: number | null;
  bg_image?: string | null;
  text_color?: string | null;
  status?: string | null;
  total_stages: number;
  current_stage?: number | null;
  settings?: Record<string, unknown> | null;
}

export interface CardActivationRecord {
  id: number;
  channel: string;
  device_type?: string | null;
  activated_at?: string | null;
}

export interface IssuedCard {
  id: number;
  card_code: string;
  qr_payload: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  stamps_count: number;
  stamps_target: number;
  status: string;
  apple_wallet_installed_at?: string | null;
  last_scanned_at?: string | null;
  customer?: {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
  } | null;
  template?: {
    id?: number;
    name?: string;
    title?: string;
    bg_color?: string;
    text_color?: string;
    business?: string | null;
  } | null;
  qr_url: string;
  pkpass_url: string;
  google_wallet?: {
    url: string;
    installed_at?: string | null;
    activation_count?: number;
    object_id?: string | null;
    class_id?: string | null;
    last_update?: string | null;
  } | null;
  activations: CardActivationRecord[];
}

export interface IssueCardInstancePayload {
  card_template_id: number;
  customer_id?: number;
  customer?: {
    name: string;
    phone: string;
    email?: string | null;
  };
  issue_date?: string | null;
  expiry_date?: string | null;
  initial_stamps?: number;
  notes?: string | null;
}

export async function fetchCards() {
  return apiFetch<{ data: CardRecord[] }>("/cards");
}

export async function createCard(payload: CardPayload) {
  return apiFetch<{ data: CardRecord }>("/cards", {
    method: "POST",
    data: payload,
  });
}

export async function fetchCard(id: string | number) {
  return apiFetch<{ data: CardRecord }>(`/cards/${id}`);
}

export async function updateCard(id: string | number, payload: CardPayload) {
  return apiFetch<{ data: CardRecord }>(`/cards/${id}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteCard(id: string | number) {
  return apiFetch<{ message: string }>(`/cards/${id}`, {
    method: "DELETE",
  });
}

export async function fetchCardTemplates() {
  return apiFetch<{ data: CardTemplateRecord[] }>("/card-templates");
}

export async function fetchCardInstances(params?: { q?: string; page?: number }) {
  return apiFetch<{ data: IssuedCard[]; meta?: any }>("/card-instances", { params });
}

export async function fetchCardInstanceById(id: string | number) {
  return apiFetch<{ data: IssuedCard }>(`/card-instances/${id}`);
}

export async function fetchCardInstanceByCode(cardCode: string) {
  return apiFetch<{ data: IssuedCard }>(`/card-instances/code/${cardCode}`);
}

export async function issueCardInstance(payload: IssueCardInstancePayload) {
  return apiFetch<{ data: IssuedCard }>("/card-instances", {
    method: "POST",
    data: payload,
  });
}

export async function fetchCustomers() {
  return apiFetch<{ data: any[] }>("/customers");
}

export interface CustomerListItem {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  active_cards?: number;
  current_stamps?: number;
  total_stamps?: number;
  available_rewards?: number;
  redeemed_rewards?: number;
  last_update?: string | null;
  created_at?: string | null;
}

export interface CustomerDetails {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  birth_date?: string | null;
  language?: string | null;
  loyalty_points?: number;
  last_visit_at?: string | null;
  metadata?: Record<string, unknown> | null;
  cards: Array<{
    card?: { id?: number; name?: string } | null;
    card_code?: string;
    current_stage: number;
    total_stages: number;
    stamps_count?: number;
    stamps_target?: number;
    available_rewards: number;
    status?: string | null;
    qr_url?: string;
    pkpass_url?: string;
    google_wallet_url?: string;
    google_wallet_installed_at?: string | null;
    google_object_id?: string | null;
    google_class_id?: string | null;
    last_google_update?: string | null;
  }>;
  recent_transactions: Array<{
    id: number;
    type: string;
    amount: number;
    currency: string;
    note?: string | null;
    happened_at?: string | null;
  }>;
}

export interface CustomerPayload {
  name: string;
  phone: string;
  email?: string | null;
  birth_date?: string | null;
  language?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function fetchCustomer(id: string | number) {
  return apiFetch<{ data: CustomerDetails }>(`/customers/${id}`);
}

export interface GoogleWalletLink {
  save_url: string;
  jwt: string;
  class_id: string;
  object_id: string;
}

export async function generateGoogleWalletLink(cardCode: string) {
  return apiFetch<{ data: GoogleWalletLink }>(`/card-instances/code/${cardCode}/google-wallet`);
}

export interface GoogleWalletRefresh {
  object_id: string;
  last_google_update?: string | null;
}

export async function refreshGoogleWallet(cardCode: string) {
  return apiFetch<{ data: GoogleWalletRefresh }>(`/card-instances/code/${cardCode}/google-wallet/refresh`, {
    method: "POST",
  });
}

export interface PublicCardInfo {
  id: number;
  card_code: string;
  name: string;
  title?: string | null;
  description?: string | null;
  total_stages?: number | null;
  bg_color?: string | null;
  text_color?: string | null;
  form_fields?: Array<{ id?: string; type?: string; name?: string; required?: boolean }>;
  registration_url?: string;
}

export interface PublicRegistrationResult {
  card_instance: {
    id: number;
    card_code: string;
    qr_payload: string;
    qr_url: string;
    pkpass_url: string;
    google_wallet_url?: string | null;
    google_object_id?: string | null;
    google_class_id?: string | null;
  };
  registration_url?: string;
}

export async function fetchPublicCard(cardCode: string) {
  return apiFetch<{ data: PublicCardInfo }>(`/public/cards/${cardCode}`);
}

export async function registerPublicCard(cardCode: string, payload: { name: string; phone: string; email?: string | null }) {
  return apiFetch<{ data: PublicRegistrationResult }>(`/public/cards/${cardCode}/register`, {
    method: "POST",
    data: payload,
  });
}

export async function createCustomer(payload: CustomerPayload) {
  return apiFetch<{ data: CustomerDetails }>("/customers", {
    method: "POST",
    data: payload,
  });
}

export async function updateCustomer(id: string | number, payload: CustomerPayload) {
  return apiFetch<{ data: CustomerDetails }>(`/customers/${id}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteCustomer(id: string | number) {
  return apiFetch<{ message: string }>(`/customers/${id}`, {
    method: "DELETE",
  });
}

export interface AdminSummary {
  totals: {
    businesses: number;
    users: number;
    cards: number;
    customers: number;
    transactions: number;
    revenue: number;
  };
  users_by_role: Record<string, number>;
  transactions_by_day: Array<{ day: string; total: number; amount: number }>;
  latest_transactions: any[];
  latest_businesses: any[];
  latest_customers: any[];
}

export async function fetchAdminSummary() {
  return apiFetch<{ data: AdminSummary }>("/admin/summary");
}

export type LanguageCode = "ar" | "en";

export interface AdminUsersStats {
  total: number;
  active: number;
  store_owners: number;
  managers: number;
}

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  raw_role: string;
  store?: string | null;
  status: string;
  is_active: boolean;
  join_date?: string | null;
  last_login?: string | null;
  permissions: string[];
}

export interface AdminUsersData {
  stats: AdminUsersStats;
  users: AdminUserRecord[];
}

export async function fetchAdminUsers() {
  return apiFetch<{ data: AdminUsersData }>("/admin/users");
}

export async function fetchAdminUser(userId: number) {
  return apiFetch<{ data: AdminUserRecord }>(`/admin/users/${userId}`);
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  is_active?: boolean;
}

export async function updateAdminUser(userId: number, payload: UpdateAdminUserPayload) {
  return apiFetch<{ data: AdminUserRecord }>(`/admin/users/${userId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteAdminUser(userId: number) {
  return apiFetch<{ message: string }>(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export interface AdminStoreRecord {
  id: number;
  name: string;
  owner?: string;
  email?: string;
  phone?: string;
  plan?: string;
  status: string;
  customers: number;
  cards: number;
  revenue: string;
  join_date?: string;
  last_activity?: string | null;
  subscription_end?: string | null;
}

export interface AdminStoresData {
  stats: {
    total_stores: number;
    total_customers: number;
    total_cards: number;
    active_stores: number;
  };
  stores: AdminStoreRecord[];
}

export async function fetchAdminStores() {
  return apiFetch<{ data: AdminStoresData }>("/admin/stores");
}

export interface AdminStoreDetails {
  store: {
    id: number;
    name: string;
    owner?: string;
    email?: string;
    phone?: string;
    address?: string | null;
    plan?: string;
    status: string;
    join_date?: string;
    subscription_end?: string | null;
    last_activity?: string | null;
    total_customers: number;
    total_cards: number;
    monthly_revenue: string;
    total_revenue: string;
    description?: string | null;
    city?: string | null;
  };
  recent_customers: Array<{
    id: number;
    name: string;
    phone?: string;
    join_date?: string;
  }>;
  monthly_data: Array<{
    month: string;
    customers: number;
    revenue: number;
  }>;
}

export async function fetchAdminStoreDetails(storeId: string | number) {
  return apiFetch<{ data: AdminStoreDetails }>(`/admin/stores/${storeId}`);
}

export interface Business {
  id: number;
  name: string;
  slug?: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  currency?: string | null;
  theme_primary?: string | null;
  theme_secondary?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
}

export interface BusinessPayload {
  name: string;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  currency?: string | null;
  theme_primary?: string | null;
  theme_secondary?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
}

export async function fetchBusiness(id: string | number) {
  return apiFetch<{ data: Business }>(`/businesses/${id}`);
}

export async function createBusiness(payload: BusinessPayload) {
  return apiFetch<{ data: Business }>("/businesses", {
    method: "POST",
    data: payload,
  });
}

export async function updateBusiness(id: string | number, payload: BusinessPayload) {
  return apiFetch<{ data: Business }>(`/businesses/${id}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteBusiness(id: string | number) {
  return apiFetch<{ message: string }>(`/businesses/${id}`, {
    method: "DELETE",
  });
}

export interface ProductRecord {
  id: number;
  name: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  status: string;
  category?: string | null;
  description?: string | null;
  image_url?: string | null;
}

export interface ProductPayload {
  name: string;
  sku: string;
  price: number;
  currency?: string | null;
  stock?: number | null;
  status?: string | null;
  category?: string | null;
  description?: string | null;
  image_url?: string | null;
}

export async function fetchProducts(params?: Record<string, any>) {
  return apiFetch<{ data: ProductRecord[] }>("/products", {
    params,
  });
}

export async function fetchProduct(productId: string | number) {
  return apiFetch<{ data: ProductRecord }>(`/products/${productId}`);
}

export async function createProduct(payload: ProductPayload) {
  return apiFetch<{ data: ProductRecord }>("/products", {
    method: "POST",
    data: payload,
  });
}

export async function updateProduct(productId: string | number, payload: Partial<ProductPayload>) {
  return apiFetch<{ data: ProductRecord }>(`/products/${productId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteProduct(productId: string | number) {
  return apiFetch<{ message: string }>(`/products/${productId}`, {
    method: "DELETE",
  });
}

export interface AdminSubscriptionsData {
  stats: {
    total_revenue: string;
    active_subscriptions: number;
    expiring_soon: number;
    trial_accounts: number;
  };
  subscriptions: Array<{
    id: number;
    store_name?: string;
    plan?: string;
    status: string;
    raw_status: string;
    amount: string;
    start_date?: string | null;
    end_date?: string | null;
    auto_renew: boolean;
    payment_method?: string | null;
    last_payment?: string | null;
    next_payment?: string | null;
    total_paid: string;
  }>;
}

export async function fetchAdminSubscriptions() {
  return apiFetch<{ data: AdminSubscriptionsData }>("/admin/subscriptions");
}

export async function renewAdminSubscription(subscriptionId: number) {
  return apiFetch<{ data: AdminSubscriptionsData["subscriptions"][number] }>(
    `/admin/subscriptions/${subscriptionId}/renew`,
    { method: "POST" }
  );
}

export async function cancelAdminSubscription(subscriptionId: number) {
  return apiFetch<{ data: AdminSubscriptionsData["subscriptions"][number] }>(
    `/admin/subscriptions/${subscriptionId}/cancel`,
    { method: "POST" }
  );
}

export interface AdminAnalyticsData {
  stats: {
    total_revenue: string;
    total_stores: number;
    total_users: number;
    avg_growth: string;
  };
  monthly_growth: Array<{ month: string; stores: number; revenue: number; users: number }>;
  plan_distribution: Array<{ name: string; value: number; color: string }>;
  top_stores: Array<{ name: string; revenue: number; customers: number; growth: string }>;
  user_activity: Array<{ hour: string; active_users: number }>;
}

export async function fetchAdminAnalytics() {
  return apiFetch<{ data: AdminAnalyticsData }>("/admin/analytics");
}

export interface AdminMarketingData {
  stats: {
    total_coupons: number;
    active_coupons: number;
    active_campaigns: number;
    total_savings: string;
  };
  coupons: Array<{
    id: number;
    code: string;
    type: string;
    value: number;
    discount_text: string;
    min_purchase?: number | null;
    usage_count: number;
    max_usage?: number | null;
    status: string;
    raw_status: string;
    start_date?: string | null;
    end_date?: string | null;
    total_savings: string;
    total_savings_value?: number;
    currency?: string;
  }>;
  campaigns: Array<{
    id: number;
    name: string;
    description?: string | null;
    coupons: string[];
    coupon_ids?: number[];
    status: string;
    raw_status: string;
    target_audience?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    conversions: number;
    roi: string;
    roi_percentage?: number;
    total_spent: string;
    total_revenue: string;
    total_spent_value?: number;
    total_revenue_value?: number;
    currency?: string;
  }>;
}

export async function fetchAdminMarketing() {
  return apiFetch<{ data: AdminMarketingData }>("/admin/marketing");
}

export type MarketingCouponRecord = AdminMarketingData["coupons"][number];
export type MarketingCampaignRecord = AdminMarketingData["campaigns"][number];

export interface UpdateMarketingCouponPayload {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_purchase_amount?: number | null;
  usage_count?: number;
  max_usage?: number | null;
  status: string;
  starts_at?: string | null;
  ends_at?: string | null;
  total_savings?: number;
  currency?: string;
}

export interface UpdateMarketingCampaignPayload {
  name: string;
  description?: string | null;
  status: string;
  target_audience?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  conversions?: number;
  roi_percentage?: number;
  total_spent?: number;
  total_revenue?: number;
  currency?: string;
  coupon_ids?: number[];
}

export async function fetchMarketingCoupon(couponId: number) {
  return apiFetch<{ data: MarketingCouponRecord }>(`/admin/marketing/coupons/${couponId}`);
}

export async function updateMarketingCoupon(couponId: number, payload: UpdateMarketingCouponPayload) {
  return apiFetch<{ data: MarketingCouponRecord; message: string }>(`/admin/marketing/coupons/${couponId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function fetchMarketingCampaign(campaignId: number) {
  return apiFetch<{ data: MarketingCampaignRecord }>(`/admin/marketing/campaigns/${campaignId}`);
}

export async function updateMarketingCampaign(campaignId: number, payload: UpdateMarketingCampaignPayload) {
  return apiFetch<{ data: MarketingCampaignRecord; message: string }>(`/admin/marketing/campaigns/${campaignId}`, {
    method: "PUT",
    data: payload,
  });
}

export interface AdminReportsData {
  reports: Array<{
    id: number;
    name: string;
    type: string;
    period?: string | null;
    generated_date?: string | null;
    status: string;
    raw_status: string;
    size?: string | null;
    format: string;
  }>;
  financial_summary: {
    total_revenue: string;
    monthly_growth: string;
    top_revenue_source: string;
    avg_revenue_per_store: string;
    projected_revenue: string;
  };
}

export async function fetchAdminReports() {
  return apiFetch<{ data: AdminReportsData }>("/admin/reports");
}

export interface SystemLogsData {
  stats: {
    total_logs: number;
    error_logs: number;
    warning_logs: number;
    info_logs: number;
  };
  logs: Array<{
    id: number;
    timestamp: string;
    level: string;
    category?: string | null;
    message: string;
    user: string;
    store: string;
    ip?: string | null;
    details?: Record<string, any> | null;
  }>;
}

export async function fetchSystemLogs() {
  return apiFetch<{ data: SystemLogsData }>("/admin/system-logs");
}

export interface BlogCategory {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string | null;
  description_en?: string | null;
  color?: string | null;
  posts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostRecord {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image?: string | null;
  status: "draft" | "published";
  category?: {
    id: number;
    name_ar: string;
    name_en: string;
    color?: string | null;
  } | null;
  published_at?: string | null;
  author?: {
    id: number;
    name: string;
  } | null;
  tags?: string[] | null;
  views: number;
  likes: number;
  comments: number;
  is_featured: boolean;
}

export interface BlogPostDetails extends BlogPostRecord {
  content?: string | null;
  comments?: BlogCommentRecord[];
}

export interface BlogCommentRecord {
  id: number;
  author_name: string;
  author_email: string;
  content: string;
  status: "approved" | "pending" | "rejected";
  likes?: number | null;
  replies_count?: number | null;
  created_at?: string | null;
}

export interface BlogPostPayload {
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  status?: "draft" | "published";
  tags?: string[];
  category_id?: number | null;
  is_featured?: boolean;
}

export interface BlogCategoryPayload {
  name_ar: string;
  name_en: string;
  slug?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  color?: string | null;
}

export async function fetchBlogCategories() {
  return apiFetch<{ data: BlogCategory[] }>("/blog-categories");
}

export async function createBlogCategory(payload: BlogCategoryPayload) {
  return apiFetch<{ data: BlogCategory }>("/blog-categories", {
    method: "POST",
    data: payload,
  });
}

export async function updateBlogCategory(categoryId: number, payload: Partial<BlogCategoryPayload>) {
  return apiFetch<{ data: BlogCategory }>(`/blog-categories/${categoryId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteBlogCategory(categoryId: number) {
  return apiFetch<{ message: string }>(`/blog-categories/${categoryId}`, {
    method: "DELETE",
  });
}

export async function fetchBlogPosts(params?: { status?: string }) {
  return apiFetch<{ data: BlogPostRecord[] }>("/blog", {
    params,
  });
}

export async function fetchBlogPost(postId: number | string) {
  return apiFetch<{ data: BlogPostDetails }>(`/blog/${postId}`);
}

export async function createBlogPost(payload: BlogPostPayload) {
  return apiFetch<{ data: BlogPostDetails }>("/blog", {
    method: "POST",
    data: payload,
  });
}

export async function updateBlogPost(postId: number | string, payload: Partial<BlogPostPayload>) {
  return apiFetch<{ data: BlogPostDetails }>(`/blog/${postId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function deleteBlogPost(postId: number | string) {
  return apiFetch<{ message: string }>(`/blog/${postId}`, {
    method: "DELETE",
  });
}

export async function updateBlogComment(commentId: number, status: "approved" | "pending" | "rejected") {
  return apiFetch<{ data: BlogCommentRecord }>(`/blog-comments/${commentId}`, {
    method: "PUT",
    data: { status },
  });
}

export async function deleteBlogComment(commentId: number) {
  return apiFetch<{ message: string }>(`/blog-comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminSettingGroup<T = any>(group: string) {
  return apiFetch<{ data: T }>(`/admin/settings/${group}`);
}

export async function updateAdminSettingGroup<T = any>(group: string, settings: T) {
  return apiFetch<{ data: T }>(`/admin/settings/${group}`, {
    method: "PUT",
    data: { settings },
  });
}

export async function fetchAdminSiteContent(language: LanguageCode) {
  return apiFetch<{ data: Record<string, any> }>("/admin/site-content", {
    params: { language },
  });
}

export async function fetchAdminSiteSection(section: string, language: LanguageCode) {
  return apiFetch<{ data: any }>(`/admin/site-content/${section}`, {
    params: { language },
  });
}

export async function updateAdminSiteSection(section: string, language: LanguageCode, content: any) {
  return apiFetch<{ data: any }>(`/admin/site-content/${section}`, {
    method: "PUT",
    data: { language, content },
  });
}
