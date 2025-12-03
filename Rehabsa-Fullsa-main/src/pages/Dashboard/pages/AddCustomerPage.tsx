import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { createCustomer, type CustomerPayload } from "@/lib/api";

export function AddCustomerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL: _isRTL } = useDirection();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.name || !formData.phone) {
      toast.error(t("dashboardPages.messages.fillRequiredFields"), {
        description: t("dashboardPages.messages.namePhoneRequired")
      });
      return;
    }

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

      const response = await createCustomer(payload);
      toast.success(t("dashboardPages.messages.customerAddedSuccess"), {
        description: t("dashboardPages.messages.customerAccountCreated", { name: formData.name }),
      });
      navigate(`/dashboard/customers/view/${response.data.id}`);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
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
            {t("dashboardPages.crud.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              {t("dashboardPages.customers.addCustomer")}
            </h1>
            <p className="text-muted-foreground">{t("dashboardPages.messages.enterCustomerInfo") || "Enter new customer information"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>معلومات العميل</CardTitle>
          </CardHeader>
          <CardContent>
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
                      placeholder={t("dashboardPages.forms.fullNamePlaceholder")}
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
                        <SelectValue placeholder={t("dashboardPages.forms.languagePlaceholder")} />
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
                        <SelectValue placeholder={t("dashboardPages.forms.genderPlaceholder")} />
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
                        <SelectValue placeholder={t("dashboardPages.forms.templatePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template1">مغاسل وتلميع تذكار</SelectItem>
                        <SelectItem value="template2">قالب أساسي</SelectItem>
                        <SelectItem value="template3">قالب مخصص</SelectItem>
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
                    placeholder={t("dashboardPages.forms.addressPlaceholder")}
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  إلغاء
                </Button>
                <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                  <Save className="h-4 w-4" />
                  {isSubmitting ? t("common.loading") : "حفظ العميل"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
