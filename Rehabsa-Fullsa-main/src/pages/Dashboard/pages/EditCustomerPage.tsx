import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, User } from "lucide-react";
import { toast } from "sonner";
import { fetchCustomer, updateCustomer, type CustomerPayload } from "@/lib/api";

export function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    language: "ar",
    gender: "",
    address: "",
    template: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  React.useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetchCustomer(id);
        const detail = response.data;
        const metadata = detail.metadata ?? {};
        setFormData({
          name: detail.name,
          phone: detail.phone,
          email: detail.email ?? "",
          birthDate: detail.birth_date ?? "",
          language: detail.language ?? "ar",
          gender: (metadata.gender as string) ?? "",
          address: (metadata.address as string) ?? "",
          template: (metadata.template as string) ?? "",
        });
      } catch {
        toast.error("تعذر تحميل بيانات العميل");
        navigate("/dashboard/customers");
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomer();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.name || !formData.phone) {
      toast.error("يرجى ملء جميع الحقول المطلوبة", {
        description: "الاسم ورقم الهاتف مطلوبان"
      });
      return;
    }

    if (!id) return;
    setIsSubmitting(true);
    try {
      const payload: CustomerPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        birth_date: formData.birthDate || undefined,
        language: formData.language || undefined,
        metadata: {
          gender: formData.gender || undefined,
          address: formData.address || undefined,
          template: formData.template || undefined,
        },
      };
      await updateCustomer(id, payload);
      toast.success("تم تحديث بيانات العميل بنجاح!");
      navigate(`/dashboard/customers/view/${id}`);
    } catch (error: any) {
      toast.error(error?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User className="h-6 w-6" />
              تعديل بيانات العميل
            </h1>
            <p className="text-muted-foreground">تعديل معلومات العميل: {customerData.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">ID: {id}</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>معلومات العميل</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">جاري تحميل بيانات العميل...</p>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+966XXXXXXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">الجنس</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                        <SelectItem value="other">غير محدد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">القالب</Label>
                    <Select value={formData.template} onValueChange={(value) => handleInputChange("template", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القالب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مغاسل وتلميع تذكار">مغاسل وتلميع تذكار</SelectItem>
                        <SelectItem value="قالب أساسي">قالب أساسي</SelectItem>
                        <SelectItem value="قالب مخصص">قالب مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="أدخل العنوان الكامل"
                    rows={3}
                  />
                </div>
              </div>

              {/* Card Statistics (Read Only) */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إحصائيات البطاقة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{customerData.currentStamps}</p>
                    <p className="text-sm text-muted-foreground">الطوابع الحالية</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{customerData.totalStamps}</p>
                    <p className="text-sm text-muted-foreground">إجمالي الطوابع</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{customerData.availableRewards}</p>
                    <p className="text-sm text-muted-foreground">المكافآت المتاحة</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{customerData.totalRewards}</p>
                    <p className="text-sm text-muted-foreground">إجمالي المكافآت</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  إلغاء
                </Button>
                <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

