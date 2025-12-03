import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  cancelAdminSubscription,
  fetchAdminSubscriptions,
  renewAdminSubscription,
  type AdminSubscriptionsData,
} from "@/lib/api";

export function SubscriptionsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [data, setData] = useState<AdminSubscriptionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscriptionsData["subscriptions"][number] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionSubscriptionId, setActionSubscriptionId] = useState<number | null>(null);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAdminSubscriptions();
      setData(response.data);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const subscriptions = useMemo(() => data?.subscriptions ?? [], [data]);

  const filteredSubscriptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return subscriptions.filter((subscription) => {
      const matchesSearch = (subscription.store_name ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || subscription.raw_status === statusFilter;
      const matchesPlan = planFilter === "all" || subscription.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  const stats = data?.stats;

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

  const getPlanBadge = (plan: string | undefined) => {
    const planConfig = {
      "الأساسية": { className: "bg-gray-100 text-gray-800" },
      "المتقدمة": { className: "bg-blue-100 text-blue-800" },
      "المميزة": { className: "bg-purple-100 text-purple-800" },
      "تجريبي": { className: "bg-yellow-100 text-yellow-800" },
    };

    const config = plan ? planConfig[plan as keyof typeof planConfig] : undefined;

    return (
      <Badge variant="outline" className={config?.className ?? "bg-gray-100 text-gray-800"}>
        {plan ?? t("common.notAvailable")}
      </Badge>
    );
  };

  const handleExport = () => {
    toast.success(t("admin.subscriptions.exportSuccess"));
  };

  const handleRenewSubscription = async (subscriptionId: number) => {
    setActionSubscriptionId(subscriptionId);
    try {
      const response = await renewAdminSubscription(subscriptionId);
      toast.success(t("admin.subscriptions.renewSuccess"));
      setSelectedSubscription((prev) => (prev && prev.id === subscriptionId ? response.data : prev));
      await loadSubscriptions();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setActionSubscriptionId(null);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!window.confirm(t("admin.subscriptions.cancelConfirm"))) return;
    setActionSubscriptionId(subscriptionId);
    try {
      const response = await cancelAdminSubscription(subscriptionId);
      toast.success(t("admin.subscriptions.cancelSuccess"));
      setSelectedSubscription((prev) => (prev && prev.id === subscriptionId ? response.data : prev));
      await loadSubscriptions();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setActionSubscriptionId(null);
    }
  };

  const handleViewSubscription = (subscription: AdminSubscriptionsData["subscriptions"][number]) => {
    setSelectedSubscription(subscription);
    setIsDialogOpen(true);
  };

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
          value={stats?.active_subscriptions ?? 0}
          icon={TrendingUp}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.subscriptions.totalRevenue")}
          value={stats?.total_revenue ?? "SAR 0"}
          icon={DollarSign}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.subscriptions.expiringSoon")}
          value={stats?.expiring_soon ?? 0}
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
              <option value="active">{t("admin.subscriptions.active")}</option>
              <option value="expired">{t("admin.subscriptions.expired")}</option>
              <option value="canceled">{t("admin.subscriptions.cancelled")}</option>
              <option value="trial">{t("admin.subscriptions.trial")}</option>
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
                    {subscription.store_name ?? t("common.notAvailable")}
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
                    {subscription.start_date ?? "-"}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {subscription.end_date ?? "-"}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <Badge variant={subscription.auto_renew ? "default" : "secondary"}>
                      {subscription.auto_renew ? t("admin.subscriptions.yes") : t("admin.subscriptions.no")}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {subscription.total_paid}
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
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            handleViewSubscription(subscription);
                          }}
                        >
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.subscriptions.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            handleViewSubscription(subscription);
                          }}
                        >
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.subscriptions.edit")}
                        </DropdownMenuItem>
                        {subscription.raw_status === "active" && (
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault();
                              handleRenewSubscription(subscription.id);
                            }}
                            disabled={actionSubscriptionId === subscription.id}
                          >
                            <RefreshCw className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {actionSubscriptionId === subscription.id
                              ? t("common.loading")
                              : t("admin.subscriptions.renew")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(event) => {
                            event.preventDefault();
                            handleCancelSubscription(subscription.id);
                          }}
                          disabled={actionSubscriptionId === subscription.id}
                        >
                          <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {actionSubscriptionId === subscription.id
                            ? t("common.loading")
                            : t("admin.subscriptions.cancel")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("common.loading")}
            </div>
          )}
          {!isLoading && !filteredSubscriptions.length && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("common.noData")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.subscriptions.shownFrom", { shown: filteredSubscriptions.length, total: subscriptions.length })}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t("admin.subscriptions.detailsTitle")}</DialogTitle>
          </DialogHeader>
          {selectedSubscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.storeName")}</p>
                  <p className="font-medium">{selectedSubscription.store_name ?? t("common.notAvailable")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.plan")}</p>
                  <p className="font-medium">{selectedSubscription.plan ?? t("common.notAvailable")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.status")}</p>
                  <p className="font-medium">{selectedSubscription.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.amount")}</p>
                  <p className="font-medium">{selectedSubscription.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.startDate")}</p>
                  <p className="font-medium">{selectedSubscription.start_date ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.endDate")}</p>
                  <p className="font-medium">{selectedSubscription.end_date ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.lastPayment")}</p>
                  <p className="font-medium">{selectedSubscription.last_payment ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.subscriptions.nextPayment")}</p>
                  <p className="font-medium">{selectedSubscription.next_payment ?? "-"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleRenewSubscription(selectedSubscription.id)}
                  disabled={actionSubscriptionId === selectedSubscription.id}
                >
                  {actionSubscriptionId === selectedSubscription.id
                    ? t("common.loading")
                    : t("admin.subscriptions.renew")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelSubscription(selectedSubscription.id)}
                  disabled={actionSubscriptionId === selectedSubscription.id}
                >
                  {actionSubscriptionId === selectedSubscription.id
                    ? t("common.loading")
                    : t("admin.subscriptions.cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
