import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Search,
  MoreHorizontal,
  Megaphone,
  Ticket,
  TrendingUp,
  Users,
  DollarSign,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Tag,
  Percent,
  Target,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for coupons
const coupons = [
  {
    id: "coupon-1",
    code: "SAVE20",
    type: "percentage",
    value: 20,
    discount: "20%",
    minPurchase: 100,
    usageCount: 245,
    maxUsage: 1000,
    status: "نشط",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    totalSavings: "SAR 12,450",
  },
  {
    id: "coupon-2",
    code: "WELCOME50",
    type: "fixed",
    value: 50,
    discount: "SAR 50",
    minPurchase: 200,
    usageCount: 189,
    maxUsage: 500,
    status: "نشط",
    startDate: "2024-06-01",
    endDate: "2025-06-01",
    totalSavings: "SAR 9,450",
  },
  {
    id: "coupon-3",
    code: "SUMMER30",
    type: "percentage",
    value: 30,
    discount: "30%",
    minPurchase: 150,
    usageCount: 567,
    maxUsage: 1000,
    status: "نشط",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    totalSavings: "SAR 28,350",
  },
  {
    id: "coupon-4",
    code: "NEWUSER100",
    type: "fixed",
    value: 100,
    discount: "SAR 100",
    minPurchase: 500,
    usageCount: 45,
    maxUsage: 200,
    status: "منتهي",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalSavings: "SAR 4,500",
  },
  {
    id: "coupon-5",
    code: "FLASH25",
    type: "percentage",
    value: 25,
    discount: "25%",
    minPurchase: 50,
    usageCount: 1234,
    maxUsage: 2000,
    status: "نشط",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    totalSavings: "SAR 61,700",
  },
];

// Mock data for campaigns
const campaigns = [
  {
    id: "campaign-1",
    name: "حملة الصيف الكبيرة",
    description: "خصومات صيفية على جميع المنتجات",
    coupons: ["SAVE20", "SUMMER30"],
    status: "نشط",
    targetAudience: "جميع العملاء",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    conversions: 890,
    roi: "245%",
    totalSpent: "SAR 15,000",
    totalRevenue: "SAR 52,250",
  },
  {
    id: "campaign-2",
    name: "ترحيب بالعملاء الجدد",
    description: "عروض خاصة للعملاء الجدد",
    coupons: ["WELCOME50", "NEWUSER100"],
    status: "منتهي",
    targetAudience: "عملاء جدد",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    conversions: 234,
    roi: "180%",
    totalSpent: "SAR 8,000",
    totalRevenue: "SAR 22,400",
  },
  {
    id: "campaign-3",
    name: "عروض الفلاش",
    description: "عروض محدودة بوقت",
    coupons: ["FLASH25"],
    status: "نشط",
    targetAudience: "جميع العملاء",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    conversions: 1234,
    roi: "310%",
    totalSpent: "SAR 20,000",
    totalRevenue: "SAR 82,000",
  },
];

