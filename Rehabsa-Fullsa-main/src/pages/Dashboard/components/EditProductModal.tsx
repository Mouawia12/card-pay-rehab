import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string | number;
  initialData?: {
    name: string;
    price: string;
    description: string;
  };
  onSuccess?: () => void;
}

// بيانات وهمية للمنتج
const getProductData = (id: string | number | undefined) => {
  if (!id) return null;
  
  const mockProducts: Record<string | number, { name: string; price: string; description: string }> = {
    1: {
      name: "غسيل واكس",
      price: "30",
      description: "خدمة غسيل شامل للسيارة مع إضافة الواكس للحماية واللمعان",
    },
    2: {
      name: "غسيل عادي",
      price: "25",
      description: "خدمة غسيل عادي للسيارة",
    },
  };

  return mockProducts[id] || null;
};

export function EditProductModal({ 
  open, 
  onOpenChange, 
  productId,
  initialData,
  onSuccess 
}: EditProductModalProps) {
  const productData = initialData || getProductData(productId);
  
  const [formData, setFormData] = useState({
    name: productData?.name || "",
    price: productData?.price || "0",
    description: productData?.description || "",
  });

  useEffect(() => {
    if (open && productData) {
      setFormData({
        name: productData.name,
        price: productData.price,
        description: productData.description,
      });
    }
  }, [open, productData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.name) {
      toast.error("يرجى إدخال اسم المنتج");
      return;
    }

    // محاكاة تحديث البيانات
    toast.loading("جاري تحديث المنتج...", {
      description: "يرجى الانتظار"
    });

    setTimeout(() => {
      toast.dismiss();
      toast.success("تم تحديث المنتج بنجاح!", {
        description: `تم حفظ التغييرات للمنتج: ${formData.name}`
      });
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل منتج</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="أدخل اسم المنتج"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">السعر</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="أدخل وصف المنتج"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

