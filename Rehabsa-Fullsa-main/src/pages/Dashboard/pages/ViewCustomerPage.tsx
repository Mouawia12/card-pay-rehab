import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { ArrowLeft, Edit, Trash2, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { deleteCustomer, fetchCustomer, type CustomerDetails } from "@/lib/api";

export function ViewCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetchCustomer(id);
        setCustomer(response.data);
      } catch {
        toast.error("تعذر تحميل بيانات العميل");
        navigate("/dashboard/customers");
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomer();
  }, [id, navigate]);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/dashboard/customers/edit/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(id);
      toast.success("تم حذف العميل");
      navigate("/dashboard/customers");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/customers");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">تفاصيل العميل</h1>
            <p className="text-muted-foreground">عرض معلومات العميل بالتفصيل</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} disabled={!customer}>
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!customer}>
            <Trash2 className="h-4 w-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : customer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                    <p className="text-lg font-semibold">{customer.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{customer.email ?? "-"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">تاريخ الميلاد</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{customer.birth_date ?? "-"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">اللغة</label>
                    <Badge variant="secondary">{customer.language ?? "-"}</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{(customer.metadata?.address as string) ?? "-"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات البطاقات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.cards.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.cards.map((card, index) => (
                      <div key={card.card?.id ?? index} className="border rounded-md p-3 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{card.card?.name ?? "بطاقة"}</p>
                        <p className="text-xs text-muted-foreground">الكود: {card.card?.card_code ?? "-"}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>المرحلة الحالية: {card.current_stage}</span>
                          <span>إجمالي المراحل: {card.total_stages}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>المكافآت المتاحة: {card.available_rewards}</span>
                          <span>الحالة: {card.status ?? "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد بطاقات مرتبطة.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>النقاط</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{customer.loyalty_points ?? 0}</p>
                <p className="text-sm text-muted-foreground">مجموع نقاط الولاء</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>آخر الأنشطة</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.recent_transactions.length ? (
                  <div className="space-y-3">
                    {customer.recent_transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold">{transaction.type}</p>
                          <p className="text-muted-foreground text-xs">{transaction.happened_at ?? "-"}</p>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                          {transaction.amount} {transaction.currency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">لا توجد معاملات حديثة.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع بيانات العميل ولا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
              {isDeleting ? t("common.loading") : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
