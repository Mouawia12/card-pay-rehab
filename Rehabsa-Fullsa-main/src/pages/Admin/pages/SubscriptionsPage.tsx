import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Search,
  MoreHorizontal,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
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

const subscriptions = [
  {
    id: "sub-1",
    storeName: "مقهى النخيل",
    plan: "المتقدمة",
    status: "نشط",
    amount: "SAR 299",
    startDate: "2024-01-15",
    endDate: "2025-02-15",
    autoRenew: true,
    paymentMethod: "بطاقة ائتمان",
    lastPayment: "2024-12-15",
    nextPayment: "2025-01-15",
    totalPaid: "SAR 3,588"
  },
  {
    id: "sub-2",
    storeName: "صالون الجمال",
    plan: "الأساسية",
    status: "نشط",
    amount: "SAR 199",
    startDate: "2024-03-20",
    endDate: "2025-03-20",
    autoRenew: true,
    paymentMethod: "تحويل بنكي",
    lastPayment: "2024-12-20",
    nextPayment: "2025-01-20",
    totalPaid: "SAR 1,990"
  },
  {
    id: "sub-3",
    storeName: "مطعم الشرق",
    plan: "المميزة",
    status: "نشط",
    amount: "SAR 499",
    startDate: "2023-12-10",
    endDate: "2025-12-10",
    autoRenew: true,
    paymentMethod: "بطاقة ائتمان",
    lastPayment: "2024-12-10",
    nextPayment: "2025-01-10",
    totalPaid: "SAR 6,488"
  },
  {
    id: "sub-4",
    storeName: "صالة الرياضة",
    plan: "المتقدمة",
    status: "منتهي",
    amount: "SAR 299",
    startDate: "2024-06-05",
    endDate: "2025-01-10",
    autoRenew: false,
    paymentMethod: "بطاقة ائتمان",
    lastPayment: "2024-12-05",
    nextPayment: null,
    totalPaid: "SAR 2,094"
  },
  {
    id: "sub-5",
    storeName: "مغسلة السيارات",
    plan: "تجريبي",
    status: "تجريبي",
    amount: "SAR 0",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    autoRenew: false,
    paymentMethod: "مجاني",
    lastPayment: null,
    nextPayment: null,
    totalPaid: "SAR 0"
  }
];

export function SubscriptionsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");

  const handleExport = () => {
    toast.success(t("admin.subscriptions.exportSuccess"));
  };

  const handleRenewSubscription = (_subscriptionId: string) => {
    toast.success(t("admin.subscriptions.renewalSuccess"));
  };

  const handleCancelSubscription = (_subscriptionId: string) => {
    toast.success(t("admin.subscriptions.cancellationSuccess"));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "منتهي": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "ملغي": { variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      "تجريبي": { variant: "outline" as const, className: "bg-blue-100 text-blue-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["نشط"];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      "الأساسية": { className: "bg-gray-100 text-gray-800" },
      "المتقدمة": { className: "bg-blue-100 text-blue-800" },
      "المميزة": { className: "bg-purple-100 text-purple-800" },
      "تجريبي": { className: "bg-yellow-100 text-yellow-800" },
    };
    
    const config = planConfig[plan as keyof typeof planConfig] || planConfig["الأساسية"];
    
    return (
      <Badge variant="outline" className={config.className}>
        {plan}
      </Badge>
    );
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;
    const matchesPlan = planFilter === "all" || subscription.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalRevenue = subscriptions.reduce((sum, sub) => {
    const amount = parseFloat(sub.totalPaid.replace(/[^\d.]/g, ''));
    return sum + amount;
  }, 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === "نشط").length;
  const expiringSoon = subscriptions.filter(sub => {
    if (!sub.endDate) return false;
    const endDate = new Date(sub.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <CreditCard className="h-6 w-6" />
          {t("admin.subscriptions.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.subscriptions.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.subscriptions.totalSubscriptions")}
          value={subscriptions.length}
          icon={CreditCard}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.subscriptions.activeSubscriptions")}
          value={activeSubscriptions}
          icon={TrendingUp}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.subscriptions.totalRevenue")}
          value={`SAR ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.subscriptions.expiringSoon")}
          value={expiringSoon}
          icon={Calendar}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="relative flex-1 max-w-sm">
              <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-muted-foreground`} />
              <input
                type="text"
                placeholder={t("admin.subscriptions.searchPlaceholder")}
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
              <option value="all">{t("admin.subscriptions.allStatuses")}</option>
              <option value="نشط">{t("admin.subscriptions.active")}</option>
              <option value="منتهي">{t("admin.subscriptions.expired")}</option>
              <option value="ملغي">{t("admin.subscriptions.cancelled")}</option>
              <option value="تجريبي">{t("admin.subscriptions.trial")}</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.subscriptions.allPlans")}</option>
              <option value="الأساسية">{t("admin.subscriptions.basicPlan")}</option>
              <option value="المتقدمة">{t("admin.subscriptions.advancedPlan")}</option>
              <option value="المميزة">{t("admin.subscriptions.premiumPlan")}</option>
              <option value="تجريبي">{t("admin.subscriptions.trialPlan")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.storeName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.plan")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.amount")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.startDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.endDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.autoRenew")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.totalPaid")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.subscriptions.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {subscription.storeName}
                  </TableCell>
                  <TableCell>
                    {getPlanBadge(subscription.plan)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subscription.status)}
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {subscription.amount}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {subscription.startDate}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {subscription.endDate}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                      {subscription.autoRenew ? t("admin.subscriptions.yes") : t("admin.subscriptions.no")}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {subscription.totalPaid}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuLabel>{t("admin.subscriptions.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.subscriptions.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.subscriptions.edit")}
                        </DropdownMenuItem>
                        {subscription.status === "نشط" && (
                          <DropdownMenuItem onClick={() => handleRenewSubscription(subscription.id)}>
                            <RefreshCw className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.subscriptions.renew")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleCancelSubscription(subscription.id)}
                        >
                          <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.subscriptions.cancel")}
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

      {/* Pagination */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.subscriptions.shownFrom", { shown: filteredSubscriptions.length, total: subscriptions.length })}
        </p>
      </div>
    </div>
  );
}
