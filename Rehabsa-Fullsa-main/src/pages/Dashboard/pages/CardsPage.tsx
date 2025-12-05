import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Dot, Star, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";
import { fetchCards } from "@/lib/api";
import { toast } from "sonner";

const defaultCards = [
  {
    id: 1,
    name: "نادي اللياقة النخبة",
    title: "تدرب وادخر",
    description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!",
    cardId: "477-398-475-609",
    issueDate: new Date("2025-07-08"),
    expiryDate: new Date("2027-08-30"),
    bgColor: "#3498DB",
    bgOpacity: 0.87,
    bgImage: "https://reward-loyalty-demo.nowsquare.com/files/126/conversions/1-sm.jpg",
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
    issueDate: new Date("2025-01-15"),
    expiryDate: new Date("2026-01-15"),
    bgColor: "#1E324A",
    bgOpacity: 0.9,
    bgImage: "",
    textColor: "#ffffff",
    status: "نشط",
    currentStage: 1,
    totalStages: 4,
  },
];

export function CardsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // تحميل البطاقات من الباك اند مباشرةً (بدون بيانات تجريبية)
  const loadCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCards();
      const remoteCards = response.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        title: card.title,
        description: card.description,
        cardId: card.card_code,
        issueDate: card.issue_date ? new Date(card.issue_date) : null,
        expiryDate: card.expiry_date ? new Date(card.expiry_date) : null,
        bgColor: card.bg_color,
        bgOpacity: card.bg_opacity,
        bgImage: card.bg_image,
        textColor: card.text_color,
        status: card.status === "paused" ? "موقوف" : "نشط",
        currentStage: card.current_stage,
        totalStages: card.total_stages,
      }));

      if (remoteCards.length === 0) {
        toast.info(t("dashboardPages.cards.noCards") || "لا توجد بطاقات حتى الآن، نعرض لك نموذج التصميم.");
        setCards(defaultCards);
        setUsingFallback(true);
      } else {
        setCards(remoteCards);
        setUsingFallback(false);
      }
    } catch (error) {
      console.error("Failed to load cards", error);
      toast.error(t("dashboardPages.cards.loadError") || "تعذر تحميل البطاقات، تم إظهار النماذج الجاهزة.");
      setCards(defaultCards);
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل البطاقات من localStorage عند تحميل الصفحة
  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="px-10">
      <h1 className="mb-12 mt-4 text-[24px] font-[500] flex items-center gap-1">
        {t("dashboardPages.cards.title") || "بطاقات"}
      </h1>
      {usingFallback && (
        <p className="text-sm text-muted-foreground mb-6">
          {t("dashboardPages.cards.fallbackMessage") || "نعرض حالياً تصاميم توضيحية إلى أن تقوم بإنشاء بطاقاتك الأولى."}
        </p>
      )}
      <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
        {/* Create New Card */}
        <div className="max-md:px-2">
          <div className="px-4 flex-[1] flex items-center justify-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto" dir="ltr">
            <div className="relative flex flex-col items-center">
              <div className="overflow-hidden relative w-[245px] max-xsm:w-[200px] my-6 max-md:my-4">
                <img
                  alt="Create card screen"
                  src="/dashboard/ios.svg"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                {/* Plus icon inside iOS frame */}
                <div className="absolute top-[40%] right-[50%] translate-x-[50%] translate-y-[-50%] flex items-center justify-center">
                  <a href="/dashboard/cards/create" className="cursor-pointer">
                    <Plus className="w-16 h-16 text-primary" strokeWidth={3} />
                  </a>
                </div>
              </div>
              <h2 className="my-2 text-[20px] font-[500] text-center max-sm:text-[18px]">
                {t("dashboardPages.cards.createCard") || "إنشاء بطاقة"}
              </h2>
              <div className="w-full flex justify-center mb-14">
                <div className="flex flex-col items-center gap-3 text-[14px] font-[500]">
                  <button 
                    onClick={() => navigate('/dashboard/cards/templates')}
                    className="main-btn w-[170px] max-sm:w-[150px] max-sm:px-1 max-sm:py-0"
                  >
                    {t("dashboardPages.cards.readyTemplates") || "قوالب جاهزة"}
                  </button>
                  <a href="/dashboard/cards/create">
                    <button className="border-btn w-[170px] max-sm:w-[150px] max-sm:px-1 max-sm:py-0">
                      {t("dashboardPages.cards.newTemplate") || "قالب جديد"}
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Cards */}
        {cards.map((card) => {
          // Convert hex color to rgb for gradient
          const hexToRgb = (hex: string) => {
            // Remove # if present
            const cleanHex = hex.replace('#', '');
            const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
            return result
              ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
                }
              : { r: 52, g: 152, b: 219 };
          };
          
          const rgb = hexToRgb(card.bgColor);
          const gradientStyle = card.bgImage
            ? {
                backgroundImage: `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity})), url("${card.bgImage}")`,
              }
            : {
                backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity})`,
              };

          return (
            <div key={card.id} className="max-md:px-2">
              <div className="px-4 flex-[1] flex items-center justify-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto" dir="ltr">
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-6 right-[50%] translate-x-1/2 flex items-center justify-center">
                    <Dot className="absolute -left-7 text-active" aria-hidden="true" width={24} height={24} />
                    <span className="text-[12px] font-[600]">{card.status}</span>
                  </div>
                  <div className="overflow-hidden relative w-[245px] max-xsm:w-[200px] my-6 max-md:my-4">
                    <img
                      alt="Active screen"
                      src="/dashboard/ios.svg"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {/* Card inside iOS frame - متناسق ومحاذي */}
                    <div
                      className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                      style={{
                        ...gradientStyle,
                        color: card.textColor,
                      }}
                      dir="rtl"
                    >
                      <div className="h-full flex flex-col p-2.5 md:p-3">
                        {/* Header with Stages - في المنتصف */}
                        <div className="flex flex-col items-center justify-center mb-2">
                          <div className="text-center mb-1">
                            <div className="text-xs font-medium">
                              <span className="tracking-tight">{card.name}</span>
                            </div>
                          </div>
                          {/* Stages Counter - في المنتصف */}
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-[10px] font-semibold opacity-90 text-center">
                              المرحلة: {card.currentStage}/{card.totalStages}
                            </span>
                          </div>
                        </div>

                        {/* Stages Indicators - Stars */}
                        <div className="flex items-center justify-center gap-1.5 mb-2.5 pb-2 border-b border-white/20">
                          {Array.from({ length: card.totalStages }).map((_, index) => {
                            const stageNumber = index + 1;
                            const isCompleted = stageNumber < card.currentStage;
                            const isCurrent = stageNumber === card.currentStage;
                            const isPending = stageNumber > card.currentStage;

                            return (
                              <div
                                key={index}
                                className="relative flex items-center justify-center"
                                title={`المرحلة ${stageNumber}${isCurrent ? ' (الحالية)' : isCompleted ? ' (مكتملة)' : ' (قادمة)'}`}
                              >
                                <Star
                                  className={`transition-all duration-300 ${
                                    isCompleted
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : isCurrent
                                      ? 'fill-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.9)] scale-125 animate-pulse'
                                      : 'fill-yellow-500/30 text-yellow-500/30'
                                  }`}
                                  size={16}
                                  strokeWidth={2}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Content - النص في الأعلى */}
                        <div className="flex-grow min-w-0 overflow-hidden text-center mb-2">
                          <h3 className="text-sm font-extralight line-clamp-1 mb-1">{card.title}</h3>
                          <div className="line-clamp-2 font-light text-[10px] leading-tight">{card.description}</div>
                        </div>

                        {/* QR Code - في الأسفل وبحجم أكبر */}
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
                              style={{ stroke: card.bgColor }}
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

                        {/* Footer - RTL */}
                        <div className="flex self-end mt-auto pt-1.5 border-t border-white/20">
                          <div className="flex-grow text-right">
                            <div className="text-[7px] font-extralight opacity-80">المعرف</div>
                            <div className="text-[9px] font-light truncate">{card.cardId}</div>
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
                  <h2 className="my-2 text-[20px] font-[500] text-center max-sm:text-[18px]">{card.name}</h2>
                  <div className="w-full flex justify-center mb-14">
                    <button 
                      onClick={() => navigate(`/dashboard/cards/${card.id}`)}
                      className="main-btn w-[170px] py-2 max-sm:w-[150px] max-sm:px-1 max-sm:py-0"
                    >
                      {t("dashboardPages.cards.details") || "التفاصيل"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
