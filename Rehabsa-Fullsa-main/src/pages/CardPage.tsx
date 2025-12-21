import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchCardInstanceByCode, subscribePushNotification, unsubscribePushNotification } from "@/lib/api";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ar-DZ");
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function CardPage() {
  const [params] = useSearchParams();
  const cardCode = params.get("card") || "";
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const lastMessageRef = useRef<string | null>(null);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const supportsPush = useMemo(() => {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }, []);

  const supportsPwa = useMemo(() => {
    return "serviceWorker" in navigator && (Boolean(installPrompt) || isIOS);
  }, [installPrompt, isIOS]);

  const loadCard = useCallback(async () => {
    if (!cardCode) {
      setLoading(false);
      toast.error("الرابط غير مكتمل", { description: "يرجى التأكد من رابط البطاقة" });
      return;
    }
    try {
      setLoading(true);
      const response = await fetchCardInstanceByCode(cardCode);
      setCard(response.data);
    } catch (error: any) {
      toast.error("تعذر تحميل البطاقة", { description: error?.message || "حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  }, [cardCode]);

  const ensureServiceWorker = useCallback(async () => {
    if (!supportsPush) return null;
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) return existing;
    return navigator.serviceWorker.register("/sw.js");
  }, [supportsPush]);

  const syncPushStatus = useCallback(async () => {
    if (!supportsPush) return;
    const registration = await ensureServiceWorker();
    const subscription = await registration?.pushManager.getSubscription();
    setPushEnabled(Boolean(subscription));
  }, [ensureServiceWorker, supportsPush]);

  const handleEnablePush = useCallback(async () => {
    if (!supportsPush) {
      toast.error("المتصفح لا يدعم الإشعارات");
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      toast.error("مفتاح الإشعارات غير مُعد");
      return;
    }
    setPushBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("تم رفض الإذن", { description: "يمكنك تفعيله لاحقًا من إعدادات المتصفح" });
        return;
      }
      const registration = await ensureServiceWorker();
      if (!registration) {
        toast.error("تعذر تفعيل الإشعارات");
        return;
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await subscribePushNotification({
        card_code: cardCode,
        subscription: subscription.toJSON(),
        platform: navigator.platform,
      });

      setPushEnabled(true);
      toast.success("تم تفعيل الإشعارات", { description: "ستصلك آخر النقاط والعروض" });
    } catch (error: any) {
      toast.error("تعذر تفعيل الإشعارات", { description: error?.message || "حاول لاحقًا" });
    } finally {
      setPushBusy(false);
    }
  }, [cardCode, ensureServiceWorker, supportsPush]);

  const handleDisablePush = useCallback(async () => {
    if (!supportsPush) return;
    setPushBusy(true);
    try {
      const registration = await ensureServiceWorker();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await unsubscribePushNotification({ endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      setPushEnabled(false);
      toast.success("تم إيقاف الإشعارات");
    } catch (error: any) {
      toast.error("تعذر إيقاف الإشعارات", { description: error?.message || "حاول لاحقًا" });
    } finally {
      setPushBusy(false);
    }
  }, [ensureServiceWorker, supportsPush]);

  const handleInstall = useCallback(async () => {
    if (isIOS && !installPrompt) {
      toast.message("اضغط Share ثم Add to Home Screen لإضافة البطاقة");
      return;
    }
    if (!installPrompt) {
      toast.error("تعذر إظهار نافذة التثبيت");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      toast.success("تمت إضافة البطاقة إلى الشاشة الرئيسية");
      setInstallPrompt(null);
      setIsStandalone(true);
    }
  }, [installPrompt, isIOS]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  useEffect(() => {
    const listener = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", listener as EventListener);
    const media = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(media.matches);
    const handleChange = () => setIsStandalone(media.matches);
    media.addEventListener?.("change", handleChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", listener as EventListener);
      media.removeEventListener?.("change", handleChange);
    };
  }, []);

  useEffect(() => {
    syncPushStatus();
  }, [syncPushStatus]);

  useEffect(() => {
    if (!supportsPush) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "push") return;
      const payload = event.data.payload || {};
      const body = payload.body || "تم تحديث نقاطك";
      if (body !== lastMessageRef.current) {
        lastMessageRef.current = body;
        toast.success(payload.title || "إشعار", { description: body });
      }
      loadCard();
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, [loadCard, supportsPush]);

  const stampsTarget = card?.stamps_target ?? card?.template?.total_stages ?? 0;
  const stampsCount = card?.stamps_count ?? 0;
  const lastVisit = card?.last_scanned_at || card?.customer?.last_visit_at || null;
  const isAndroid = /android/i.test(navigator.userAgent);
  const showAppleWallet = Boolean(isIOS && card?.pkpass_url);
  const showGoogleWallet = Boolean(isAndroid && card?.google_wallet?.url);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-600">
        جاري تحميل البطاقة...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-600">
        تعذر العثور على البطاقة.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-slate-400">بطاقة الولاء</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {card?.template?.name || "بطاقتك"}
              </h1>
              <p className="text-sm text-slate-500">{card?.template?.title || "تابع نقاطك مباشرة"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">الكود: {card.card_code}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  آخر زيارة: {formatDateTime(lastVisit)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant={pushEnabled ? "secondary" : "default"}
                onClick={pushEnabled ? handleDisablePush : handleEnablePush}
                disabled={pushBusy}
                className="gap-2"
              >
                {pushEnabled ? "إيقاف الإشعارات" : "🔔 فعّل الإشعارات"}
              </Button>
              {!pushEnabled ? (
                <p className="text-xs text-slate-500">لتلقي النقاط، العروض والتخفيضات.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl border border-slate-200 p-6 shadow-sm"
          style={{
            background: card?.template?.bg_color || "#0f172a",
            color: card?.template?.text_color || "#ffffff",
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm opacity-80">رصيد النقاط</p>
              <p className="text-3xl font-semibold">
                {stampsCount} / {stampsTarget}
              </p>
              <p className="text-xs opacity-70">{card?.template?.business || ""}</p>
            </div>
            {card?.qr_url ? (
              <div className="rounded-2xl bg-white p-2 shadow">
                <img src={card.qr_url} alt="QR" className="h-28 w-28" />
              </div>
            ) : null}
          </div>
          {!isStandalone && supportsPwa ? (
            <div className="mt-4">
              <Button onClick={handleInstall} className="gap-2">
                ➕ أضف البطاقة إلى الشاشة الرئيسية
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">النقاط</p>
            <p className="text-xl font-semibold text-slate-900">
              {stampsCount} من {stampsTarget}
            </p>
            <p className="mt-2 text-xs text-slate-400">يتم تحديث النقاط فورًا بعد كل عملية مسح.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">آخر زيارة</p>
            <p className="text-xl font-semibold text-slate-900">{formatDateTime(lastVisit)}</p>
            <p className="mt-2 text-xs text-slate-400">سيصلك إشعار عند إضافة أي نقاط.</p>
          </div>
        </div>

        {(showAppleWallet || showGoogleWallet) && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-3">Wallet (اختياري)</p>
            <div className="flex flex-wrap gap-3">
              {showAppleWallet ? (
                <Button asChild variant="secondary">
                  <a href={card.pkpass_url} rel="noreferrer">Apple Wallet</a>
                </Button>
              ) : null}
              {showGoogleWallet ? (
                <Button asChild variant="secondary">
                  <a href={card.google_wallet.url} rel="noreferrer">Google Wallet</a>
                </Button>
              ) : null}
            </div>
          </div>
        )}

        {!supportsPush ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            متصفحك لا يدعم إشعارات الدفع. استخدم Chrome أو Edge على Android.
          </div>
        ) : null}
      </div>
    </div>
  );
}
