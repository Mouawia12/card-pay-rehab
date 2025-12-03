import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createProduct, type ProductPayload, type ProductRecord } from "@/lib/api";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (product?: ProductRecord) => void;
}

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

export function AddProductModal({ open, onOpenChange, onSuccess }: AddProductModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = (): ProductPayload => ({
    name: formData.name.trim(),
    sku: formData.sku.trim(),
    price: parseFloat(formData.price) || 0,
    currency: formData.currency || "SAR",
    stock: Number(formData.stock) || 0,
    status: formData.status,
    category: formData.category?.trim() || null,
    description: formData.description?.trim() || null,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error(t("dashboardPages.messages.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const response = await createProduct(payload);
      toast.success(t("dashboardPages.messages.productAddedSuccess"), {
        description: t("dashboardPages.messages.productCreated", { name: response.data.name }),
      });
      setFormData(defaultFormState);
      onSuccess?.(response.data);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("dashboardPages.products.modalAddTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-currency">{t("dashboardPages.products.currency")}</Label>
              <Input
                id="product-currency"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                placeholder="SAR"
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
                placeholder={t("dashboardPages.forms.stockPlaceholder") ?? ""}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("dashboardPages.crud.cancel")}
            </Button>
            <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? t("common.loading") : t("dashboardPages.products.saveProduct")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
