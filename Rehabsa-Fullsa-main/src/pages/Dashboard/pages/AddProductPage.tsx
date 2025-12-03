import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { createProduct } from "@/lib/api";

const defaultFormState = {
  name: "",
  sku: "",
  price: "0",
  currency: "SAR",
  stock: "0",
  status: "active",
  category: "",
  description: "",
};

export function AddProductPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [formData, setFormData] = React.useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error(t("dashboardPages.messages.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createProduct({
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        price: parseFloat(formData.price) || 0,
        currency: formData.currency || "SAR",
        stock: Number(formData.stock) || 0,
        status: formData.status,
        category: formData.category?.trim() || null,
        description: formData.description?.trim() || null,
      });

      toast.success(t("dashboardPages.messages.productAddedSuccess"), {
        description: response.data.name,
      });

      navigate(`/dashboard/products/view/${response.data.id}`);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboardPages.products.addProduct")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-name">{t("dashboardPages.forms.productName")}</Label>
                  <Input
                    id="product-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("dashboardPages.forms.productNamePlaceholder") ?? ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-sku">{t("dashboardPages.forms.sku")}</Label>
                  <Input
                    id="product-sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder={t("dashboardPages.forms.skuPlaceholder") ?? ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">{t("dashboardPages.forms.price")}</Label>
                  <Input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-currency">{t("dashboardPages.products.currency")}</Label>
                  <Input
                    id="product-currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">{t("dashboardPages.forms.stock")}</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-status">{t("dashboardPages.forms.status")}</Label>
                  <select
                    id="product-status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="active">{t("dashboardPages.products.statusActive")}</option>
                    <option value="draft">{t("dashboardPages.products.statusDraft")}</option>
                    <option value="archived">{t("dashboardPages.products.statusArchived")}</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product-category">{t("dashboardPages.forms.category")}</Label>
                  <Input
                    id="product-category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder={t("dashboardPages.forms.categoryPlaceholder") ?? ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product-description">{t("dashboardPages.forms.description")}</Label>
                  <Textarea
                    id="product-description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={t("dashboardPages.forms.descriptionPlaceholder") ?? ""}
                  />
                </div>
              </div>

              <div className={`flex justify-end gap-4 border-t pt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                  <Save className="h-4 w-4" />
                  {isSubmitting ? t("common.loading") : t("dashboardPages.products.saveProduct")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
