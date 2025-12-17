import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AddProductModal } from "../components/AddProductModal";
import { EditProductModal } from "../components/EditProductModal";
import { deleteProduct, fetchProducts, type ProductRecord } from "@/lib/api";
import type { CheckedState } from "@radix-ui/react-checkbox";

export function ProductsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setSelectedProducts([]);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        (product.category ?? "").toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const handleAddProduct = () => {
    setAddModalOpen(true);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/dashboard/products/view/${productId}`);
  };

  const handleEditProduct = (product: ProductRecord) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteProduct = (product: ProductRecord) => {
    setItemToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(itemToDelete.id);
      toast.success(t("dashboardPages.messages.productDeleted"));
      setSelectedProducts((prev) => prev.filter((id) => id !== itemToDelete.id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await loadProducts();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = (checked: CheckedState) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: CheckedState) => {
    if (checked) {
      setSelectedProducts((prev) => Array.from(new Set([...prev, productId])));
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return t("dashboardPages.products.statusDraft");
      case "archived":
        return t("dashboardPages.products.statusArchived");
      default:
        return t("dashboardPages.products.statusActive");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "outline";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`flex flex-wrap items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h1 className={`text-2xl font-semibold ${isRTL ? "text-right" : "text-left"}`}>
          {t("dashboardPages.products.title")}
        </h1>
        <Button className="flex items-center gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          {t("dashboardPages.products.addProduct")}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full max-w-sm">
          <Search className={`absolute top-3 ${isRTL ? "left-3" : "right-3"} h-4 w-4 text-muted-foreground`} />
          <Input
            dir={isRTL ? "rtl" : "ltr"}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("dashboardPages.products.searchPlaceholder") ?? ""}
            className={`${isRTL ? "pr-10 text-right" : "pl-10 text-left"}`}
          />
        </div>
        {selectedProducts.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {t("dashboardPages.products.selectedProducts", { count: selectedProducts.length })}
          </div>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="select all products"
                    />
                  </TableHead>
                  <TableHead>{t("dashboardPages.products.productName")}</TableHead>
                  <TableHead>{t("dashboardPages.products.sku")}</TableHead>
                  <TableHead>{t("dashboardPages.products.price")}</TableHead>
                  <TableHead>{t("dashboardPages.products.stock")}</TableHead>
                  <TableHead>{t("dashboardPages.products.status")}</TableHead>
                  <TableHead>{t("dashboardPages.products.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="font-medium">
                      {product.price} {product.currency}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(product.status)}>{getStatusLabel(product.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewProduct(product.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredProducts.length && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                      {t("dashboardPages.products.noProducts")}
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                      {t("dashboardPages.products.loading")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={() => {
          loadProducts();
        }}
      />
      <EditProductModal
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
          }
          setEditModalOpen(open);
        }}
        productId={editingProduct?.id}
        product={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          loadProducts();
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete &&
                t("dashboardPages.deleteConfirmation.descriptionWithName", {
                  item: t("dashboardPages.products.title"),
                  name: itemToDelete.name,
                })}
              <span className="mt-2 block text-xs text-muted-foreground">
                {t("dashboardPages.deleteConfirmation.warning")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t("dashboardPages.deleteConfirmation.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? t("common.loading") : t("dashboardPages.deleteConfirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

