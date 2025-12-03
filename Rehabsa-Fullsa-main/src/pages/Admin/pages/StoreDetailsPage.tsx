import React, { useEffect, useMemo, useState } from "react";
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
import { fetchAdminStoreDetails, type AdminStoreDetails } from "@/lib/api";
import { toast } from "sonner";

export function StoreDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [details, setDetails] = useState<AdminStoreDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchAdminStoreDetails(id);
        setDetails(res.data);
      } catch {
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, t]);

  const storeDetails = details?.store;
  const recentCustomers = details?.recent_customers ?? [];
  const monthlyData = details?.monthly_data ?? [];

  const storeStats = useMemo(() => {
    if (!storeDetails) return [];
    return [
      {
        title: t("admin.stores.totalCustomers"),
        value: storeDetails.total_customers.toLocaleString(),
        change: "",
        changeType: "positive",
        icon: Users,
      },
      {
        title: t("admin.stores.totalCards"),
        value: storeDetails.total_cards.toLocaleString(),
        change: "",
        changeType: "positive",
        icon: CreditCard,
      },
      {
        title: t("admin.stores.monthlyRevenue"),
        value: storeDetails.monthly_revenue,
        change: "",
        changeType: "positive",
        icon: TrendingUp,
      },
      {
        title: t("admin.stores.totalRevenue"),
        value: storeDetails.total_revenue,
        change: "",
        changeType: "positive",
        icon: Activity,
      },
    ];
  }, [storeDetails, t]);

  if (!storeDetails) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 w-full">
        <Button variant="outline" onClick={() => navigate("/admin/stores")} className="flex items-center gap-2 flex-row-reverse max-w-max">
          <ArrowLeft className="h-4 w-4" />
          {t("admin.stores.backToStores")}
        </Button>
        <div className="text-center text-muted-foreground">
          {isLoading ? t("common.loading") : t("common.noData")}
        </div>
      </div>
    );
  }

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
                <p className="text-gray-600">{storeDetails.description ?? t("common.notAvailable")}</p>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{storeDetails.owner ?? t("common.notAvailable")}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.email ?? "-"}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.phone ?? "-"}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{storeDetails.address ?? storeDetails.city ?? "-"}</span>
                </div>
              </div>
            </div>
            
            <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.joinDate")}: </span>
                    <span>{storeDetails.join_date ?? "-"}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.subscriptionEnd")}: </span>
                    <span>{storeDetails.subscription_end ?? "-"}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Activity className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{t("admin.stores.lastActivity")}: </span>
                    <span>{storeDetails.last_activity ?? "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {storeStats.map((stat, idx) => (
          <AdminStatsCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={{ value: stat.change, isPositive: stat.changeType === "positive" }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
            iconColor="text-blue-600"
          />
        ))}
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
                    {t("admin.stores.phone")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {customer.name}
                    </TableCell>
                    <TableCell className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {customer.join_date ?? "-"}
                    </TableCell>
                    <TableCell className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {customer.phone ?? "-"}
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
