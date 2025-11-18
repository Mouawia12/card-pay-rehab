import React, { useState } from "react";
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
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AddProductModal } from "../components/AddProductModal";
import { EditProductModal } from "../components/EditProductModal";

const products = [
  {
    id: 1,
    name: "غسيل واكس",
    price: "30",
  },
  {
    id: 2,
    name: "غسيل عادي",
    price: "25",
  },
];

export function ProductsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const isArabic = i18n.language === 'ar';
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleAddProduct = () => {
    setAddModalOpen(true);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/dashboard/products/view/${productId}`);
    toast.info(t("dashboardPages.messages.openedDetailsPage", { item: t("dashboardPages.products.title") }));
  };

  const handleEditProduct = (productId: number) => {
    setSelectedProductId(productId);
    setEditModalOpen(true);
  };

  const handleDeleteProduct = (productId: number, productName: string) => {
    setItemToDelete({ id: productId, name: productName });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (itemToDelete) {
      toast.error(t("dashboardPages.messages.deletedItem", { item: t("dashboardPages.products.title"), name: itemToDelete.name }), {
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isArabic ? (
          <>
            <Button className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleAddProduct}>
              <Plus className="h-4 w-4" />
              {t("dashboardPages.products.addProduct")}
            </Button>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.products.title")}
            </h1>
          </>
        ) : (
          <>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.products.title")}
            </h1>
            <Button className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleAddProduct}>
              <Plus className="h-4 w-4" />
              {t("dashboardPages.products.addProduct")}
            </Button>
          </>
        )}
      </div>

      {/* Products Table */}
      <div className="relative overflow-x-auto">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-xs py-2">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[200px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.products.productName")}
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t("dashboardPages.products.price")}
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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-xs py-2">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {product.price} SAR
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
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
            {t("dashboardPages.products.shownFrom", { shown: 2, total: 2 })}
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className={`text-sm text-muted-foreground ${isRTL ? 'mr-4' : 'ml-4'}`}>
              {t("dashboardPages.products.perPage", { count: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen}
        onSuccess={() => {
          // Refresh products list if needed
        }}
      />
      <EditProductModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen}
        productId={selectedProductId || undefined}
        onSuccess={() => {
          setSelectedProductId(null);
          // Refresh products list if needed
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.products.title"),
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
              onClick={confirmDeleteProduct}
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
