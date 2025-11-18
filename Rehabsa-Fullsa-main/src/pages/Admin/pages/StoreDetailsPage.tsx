import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

// Mock data for store details
const storeDetails = {
  id: "store-1",
  name: "مقهى النخيل",
  owner: "أحمد محمد",
  email: "ahmed@cafe.com",
  phone: "+966501234567",
  address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
  plan: "المتقدمة",
  status: "نشط",
  joinDate: "2024-01-15",
  subscriptionEnd: "2025-02-15",
  lastActivity: "2025-01-15",
  totalCustomers: 1250,
  totalCards: 980,
  monthlyRevenue: "SAR 12,500",
  totalRevenue: "SAR 150,000",
  description: "مقهى راقي يقدم أجود أنواع القهوة والحلويات في قلب الرياض"
};

const storeStats = [
  {
    title: "إجمالي العملاء",
    value: "1,250",
    change: "+15.3%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "البطاقات الصادرة",
    value: "980",
    change: "+12.1%",
    changeType: "positive",
    icon: CreditCard,
  },
  {
    title: "الإيرادات الشهرية",
    value: "SAR 12,500",
    change: "+8.7%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "نشاط الشهر",
    value: "ممتاز",
    change: "+5.2%",
    changeType: "positive",
    icon: Activity,
  },
];

const recentCustomers = [
  {
    id: 1,
    name: "محمد أحمد",
    phone: "+966501234567",
    joinDate: "2025-01-15",
    stamps: 8,
    rewards: 2,
  },
  {
    id: 2,
    name: "فاطمة علي",
    phone: "+966502345678",
    joinDate: "2025-01-14",
    stamps: 12,
    rewards: 3,
  },
  {
    id: 3,
    name: "خالد السعد",
    phone: "+966503456789",
    joinDate: "2025-01-13",
    stamps: 6,
    rewards: 1,
  },
];

const monthlyData = [
  { month: "يوليو", customers: 45, revenue: 8500 },
  { month: "أغسطس", customers: 52, revenue: 9200 },
  { month: "سبتمبر", customers: 48, revenue: 8800 },
  { month: "أكتوبر", customers: 61, revenue: 10500 },
  { month: "نوفمبر", customers: 58, revenue: 9800 },
  { month: "ديسمبر", customers: 67, revenue: 11200 },
];

export function StoreDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "متوقف": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "تجريبي": { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 w-full">
      {/* Header */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button variant="outline" onClick={() => navigate("/admin/stores")} className="flex items-center gap-2 flex-row-reverse">
          <ArrowLeft className="h-4 w-4" />
          {t("admin.stores.backToStores")}
        </Button>
        <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.stores.storeDetails")} - {storeDetails.name}
        </h1>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button onClick={() => navigate(`/admin/stores/${id}/edit`)} className="flex items-center gap-2 flex-row-reverse">
            <Edit className="h-4 w-4" />
            {t("admin.stores.editStore")}
          </Button>
        </div>
      </div>

      {/* Store Info Card */}
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`text-xl ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("admin.stores.storeInformation")}
            </CardTitle>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {getStatusBadge(storeDetails.status)}
              {getPlanBadge(storeDetails.plan)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <h3 className="font-semibold text-lg">{storeDetails.name}</h3>
                <p className="text-gray-600">{storeDetails.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{storeDetails.owner}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.email}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.phone}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.address}</span>
                </div>
              </div>
            </div>
            
            <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.joinDate")}: </span>
                    <span>{storeDetails.joinDate}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.subscriptionEnd")}: </span>
                    <span>{storeDetails.subscriptionEnd}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Activity className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.lastActivity")}: </span>
                    <span>{storeDetails.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={storeStats[0].title}
          value={storeStats[0].value}
          icon={storeStats[0].icon}
          trend={{ value: storeStats[0].change, isPositive: storeStats[0].changeType === "positive" }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={storeStats[1].title}
          value={storeStats[1].value}
          icon={storeStats[1].icon}
          trend={{ value: storeStats[1].change, isPositive: storeStats[1].changeType === "positive" }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={storeStats[2].title}
          value={storeStats[2].value}
          icon={storeStats[2].icon}
          trend={{ value: storeStats[2].change, isPositive: storeStats[2].changeType === "positive" }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={storeStats[3].title}
          value={storeStats[3].value}
          icon={storeStats[3].icon}
          trend={{ value: storeStats[3].change, isPositive: storeStats[3].changeType === "positive" }}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BarChart3 className="h-5 w-5" />
              {t("admin.stores.monthlyPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="font-medium">{month.month}</div>
                    <div className="text-sm text-gray-600">{month.customers} {t("admin.stores.customers")}</div>
                  </div>
                  <div className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {month.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="h-5 w-5" />
              {t("admin.stores.recentCustomers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.stores.customerName")}
                  </TableHead>
                  <TableHead className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.stores.joinDate")}
                  </TableHead>
                  <TableHead className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.stores.activity")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div>
                        <div>{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {customer.joinDate}
                    </TableCell>
                    <TableCell className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      <div>
                        <div className="text-sm">{customer.stamps} {t("admin.stores.stamps")}</div>
                        <div className="text-sm text-gray-600">{customer.rewards} {t("admin.stores.rewards")}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
