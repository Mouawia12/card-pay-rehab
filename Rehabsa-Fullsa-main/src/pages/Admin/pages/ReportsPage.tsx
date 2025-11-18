import React from "react";
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

const reports = [
  {
    id: "report-1",
    name: "تقرير الإيرادات الشهرية",
    type: "مالي",
    period: "يناير 2025",
    generatedDate: "2025-01-15",
    status: "مكتمل",
    size: "2.3 MB",
    format: "PDF"
  },
  {
    id: "report-2",
    name: "تقرير نمو المستخدمين",
    type: "تحليلي",
    period: "الربع الأول 2025",
    generatedDate: "2025-01-10",
    status: "مكتمل",
    size: "1.8 MB",
    format: "Excel"
  },
  {
    id: "report-3",
    name: "تقرير الاشتراكات",
    type: "اشتراكات",
    period: "ديسمبر 2024",
    generatedDate: "2025-01-05",
    status: "مكتمل",
    size: "3.1 MB",
    format: "PDF"
  },
  {
    id: "report-4",
    name: "تقرير أداء المتاجر",
    type: "أداء",
    period: "2024",
    generatedDate: "2025-01-01",
    status: "جاري الإعداد",
    size: "0 MB",
    format: "PDF"
  }
];

const financialSummary = {
  totalRevenue: 894500,
  monthlyGrowth: 15.7,
  topRevenueSource: "المتاجر المميزة",
  avgRevenuePerStore: 3600,
  projectedRevenue: 1050000
};

export function ReportsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedPeriod, setSelectedPeriod] = React.useState("month");
  const [selectedType, setSelectedType] = React.useState("all");

  const handleGenerateReport = () => {
    toast.success(t("admin.reports.generationStarted"));
  };

  const handleDownloadReport = (_reportId: string) => {
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "مالي": { className: "bg-green-100 text-green-800" },
      "تحليلي": { className: "bg-blue-100 text-blue-800" },
      "اشتراكات": { className: "bg-purple-100 text-purple-800" },
      "أداء": { className: "bg-orange-100 text-orange-800" },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig["مالي"];
    
    return (
      <Badge variant="outline" className={config.className}>
        {type}
      </Badge>
    );
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === "all" || report.type === selectedType;
    return matchesType;
  });

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
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

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <AdminStatsCard
          title={t("admin.reports.totalRevenue")}
          value={`SAR ${financialSummary.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.reports.monthlyGrowth")}
          value={`+${financialSummary.monthlyGrowth}%`}
          icon={TrendingUp}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.reports.avgRevenuePerStore")}
          value={`SAR ${financialSummary.avgRevenuePerStore.toLocaleString()}`}
          icon={Store}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.reports.topRevenueSource")}
          value={financialSummary.topRevenueSource}
          icon={CreditCard}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
        <AdminStatsCard
          title={t("admin.reports.projectedRevenue")}
          value={`SAR ${financialSummary.projectedRevenue.toLocaleString()}`}
          icon={TrendingUp}
          className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("day")}
              >
                {t("admin.reports.day")}
              </Button>
              <Button
                variant={selectedPeriod === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
              >
                {t("admin.reports.week")}
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
              >
                {t("admin.reports.month")}
              </Button>
              <Button
                variant={selectedPeriod === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("year")}
              >
                {t("admin.reports.year")}
              </Button>
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.reportName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.type")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.period")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.generatedDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.size")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.format")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.reports.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {report.name}
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(report.type)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {report.period}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {report.generatedDate}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {report.size}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <Badge variant="outline">{report.format}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={report.status !== "مكتمل"}
                      className={isRTL ? 'text-left' : 'text-right'}
                    >
                      <Download className={`h-4 w-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                      {t("admin.reports.download")}
                    </Button>
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
          {t("admin.reports.shownFrom", { shown: filteredReports.length, total: reports.length })}
        </p>
      </div>
    </div>
  );
}
