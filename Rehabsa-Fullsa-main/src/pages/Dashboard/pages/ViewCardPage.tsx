import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Dot, Star, Trash2, Download, BellPlus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { fetchCard, deleteCard, generateGoogleWalletLink } from "@/lib/api";
import iosFrame from "@/assets/ios.svg";

export function ViewCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [walletLoadingCode, setWalletLoadingCode] = useState<string | null>(null);

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return "-";
    }
    try {
      return format(new Date(value), "dd/MM/yyyy hh:mm a", { locale: ar });
    } catch {
      return value;
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/cards");
      return;
    }

    const loadCard = async () => {
      setLoading(true);
      try {
        const response = await fetchCard(id);
        const data = response.data as any;
        const settings = data.settings ?? {};
          const mappedCard = {
          id: data.id,
          name: data.name,
          title: data.title ?? settings.cardDescription ?? data.description,
          description: data.description ?? settings.howToEarnStamp ?? "",
          cardId: data.card_code,
          registrationUrl: data.registration_url,
          qrTemplateUrl: data.qr_template_url,
          issueDate: data.issue_date ? new Date(data.issue_date) : null,
          expiryDate: data.expiry_date ? new Date(data.expiry_date) : null,
          bgColor: data.bg_color ?? settings.colors?.backgroundColor ?? "#1E324A",
          bgOpacity: data.bg_opacity ?? 0.9,
          bgImage: data.bg_image ?? "",
          textColor: data.text_color ?? settings.colors?.textColor ?? "#ffffff",
          status: data.status === "paused" ? "موقوف" : "نشط",
          currentStage: data.current_stage ?? 0,
          totalStages: data.total_stages ?? settings.totalStages ?? 0,
          cardType: settings.cardType ?? 0,
          settings,
        };

        const mappedCustomers = (data.customers ?? []).map((record: any) => ({
          id: record.id,
          createdAt: record.issue_date,
          name: record.customer?.name ?? "—",
          phone: record.customer?.phone ?? "—",
          template: data.name ?? "",
          currentStamps: record.stamps_count ?? record.current_stage ?? 0,
          totalStamps: record.stamps_target ?? record.total_stages ?? mappedCard.totalStages,
          rewards: record.available_rewards ?? 0,
          totalRewards: record.redeemed_rewards ?? 0,
          installed: Boolean(record.apple_wallet_installed_at),
          googleInstalled: Boolean(record.google_wallet_installed_at),
          birthDate: record.customer?.birth_date ?? "",
          lastUpdate: record.last_scanned_at ?? "",
          cardCode: record.card_code,
          pkpassUrl: record.pkpass_url,
          googleWalletUrl: record.google_wallet_url,
        }));

        setCard(mappedCard);
        setCustomers(mappedCustomers);
      } catch (error: any) {
        toast.error(error.message || "البطاقة غير موجودة");
        navigate("/dashboard/cards");
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id, navigate]);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!card) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCard(card.id);
      toast.success("تم حذف البطاقة بنجاح");
      setDeleteDialogOpen(false);
      navigate("/dashboard/cards");
    } catch (error: any) {
      toast.error(error.message || "تعذر حذف البطاقة");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGoogleWallet = async (cardCode?: string | null) => {
    if (!cardCode) {
      toast.error("لا يوجد رمز للبطاقة");
      return;
    }

    try {
      setWalletLoadingCode(cardCode);
      const response = await generateGoogleWalletLink(cardCode);
      const url = response.data.save_url || (response.data.jwt ? `https://pay.google.com/gp/v/save/${response.data.jwt}` : null);
      if (!url) {
        toast.error("تعذر استلام رابط Google Wallet");
        return;
      }
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "تعذر إنشاء بطاقة Google Wallet");
    } finally {
      setWalletLoadingCode(null);
    }
  };

  const handleDisable = () => {
    // TODO: Implement disable functionality
    toast.info("سيتم تنفيذ هذه الميزة قريباً");
  };

  if (loading || !card) {
    return (
      <div className="px-10 py-6">
        <div className="flex items-center justify-center h-64">
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 30, g: 50, b: 74 };
  };

  const rgb = hexToRgb(card.bgColor || "#1E324A");
  const gradientStyle = card.bgImage
    ? {
        backgroundImage: `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity || 0.9}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity || 0.9})), url("${card.bgImage}")`,
      }
    : {
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity || 0.9})`,
      };

  const cardUrl = card.registrationUrl || `${window.location.origin}/new-customer?card=${card.cardId}`;
  const installedCount = customers.filter((customer) => customer.installed).length;
  const googleInstalledCount = customers.filter((customer) => customer.googleInstalled).length;
  const totalCustomers = customers.length;
  const totalStampsEarned = customers.reduce((sum, customer) => sum + (customer.currentStamps ?? 0), 0);
  const totalRewardsAvailable = customers.reduce((sum, customer) => sum + (customer.rewards ?? 0), 0);
  const totalRewardsRedeemed = customers.reduce((sum, customer) => sum + (customer.totalRewards ?? 0), 0);

  return (
    <div className="w-full min-h-[100vh] py-3 relative">
      <h1 className="mb-5 text-[24px] font-[500] flex justify-between items-center max-xsm:flex-col px-10">
        معلومات البطاقة
        <div className="flex items-center gap-3 font-space max-[260px]:flex-col max-[260px]:gap-1">
          <Link to="/dashboard/cards">
            <button className="w-fit py-1 main-btn text-[16px]">عودة</button>
          </Link>
          <Link to={`/dashboard/cards/create?edit=${card.id}`}>
            <button className="w-fit py-1 main-btn text-[16px]">تعديل</button>
          </Link>
          <button
            onClick={handleDelete}
            className="w-fit py-1 main-btn text-[16px] bg-red-500 border-red-500 mt-1"
          >
            حذف
          </button>
        </div>
      </h1>

      <div className="flex items-start justify-between max-lg:items-center max-lg:justify-center max-lg:flex-col px-10 gap-5">
        {/* Card Preview */}
        <div className="mt-5 flex-1 max-lg:self-center">
          <div className="px-4 flex-[1] flex items-center justify-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto" dir="ltr">
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-6 right-[50%] translate-x-1/2 flex items-center justify-center">
                <Dot className="absolute -left-7 text-active" aria-hidden="true" width={24} height={24} />
                <span className="text-[12px] font-[600]">{card.status || "نشط"}</span>
              </div>
              <div className="overflow-hidden relative w-[245px] max-xsm:w-[200px]">
                <img alt="Active screen" src={iosFrame} className="w-full h-full object-contain" />
                <div
                  className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                  style={{
                    ...gradientStyle,
                    color: card.textColor || "#ffffff",
                  }}
                  dir="rtl"
                >
                  <div className="h-full flex flex-col p-2.5 md:p-3">
                    <div className="flex flex-col items-center justify-center mb-2">
                      <div className="text-center mb-1">
                        <div className="text-xs font-medium">
                          <span className="tracking-tight">{card.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-[10px] font-semibold opacity-90 text-center">
                          {card.cardType === 0 ? "STAMPS" : "REFUND"} <span className="block text-right">1/{card.totalStages || card.stampsCount || 4}</span>
                        </span>
                      </div>
                    </div>

                    {card.cardType === 0 && (
                      <div className="flex items-center justify-center gap-1.5 mb-2.5 pb-2 border-b border-white/20">
                        {Array.from({ length: card.totalStages || card.stampsCount || 4 }).map((_, index) => {
                          const isFilled = index < 1;
                          return (
                            <div
                              key={index}
                              className="relative flex items-center justify-center rounded-[50%] border w-[35px] h-[35px]"
                              style={{
                                backgroundColor: "rgba(242, 241, 241, 0.804)",
                                borderColor: "rgb(0, 0, 0)",
                              }}
                            >
                              <Star
                                className={`w-[14px] h-[14px] ${
                                  isFilled ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex-grow min-w-0 overflow-hidden text-center mb-2">
                      <h3 className="text-sm font-extralight line-clamp-1 mb-1">{card.title || card.description}</h3>
                      <div className="line-clamp-2 font-light text-[10px] leading-tight">
                        {card.description || card.howToEarnStamp || "اجمع الطوابع واحصل على مكافآت حصرية"}
                      </div>
                    </div>

                    <div className="flex items-center justify-center mb-2">
                      <div
                        className="rounded-lg w-[100px] h-[100px] flex place-content-center items-center shadow-md"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        {card.qrTemplateUrl ? (
                          <img
                            src={card.qrTemplateUrl}
                            alt="QR"
                            className="w-[90px] h-[90px] object-contain"
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="flex self-end mt-auto pt-1.5 border-t border-white/20">
                      <div className="flex-grow text-right">
                        <div className="text-[7px] font-extralight opacity-80">المعرف</div>
                        <div className="text-[9px] font-light truncate">{card.cardId || `${card.id}`}</div>
                      </div>
                      <div className="flex-none w-14 text-left hidden md:block">
                        <div className="text-[7px] font-extralight opacity-80">الإصدار</div>
                        <div className="text-[9px] font-light">
                          {card.issueDate ? format(card.issueDate, "dd MMM yyyy", { locale: ar }) : "-"}
                        </div>
                      </div>
                      <div className="flex-none w-14 text-left">
                        <div className="text-[7px] font-extralight opacity-80">الانتهاء</div>
                        <div className="text-[9px] font-light">
                          {card.expiryDate ? format(card.expiryDate, "dd MMM yyyy", { locale: ar }) : "غير محدود"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleDisable}
                className="main-btn mt-4 bg-inActive border-inActive"
              >
                تعطيل
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code and Statistics */}
        <div className="mt-5 flex-[.7] py-24 px-10 h-fit flex flex-col justify-center items-center gap-10 border-[1px] rounded-[6px] border-Gray font-[500] max-lg:flex-row max-lg:w-full max-md:gap-5 max-md:px-3 max-sm:flex-col max-sm:pb-3">
          <div>
            <div className="ant-qrcode" style={{ backgroundColor: "transparent", width: "160px", height: "160px" }}>
              {card.qrTemplateUrl ? (
                <img src={card.qrTemplateUrl} alt="QR" className="w-[160px] h-[160px] object-contain" />
              ) : null}
            </div>
            <input
              type="text"
              readOnly
              className="ant-input ant-input-outlined mt-2 w-full px-3 py-2 border rounded"
              value={cardUrl}
            />
            <div className="w-full flex flex-col gap-2 mt-2">
              <Button className="main-btn" onClick={() => {
                navigator.clipboard.writeText(cardUrl);
                toast.success("تم نسخ الرابط");
              }}>
                نسخ
              </Button>
              <Button className="main-btn">
                تحميل PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-5 flex-[2] grid grid-cols-2 gap-10 max-lg:grid-cols-4 max-lg:w-full max-lg:mt-8 max-md:grid-cols-3 max-sm:grid-cols-2 max-xsm:grid-cols-1">
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">Apple Wallet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{installedCount}</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">Google Wallet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{googleInstalledCount}</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">إجمالي العملاء</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{totalCustomers}</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">الطوابع المكتسبة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{totalStampsEarned}</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">المكافآت المكتسبة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{totalRewardsAvailable}</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">المكافآت المستردة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">{totalRewardsRedeemed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="mt-10 px-10">
        <div className={`justify-end mt-6 w-full flex gap-4 text-center items-center max-xsm:flex-col mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button type="button" variant="outline" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>تصدير</span>
          </Button>
          <Button type="button" variant="outline" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
            <BellPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>ارسال اشعارات</span>
          </Button>
          <Button type="button" variant="destructive" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} disabled>
            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>حذف العملاء</span>
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-xs py-2">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        تاريخ الإنشاء
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[100px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        اسم العميل
                        <Search className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        رقم الهاتف
                        <Search className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[150px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        القالب
                        <Filter className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[140px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        الاختام/الكاش باك الحالية
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[140px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        إجمالي الاختام/الكاش باك المكتسبة
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[100px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        المكافآت المتاحة
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        إجمالي المكافآت المستردة
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        Apple Wallet
                        <Filter className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        Google Wallet
                        <Filter className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs py-2 min-w-[100px]">تاريخ الميلاد</TableHead>
                    <TableHead className="text-xs py-2 min-w-[120px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        اخر تحديث
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="py-6 text-center text-sm text-muted-foreground">
                        {t("dashboardPages.cards.noCustomers") || "لا يوجد عملاء لهذه البطاقة بعد"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="text-xs py-2">
                          <Checkbox />
                        </TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{formatDateTime(customer.createdAt)}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{customer.name}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{customer.phone}</TableCell>
                        <TableCell className="text-xs py-2">
                          <Badge variant="secondary" className="text-xs whitespace-nowrap">{customer.template}</Badge>
                        </TableCell>
                        <TableCell className="text-xs py-2 text-center">{customer.currentStamps}</TableCell>
                        <TableCell className="text-xs py-2 text-center">{customer.totalStamps}</TableCell>
                        <TableCell className="text-xs py-2 text-center">{customer.rewards}</TableCell>
                        <TableCell className="text-xs py-2 text-center">{customer.totalRewards}</TableCell>
                        <TableCell className="text-xs py-2">
                          <div className="flex flex-col gap-2">
                            <Badge variant="default" className={`text-xs whitespace-nowrap ${customer.installed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {customer.installed ? "مثبت" : "غير مثبت"}
                            </Badge>
                            {customer.pkpassUrl ? (
                              <Button asChild variant="outline" size="sm" className="text-xs">
                                <a href={customer.pkpassUrl} target="_blank" rel="noreferrer">
                                  تنزيل Apple
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs py-2">
                          <div className="flex flex-col gap-2">
                            <Badge variant="default" className={`text-xs whitespace-nowrap ${customer.googleInstalled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {customer.googleInstalled ? "مثبت" : "غير مثبت"}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleGoogleWallet(customer.cardCode)}
                              disabled={walletLoadingCode === customer.cardCode}
                            >
                              {walletLoadingCode === customer.cardCode ? "..." : "إضافة Google"}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{customer.birthDate || "-"}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{formatDateTime(customer.lastUpdate)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {`Shown ${customers.length} From ${customers.length} Customers`}
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className={`text-sm text-muted-foreground ${isRTL ? 'mr-4' : 'ml-4'}`}>
                {`${customers.length} / page`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {card && t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.cards.title") || "البطاقة",
                name: card.name || card.title || ""
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
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (t("common.loading") || "جاري الحذف...") : t("dashboardPages.deleteConfirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
