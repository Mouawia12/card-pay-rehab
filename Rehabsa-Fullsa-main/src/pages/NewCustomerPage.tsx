import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPublicCard, registerPublicCard, type PublicCardInfo } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cardCode = params.get("card");
  const [card, setCard] = useState<PublicCardInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!cardCode) {
        toast.error("لا يوجد رمز بطاقة");
        setLoadError("الرابط غير مكتمل، يرجى طلب رابط جديد من التاجر.");
        return;
      }
      try {
        setLoading(true);
        setLoadError(null);
        const response = await fetchPublicCard(cardCode);
        setCard(response.data);
      } catch (error: any) {
        toast.error(error.message || "تعذر تحميل البطاقة");
        setLoadError(error.message || "تعذر تحميل البطاقة");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cardCode]);

  const dynamicFields = useMemo(() => card?.form_fields || [], [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardCode) return;
    try {
      setSubmitting(true);
      const response = await registerPublicCard(cardCode, { name, phone, email });
      const payload = response.data.card_instance;
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      if (isIOS && payload.pkpass_url) {
        window.location.href = payload.pkpass_url;
        return;
      }
      if (isAndroid && payload.google_wallet_url) {
        window.location.href = payload.google_wallet_url;
        return;
      }
      const fallbackUrl = payload.google_wallet_url || payload.pkpass_url || payload.qr_url;
      if (fallbackUrl) {
        window.location.href = fallbackUrl;
      } else {
        toast.success("تم إنشاء البطاقة", { description: "يمكنك استخدام الرابط المرسل" });
      }
    } catch (error: any) {
      toast.error(error.message || "تعذر إنشاء البطاقة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        {loadError ? (
          <div className="space-y-4 text-center">
            <h1 className="text-xl font-semibold">تعذر العثور على البطاقة</h1>
            <p className="text-sm text-gray-600">{loadError}</p>
            <Button className="w-full" onClick={() => navigate("/#pricing")}>
              الانتقال لصفحة الاشتراك
            </Button>
          </div>
        ) : (
        <>
        <h1 className="text-xl font-semibold mb-2 text-center">{card?.name || "تسجيل عميل جديد"}</h1>
        <p className="text-sm text-gray-600 text-center mb-6">{card?.title || card?.description || "أكمل البيانات لإصدار بطاقتك"}</p>
        {loading ? (
          <p className="text-center text-sm text-gray-500">جاري التحميل...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 block mb-1">الاسم</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">رقم الجوال</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            {dynamicFields.some((f) => f.type === "email" || f.name?.toLowerCase().includes("email")) ? (
              <div>
                <label className="text-sm text-gray-700 block mb-1">البريد الإلكتروني</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            ) : null}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "جاري الإصدار..." : "إصدار البطاقة"}
            </Button>
          </form>
        )}
        </>
        )}
      </div>
    </div>
  );
}
