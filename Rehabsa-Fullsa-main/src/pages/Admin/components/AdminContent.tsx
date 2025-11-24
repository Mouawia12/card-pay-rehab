import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "./StatsCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Activity, ArrowUpRight, CreditCard, DollarSign, Eye, Store, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AdminSummary, fetchAdminSummary } from "@/lib/api";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ef4444"];

export function AdminContent() {
  const { t } = useTranslation();
  const { isRTL, language } = useDirection();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchAdminSummary();
        setSummary(res.data);
      } catch (err: any) {
        console.error("Failed to load admin summary", err);
        toast.error(err?.message || t("admin.dashboard.error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t]);

  const stats = useMemo(
    () => [
      { title: t("admin.dashboard.stats.totalStores"), value: summary?.totals.businesses ?? 0, icon: Store },
      { title: t("admin.dashboard.stats.totalUsers"), value: summary?.totals.users ?? 0, icon: Users },
      { title: t("admin.dashboard.stats.totalCards"), value: summary?.totals.cards ?? 0, icon: CreditCard },
      { title: t("admin.dashboard.stats.totalCustomers"), value: summary?.totals.customers ?? 0, icon: Activity },
      { title: t("admin.dashboard.stats.totalTransactions"), value: summary?.totals.transactions ?? 0, icon: TrendingUp },
      { title: t("admin.dashboard.stats.totalRevenue"), value: `SAR ${summary?.totals.revenue ?? 0}`, icon: DollarSign },
    ],
    [summary, t]
  );

  const additionalStats = useMemo(
    () => [
      { title: t("admin.dashboard.stats.totalCards"), value: summary?.totals.cards ?? 0, icon: Store },
      { title: t("admin.dashboard.stats.totalCustomers"), value: summary?.totals.customers ?? 0, icon: Activity },
      { title: t("admin.dashboard.stats.totalTransactions"), value: summary?.totals.transactions ?? 0, icon: TrendingUp },
    ],
    [summary, t]
  );

  const monthlyGrowthData = useMemo(() => {
    return summary?.transactions_by_day?.map((item) => ({
      month: item.day,
      stores: item.total,
      revenue: item.amount,
    })) ?? [];
  }, [summary]);

  const usersByRoleData = useMemo(() => {
    if (!summary?.users_by_role) return [];
    return Object.entries(summary.users_by_role).map(([role, value], idx) => ({
      name: role,
      value: Number(value),
      color: COLORS[idx % COLORS.length],
    }));
  }, [summary]);

  const latestTransactions = summary?.latest_transactions ?? [];
  const latestBusinesses = summary?.latest_businesses ?? [];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}>
            {t("admin.dashboard.title")}
          </h1>
          <p className={`text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}>
            {t("admin.dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[260px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: language === "ar" ? ar : enUS }) : t("common.pickDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={language === "ar" ? ar : enUS}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            {t("admin.dashboard.export")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <AdminStatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("admin.dashboard.charts.monthlyGrowth")}</p>
              <h3 className="text-xl font-semibold">{t("admin.dashboard.charts.storesAndRevenue")}</h3>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {t("admin.dashboard.viewAll")}
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stores" stroke="#3b82f6" />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">{t("admin.dashboard.charts.usersByRole")}</p>
            <h3 className="text-xl font-semibold">{t("admin.dashboard.charts.subscriptionsDistribution")}</h3>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usersByRoleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {usersByRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {additionalStats.map((stat, idx) => (
          <Card key={idx} className="p-4 flex items-center gap-3">
            <stat.icon className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <span className="text-xl font-semibold">{stat.value}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Latest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">{t("admin.dashboard.latest.transactions")}</p>
            <h3 className="text-xl font-semibold">{t("admin.dashboard.latest.title")}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestTransactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.customer?.name || t("admin.dashboard.unknown")} · {tx.card?.name || ""}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {tx.amount} {tx.currency}
                </span>
              </div>
            ))}
            {!latestTransactions.length && <p className="text-sm text-muted-foreground">{t("admin.dashboard.noData")}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">{t("admin.dashboard.latest.stores")}</p>
            <h3 className="text-xl font-semibold">{t("admin.dashboard.latest.title")}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestBusinesses.map((biz: any) => (
              <div key={biz.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{biz.name}</p>
                  <p className="text-xs text-muted-foreground">{biz.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{biz.city}</span>
              </div>
            ))}
            {!latestBusinesses.length && <p className="text-sm text-muted-foreground">{t("admin.dashboard.noData")}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Skeleton / loader */}
      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      )}
    </div>
  );
}
