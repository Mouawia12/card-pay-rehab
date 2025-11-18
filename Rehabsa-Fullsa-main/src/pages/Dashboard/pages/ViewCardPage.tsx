import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Dot, Star, Trash2, Edit, Download, BellPlus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Filter } from "lucide-react";
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

// بيانات وهمية للعملاء
const mockCustomers = [
  { id: "1", name: "بتال الشهراني", phone: "+966559953343", template: "مغاسل وتلميع تذكار", currentStamps: 0, totalStamps: 0, rewards: 0, totalRewards: 0, installed: false, birthDate: "", createdAt: "11/2/2025 10:31:07 PM", lastUpdate: "11/2/2025 10:31:07 PM" },
  { id: "2", name: "SHEKH SAIM", phone: "+966561960461", template: "مغاسل وتلميع تذكار", currentStamps: 1, totalStamps: 1, rewards: 0, totalRewards: 0, installed: true, birthDate: "", createdAt: "11/2/2025 6:27:50 PM", lastUpdate: "11/2/2025 6:28:26 PM" },
];

export function ViewCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // تحميل البطاقة من localStorage
    const loadCard = () => {
      const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
      const defaultCards = [
        {
          id: 1,
          name: "نادي اللياقة النخبة",
          title: "تدرب وادخر",
          description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!",
          cardId: "477-398-475-609",
          issueDate: new Date("2025-07-08").toISOString(),
          expiryDate: new Date("2027-08-30").toISOString(),
          bgColor: "#3498DB",
          bgOpacity: 0.87,
          bgImage: "",
          textColor: "#ffffff",
          status: "نشط",
          currentStage: 2,
          totalStages: 5,
        },
        {
          id: 2,
          name: "مغاسل وتلميع تذكار",
          title: "غسيل احترافي",
          description: "احصل على خدمات الغسيل والتلميع بجودة عالية ومكافآت مميزة",
          cardId: "123-456-789-012",
          issueDate: new Date("2025-01-15").toISOString(),
          expiryDate: new Date("2026-01-15").toISOString(),
          bgColor: "#1E324A",
          bgOpacity: 0.9,
          bgImage: "",
          textColor: "#ffffff",
          status: "نشط",
          currentStage: 1,
          totalStages: 4,
        },
      ];

      const allCards = [...defaultCards, ...savedCards];
      const foundCard = allCards.find((c) => c.id.toString() === id || c.id === Number(id));
      
      if (foundCard) {
        setCard({
          ...foundCard,
          issueDate: foundCard.issueDate ? new Date(foundCard.issueDate) : new Date(),
          expiryDate: foundCard.expiryDate ? new Date(foundCard.expiryDate) : null,
        });
      } else {
        toast.error("البطاقة غير موجودة");
        navigate("/dashboard/cards");
      }
      setLoading(false);
    };

    loadCard();
  }, [id, navigate]);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
    const updatedCards = savedCards.filter((c: any) => c.id.toString() !== id && c.id !== Number(id));
    localStorage.setItem("dashboard_cards", JSON.stringify(updatedCards));
    toast.success("تم حذف البطاقة بنجاح");
    setDeleteDialogOpen(false);
    navigate("/dashboard/cards");
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

  const cardUrl = `${window.location.origin}/new_customer?shopId=demo&templateId=${card.id}`;

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
                <img alt="Active screen" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
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
                        <svg
                          className="w-[90px] h-[90px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          style={{ stroke: card.bgColor || "#1E324A" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                          ></path>
                        </svg>
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
                          {format(card.issueDate, "dd MMM yyyy", { locale: ar })}
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
              <svg height="160" width="160" viewBox="0 0 41 41" role="img">
                <path fill="transparent" d="M0,0 h41v41H0z" shapeRendering="crispEdges"></path>
                <path fill="rgba(0,0,0,0.88)" d="M0 0h7v1H0zM8 0h3v1H8zM12 0h4v1H12zM17 0h1v1H17zM20 0h2v1H20zM25 0h1v1H25zM28 0h5v1H28zM34,0 h7v1H34zM0 1h1v1H0zM6 1h1v1H6zM8 1h2v1H8zM11 1h1v1H11zM13 1h1v1H13zM15 1h2v1H15zM18 1h1v1H18zM20 1h1v1H20zM23 1h3v1H23zM34 1h1v1H34zM40,1 h1v1H40zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM10 2h2v1H10zM17 2h1v1H17zM19 2h1v1H19zM24 2h1v1H24zM31 2h2v1H31zM34 2h1v1H34zM36 2h3v1H36zM40,2 h1v1H40zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM8 3h7v1H8zM16 3h1v1H16zM21 3h1v1H21zM24 3h1v1H24zM26 3h3v1H26zM32 3h1v1H32zM34 3h1v1H34zM36 3h3v1H36zM40,3 h1v1H40zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM10 4h1v1H10zM12 4h1v1H12zM14 4h1v1H14zM17 4h1v1H17zM19 4h1v1H19zM21 4h2v1H21zM24 4h4v1H24zM29 4h3v1H29zM34 4h1v1H34zM36 4h3v1H36zM40,4 h1v1H40zM0 5h1v1H0zM6 5h1v1H6zM10 5h1v1H10zM12 5h2v1H12zM16 5h2v1H16zM19 5h3v1H19zM24 5h1v1H24zM29 5h1v1H29zM31 5h2v1H31zM34 5h1v1H34zM40,5 h1v1H40zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14 6h1v1H14zM16 6h1v1H16zM18 6h1v1H18zM20 6h1v1H20zM22 6h1v1H22zM24 6h1v1H24zM26 6h1v1H26zM28 6h1v1H28zM30 6h1v1H30zM32 6h1v1H32zM34,6 h7v1H34z"></path>
              </svg>
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
              <span className="text-[12px]">مثبتة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">151</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">إجمالي العملاء</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">167</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">الطوابع المكتسبة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">205</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">المكافآت المكتسبة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">9</span>
            </div>
          </div>
          <div className="px-3 py-3 border-[1px] rounded-[6px] border-Gray font-[500] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px]">المكافآت المستردة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[32px]">9</span>
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
                    <TableHead className="text-xs py-2 min-w-[100px]">
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        البطاقة مثبتة
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
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="text-xs py-2">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap">{customer.createdAt}</TableCell>
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
                        <Badge variant="default" className={`text-xs whitespace-nowrap ${customer.installed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {customer.installed ? "نعم" : "لا"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap">{customer.birthDate || "-"}</TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap">{customer.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              Shown 50 From 167 Customers
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
                50 / page
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

