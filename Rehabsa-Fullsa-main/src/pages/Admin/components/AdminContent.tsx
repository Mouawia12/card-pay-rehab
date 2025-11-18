import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "./StatsCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Store,
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const getStats = (t: any) => [
  {
    title: t("admin.dashboard.stats.totalStores"),
    value: "1,247",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Store,
    description: t("admin.dashboard.stats.fromLastMonth"),
  },
  {
    title: t("admin.dashboard.stats.activeSubscriptions"),
    value: "1,189",
    change: "+8.3%",
    changeType: "positive" as const,
    icon: CreditCard,
    description: t("admin.dashboard.stats.fromLastMonth"),
  },
  {
    title: t("admin.dashboard.stats.monthlyRevenue"),
    value: "SAR 89,450",
    change: "+15.7%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: t("admin.dashboard.stats.fromLastMonth"),
  },
  {
    title: t("admin.dashboard.stats.totalUsers"),
    value: "45,678",
    change: "+22.1%",
    changeType: "positive" as const,
    icon: Users,
    description: t("admin.dashboard.stats.fromLastMonth"),
  },
];

const getAdditionalStats = (t: any) => [
  {
    title: t("admin.dashboard.stats.newStoresThisMonth"),
    value: "156",
    icon: Store,
  },
  {
    title: t("admin.dashboard.stats.activeUsers"),
    value: "38,234",
    icon: Activity,
  },
  {
    title: t("admin.dashboard.stats.totalRevenue"),
    value: "SAR 1.2M",
    icon: TrendingUp,
  },
];

// بيانات الرسم الخطي للنمو الشهري - ديناميكية حسب اللغة
const getMonthlyGrowthData = (isRTL: boolean) => {
  const months = isRTL 
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  
  return [
    { month: months[0], stores: 120, revenue: 45000 },
    { month: months[1], stores: 135, revenue: 52000 },
    { month: months[2], stores: 148, revenue: 58000 },
    { month: months[3], stores: 162, revenue: 62000 },
    { month: months[4], stores: 175, revenue: 68000 },
    { month: months[5], stores: 189, revenue: 75000 },
    { month: months[6], stores: 203, revenue: 82000 },
    { month: months[7], stores: 218, revenue: 89000 },
    { month: months[8], stores: 234, revenue: 95000 },
    { month: months[9], stores: 247, revenue: 89450 },
  ];
};

const getSubscriptionDistribution = (t: any) => [
  { name: t("admin.dashboard.charts.basicPlan"), value: 45, color: "#3b82f6" },
  { name: t("admin.dashboard.charts.advancedPlan"), value: 35, color: "#10b981" },
  { name: t("admin.dashboard.charts.premiumPlan"), value: 20, color: "#f59e0b" },
];

const recentSubscriptions = [
  {
    id: 1,
    storeName: "مقهى النخيل",
    plan: "المتقدمة",
    amount: "SAR 299",
    date: "2025-01-15",
    status: "نشط"
  },
  {
    id: 2,
    storeName: "صالون الجمال",
    plan: "الأساسية",
    amount: "SAR 199",
    date: "2025-01-14",
    status: "نشط"
  },
  {
    id: 3,
    storeName: "مطعم الشرق",
    plan: "المميزة",
    amount: "SAR 499",
    date: "2025-01-13",
    status: "نشط"
  },
  {
    id: 4,
    storeName: "صالة الرياضة",
    plan: "المتقدمة",
    amount: "SAR 299",
    date: "2025-01-12",
    status: "نشط"
  },
];

const topActiveStores = [
  {
    id: 1,
    name: "مقهى النخيل",
    customers: 1250,
    cards: 980,
    revenue: "SAR 12,500"
  },
  {
    id: 2,
    name: "صالون الجمال",
    customers: 890,
    cards: 720,
    revenue: "SAR 8,900"
  },
  {
    id: 3,
    name: "مطعم الشرق",
    customers: 2100,
    cards: 1850,
    revenue: "SAR 21,000"
  },
  {
    id: 4,
    name: "صالة الرياضة",
    customers: 1560,
    cards: 1200,
    revenue: "SAR 15,600"
  },
];

