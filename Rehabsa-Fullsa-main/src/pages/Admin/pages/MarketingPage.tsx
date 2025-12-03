import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  MoreHorizontal,
  Megaphone,
  Ticket,
  TrendingUp,
  DollarSign,
  Copy,
  Eye,
  Edit2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchAdminMarketing,
  fetchMarketingCampaign,
  fetchMarketingCoupon,
  type AdminMarketingData,
  type MarketingCampaignRecord,
  type MarketingCouponRecord,
  updateMarketingCampaign,
  updateMarketingCoupon,
} from "@/lib/api";

type CouponDialogMode = "view" | "edit";
type CampaignDialogMode = "view" | "edit";

interface CouponFormState {
  code: string;
  type: "percentage" | "fixed";
  value: string;
  min_purchase_amount: string;
  usage_count: string;
  max_usage: string;
  status: string;
  starts_at: string;
  ends_at: string;
  total_savings: string;
  currency: string;
}

interface CampaignFormState {
  name: string;
  description: string;
  status: string;
  target_audience: string;
  starts_at: string;
  ends_at: string;
  conversions: string;
  roi_percentage: string;
  total_spent: string;
  total_revenue: string;
  currency: string;
}

const emptyCouponForm: CouponFormState = {
  code: "",
  type: "percentage",
  value: "",
  min_purchase_amount: "",
  usage_count: "0",
  max_usage: "",
  status: "active",
  starts_at: "",
  ends_at: "",
  total_savings: "",
  currency: "SAR",
};

const emptyCampaignForm: CampaignFormState = {
  name: "",
  description: "",
  status: "draft",
  target_audience: "",
  starts_at: "",
  ends_at: "",
  conversions: "0",
  roi_percentage: "0",
  total_spent: "0",
  total_revenue: "0",
  currency: "SAR",
};

const mockMarketingData: AdminMarketingData = {
  stats: {
    total_coupons: 2,
    active_coupons: 2,
    active_campaigns: 1,
    total_savings: "SAR 85,000",
  },
  coupons: [
    {
      id: 1001,
      code: "MOCK20",
      type: "percentage",
      value: 20,
      discount_text: "20%",
      min_purchase: 150,
      usage_count: 120,
      max_usage: 600,
      status: "نشط",
      raw_status: "active",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      total_savings: "SAR 45,000",
      total_savings_value: 45000,
      currency: "SAR",
    },
    {
      id: 1002,
      code: "VIP150",
      type: "fixed",
      value: 150,
      discount_text: "SAR 150",
      min_purchase: 500,
      usage_count: 45,
      max_usage: 300,
      status: "نشط",
      raw_status: "active",
      start_date: "2024-05-01",
      end_date: "2024-10-01",
      total_savings: "SAR 40,000",
      total_savings_value: 40000,
      currency: "SAR",
    },
  ],
  campaigns: [
    {
      id: 2001,
      name: "حملة العملاء المميزين",
      description: "حملة خاصة بالعملاء الأكثر ولاءً مع مزايا إضافية",
      coupons: ["VIP150"],
      coupon_ids: [1002],
      status: "نشط",
      raw_status: "active",
      target_audience: "VIP",
      start_date: "2024-04-01",
      end_date: "2024-12-31",
      conversions: 210,
      roi: "185%",
      roi_percentage: 185,
      total_spent: "SAR 20,000",
      total_revenue: "SAR 57,000",
      total_spent_value: 20000,
      total_revenue_value: 57000,
      currency: "SAR",
    },
    {
      id: 2002,
      name: "عودة المدارس",
      description: "حملة موجهة للأسر قبل موسم الدراسة",
      coupons: ["MOCK20"],
      coupon_ids: [1001],
      status: "مسودة",
      raw_status: "draft",
      target_audience: "العائلات",
      start_date: "2024-08-01",
      end_date: "2024-09-30",
      conversions: 0,
      roi: "0%",
      roi_percentage: 0,
      total_spent: "SAR 0",
      total_revenue: "SAR 0",
      total_spent_value: 0,
      total_revenue_value: 0,
      currency: "SAR",
    },
  ],
};

const buildMockMarketingData = (): AdminMarketingData => JSON.parse(JSON.stringify(mockMarketingData));

const parseNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toNullableNumber = (value: string) => (value.trim() === "" ? null : parseNumber(value));

