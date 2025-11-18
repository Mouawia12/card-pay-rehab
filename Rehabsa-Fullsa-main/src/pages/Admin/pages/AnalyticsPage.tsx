import React from "react";
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
  CreditCard,
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
  Cell 
} from 'recharts';

// Mock data for analytics
const monthlyGrowthData = [
  { month: "يناير", stores: 120, revenue: 45000, users: 1200 },
  { month: "فبراير", stores: 135, revenue: 52000, users: 1350 },
  { month: "مارس", stores: 148, revenue: 58000, users: 1480 },
  { month: "أبريل", stores: 162, revenue: 62000, users: 1620 },
  { month: "مايو", stores: 175, revenue: 68000, users: 1750 },
  { month: "يونيو", stores: 189, revenue: 75000, users: 1890 },
  { month: "يوليو", stores: 203, revenue: 82000, users: 2030 },
  { month: "أغسطس", stores: 218, revenue: 89000, users: 2180 },
  { month: "سبتمبر", stores: 234, revenue: 95000, users: 2340 },
  { month: "أكتوبر", stores: 247, revenue: 89450, users: 2470 },
];

const planDistributionData = [
  { name: "الأساسية", value: 45, color: "#3b82f6" },
  { name: "المتقدمة", value: 35, color: "#10b981" },
  { name: "المميزة", value: 20, color: "#f59e0b" },
];

const topPerformingStores = [
  { name: "مقهى النخيل", revenue: 12500, customers: 1250, growth: "+15.3%" },
  { name: "صالون الجمال", revenue: 8900, customers: 890, growth: "+12.1%" },
  { name: "مطعم الشرق", revenue: 21000, customers: 2100, growth: "+18.7%" },
  { name: "صالة الرياضة", revenue: 15600, customers: 1560, growth: "+8.2%" },
];

const userActivityData = [
  { hour: "00:00", activeUsers: 45 },
  { hour: "02:00", activeUsers: 32 },
  { hour: "04:00", activeUsers: 28 },
  { hour: "06:00", activeUsers: 35 },
  { hour: "08:00", activeUsers: 120 },
  { hour: "10:00", activeUsers: 180 },
  { hour: "12:00", activeUsers: 220 },
  { hour: "14:00", activeUsers: 195 },
  { hour: "16:00", activeUsers: 210 },
  { hour: "18:00", activeUsers: 185 },
  { hour: "20:00", activeUsers: 150 },
  { hour: "22:00", activeUsers: 95 },
];

export function AnalyticsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedPeriod, setSelectedPeriod] = React.useState("month");

  const periods = [
    { value: "day", label: t("admin.analytics.day") },
    { value: "week", label: t("admin.analytics.week") },
    { value: "month", label: t("admin.analytics.month") },
    { value: "year", label: t("admin.analytics.year") },
  ];

  const handleExport = () => {
    // Export functionality
  };

  const totalRevenue = monthlyGrowthData.reduce((sum, month) => sum + month.revenue, 0);
  const totalStores = monthlyGrowthData[monthlyGrowthData.length - 1].stores;
  const totalUsers = monthlyGrowthData[monthlyGrowthData.length - 1].users;
  const avgGrowthRate = ((monthlyGrowthData[monthlyGrowthData.length - 1].revenue - monthlyGrowthData[0].revenue) / monthlyGrowthData[0].revenue * 100).toFixed(1);

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
          value={`SAR ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description={`+${avgGrowthRate}% ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.totalStores")}
          value={totalStores.toString()}
          icon={Store}
          description={`+12.5% ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.totalUsers")}
          value={totalUsers.toLocaleString()}
          icon={Users}
          description={`+22.1% ${t("admin.analytics.fromLastMonth")}`}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.analytics.avgGrowth")}
          value={`+${avgGrowthRate}%`}
          icon={Activity}
          description={t("admin.analytics.monthlyGrowth")}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
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
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stores" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CreditCard className="h-5 w-5" />
              {t("admin.analytics.planDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="h-5 w-5" />
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
                  <Bar dataKey="activeUsers" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Stores */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Store className="h-5 w-5" />
              {t("admin.analytics.topPerformingStores")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingStores.map((store, index) => (
                <div key={index} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-medium">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.customers.toLocaleString()} {t("admin.analytics.customers")}</p>
                  </div>
                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <p className="font-medium text-green-600">SAR {store.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">{store.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
