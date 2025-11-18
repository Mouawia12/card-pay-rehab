import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Store,
} from "lucide-react";
import { toast } from "sonner";

const systemLogs = [
  {
    id: "log-1",
    timestamp: "2025-01-15 14:30:25",
    level: "INFO",
    category: "Authentication",
    message: "User login successful",
    user: "أحمد محمد",
    store: "مقهى النخيل",
    ip: "192.168.1.100",
    details: "Login from web browser"
  },
  {
    id: "log-2",
    timestamp: "2025-01-15 14:25:10",
    level: "WARNING",
    category: "Payment",
    message: "Payment processing delay",
    user: "فاطمة أحمد",
    store: "صالون الجمال",
    ip: "192.168.1.101",
    details: "Payment took longer than expected"
  },
  {
    id: "log-3",
    timestamp: "2025-01-15 14:20:45",
    level: "ERROR",
    category: "Database",
    message: "Database connection timeout",
    user: "System",
    store: "System",
    ip: "127.0.0.1",
    details: "Connection pool exhausted"
  },
  {
    id: "log-4",
    timestamp: "2025-01-15 14:15:30",
    level: "INFO",
    category: "Subscription",
    message: "New subscription created",
    user: "محمد علي",
    store: "مطعم الشرق",
    ip: "192.168.1.102",
    details: "Premium plan subscription activated"
  },
  {
    id: "log-5",
    timestamp: "2025-01-15 14:10:15",
    level: "SUCCESS",
    category: "Backup",
    message: "Database backup completed",
    user: "System",
    store: "System",
    ip: "127.0.0.1",
    details: "Backup size: 2.3 GB"
  },
  {
    id: "log-6",
    timestamp: "2025-01-15 14:05:00",
    level: "ERROR",
    category: "API",
    message: "API rate limit exceeded",
    user: "خالد السعد",
    store: "صالة الرياضة",
    ip: "192.168.1.103",
    details: "Too many requests from IP"
  }
];

export function SystemLogsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const handleExport = () => {
    toast.success(t("admin.systemLogs.exportSuccess"));
  };

  const getLevelIcon = (level: string) => {
    const iconConfig = {
      "INFO": <Info className="h-4 w-4 text-blue-600" />,
      "WARNING": <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      "ERROR": <XCircle className="h-4 w-4 text-red-600" />,
      "SUCCESS": <CheckCircle className="h-4 w-4 text-green-600" />,
    };
    
    return iconConfig[level as keyof typeof iconConfig] || <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      "INFO": { variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      "WARNING": { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      "ERROR": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "SUCCESS": { variant: "outline" as const, className: "bg-green-100 text-green-800" },
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig["INFO"];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {level}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      "Authentication": { className: "bg-purple-100 text-purple-800" },
      "Payment": { className: "bg-green-100 text-green-800" },
      "Database": { className: "bg-red-100 text-red-800" },
      "Subscription": { className: "bg-blue-100 text-blue-800" },
      "Backup": { className: "bg-gray-100 text-gray-800" },
      "API": { className: "bg-orange-100 text-orange-800" },
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig["API"];
    
    return (
      <Badge variant="outline" className={config.className}>
        {category}
      </Badge>
    );
  };

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const totalLogs = systemLogs.length;
  const errorLogs = systemLogs.filter(log => log.level === "ERROR").length;
  const warningLogs = systemLogs.filter(log => log.level === "WARNING").length;
  const infoLogs = systemLogs.filter(log => log.level === "INFO").length;

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <FileText className="h-6 w-6" />
          {t("admin.systemLogs.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.systemLogs.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.systemLogs.totalLogs")}
          value={totalLogs}
          icon={FileText}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.systemLogs.errorLogs")}
          value={errorLogs}
          icon={XCircle}
          className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
          iconColor="text-red-600"
        />
        <AdminStatsCard
          title={t("admin.systemLogs.warningLogs")}
          value={warningLogs}
          icon={AlertTriangle}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
          iconColor="text-yellow-600"
        />
        <AdminStatsCard
          title={t("admin.systemLogs.infoLogs")}
          value={infoLogs}
          icon={Info}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
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
                placeholder={t("admin.systemLogs.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'} py-2 border border-gray-300 rounded-md`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.systemLogs.allLevels")}</option>
              <option value="INFO">{t("admin.systemLogs.info")}</option>
              <option value="WARNING">{t("admin.systemLogs.warning")}</option>
              <option value="ERROR">{t("admin.systemLogs.error")}</option>
              <option value="SUCCESS">{t("admin.systemLogs.success")}</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.systemLogs.allCategories")}</option>
              <option value="Authentication">{t("admin.systemLogs.authentication")}</option>
              <option value="Payment">{t("admin.systemLogs.payment")}</option>
              <option value="Database">{t("admin.systemLogs.database")}</option>
              <option value="Subscription">{t("admin.systemLogs.subscription")}</option>
              <option value="Backup">{t("admin.systemLogs.backup")}</option>
              <option value="API">{t("admin.systemLogs.api")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.timestamp")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.level")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.category")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.message")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.user")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.store")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.systemLogs.ip")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(log.category)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div>
                      <div className="font-medium">{log.message}</div>
                      <div className="text-sm text-gray-600">{log.details}</div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <User className="h-3 w-3 text-gray-500" />
                      {log.user}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Store className="h-3 w-3 text-gray-500" />
                      {log.store}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {log.ip}
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
          {t("admin.systemLogs.shownFrom", { shown: filteredLogs.length, total: systemLogs.length })}
        </p>
      </div>
    </div>
  );
}