const parseCurrencyString = (value?: string | null) => {
  if (!value) return 0;
  const numeric = Number(value.replace(/[^\d.-]+/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

export function MarketingPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState("coupons");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [data, setData] = useState<AdminMarketingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [couponDialogMode, setCouponDialogMode] = useState<CouponDialogMode>("view");
  const [selectedCoupon, setSelectedCoupon] = useState<MarketingCouponRecord | null>(null);
  const [couponForm, setCouponForm] = useState<CouponFormState>(emptyCouponForm);
  const [isCouponDialogLoading, setIsCouponDialogLoading] = useState(false);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [campaignDialogMode, setCampaignDialogMode] = useState<CampaignDialogMode>("view");
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaignRecord | null>(null);
  const [campaignForm, setCampaignForm] = useState<CampaignFormState>(emptyCampaignForm);
  const [isCampaignDialogLoading, setIsCampaignDialogLoading] = useState(false);
  const [isSavingCampaign, setIsSavingCampaign] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAdminMarketing();
        if (response?.data) {
          setData(response.data);
        } else {
          setData(buildMockMarketingData());
        }
      } catch (error: any) {
        toast.error(error?.message || t("common.error"));
        setData((prev) => prev ?? buildMockMarketingData());
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t]);

  const coupons = useMemo(() => data?.coupons ?? [], [data]);
  const campaigns = useMemo(() => data?.campaigns ?? [], [data]);
  const stats = data?.stats;

  const filteredCoupons = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
      const matchesType = typeFilter === "all" || coupon.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchTerm, statusFilter, typeFilter]);

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const hydrateCouponForm = (coupon: MarketingCouponRecord): CouponFormState => ({
    code: coupon.code,
    type: (coupon.type as "percentage" | "fixed") ?? "percentage",
    value: coupon.value?.toString() ?? "",
    min_purchase_amount: coupon.min_purchase != null ? coupon.min_purchase.toString() : "",
    usage_count: coupon.usage_count?.toString() ?? "0",
    max_usage: coupon.max_usage != null ? coupon.max_usage.toString() : "",
    status: coupon.raw_status,
    starts_at: coupon.start_date ?? "",
    ends_at: coupon.end_date ?? "",
    total_savings: (coupon.total_savings_value ?? parseCurrencyString(coupon.total_savings)).toString(),
    currency: coupon.currency ?? "SAR",
  });

  const hydrateCampaignForm = (campaign: MarketingCampaignRecord): CampaignFormState => ({
    name: campaign.name,
    description: campaign.description ?? "",
    status: campaign.raw_status,
    target_audience: campaign.target_audience ?? "",
    starts_at: campaign.start_date ?? "",
    ends_at: campaign.end_date ?? "",
    conversions: campaign.conversions?.toString() ?? "0",
    roi_percentage: campaign.roi_percentage?.toString() ?? "0",
    total_spent: (campaign.total_spent_value ?? parseCurrencyString(campaign.total_spent)).toString(),
    total_revenue: (campaign.total_revenue_value ?? parseCurrencyString(campaign.total_revenue)).toString(),
    currency: campaign.currency ?? "SAR",
  });

  const handleCouponDialogOpenChange = (open: boolean) => {
    setIsCouponDialogOpen(open);
    if (!open) {
      setSelectedCoupon(null);
      setCouponDialogMode("view");
      setCouponForm(emptyCouponForm);
    }
  };

  const handleCampaignDialogOpenChange = (open: boolean) => {
    setIsCampaignDialogOpen(open);
    if (!open) {
      setSelectedCampaign(null);
      setCampaignDialogMode("view");
      setCampaignForm(emptyCampaignForm);
    }
  };

  const openCouponDialog = async (couponId: number, mode: CouponDialogMode) => {
    setCouponDialogMode(mode);
    setIsCouponDialogOpen(true);
    setIsCouponDialogLoading(true);
    try {
      const response = await fetchMarketingCoupon(couponId);
      setSelectedCoupon(response.data);
      setCouponForm(hydrateCouponForm(response.data));
    } catch (error: any) {
      const fallback = coupons.find((coupon) => coupon.id === couponId);
      if (fallback) {
        setSelectedCoupon(fallback);
        setCouponForm(hydrateCouponForm(fallback));
      }
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsCouponDialogLoading(false);
    }
  };

  const openCampaignDialog = async (campaignId: number, mode: CampaignDialogMode) => {
    setCampaignDialogMode(mode);
    setIsCampaignDialogOpen(true);
    setIsCampaignDialogLoading(true);
    try {
      const response = await fetchMarketingCampaign(campaignId);
      setSelectedCampaign(response.data);
      setCampaignForm(hydrateCampaignForm(response.data));
    } catch (error: any) {
      const fallback = campaigns.find((campaign) => campaign.id === campaignId);
      if (fallback) {
        setSelectedCampaign(fallback);
        setCampaignForm(hydrateCampaignForm(fallback));
      }
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsCampaignDialogLoading(false);
    }
  };

  const handleCouponFormChange = (field: keyof CouponFormState, value: string) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCampaignFormChange = (field: keyof CampaignFormState, value: string) => {
    setCampaignForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCoupon = async () => {
    if (!selectedCoupon) return;
    setIsSavingCoupon(true);
    try {
      const payload = {
        code: couponForm.code,
        type: couponForm.type,
        value: parseNumber(couponForm.value, selectedCoupon.value),
        min_purchase_amount: toNullableNumber(couponForm.min_purchase_amount),
        usage_count: parseNumber(couponForm.usage_count, selectedCoupon.usage_count),
        max_usage: toNullableNumber(couponForm.max_usage),
        status: couponForm.status,
        starts_at: couponForm.starts_at || null,
        ends_at: couponForm.ends_at || null,
        total_savings: parseNumber(couponForm.total_savings, parseCurrencyString(selectedCoupon.total_savings)),
        currency: couponForm.currency || selectedCoupon.currency || "SAR",
      };
      const response = await updateMarketingCoupon(selectedCoupon.id, payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          coupons: prev.coupons.map((coupon) => (coupon.id === response.data.id ? response.data : coupon)),
        };
      });
      setSelectedCoupon(response.data);
      toast.success(t("admin.marketing.couponUpdated", { defaultValue: "تم تحديث بيانات الكوبون" }));
      handleCouponDialogOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleSaveCampaign = async () => {
    if (!selectedCampaign) return;
    setIsSavingCampaign(true);
    try {
      const payload = {
        name: campaignForm.name,
        description: campaignForm.description || null,
        status: campaignForm.status,
        target_audience: campaignForm.target_audience || null,
        starts_at: campaignForm.starts_at || null,
        ends_at: campaignForm.ends_at || null,
        conversions: parseNumber(campaignForm.conversions, selectedCampaign.conversions),
        roi_percentage: parseNumber(campaignForm.roi_percentage, selectedCampaign.roi_percentage ?? 0),
        total_spent: parseNumber(
          campaignForm.total_spent,
          selectedCampaign.total_spent_value ?? parseCurrencyString(selectedCampaign.total_spent)
        ),
        total_revenue: parseNumber(
          campaignForm.total_revenue,
          selectedCampaign.total_revenue_value ?? parseCurrencyString(selectedCampaign.total_revenue)
        ),
        currency: campaignForm.currency || selectedCampaign.currency || "SAR",
      };
      const response = await updateMarketingCampaign(selectedCampaign.id, payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          campaigns: prev.campaigns.map((campaign) => (campaign.id === response.data.id ? response.data : campaign)),
        };
      });
      setSelectedCampaign(response.data);
      toast.success(t("admin.marketing.campaignUpdated", { defaultValue: "تم تحديث بيانات الحملة" }));
      handleCampaignDialogOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSavingCampaign(false);
    }
  };

  const couponStatusOptions = [
    { value: "active", label: t("admin.marketing.active", { defaultValue: "نشط" }) },
    { value: "paused", label: t("admin.marketing.paused", { defaultValue: "متوقف" }) },
    { value: "finished", label: t("admin.marketing.finished", { defaultValue: "منتهي" }) },
    { value: "expired", label: t("admin.marketing.expired", { defaultValue: "منتهي" }) },
    { value: "draft", label: t("admin.marketing.draft", { defaultValue: "مسودة" }) },
  ];

  const campaignStatusOptions = [
    { value: "active", label: t("admin.marketing.active", { defaultValue: "نشط" }) },
    { value: "paused", label: t("admin.marketing.paused", { defaultValue: "متوقف" }) },
    { value: "finished", label: t("admin.marketing.finished", { defaultValue: "منتهي" }) },
    { value: "expired", label: t("admin.marketing.expired", { defaultValue: "منتهي" }) },
    { value: "draft", label: t("admin.marketing.draft", { defaultValue: "مسودة" }) },
  ];

  const handleExport = () => {
    toast.success(t("admin.marketing.exportSuccess"));
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("admin.marketing.couponCopied", { code }));
  };

  const couponStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": "bg-green-100 text-green-800",
      "منتهي": "bg-gray-100 text-gray-800",
      "متوقف": "bg-red-100 text-red-800",
      "مسودة": "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={statusConfig[status as keyof typeof statusConfig] ?? "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const campaignStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": "bg-blue-100 text-blue-800",
      "منتهي": "bg-gray-100 text-gray-800",
      "مسودة": "bg-yellow-100 text-yellow-800",
      "متوقف": "bg-red-100 text-red-800",
    };
    return <Badge className={statusConfig[status as keyof typeof statusConfig] ?? "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Megaphone className="h-6 w-6" />
          {t("admin.marketing.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.marketing.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.marketing.totalCoupons")}
          value={(stats?.total_coupons ?? coupons.length).toString()}
          icon={Ticket}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.activeCoupons")}
          value={(stats?.active_coupons ?? coupons.filter((c) => c.status === "نشط").length).toString()}
          icon={TrendingUp}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.activeCampaigns")}
          value={(stats?.active_campaigns ?? campaigns.filter((c) => c.status === "نشط").length).toString()}
          icon={Megaphone}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.totalSavings")}
          value={stats?.total_savings ?? "SAR 0"}
          icon={DollarSign}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="relative flex-1 min-w-[240px]">
              <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-muted-foreground`} />
              <input
                type="text"
                placeholder={t("admin.marketing.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'} py-2 border border-gray-300 rounded-md`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.marketing.allStatuses")}</option>
              <option value="نشط">{t("admin.marketing.active")}</option>
              <option value="منتهي">{t("admin.marketing.finished")}</option>
              <option value="متوقف">{t("admin.marketing.paused")}</option>
            </select>
            {activeTab === "coupons" && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">{t("admin.marketing.allTypes")}</option>
                <option value="percentage">{t("admin.marketing.percentage")}</option>
                <option value="fixed">{t("admin.marketing.fixed")}</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="coupons" className={isRTL ? "font-arabic" : ""}>
            {t("admin.marketing.coupons")}
          </TabsTrigger>
          <TabsTrigger value="campaigns" className={isRTL ? "font-arabic" : ""}>
            {t("admin.marketing.campaigns")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Ticket className="h-5 w-5" />
                {t("admin.marketing.couponsList")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.code")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.type")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.value")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.usage")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.period")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.totalSavings")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.status")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                        <div className="flex items-center gap-2">
                          <span>{coupon.code}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleCopyCouponCode(coupon.code)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{coupon.type === "percentage" ? `${coupon.value}%` : `SAR ${coupon.value}`}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{coupon.min_purchase ?? 0}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        {coupon.usage_count}/{coupon.max_usage ?? t("common.notAvailable")}
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        <div className="text-sm text-muted-foreground">
                          {coupon.start_date} - {coupon.end_date ?? t("common.notAvailable")}
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{coupon.total_savings}</TableCell>
                      <TableCell>{couponStatusBadge(coupon.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuLabel>{t("admin.marketing.actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleCopyCouponCode(coupon.code)}>
                              {t("admin.marketing.copyCode")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openCouponDialog(coupon.id, "view")}>
                              <Eye className="h-4 w-4" />
                              {t("admin.marketing.viewCoupon", { defaultValue: "عرض التفاصيل" })}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openCouponDialog(coupon.id, "edit")}>
                              <Edit2 className="h-4 w-4" />
                              {t("admin.marketing.editCoupon")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">{t("admin.marketing.deleteCoupon")}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {isLoading && (
                <div className="p-4 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
              )}
              {!isLoading && !filteredCoupons.length && (
                <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Megaphone className="h-5 w-5" />
                {t("admin.marketing.campaignsList")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.name")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.coupons")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.targetAudience")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.period")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.conversions")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.roi")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.status")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                        <div>
                          <div>{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        <div className="flex flex-wrap gap-1">
                          {campaign.coupons.map((code) => (
                            <Badge key={code} variant="outline">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{campaign.target_audience ?? t("common.notAvailable")}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        {campaign.start_date} - {campaign.end_date ?? t("common.notAvailable")}
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{campaign.conversions}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{campaign.roi}</TableCell>
                      <TableCell>{campaignStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuLabel>{t("admin.marketing.actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openCampaignDialog(campaign.id, "view")}>
                              <Eye className="h-4 w-4" />
                              {t("admin.marketing.viewCampaign", { defaultValue: "عرض الحملة" })}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openCampaignDialog(campaign.id, "edit")}>
                              <Edit2 className="h-4 w-4" />
                              {t("admin.marketing.editCampaign", { defaultValue: "تعديل الحملة" })}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {isLoading && (
                <div className="p-4 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
              )}
              {!isLoading && !filteredCampaigns.length && (
                <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCouponDialogOpen} onOpenChange={handleCouponDialogOpenChange}>
        <DialogContent className={isRTL ? "font-arabic" : "font-sans"} dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>
              {couponDialogMode === "edit"
                ? t("admin.marketing.editCoupon")
                : t("admin.marketing.viewCoupon", { defaultValue: "تفاصيل الكوبون" })}
            </DialogTitle>
          </DialogHeader>
          {isCouponDialogLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : selectedCoupon ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-code">{t("admin.marketing.code")}</Label>
                  <Input
                    id="coupon-code"
                    value={couponForm.code}
                    onChange={(e) => handleCouponFormChange("code", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-type">{t("admin.marketing.type")}</Label>
                  <select
                    id="coupon-type"
                    value={couponForm.type}
                    onChange={(e) => handleCouponFormChange("type", e.target.value as CouponFormState["type"])}
                    disabled={couponDialogMode === "view"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="percentage">{t("admin.marketing.percentage")}</option>
                    <option value="fixed">{t("admin.marketing.fixed")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-value">{t("admin.marketing.value")}</Label>
                  <Input
                    id="coupon-value"
                    type="number"
                    value={couponForm.value}
                    onChange={(e) => handleCouponFormChange("value", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-min-purchase">
                    {t("admin.marketing.minPurchase", { defaultValue: "الحد الأدنى للطلب" })}
                  </Label>
                  <Input
                    id="coupon-min-purchase"
                    type="number"
                    value={couponForm.min_purchase_amount}
                    onChange={(e) => handleCouponFormChange("min_purchase_amount", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-usage">{t("admin.marketing.usage")}</Label>
                  <Input
                    id="coupon-usage"
                    type="number"
                    value={couponForm.usage_count}
                    onChange={(e) => handleCouponFormChange("usage_count", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-max-usage">
                    {t("admin.marketing.maxUsage", { defaultValue: "الحد الأقصى للاستخدام" })}
                  </Label>
                  <Input
                    id="coupon-max-usage"
                    type="number"
                    value={couponForm.max_usage}
                    onChange={(e) => handleCouponFormChange("max_usage", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-status">{t("admin.marketing.status")}</Label>
                  <select
                    id="coupon-status"
                    value={couponForm.status}
                    onChange={(e) => handleCouponFormChange("status", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {couponStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-currency">
                    {t("admin.marketing.currency", { defaultValue: "العملة" })}
                  </Label>
                  <Input
                    id="coupon-currency"
                    value={couponForm.currency}
                    onChange={(e) => handleCouponFormChange("currency", e.target.value)}
                    disabled={couponDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-start">{t("admin.marketing.startDate", { defaultValue: "تاريخ البداية" })}</Label>
                  <Input
                    id="coupon-start"
                    type="date"
                    value={couponForm.starts_at}
                    onChange={(e) => handleCouponFormChange("starts_at", e.target.value)}
                    disabled={couponDialogMode === "view"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coupon-end">{t("admin.marketing.endDate", { defaultValue: "تاريخ النهاية" })}</Label>
                  <Input
                    id="coupon-end"
                    type="date"
                    value={couponForm.ends_at}
                    onChange={(e) => handleCouponFormChange("ends_at", e.target.value)}
                    disabled={couponDialogMode === "view"}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coupon-savings">
                  {t("admin.marketing.totalSavings", { defaultValue: "إجمالي التوفير" })}
                </Label>
                <Input
                  id="coupon-savings"
                  type="number"
                  value={couponForm.total_savings}
                  onChange={(e) => handleCouponFormChange("total_savings", e.target.value)}
                  disabled={couponDialogMode === "view"}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
          {couponDialogMode === "edit" && (
            <DialogFooter>
              <Button
                onClick={handleSaveCoupon}
                disabled={isSavingCoupon || isCouponDialogLoading}
                className="flex items-center gap-2"
              >
                {isSavingCoupon && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{t("common.save")}</span>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCampaignDialogOpen} onOpenChange={handleCampaignDialogOpenChange}>
        <DialogContent className={isRTL ? "font-arabic" : "font-sans"} dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>
              {campaignDialogMode === "edit"
                ? t("admin.marketing.editCampaign", { defaultValue: "تعديل الحملة" })
                : t("admin.marketing.viewCampaign", { defaultValue: "تفاصيل الحملة" })}
            </DialogTitle>
          </DialogHeader>
          {isCampaignDialogLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : selectedCampaign ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="campaign-name">{t("admin.marketing.name")}</Label>
                <Input
                  id="campaign-name"
                  value={campaignForm.name}
                  onChange={(e) => handleCampaignFormChange("name", e.target.value)}
                  disabled={campaignDialogMode === "view"}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="campaign-description">{t("admin.marketing.description", { defaultValue: "الوصف" })}</Label>
                <Textarea
                  id="campaign-description"
                  value={campaignForm.description}
                  onChange={(e) => handleCampaignFormChange("description", e.target.value)}
                  disabled={campaignDialogMode === "view"}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-status">{t("admin.marketing.status")}</Label>
                  <select
                    id="campaign-status"
                    value={campaignForm.status}
                    onChange={(e) => handleCampaignFormChange("status", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {campaignStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-target">
                    {t("admin.marketing.targetAudience", { defaultValue: "الجمهور المستهدف" })}
                  </Label>
                  <Input
                    id="campaign-target"
                    value={campaignForm.target_audience}
                    onChange={(e) => handleCampaignFormChange("target_audience", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-start">{t("admin.marketing.startDate", { defaultValue: "تاريخ البداية" })}</Label>
                  <Input
                    id="campaign-start"
                    type="date"
                    value={campaignForm.starts_at}
                    onChange={(e) => handleCampaignFormChange("starts_at", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-end">{t("admin.marketing.endDate", { defaultValue: "تاريخ النهاية" })}</Label>
                  <Input
                    id="campaign-end"
                    type="date"
                    value={campaignForm.ends_at}
                    onChange={(e) => handleCampaignFormChange("ends_at", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-conversions">{t("admin.marketing.conversions")}</Label>
                  <Input
                    id="campaign-conversions"
                    type="number"
                    value={campaignForm.conversions}
                    onChange={(e) => handleCampaignFormChange("conversions", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-roi">{t("admin.marketing.roi")}</Label>
                  <Input
                    id="campaign-roi"
                    type="number"
                    value={campaignForm.roi_percentage}
                    onChange={(e) => handleCampaignFormChange("roi_percentage", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-spent">{t("admin.marketing.totalSpent", { defaultValue: "إجمالي المصروف" })}</Label>
                  <Input
                    id="campaign-spent"
                    type="number"
                    value={campaignForm.total_spent}
                    onChange={(e) => handleCampaignFormChange("total_spent", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="campaign-revenue">{t("admin.marketing.totalRevenue", { defaultValue: "إجمالي العائد" })}</Label>
                  <Input
                    id="campaign-revenue"
                    type="number"
                    value={campaignForm.total_revenue}
                    onChange={(e) => handleCampaignFormChange("total_revenue", e.target.value)}
                    disabled={campaignDialogMode === "view"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="campaign-currency">
                  {t("admin.marketing.currency", { defaultValue: "العملة" })}
                </Label>
                <Input
                  id="campaign-currency"
                  value={campaignForm.currency}
                  onChange={(e) => handleCampaignFormChange("currency", e.target.value)}
                  disabled={campaignDialogMode === "view"}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
          {campaignDialogMode === "edit" && (
            <DialogFooter>
              <Button
                onClick={handleSaveCampaign}
                disabled={isSavingCampaign || isCampaignDialogLoading}
                className="flex items-center gap-2"
              >
                {isSavingCampaign && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{t("common.save")}</span>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
