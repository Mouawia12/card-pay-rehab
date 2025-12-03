import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Receipt,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Store,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAdminReports, type AdminReportsData } from "@/lib/api";

export function ReportsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedType, setSelectedType] = useState("all");
  const [data, setData] = useState<AdminReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAdminReports();
        setData(response.data);
      } catch {
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t]);

  const reports = useMemo(() => data?.reports ?? [], [data]);
  const summary = data?.financial_summary;

  const filteredReports = useMemo(() => {
    if (selectedType === "all") return reports;
    return reports.filter((report) => report.type === selectedType);
  }, [reports, selectedType]);

  const handleGenerateReport = () => {
    toast.success(t("admin.reports.generationStarted"));
  };

  const handleDownloadReport = (_reportId: number) => {
    toast.success(t("admin.reports.downloadSuccess"));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "مكتمل": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "جاري الإعداد": { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      "فشل": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["مكتمل"];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Receipt className="h-6 w-6" />
          {t("admin.reports.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateReport} className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.reports.generateReport")}</span>
            <FileText className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <AdminStatsCard
          title={t("admin.reports.totalRevenue")}
          value={summary?.total_revenue ?? "SAR 0"}
          icon={DollarSign}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.reports.monthlyGrowth")}
          value={`+${summary?.monthly_growth ?? "0"}%`}
          icon={TrendingUp}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.reports.avgRevenuePerStore")}
          value={summary?.avg_revenue_per_store ?? "SAR 0"}
          icon={Store}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.reports.topRevenueSource")}
          value={summary?.top_revenue_source ?? t("common.notAvailable")}
          icon={CreditCard}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
        <AdminStatsCard
          title={t("admin.reports.projectedRevenue")}
          value={summary?.projected_revenue ?? "SAR 0"}
          icon={TrendingUp}
          className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20"
          iconColor="text-indigo-600"
        />
      </div>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">{t("admin.reports.allTypes")}</option>
            <option value="مالي">{t("admin.reports.financial")}</option>
            <option value="تحليلي">{t("admin.reports.analytical")}</option>
            <option value="اشتراكات">{t("admin.reports.subscriptions")}</option>
            <option value="أداء">{t("admin.reports.performance")}</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.name")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.type")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.period")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.generatedDate")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.status")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.size")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.reports.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>{report.name}</TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>{report.type}</TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>{report.period ?? t("common.notAvailable")}</TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>{report.generated_date ?? "-"}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>{report.size ?? "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      {t("admin.reports.download")}
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
          )}
          {!isLoading && !filteredReports.length && (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
