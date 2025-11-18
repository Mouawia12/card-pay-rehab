import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Download,
  BellPlus,
  Trash2,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { fetchCustomers } from "@/lib/api";

const fallbackCustomers = [
  { id: "1", name: "توفيق حسن لغبي", phone: "+966055180666", template: "مغاسل وتلميع تذكار", currentStamps: 0, totalStamps: 0, availableRewards: 0, totalRewards: 0, cardInstalled: true, birthDate: "", lastUpdate: "10/22/2025 4:55:43 PM", createdAt: "10/22/2025 4:55:43 PM" },
  { id: "2", name: "مداوي القحطاني", phone: "+966580005528", template: "مغاسل وتلميع تذكار", currentStamps: 1, totalStamps: 1, availableRewards: 0, totalRewards: 0, cardInstalled: true, birthDate: "", lastUpdate: "10/22/2025 4:54:40 PM", createdAt: "10/22/2025 4:53:52 PM" },
  { id: "3", name: "سعيد", phone: "+966551047087", template: "مغاسل وتلميع تذكار", currentStamps: 1, totalStamps: 1, availableRewards: 0, totalRewards: 0, cardInstalled: true, birthDate: "", lastUpdate: "10/22/2025 2:23:08 PM", createdAt: "10/22/2025 2:22:39 PM" },
  { id: "4", name: "ابو حاتم", phone: "+966569941511", template: "مغاسل وتلميع تذكار", currentStamps: 1, totalStamps: 1, availableRewards: 0, totalRewards: 0, cardInstalled: true, birthDate: "", lastUpdate: "10/22/2025 12:27:07 PM", createdAt: "10/22/2025 12:25:06 PM" }
];

