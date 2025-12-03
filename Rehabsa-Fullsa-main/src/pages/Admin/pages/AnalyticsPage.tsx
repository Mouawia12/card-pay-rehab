import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Store,
  DollarSign,
  Activity,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchAdminAnalytics, type AdminAnalyticsData } from "@/lib/api";
import { toast } from "sonner";

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899"];

export function AnalyticsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAdminAnalytics();
        setData(response.data);
      } catch {
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t]);

  const stats = data?.stats;
  const monthlyGrowthData = useMemo(() => data?.monthly_growth ?? [], [data]);
  const planDistributionData = data?.plan_distribution ?? [];
  const topPerformingStores = data?.top_stores ?? [];
  const userActivityData = data?.user_activity ?? [];

  const handleExport = () => {
    toast.success(t("admin.analytics.exportSuccess"));
  };

  const periods = [
    { value: "day", label: t("admin.analytics.day") },
    { value: "week", label: t("admin.analytics.week") },
    { value: "month", label: t("admin.analytics.month") },
    { value: "year", label: t("admin.analytics.year") },
  ];

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <BarChart3 className="h-6 w-6" />
          {t("admin.analytics.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.analytics.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={selectedPeriod === period.value ? "bg-primary text-primary-foreground" : ""}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.analytics.totalRevenue")}
          value={stats?.total_revenue ?? "SAR 0"}
          icon={DollarSign}
          description={`${stats?.avg_growth ?? "0%"} ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.totalStores")}
          value={(stats?.total_stores ?? 0).toString()}
          icon={Store}
          description={`+12% ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.totalUsers")}
          value={(stats?.total_users ?? 0).toLocaleString()}
          icon={Users}
          description={`+8% ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.avgGrowth")}
          value={stats?.avg_growth ?? "0%"}
          icon={Activity}
          description={t("admin.analytics.monthlyGrowth")}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-5 w-5" />
              {t("admin.analytics.monthlyGrowth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="stores" stroke="#10b981" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BarChart3 className="h-5 w-5" />
              {t("admin.analytics.planDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={planDistributionData} dataKey="value" nameKey="name" outerRadius={110} label>
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Store className="h-5 w-5" />
              {t("admin.analytics.topStores")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingStores.map((store) => (
              <div key={store.name} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-semibold">{store.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.analytics.customers")}: {store.customers.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">SAR {store.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">{store.growth}</p>
                </div>
              </div>
            ))}
            {!topPerformingStores.length && !isLoading && (
              <p className="text-sm text-muted-foreground text-center">{t("common.noData")}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="h-5 w-5" />
              {t("admin.analytics.userActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active_users" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">{t("common.loading")}</div>
      )}
    </div>
  );
}
