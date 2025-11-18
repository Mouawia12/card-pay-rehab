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

// بيانات وهمية للعميل
const customerData = {
  id: "lCYhBlpzmqQ4etUHVvOh",
  name: "توفيق حسن لغبي",
  phone: "+966055180666",
  email: "tawfiq@example.com",
  template: "مغاسل وتلميع تذكار",
  currentStamps: 0,
  totalStamps: 0,
  availableRewards: 0,
  totalRewards: 0,
  cardInstalled: true,
  birthDate: "1990-05-15",
  createdAt: "10/22/2025 4:55:43 PM",
  lastUpdate: "10/22/2025 4:55:43 PM",
  gender: "ذكر",
  address: "الرياض، المملكة العربية السعودية",
  totalVisits: 5,
  lastVisit: "10/20/2025",
  favoriteService: "غسيل واكس",
};

export function ViewCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleEdit = () => {
    navigate(`/dashboard/customers/edit/${id}`);
    toast.success("تم فتح صفحة التعديل");
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.error("تم حذف العميل بنجاح", {
      description: "سيتم إعادة توجيهك إلى قائمة العملاء",
      action: {
        label: "تراجع",
        onClick: () => toast.info("تم التراجع عن الحذف"),
      },
    });
    setDeleteDialogOpen(false);
    setTimeout(() => {
      navigate("/dashboard/customers");
    }, 2000);
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
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {customerData.name.charAt(0)}
                </div>
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                  <p className="text-lg font-semibold">{customerData.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{customerData.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{customerData.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">تاريخ الميلاد</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{customerData.birthDate}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الجنس</label>
                  <Badge variant="secondary">{customerData.gender}</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{customerData.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Information */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات البطاقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">القالب</label>
                  <Badge variant="outline" className="text-sm">{customerData.template}</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">حالة البطاقة</label>
                  <Badge className="bg-green-100 text-green-800">
                    {customerData.cardInstalled ? "مثبتة" : "غير مثبتة"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الطوابع الحالية</label>
                  <p className="text-2xl font-bold text-primary">{customerData.currentStamps}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">إجمالي الطوابع</label>
                  <p className="text-2xl font-bold text-primary">{customerData.totalStamps}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">المكافآت المتاحة</label>
                  <p className="text-2xl font-bold text-green-600">{customerData.availableRewards}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">إجمالي المكافآت</label>
                  <p className="text-2xl font-bold text-green-600">{customerData.totalRewards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">إجمالي الزيارات</span>
                <span className="font-semibold">{customerData.totalVisits}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">آخر زيارة</span>
                <span className="font-semibold">{customerData.lastVisit}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">الخدمة المفضلة</span>
                <span className="font-semibold">{customerData.favoriteService}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>الأنشطة الأخيرة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">تم إنشاء الحساب</p>
                    <p className="text-xs text-muted-foreground">{customerData.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">آخر تحديث</p>
                    <p className="text-xs text-muted-foreground">{customerData.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.customers.title"),
                name: customerData.name
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
              onClick={confirmDelete}
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