export function CustomersPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const isArabic = i18n.language === 'ar';
  const [customers, setCustomers] = React.useState(fallbackCustomers);
  const [loadingCustomers, setLoadingCustomers] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteBulkDialogOpen, setDeleteBulkDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<{ id: string; name: string } | null>(null);

  React.useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const response = await fetchCustomers();
        const normalized = response.data.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          template: customer.active_cards > 0 ? "بطاقة ولاء" : "غير محدد",
          currentStamps: customer.current_stamps ?? 0,
          totalStamps: customer.total_stamps ?? 0,
          availableRewards: customer.available_rewards ?? 0,
          totalRewards: customer.redeemed_rewards ?? 0,
          cardInstalled: (customer.active_cards ?? 0) > 0,
          birthDate: customer.birth_date || "",
          lastUpdate: customer.last_update || "",
          createdAt: customer.created_at || "",
        }));

        setCustomers(normalized.length ? normalized : fallbackCustomers);
      } catch (error) {
        console.error("Failed to fetch customers", error);
        setCustomers(fallbackCustomers);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  const handleAddCustomer = () => {
    navigate("/dashboard/customers/add");
    toast.success(t("dashboardPages.messages.openedAddPage", { item: t("dashboardPages.customers.title") }));
  };

  const handleViewCustomer = (customerId: string) => {
    navigate(`/dashboard/customers/view/${customerId}`);
    toast.info(t("dashboardPages.messages.openedDetailsPage", { item: t("dashboardPages.customers.title") }));
  };

  const handleEditCustomer = (customerId: string) => {
    navigate(`/dashboard/customers/edit/${customerId}`);
    toast.info(t("dashboardPages.messages.openedEditPage", { item: t("dashboardPages.customers.title") }));
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    setItemToDelete({ id: customerId, name: customerName });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = () => {
    if (itemToDelete) {
      toast.error(t("dashboardPages.messages.deletedItem", { item: t("dashboardPages.customers.title"), name: itemToDelete.name }), {
        description: t("dashboardPages.messages.willReloadPage"),
        action: {
          label: t("dashboardPages.messages.undo"),
          onClick: () => toast.info(t("dashboardPages.messages.undoDelete")),
        },
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExport = () => {
    toast.loading(t("dashboardPages.messages.exportingData"), {
      description: t("dashboardPages.messages.pleaseWait")
    });
    setTimeout(() => {
      toast.dismiss();
      toast.success(t("dashboardPages.messages.exportSuccess"), {
        description: t("dashboardPages.messages.excelDownloaded")
      });
    }, 2000);
  };

  const handleSendNotification = () => {
    toast.info(t("dashboardPages.messages.notificationSent"), {
      description: t("dashboardPages.messages.allCustomersNotified")
    });
  };

  const handleBulkDelete = () => {
    setDeleteBulkDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    toast.error(t("dashboardPages.messages.bulkDeleteSuccess", { item: t("dashboardPages.customers.title") }), {
      description: t("dashboardPages.messages.pageWillReload")
    });
    setDeleteBulkDialogOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isArabic ? (
          <>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button onClick={handleAddCustomer} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Plus className="h-4 w-4" />
                {t("dashboardPages.customers.addCustomer")}
              </Button>
              <Button variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleExport}>
                <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.export")}
              </Button>
              <Button variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleSendNotification}>
                <BellPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.sendNotification")}
              </Button>
              <Button variant="destructive" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleBulkDelete}>
                <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.deleteCustomers")}
              </Button>
            </div>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.customers.title")}
            </h1>
          </>
        ) : (
          <>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.customers.title")}
            </h1>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button onClick={handleAddCustomer} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Plus className="h-4 w-4" />
                {t("dashboardPages.customers.addCustomer")}
              </Button>
              <Button variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleExport}>
                <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.export")}
              </Button>
              <Button variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleSendNotification}>
                <BellPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.sendNotification")}
              </Button>
              <Button variant="destructive" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleBulkDelete}>
                <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("dashboardPages.customers.deleteCustomers")}
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-2 mt-8 grid-cols-3 max-md:grid-cols-2 max-xsm:grid-cols-1">
        <Card className="w-full flex flex-col gap-1 p-4 border rounded-md overflow-hidden relative">
          <h4 className={`flex justify-between items-center text-base font-normal ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("dashboardPages.customers.totalCustomers")}
          </h4>
          <h1 className={`text-3xl font-semibold ${isRTL ? 'mr-3' : 'ml-3'}`}>{customers.length}</h1>
        </Card>
        <Card className="w-full flex flex-col gap-1 p-4 border rounded-md overflow-hidden relative">
          <h4 className={`flex justify-between items-center text-base font-normal ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("dashboardPages.customers.installedCards")}
          </h4>
          <h1 className={`text-3xl font-semibold ${isRTL ? 'mr-3' : 'ml-3'}`}>{customers.filter((c) => c.cardInstalled).length}</h1>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="mt-5">
        <AlertDescription className={isRTL ? 'text-right' : 'text-left'}>
          <b>{t("dashboardPages.customers.importantNote")}</b> {t("dashboardPages.customers.noteText")}
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className={`justify-end mt-6 w-full flex gap-4 text-center items-center max-xsm:flex-col mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button variant="outline" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("dashboardPages.customers.export")}
        </Button>
        <Button variant="outline" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
          <BellPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("dashboardPages.customers.sendNotifications")}
        </Button>
        <Button variant="destructive" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
          <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("dashboardPages.customers.deleteCustomers")}
        </Button>
      </div>

      {/* Customers Table */}
      <div className="relative overflow-x-auto">
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-xs py-2 relative">
                    <div className="flex items-center justify-start w-full">
                      <Checkbox />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.creationDate")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[100px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.customerName")}
                      <Search className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.phoneNumber")}
                      <Search className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.template")}
                      <Filter className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[140px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.currentStamps")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[140px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.totalStamps")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[100px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.availableRewards")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.redeemedRewards")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[100px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.cardInstalled")}
                      <Filter className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[100px]">{t("dashboardPages.customers.birthDate")}</TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.customers.lastUpdate")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">{t("dashboardPages.customers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="text-xs py-2">
                      <div className="flex items-center justify-start">
                        <Checkbox />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">{customer.createdAt}</TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">{customer.name}</TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">{customer.phone}</TableCell>
                    <TableCell className="text-xs py-2">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">{customer.template}</Badge>
                    </TableCell>
                    <TableCell className="text-xs py-2 text-center">{customer.currentStamps}</TableCell>
                    <TableCell className="text-xs py-2 text-center">{customer.totalStamps}</TableCell>
                    <TableCell className="text-xs py-2 text-center">{customer.availableRewards}</TableCell>
                    <TableCell className="text-xs py-2 text-center">{customer.totalRewards}</TableCell>
                    <TableCell className="text-xs py-2">
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
                        {t("dashboardPages.customers.yes")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">{customer.birthDate}</TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">{customer.lastUpdate}</TableCell>
                    <TableCell className="text-xs py-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewCustomer(customer.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditCustomer(customer.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("dashboardPages.customers.shownFrom", { shown: 50, total: 118 })}
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className={`text-sm text-muted-foreground ${isRTL ? 'mr-4' : 'ml-4'}`}>
              {t("dashboardPages.customers.perPage", { count: 50 })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.customers.title"),
                name: itemToDelete.name
              })}
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                {t("dashboardPages.deleteConfirmation.warning")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t("dashboardPages.deleteConfirmation.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCustomer}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("dashboardPages.deleteConfirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={deleteBulkDialogOpen} onOpenChange={setDeleteBulkDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboardPages.deleteConfirmation.descriptionBulk", {
                count: 0 // TODO: Get actual selected count
              })}
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                {t("dashboardPages.deleteConfirmation.warning")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t("dashboardPages.deleteConfirmation.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("dashboardPages.deleteConfirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
