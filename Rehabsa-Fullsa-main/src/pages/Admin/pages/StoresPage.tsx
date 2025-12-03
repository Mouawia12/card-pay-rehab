import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "../components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  BellPlus,
  Trash2,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Store,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
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
import { deleteBusiness, fetchAdminStores, type AdminStoresData } from "@/lib/api";

export function StoresPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [data, setData] = useState<AdminStoresData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingStoreId, setDeletingStoreId] = useState<number | null>(null);
  const stores = useMemo(() => data?.stores ?? [], [data]);

  const loadStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminStores();
      setData(res.data);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStores((data?.stores ?? []).map(store => store.id));
    } else {
      setSelectedStores([]);
    }
  };

  const handleSelectStore = (storeId: number, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId]);
    } else {
      setSelectedStores(selectedStores.filter(id => id !== storeId));
    }
  };

  const handleExport = () => {
    toast.success(t("admin.stores.exportSuccess"));
  };

  const handleBulkDelete = () => {
    toast.success(t("admin.stores.bulkDeleteSuccess", { count: selectedStores.length }));
    setSelectedStores([]);
  };

  const handleSendNotification = () => {
    toast.success(t("admin.stores.notificationSent"));
  };

  const handleDeleteStore = async (storeId: number, storeName: string) => {
    const confirmMessage = t("admin.stores.confirmDelete", { name: storeName });
    if (!window.confirm(confirmMessage)) return;

    setDeletingStoreId(storeId);
    try {
      await deleteBusiness(storeId);
      toast.success(t("admin.stores.deleteSuccess"));
      await loadStores();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setDeletingStoreId(null);
    }
  };

  const filteredStores = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return stores.filter(store => {
      const matchesSearch =
        store.name.toLowerCase().includes(term) ||
        (store.owner ?? "").toLowerCase().includes(term) ||
        (store.email ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || store.status === statusFilter;
      const matchesPlan = planFilter === "all" || store.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [stores, searchTerm, statusFilter, planFilter]);


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
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Store className="h-6 w-6" />
          {t("admin.stores.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.stores.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
          <Button onClick={() => navigate("/admin/stores/add")} className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.stores.addStore")}</span>
            <Plus className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.stores.totalStores")}
          value={data?.stats.total_stores ?? 0}
          icon={Store}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.stores.totalCustomers")}
          value={(data?.stats.total_customers ?? 0).toLocaleString()}
          icon={Users}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.stores.totalCards")}
          value={(data?.stats.total_cards ?? 0).toLocaleString()}
          icon={CreditCard}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.stores.activeStores")}
          value={data?.stats.active_stores ?? 0}
          icon={Users}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex flex-col gap-4 ${isRTL ? 'text-left' : 'text-right'}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <div className="relative flex-1 max-w-sm">
                <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-muted-foreground`} />
                <input
                  type="text"
                  placeholder={t("admin.stores.searchPlaceholder")}
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
                <option value="all">{t("admin.stores.allStatuses")}</option>
                <option value="نشط">{t("admin.stores.active")}</option>
                <option value="متوقف">{t("admin.stores.suspended")}</option>
                <option value="تجريبي">{t("admin.stores.trial")}</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">{t("admin.stores.allPlans")}</option>
                <option value="الأساسية">{t("admin.stores.basicPlan")}</option>
                <option value="المتقدمة">{t("admin.stores.advancedPlan")}</option>
                <option value="المميزة">{t("admin.stores.premiumPlan")}</option>
                <option value="تجريبي">{t("admin.stores.trialPlan")}</option>
              </select>
            </div>
            
            {selectedStores.length > 0 && (
              <Alert>
                <AlertDescription className={`flex items-center gap-2 ${isRTL ? 'flex-row' : 'flex-row'}`}>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                      <span>{t("admin.stores.deleteSelected")}</span>
                      <Trash2 className={`h-4 w-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSendNotification}>
                      <span>{t("admin.stores.sendNotification")}</span>
                      <BellPlus className={`h-4 w-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                    </Button>
                  </div>
                  <span>{t("admin.stores.selectedStores", { count: selectedStores.length })}</span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={Boolean(stores.length) && selectedStores.length === stores.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.storeName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.owner")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.plan")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.customers")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.revenue")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.joinDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.stores.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStores.includes(store.id)}
                      onCheckedChange={(checked) => handleSelectStore(store.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {store.name}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div>
                      <div className="font-medium">{store.owner ?? t("common.notAvailable")}</div>
                      <div className="text-sm text-gray-600">{store.email ?? "-"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPlanBadge(store.plan)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(store.status)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div>
                      <div className="font-medium">{store.customers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{store.cards} {t("admin.stores.cards")}</div>
                    </div>
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {store.revenue}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {store.join_date ?? "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuLabel>{t("admin.stores.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); navigate(`/admin/stores/${store.id}`); }}>
                          <span>{t("admin.stores.view")}</span>
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); navigate(`/admin/stores/${store.id}/edit`); }}>
                          <span>{t("admin.stores.edit")}</span>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(event) => {
                            event.preventDefault();
                            handleDeleteStore(store.id, store.name);
                          }}
                          disabled={deletingStoreId === store.id}
                        >
                          <span>
                            {deletingStoreId === store.id ? t("common.loading") : t("admin.stores.delete")}
                          </span>
                          <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" disabled>
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.stores.shownFrom", { shown: filteredStores.length, total: stores.length })}
        </p>
      </div>
    </div>
  );
}