export function AdminContent() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [date, setDate] = React.useState<Date>();
  const [selectedPeriod, setSelectedPeriod] = React.useState(t("admin.dashboard.periods.month"));
  
  const stats = getStats(t);
  const additionalStats = getAdditionalStats(t);
  const subscriptionDistribution = getSubscriptionDistribution(t);
  const monthlyGrowthData = getMonthlyGrowthData(isRTL);

  const periods = [
    t("admin.dashboard.periods.day"),
    t("admin.dashboard.periods.week"), 
    t("admin.dashboard.periods.month"),
    t("admin.dashboard.periods.year"),
    t("admin.dashboard.periods.allTime")
  ];

  return (
    <div className={`flex flex-col gap-4 p-4 w-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with filters */}
      <div className={`flex items-center justify-between gap-4`}>
        <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.dashboard.title")}
        </h1>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`${selectedPeriod === period ? "bg-primary text-primary-foreground" : ""} ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {period}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={`w-[300px] justify-end font-normal ${isRTL ? 'text-right flex items-center gap-2 flex-row-reverse' : 'text-left flex items-center gap-2 flex-row'}`}>
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP", { locale: isRTL ? ar : enUS }) : t("admin.dashboard.selectDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isRTL ? "end" : "start"}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={isRTL ? ar : enUS}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title={stats[0].title}
          value={stats[0].value}
          icon={stats[0].icon}
          trend={{ value: stats[0].change, isPositive: stats[0].changeType === "positive" }}
          description={stats[0].description}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={stats[1].title}
          value={stats[1].value}
          icon={stats[1].icon}
          trend={{ value: stats[1].change, isPositive: stats[1].changeType === "positive" }}
          description={stats[1].description}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={stats[2].title}
          value={stats[2].value}
          icon={stats[2].icon}
          trend={{ value: stats[2].change, isPositive: stats[2].changeType === "positive" }}
          description={stats[2].description}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={stats[3].title}
          value={stats[3].value}
          icon={stats[3].icon}
          trend={{ value: stats[3].change, isPositive: stats[3].changeType === "positive" }}
          description={stats[3].description}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2">
        {additionalStats.map((stat, index) => (
          <Card key={stat.title} className="h-[90px] transition-all duration-300 hover:shadow-md border border-gray-200">
            <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
              <h1 className={`text-sm font-medium text-center ${isRTL ? 'text-right' : 'text-left'}`}>{stat.title}</h1>
              <h1 className={`text-lg font-semibold text-center flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span>{stat.value}</span>
                <stat.icon className={`h-4 w-4 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'}`} />
              </h1>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <Card className="border border-gray-200 rounded-md transition-all duration-300 hover:shadow-md">
          <CardHeader className="py-4 px-6">
            <div className={`flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
              <h2 className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.charts.monthlyGrowth")}
              </h2>
              <h2 className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.charts.lastTenMonths")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6">
            <div style={{ minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="stores" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="border border-gray-200 rounded-md transition-all duration-300 hover:shadow-md">
          <CardHeader className="py-4 px-6">
            <div className={`flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
              <h2 className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.charts.subscriptionDistribution")}
              </h2>
              <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.charts.totalSubscriptions")}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 pb-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="border border-gray-200 rounded-md transition-all duration-300 hover:shadow-md">
          <CardHeader className="py-4 px-6">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button variant="outline" size="sm" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                <span>{t("admin.dashboard.viewAll")}</span>
                <Eye className="h-4 w-4" />
              </Button>
              <h2 className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.recentSubscriptions")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              {recentSubscriptions.map((subscription) => (
                <div key={subscription.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="font-medium">{subscription.storeName}</h3>
                    <p className="text-sm text-gray-600">{subscription.plan} - {subscription.amount}</p>
                  </div>
                  <div className={`${isRTL ? 'text-right flex flex-col items-end' : 'text-left flex flex-col items-start'}`}>
                    <p className="text-sm text-gray-600">{subscription.date}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {subscription.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Active Stores */}
        <Card className="border border-gray-200 rounded-md transition-all duration-300 hover:shadow-md">
          <CardHeader className="py-4 px-6">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button variant="outline" size="sm" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                <span>{t("admin.dashboard.viewAll")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <h2 className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.dashboard.topActiveStores")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              {topActiveStores.map((store) => (
                <div key={store.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="font-medium">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.customers} {t("admin.dashboard.customers")} • {store.cards} {t("admin.dashboard.cards")}</p>
                  </div>
                  <div className={`${isRTL ? 'text-right flex flex-col items-end' : 'text-left flex flex-col items-start'}`}>
                    <p className="font-medium text-green-600">{store.revenue}</p>
                    <p className="text-xs text-gray-600">{t("admin.dashboard.monthlyRevenue")}</p>
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
