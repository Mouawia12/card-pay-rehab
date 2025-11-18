import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function AddProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
    price: "0",
    description: "",
  });

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

    // محاكاة إرسال البيانات
    toast.loading("جاري إضافة المنتج...", {
      description: "يرجى الانتظار"
    });

    setTimeout(() => {
      toast.dismiss();
      toast.success("تم إضافة المنتج بنجاح!", {
        description: `تم إنشاء منتج جديد: ${formData.name}`,
        action: {
          label: "عرض التفاصيل",
          onClick: () => navigate("/dashboard/products/view/123")
        }
      });
      
      // إعادة تعيين النموذج
      setFormData({
        name: "",
        price: "0",
        description: "",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>إضافة منتج</CardTitle>
          </CardHeader>
          <CardContent>
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

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
