import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// بيانات وهمية للمنتج
const productData = {
  id: 1,
  name: "غسيل واكس",
  price: "30",
  description: "خدمة غسيل شامل للسيارة مع إضافة الواكس للحماية واللمعان",
};

export function ViewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-semibold">تفاصيل المنتج</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>معلومات المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">اسم</label>
              <p className="text-lg font-semibold">{productData.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">السعر</label>
              <p className="text-lg font-semibold">{productData.price} SAR</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">وصف</label>
              <p className="text-lg">{productData.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
