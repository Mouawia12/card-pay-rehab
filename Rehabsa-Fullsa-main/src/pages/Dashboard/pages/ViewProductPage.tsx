import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { fetchProduct, type ProductRecord } from "@/lib/api";

export function ViewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetchProduct(id);
        setProduct(response.data);
      } catch (error: any) {
        toast.error(error?.message || t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, t]);

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const renderStatus = (status?: string | null) => {
    switch (status) {
      case "draft":
        return t("dashboardPages.products.statusDraft");
      case "archived":
        return t("dashboardPages.products.statusArchived");
      default:
        return t("dashboardPages.products.statusActive");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          {t("dashboardPages.crud.back")}
        </Button>
        <h1 className="text-2xl font-semibold">{t("dashboardPages.products.title")}</h1>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboardPages.products.viewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && <div className="text-center text-sm text-muted-foreground">{t("common.loading")}</div>}
            {!isLoading && product && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("dashboardPages.forms.productName")}
                  </label>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.sku")}</label>
                    <p className="text-base">{product.sku}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.price")}</label>
                    <p className="text-base font-semibold">
                      {product.price} {product.currency}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.stock")}</label>
                    <p className="text-base">{product.stock}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.status")}</label>
                    <p className="text-base">{renderStatus(product.status)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.category")}</label>
                  <p className="text-base">{product.category ?? t("common.notAvailable")}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("dashboardPages.forms.description")}</label>
                  <p className="text-base">{product.description ?? t("common.notAvailable")}</p>
                </div>
              </>
            )}
            {!isLoading && !product && (
              <div className="text-center text-sm text-muted-foreground">{t("common.noData")}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