export function MarketingPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = React.useState("coupons");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");

  // Coupon Dialog States
  const [isCouponDialogOpen, setIsCouponDialogOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<string | null>(null);
  const [couponForm, setCouponForm] = React.useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minPurchase: "",
    maxUsage: "",
    startDate: "",
    endDate: "",
    status: "نشط",
  });

  // Campaign Dialog States
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<string | null>(null);
  const [campaignForm, setCampaignForm] = React.useState({
    name: "",
    description: "",
    coupons: [] as string[],
    targetAudience: "",
    startDate: "",
    endDate: "",
    status: "نشط",
  });

  // Calculate statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === "نشط").length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const totalSavings = coupons.reduce((sum, c) => {
    const savings = parseFloat(c.totalSavings.replace(/[^\d.]/g, ""));
    return sum + savings;
  }, 0);

  const conversionRate = campaigns.length > 0
    ? ((campaigns.reduce((sum, c) => sum + c.conversions, 0) / totalUsage) * 100).toFixed(1)
    : "0";

  const handleExport = () => {
    toast.success(t("admin.marketing.exportSuccess"));
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("admin.marketing.couponCopied", { code }));
  };

  const handleDeleteCoupon = (_id: string) => {
    toast.success(t("admin.marketing.couponDeleted"));
  };

  const handleToggleCouponStatus = (_id: string) => {
    toast.success(t("admin.marketing.couponStatusUpdated"));
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      maxUsage: "",
      startDate: "",
      endDate: "",
      status: "نشط",
    });
    setIsCouponDialogOpen(true);
  };

  const handleEditCoupon = (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) {
      setEditingCoupon(id);
      setCouponForm({
        code: coupon.code,
        type: coupon.type as "percentage" | "fixed",
        value: coupon.value.toString(),
        minPurchase: coupon.minPurchase.toString(),
        maxUsage: coupon.maxUsage.toString(),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
      });
      setIsCouponDialogOpen(true);
    }
  };

  const handleSaveCoupon = () => {
    // Validation
    if (!couponForm.code || !couponForm.value || !couponForm.startDate || !couponForm.endDate) {
      toast.error(t("admin.marketing.fillRequiredFields"));
      return;
    }
    
    if (editingCoupon) {
      toast.success(t("admin.marketing.couponUpdated"));
    } else {
      toast.success(t("admin.marketing.couponCreated"));
    }
    setIsCouponDialogOpen(false);
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setCampaignForm({
      name: "",
      description: "",
      coupons: [],
      targetAudience: "",
      startDate: "",
      endDate: "",
      status: "نشط",
    });
    setIsCampaignDialogOpen(true);
  };

  const handleEditCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setEditingCampaign(id);
      setCampaignForm({
        name: campaign.name,
        description: campaign.description,
        coupons: campaign.coupons,
        targetAudience: campaign.targetAudience,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status,
      });
      setIsCampaignDialogOpen(true);
    }
  };

  const handleSaveCampaign = () => {
    // Validation
    if (!campaignForm.name || !campaignForm.startDate || !campaignForm.endDate) {
      toast.error(t("admin.marketing.fillRequiredFields"));
      return;
    }
    
    if (editingCampaign) {
      toast.success(t("admin.marketing.campaignUpdated"));
    } else {
      toast.success(t("admin.marketing.campaignCreated"));
    }
    setIsCampaignDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "منتهي": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "متوقف": { variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["نشط"];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    if (type === "percentage") {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          <Percent className="h-3 w-3 mr-1" />
          {t("admin.marketing.percentage")}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-purple-100 text-purple-800">
        <DollarSign className="h-3 w-3 mr-1" />
        {t("admin.marketing.fixedAmount")}
      </Badge>
    );
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    const matchesType = typeFilter === "all" || coupon.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div
      className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? "flex-row" : "flex-row"}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "text-left" : "text-right"}`}>
          <Megaphone className="h-6 w-6" />
          {t("admin.marketing.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? "text-left" : "text-right"}>
            <span>{t("admin.marketing.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.marketing.totalCoupons")}
          value={totalCoupons}
          icon={Ticket}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.activeCoupons")}
          value={activeCoupons}
          icon={Tag}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.totalUsage")}
          value={totalUsage.toLocaleString()}
          icon={TrendingUp}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.marketing.conversionRate")}
          value={`${conversionRate}%`}
          icon={Target}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="coupons">{t("admin.marketing.coupons")}</TabsTrigger>
          <TabsTrigger value="campaigns">{t("admin.marketing.campaigns")}</TabsTrigger>
          <TabsTrigger value="statistics">{t("admin.marketing.statistics")}</TabsTrigger>
        </TabsList>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>{t("admin.marketing.coupons")}</CardTitle>
              <Button onClick={handleCreateCoupon} className={isRTL ? "mr-auto" : "ml-auto"}>
                <Plus className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
                {t("admin.marketing.createCoupon")}
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                <div className="relative flex-1 max-w-sm">
                  <Search className={`absolute top-2.5 ${isRTL ? "left-2" : "right-2"} h-4 w-4 text-muted-foreground`} />
                  <input
                    type="text"
                    placeholder={t("admin.marketing.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${isRTL ? "pl-8 pr-4 text-right" : "pr-8 pl-4 text-left"} py-2 border border-gray-300 rounded-md`}
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
                  <option value="منتهي">{t("admin.marketing.expired")}</option>
                  <option value="متوقف">{t("admin.marketing.paused")}</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">{t("admin.marketing.allTypes")}</option>
                  <option value="percentage">{t("admin.marketing.percentage")}</option>
                  <option value="fixed">{t("admin.marketing.fixedAmount")}</option>
                </select>
              </div>

              {/* Coupons Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.code")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.type")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.discount")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.usage")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.status")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.dates")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">{coupon.code}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCouponCode(coupon.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(coupon.type)}</TableCell>
                      <TableCell className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
                        {coupon.discount}
                      </TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        {coupon.usageCount} / {coupon.maxUsage}
                      </TableCell>
                      <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        <div className="text-sm">
                          <div>{coupon.startDate}</div>
                          <div className="text-muted-foreground">{coupon.endDate}</div>
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem>
                              <Eye className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCoupon(coupon.id)}>
                              <Edit className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyCouponCode(coupon.code)}>
                              <Copy className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.copyCode")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleCouponStatus(coupon.id)}>
                              <Tag className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {coupon.status === "نشط"
                                ? t("admin.marketing.deactivate")
                                : t("admin.marketing.activate")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className={isRTL ? "text-right" : "text-left"}>{t("admin.marketing.campaigns")}</CardTitle>
              <Button onClick={handleCreateCampaign} className={isRTL ? "mr-auto" : "ml-auto"}>
                <Plus className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
                {t("admin.marketing.createCampaign")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.campaignName")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.coupons")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.status")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.conversions")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.roi")}</TableHead>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.marketing.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
                        <div>
                          <div className="font-semibold">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {campaign.coupons.map((code) => (
                            <Badge key={code} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>{campaign.conversions}</TableCell>
                      <TableCell className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>{campaign.roi}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCampaign(campaign.id)}>
                              <Edit className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.marketing.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupon Dialog */}
        <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
          <DialogContent className={`max-w-2xl ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                {editingCoupon ? t("admin.marketing.editCoupon") : t("admin.marketing.createCoupon")}
              </DialogTitle>
              <DialogDescription className={isRTL ? "text-right" : "text-left"}>
                {editingCoupon 
                  ? t("admin.marketing.editCouponDescription")
                  : t("admin.marketing.createCouponDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Coupon Code */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="couponCode" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.code")} *
                </Label>
                <Input
                  id="couponCode"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.marketing.codePlaceholder")}
                />
              </div>

              {/* Coupon Type */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="couponType" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.type")} *
                </Label>
                <select
                  id="couponType"
                  value={couponForm.type}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, type: e.target.value as "percentage" | "fixed" }))}
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                >
                  <option value="percentage">{t("admin.marketing.percentage")}</option>
                  <option value="fixed">{t("admin.marketing.fixedAmount")}</option>
                </select>
              </div>

              {/* Discount Value */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="couponValue" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {couponForm.type === "percentage" ? t("admin.marketing.discountPercentage") : t("admin.marketing.discountAmount")} *
                </Label>
                <div className={`col-span-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Input
                    id="couponValue"
                    type="number"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, value: e.target.value }))}
                    className={`${isRTL ? "text-right" : "text-left"}`}
                    placeholder={couponForm.type === "percentage" ? "20" : "50"}
                    min="0"
                    max={couponForm.type === "percentage" ? "100" : undefined}
                  />
                  <span className="text-sm text-gray-600">
                    {couponForm.type === "percentage" ? "%" : "SAR"}
                  </span>
                </div>
              </div>

              {/* Min Purchase */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="minPurchase" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.minPurchase")}
                </Label>
                <div className={`col-span-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Input
                    id="minPurchase"
                    type="number"
                    value={couponForm.minPurchase}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, minPurchase: e.target.value }))}
                    className={`${isRTL ? "text-right" : "text-left"}`}
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-600">SAR</span>
                </div>
              </div>

              {/* Max Usage */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="maxUsage" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.maxUsage")}
                </Label>
                <Input
                  id="maxUsage"
                  type="number"
                  value={couponForm.maxUsage}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, maxUsage: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder="1000"
                  min="0"
                />
              </div>

              {/* Dates */}
              <div className={`grid grid-cols-2 gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label htmlFor="startDate" className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.marketing.startDate")} *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={couponForm.startDate}
                    onChange={(e) => setCouponForm(prev сайте => ({ ...prev, startDate: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label htmlFor="endDate" className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.marketing.endDate")} *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="couponStatus" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.status")}
                </Label>
                <select
                  id="couponStatus"
                  value={couponForm.status}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, status: e.target.value }))}
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                >
                  <option value="نشط">{t("admin.marketing.active")}</option>
                  <option value="متوقف">{t("admin.marketing.paused")}</option>
                  <option value="منتهي">{t("admin.marketing.expired")}</option>
                </select>
              </div>
            </div>

            <DialogFooter className={`${isRTL ? "flex-row-reverse" : ""}`}>
              <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                {t("admin.marketing.cancel")}
              </Button>
              <Button onClick={handleSaveCoupon}>
                {editingCoupon ? t("admin.marketing.update") : t("admin.marketing.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Campaign Dialog */}
        <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
          <DialogContent className={`max-w-2xl ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                {editingCampaign ? t("admin.marketing.editCampaign") : t("admin.marketing.createCampaign")}
              </DialogTitle>
              <DialogDescription className={isRTL ? "text-right" : "text-left"}>
                {editingCampaign
                  ? t("admin.marketing.editCampaignDescription")
                  : t("admin.marketing.createCampaignDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Campaign Name */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="campaignName" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.campaignName")} *
                </Label>
                <Input
                  id="campaignName"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.marketing.campaignNamePlaceholder")}
                />
              </div>

              {/* Description */}
              <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="campaignDescription" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.description")}
                </Label>
                <Textarea
                  id="campaignDescription"
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.marketing.descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              {/* Target Audience */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="targetAudience" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.targetAudience")}
                </Label>
                <Input
                  id="targetAudience"
                  value={campaignForm.targetAudience}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.marketing.targetAudiencePlaceholder")}
                />
              </div>

              {/* Dates */}
              <div className={`grid grid-cols-2 gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label htmlFor="campaignStartDate" className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.marketing.startDate")} *
                  </Label>
                  <Input
                    id="campaignStartDate"
                    type="date"
                    value={campaignForm.startDate}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label htmlFor="campaignEndDate" className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.marketing.endDate")} *
                  </Label>
                  <Input
                    id="campaignEndDate"
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="campaignStatus" className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.marketing.status")}
                </Label>
                <select
                  id="campaignStatus"
                  value={campaignForm.status}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, status: e.target.value }))}
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                >
                  <option value="نشط">{t("admin.marketing.active")}</option>
                  <option value="متوقف">{t("admin.marketing.paused")}</option>
                  <option value="منتهي">{t("admin.marketing.expired")}</option>
                </select>
              </div>
            </div>

            <DialogFooter className={`${isRTL ? "flex-row-reverse" : ""}`}>
              <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                {t("admin.marketing.cancel")}
              </Button>
              <Button onClick={handleSaveCampaign}>
                {editingCampaign ? t("admin.marketing.update") : t("admin.marketing.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? "text-right" : "text-left"}>
                  {t("admin.marketing.couponStatistics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.totalSavings")}
                    </span>
                    <span className="font-bold text-green-600">
                      SAR {totalSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.averageUsage")}
                    </span>
                    <span className="font-bold">
                      {(totalUsage / totalCoupons).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.mostUsedCoupon")}
                    </span>
                    <span className="font-bold">
                      {coupons.reduce((prev, current) =>
                        prev.usageCount > current.usageCount ? prev : current
                      ).code}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? "text-right" : "text-left"}>
                  {t("admin.marketing.campaignStatistics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.totalCampaigns")}
                    </span>
                    <span className="font-bold">{campaigns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.activeCampaigns")}
                    </span>
                    <span className="font-bold text-green-600">
                      {campaigns.filter((c) => c.status === "نشط").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("admin.marketing.averageROI")}
                    </span>
                    <span className="font-bold text-purple-600">
                      {(
                        campaigns.reduce((sum, c) => {
                          const roi = parseFloat(c.roi.replace("%", ""));
                          return sum + roi;
                        }, 0) / campaigns.length
                      ).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


