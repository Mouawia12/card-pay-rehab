import React, { useState, useRef, useEffect } from "react";
import { Dot, Info, Stamp, DollarSign, Ellipsis, Apple, Trash2, File, Star, Smile, Plane, Car, Heart, Gift, Crown, Trophy, Coffee, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createCard, fetchCard, updateCard, type CardPayload } from "@/lib/api";
import { NumberInput } from "@/components/ui/number-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import iosFrame from "@/assets/ios.svg";

interface FormField {
  id: string;
  type: string;
  name: string;
  required: boolean;
}

const DEFAULT_COLORS = {
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  middleAreaBg: "#FFFFFF",
  activeStamp: "#FF0000",
  stampBackground: "#f2f1f1cd",
  borderColor: "#000000",
  inactiveStamp: "#CCCCCC",
};

const DEFAULT_FORM_FIELDS: FormField[] = [
  { id: "1", type: "FName", name: "الاسم الأول", required: true },
  { id: "2", type: "LName", name: "اسم العائلة", required: true },
  { id: "3", type: "phone", name: "رقم الجوال", required: true },
  { id: "4", type: "dob", name: "تاريخ الميلاد", required: false },
];

const DEFAULT_CARD_NAME = "Stamps Card";
const DEFAULT_CARD_DESCRIPTION = "اجمع الاختام واحصل على هدية 🎁";
const DEFAULT_HOW_TO_EARN = "احصل علي ختم عند كل عملية شراء";
const DEFAULT_COMPANY_NAME = "مغاسل وتلميع تذكار";
const DEFAULT_SOURCE_COMPANY = "rehabsa";
const DEFAULT_SOURCE_EMAIL = "support@rehabsa.com";
const DEFAULT_COUNTRY_CODE = "+966";
const DEFAULT_PHONE_NUMBER = "547669684";
const DEFAULT_TERMS_OF_USE = `1. احصل على ختم واحد مع كل عملية شراء.

2. اجمع الطوابع للحصول على المكافآت.

3. تاريخ انتهاء صلاحية البطاقة والأختام والمكافآت غير محدود.

4. لا يمكن استبدال الأختام والمكافآت أو إرجاعها أو استبدالها أو شراؤها نقدًا.

5. لا يمكن نقل البطاقات أو دمجها مع بطاقات أخرى.

6. تحتفظ الشركة بالحق في رفض تقديم الخدمات.`;

export function CreateCardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loadingCard, setLoadingCard] = useState(false);
  const isEditing = Boolean(editId);
  const [cardName, setCardName] = useState(DEFAULT_CARD_NAME);
  const [activeTab, setActiveTab] = useState("نوع البطاقة");
  const [selectedCardType, setSelectedCardType] = useState<number | null>(0);
  const [selectedTemplateMeta, setSelectedTemplateMeta] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueDateValue, setIssueDateValue] = useState<string | null>(null);
  const [expiryDateValue, setExpiryDateValue] = useState<string | null>(null);
  
  // Settings state
  const [expiryType, setExpiryType] = useState("unlimited");
  const [cardLimit, setCardLimit] = useState(0);
  const [initialStamps, setInitialStamps] = useState(0);
  const [maxStampsPerTransaction, setMaxStampsPerTransaction] = useState(0);
  const [maxStampsPerDay, setMaxStampsPerDay] = useState(0);
  const [requireProductSelection, setRequireProductSelection] = useState(false);
  const [minAmountForStamps, setMinAmountForStamps] = useState(1);
  const [formFields, setFormFields] = useState<FormField[]>(DEFAULT_FORM_FIELDS);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showCardUsagePolicy, setShowCardUsagePolicy] = useState(true);
  
  // Design tab state
  const [customStamps, setCustomStamps] = useState(false);
  const [stampsCount, setStampsCount] = useState(6);
  const [activeStampType, setActiveStampType] = useState("Star");
  const [inactiveStampType, setInactiveStampType] = useState("Star");
  
  // Icon options for stamps
  const stampIcons = [
    { value: "Star", icon: Star, label: "نجمة", svgPath: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" },
    { value: "Plane", icon: Plane, label: "طائرة", svgPath: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" },
    { value: "Car", icon: Car, label: "سيارة", svgPath: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 13h18M5 13l-1-8h16l-1 8" },
    { value: "Heart", icon: Heart, label: "قلب", svgPath: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" },
    { value: "Gift", icon: Gift, label: "هدية", svgPath: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M7 7H5a2 2 0 0 1-2-2c0-1.1.9-2 2-2h2M17 7h2a2 2 0 0 0 2-2c0-1.1-.9-2-2-2h-2M7 5a2 2 0 0 0-2 2H5M17 5a2 2 0 0 1 2 2h0" },
    { value: "Crown", icon: Crown, label: "تاج", svgPath: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519L19.58 14H4.42L2.019 6.019a.5.5 0 0 1 .798-.519l4.277 3.664a1 1 0 0 0 1.516-.294zM5 16h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" },
    { value: "Trophy", icon: Trophy, label: "كأس", svgPath: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" },
    { value: "Coffee", icon: Coffee, label: "قهوة", svgPath: "M10 2v2M14 2v2M5.5 9.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S4 11.8 4 11s.7-1.5 1.5-1.5zM2 18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6H2v6zM18 7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h16V7z" },
    { value: "ShoppingBag", icon: ShoppingBag, label: "حقيبة تسوق", svgPath: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
  ];
  const [colors, setColors] = useState(DEFAULT_COLORS);
  
  // File refs
  const activeStampFileRef = useRef<HTMLInputElement>(null);
  const inactiveStampFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const backgroundFileRef = useRef<HTMLInputElement>(null);
  const pushIconFileRef = useRef<HTMLInputElement>(null);
  
  // Information tab state
  const [cardDescription, setCardDescription] = useState(DEFAULT_CARD_DESCRIPTION);
  const [howToEarnStamp, setHowToEarnStamp] = useState(DEFAULT_HOW_TO_EARN);
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY_NAME);
  const [termsOfUse, setTermsOfUse] = useState(DEFAULT_TERMS_OF_USE);
  const [sourceCompanyName, setSourceCompanyName] = useState(DEFAULT_SOURCE_COMPANY);
  const [sourceEmail, setSourceEmail] = useState(DEFAULT_SOURCE_EMAIL);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_PHONE_NUMBER);

  const tabs = ["نوع البطاقة", "الإعدادات", "التصميم", "المعلومات"];

  // تحميل بيانات القالب من localStorage عند تحميل الصفحة
  useEffect(() => {
    if (isEditing) {
      return;
    }
    const savedTemplate = localStorage.getItem('selected_template');
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        
        // تحميل بيانات القالب إلى state
        setSelectedTemplateMeta(template);
        setCardName(template.name || "Stamps Card");
        setSelectedCardType(template.cardType !== undefined ? template.cardType : 0);
        setStampsCount(template.totalStages || 6);
        setActiveStampType(template.activeStampType || "Star");
        setInactiveStampType(template.inactiveStampType || "Star");
        setColors(template.colors || DEFAULT_COLORS);
        setCardDescription(template.cardDescription || "اجمع الاختام واحصل على هدية 🎁");
        setHowToEarnStamp(template.howToEarnStamp || "احصل علي ختم عند كل عملية شراء");
        setCompanyName(template.companyName || "مغاسل وتلميع تذكار");
        setTermsOfUse(template.termsOfUse || "");
        setSourceCompanyName(template.sourceCompanyName || "rehabsa");
        setSourceEmail(template.sourceEmail || "support@rehabsa.com");
        setCountryCode(template.countryCode || "+966");
        setPhoneNumber(template.phoneNumber || "547669684");
        
        // التنقل إلى تبويب نوع البطاقة
        setActiveTab("نوع البطاقة");
        
        // حذف القالب من localStorage بعد تحميله
        localStorage.removeItem('selected_template');
        
        toast.success("تم تحميل القالب بنجاح!", {
          description: `تم تحميل قالب "${template.name}"`
        });
      } catch (error) {
        console.error("خطأ في تحميل القالب:", error);
        localStorage.removeItem('selected_template');
      }
    }
  }, []);

  useEffect(() => {
    if (!isEditing || !editId) {
      return;
    }

    const loadCardDetails = async () => {
      setLoadingCard(true);
      const loadingId = toast.loading("جاري تحميل بيانات البطاقة...");
      try {
        const response = await fetchCard(editId);
        const data = response.data;
        const settings = data.settings ?? {};
        const computedColors = {
          backgroundColor: settings.colors?.backgroundColor ?? data.bg_color ?? DEFAULT_COLORS.backgroundColor,
          textColor: settings.colors?.textColor ?? data.text_color ?? DEFAULT_COLORS.textColor,
          middleAreaBg: settings.colors?.middleAreaBg ?? DEFAULT_COLORS.middleAreaBg,
          activeStamp: settings.colors?.activeStamp ?? DEFAULT_COLORS.activeStamp,
          stampBackground: settings.colors?.stampBackground ?? DEFAULT_COLORS.stampBackground,
          borderColor: settings.colors?.borderColor ?? DEFAULT_COLORS.borderColor,
          inactiveStamp: settings.colors?.inactiveStamp ?? DEFAULT_COLORS.inactiveStamp,
        };

        setColors(computedColors);
        setSelectedTemplateMeta({
          id: settings.templateId,
          bgColor: data.bg_color,
          bgOpacity: data.bg_opacity,
          bgImage: data.bg_image,
          textColor: data.text_color,
        });
        setCardName(data.name ?? DEFAULT_CARD_NAME);
        setSelectedCardType(typeof settings.cardType === "number" ? settings.cardType : 0);
        setStampsCount(data.total_stages ?? settings.totalStages ?? 6);
        setActiveStampType(settings.activeStampType || "Star");
        setInactiveStampType(settings.inactiveStampType || "Star");
        setCardDescription(settings.cardDescription || data.title || DEFAULT_CARD_DESCRIPTION);
        setHowToEarnStamp(settings.howToEarnStamp || data.description || DEFAULT_HOW_TO_EARN);
        setCompanyName(settings.companyName || DEFAULT_COMPANY_NAME);
        setTermsOfUse(settings.termsOfUse || DEFAULT_TERMS_OF_USE);
        setSourceCompanyName(settings.sourceCompanyName || DEFAULT_SOURCE_COMPANY);
        setSourceEmail(settings.sourceEmail || DEFAULT_SOURCE_EMAIL);
        const detectedCountryCode = settings.countryCode || DEFAULT_COUNTRY_CODE;
        setCountryCode(detectedCountryCode);
        const savedPhone = settings.phoneNumber || "";
        const normalizedPhone = savedPhone.startsWith(detectedCountryCode)
          ? savedPhone.slice(detectedCountryCode.length)
          : savedPhone;
        setPhoneNumber(normalizedPhone || DEFAULT_PHONE_NUMBER);
        setCustomStamps(Boolean(settings.customStamps));
        setCardLimit(Number(settings.cardLimit) || 0);
        setInitialStamps(Number(settings.initialStamps) || 0);
        setMaxStampsPerTransaction(Number(settings.maxStampsPerTransaction) || 0);
        setMaxStampsPerDay(Number(settings.maxStampsPerDay) || 0);
        setRequireProductSelection(Boolean(settings.requireProductSelection));
        setMinAmountForStamps(Number(settings.minAmountForStamps) || 1);
        setSelectedLocation(settings.selectedLocation || "");
        setShowPrivacyPolicy(Boolean(settings.showPrivacyPolicy));
        setShowCardUsagePolicy(settings.showCardUsagePolicy === undefined ? true : Boolean(settings.showCardUsagePolicy));
        const fields = Array.isArray(settings.formFields) && settings.formFields.length
          ? settings.formFields.map((field: any, index: number) => ({
              id: field.id ?? `${index}-${Date.now()}`,
              type: field.type ?? "FName",
              name: field.name ?? "",
              required: Boolean(field.required),
            }))
          : DEFAULT_FORM_FIELDS.map((field, index) => ({
              ...field,
              id: field.id ?? `${index}-${Date.now()}`,
            }));
        setFormFields(fields);
        setIssueDateValue(data.issue_date ?? null);
        setExpiryDateValue(data.expiry_date ?? null);
        setExpiryType(settings.expiryType || (data.expiry_date ? "date" : "unlimited"));
      } catch (error: any) {
        toast.error(error.message || "تعذر تحميل البطاقة");
        navigate("/dashboard/cards");
      } finally {
        toast.dismiss(loadingId);
        setLoadingCard(false);
      }
    };

    loadCardDetails();
  }, [isEditing, editId, navigate]);

  // دالة للتنقل إلى التبويب التالي
  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // دالة لحفظ البطاقة والتنقل إلى صفحة البطاقات
  const handleSaveCard = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) {
      return;
    }

    if (!cardName.trim()) {
      toast.error("يرجى إدخال اسم البطاقة");
      return;
    }

    if (selectedCardType === null) {
      toast.error("يرجى اختيار نوع البطاقة");
      return;
    }

    if (!cardDescription.trim()) {
      toast.error("يرجى إدخال وصف البطاقة");
      return;
    }

    if (!howToEarnStamp.trim()) {
      toast.error("يرجى إدخال كيفية كسب الطابع");
      return;
    }

    if (!companyName.trim()) {
      toast.error("يرجى إدخال اسم الشركة");
      return;
    }

    if (loadingCard) {
      toast.info("يرجى انتظار تحميل بيانات البطاقة");
      return;
    }

    const actionMessage = isEditing ? "جاري تحديث البطاقة..." : "جاري إنشاء البطاقة...";
    const toastId = toast.loading(actionMessage, {
      description: "يرجى الانتظار"
    });

    const nowIso = new Date().toISOString();
    const resolvedIssueDate = issueDateValue ?? nowIso;
    const resolvedExpiryDate = expiryType === "unlimited" ? null : (expiryDateValue ?? null);
    const resolvedBgColor = colors.backgroundColor || selectedTemplateMeta?.bgColor || DEFAULT_COLORS.backgroundColor;
    const resolvedTextColor = colors.textColor || selectedTemplateMeta?.textColor || DEFAULT_COLORS.textColor;
    const resolvedBgImage = selectedTemplateMeta?.bgImage || "";
    const resolvedBgOpacity = typeof selectedTemplateMeta?.bgOpacity === "number" ? selectedTemplateMeta.bgOpacity : 0.9;

    const payload: CardPayload = {
      name: cardName.trim(),
      title: cardDescription,
      description: howToEarnStamp,
      issue_date: resolvedIssueDate,
      expiry_date: resolvedExpiryDate,
      bg_color: resolvedBgColor,
      bg_opacity: resolvedBgOpacity,
      bg_image: resolvedBgImage,
      text_color: resolvedTextColor,
      status: "active",
      total_stages: stampsCount,
      current_stage: isEditing ? undefined : 0,
      settings: {
        templateId: selectedTemplateMeta?.id,
        cardType: selectedCardType,
        colors,
        cardDescription,
        howToEarnStamp,
        companyName,
        termsOfUse,
        sourceCompanyName,
        sourceEmail,
        phoneNumber,
        countryCode,
        fullPhoneNumber: `${countryCode}${phoneNumber}`,
        activeStampType,
        inactiveStampType,
        customStamps,
        cardLimit,
        initialStamps,
        maxStampsPerTransaction,
        maxStampsPerDay,
        requireProductSelection,
        minAmountForStamps,
        formFields,
        selectedLocation,
        showPrivacyPolicy,
        showCardUsagePolicy,
        expiryType,
        issueDateValue: resolvedIssueDate,
        expiryDateValue: resolvedExpiryDate,
      },
    };

    try {
      setIsSubmitting(true);
      if (isEditing && editId) {
        await updateCard(editId, payload);
        toast.success("تم تحديث البطاقة بنجاح!", {
          description: `تم تحديث البطاقة "${cardName}"`
        });
        navigate(`/dashboard/cards/${editId}`);
      } else {
        await createCard(payload);
        toast.success("تم إنشاء البطاقة بنجاح!", {
          description: `تم إنشاء البطاقة "${cardName}" بنجاح`
        });
        navigate("/dashboard/cards");
      }
    } catch (error: any) {
      toast.error(error.message || "تعذر إنشاء البطاقة");
    } finally {
      toast.dismiss(toastId);
      setIsSubmitting(false);
    }
  };

  const cardTypes = [
    {
      id: 0,
      name: "الاختام",
      icon: Stamp,
      badge: "نسبة احتفاظ عالية",
      badgeColor: "bg-primary text-textWhite",
    },
    {
      id: 1,
      name: "الاسترداد المالي",
      icon: DollarSign,
      badge: "نسبة احتفاظ عالية",
      badgeColor: "border-primary text-primary",
    },
  ];

  if (loadingCard) {
    return (
      <div className="px-10 py-14">
        <p className="text-sm text-muted-foreground">جاري تحميل بيانات البطاقة...</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-6">
      {/* Header */}
      <div className="flex items-center justify-between max-xl:mt-[11px] mb-8 p-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary))' }}>
        <input
          className="py-3 pl-5 mr-6 w-[226px] rounded-[6px] bg-bgBlack font-[600] text-start text-textWhite text-[16px] max-xl:hidden"
          required
          dir="ltr"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <div className="mr-6 flex gap-4 items-center text-[13.04px] font-[500] max-md:overflow-scroll">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 bg-transparent border-[1.09px] border-Gray w-[126px] rounded-[5px] hover:bg-[#ffffff16] active:text-text hover:border-bg hover:text-textWhite transition-all duration-300 max-xsm:w-[100px] ${
                activeTab === tab
                  ? "bg-white text-black border-bg"
                  : "text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-6 max-lg:hidden">
          <button className="w-[197px] py-3 bg-white text-primary rounded-[6px] font-[500] text-[13px] hover:bg-gray-100 hover:text-primary transition-all">
            حفظ ومعاينة
          </button>
        </div>
        <div className="relative hidden max-lg:flex">
          <div className="text-white">
            <Ellipsis className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20 flex flex-row max-md:flex-col-reverse relative">
        {/* Left Side - Content */}
        <div className="w-[60%] ltr:pr-10 rtl:pl-10 max-md:w-full max-md:p-0 ltr:border-r rtl:border-none border-Gray font-[500] max-md:border-none px-10">
          {activeTab === "نوع البطاقة" && (
            <>
              <h1 className="pb-4 my-4 text-[24px] font-[500] border-b-[1px] border-Gray flex items-center gap-3">
                نوع البطاقة
                <Info className="w-5 h-5 text-textGray cursor-help" />
              </h1>

              <div className="mt-14 flex items-start max-md:flex-col-reverse">
                <div className="pr-5 flex-[1] max-md:p-0 max-md:w-full mr-5 max-md:mr-0 max-md:mt-5">
                  <h1 className="mb-6 text-[24px] font-[500] max-md:hidden flex items-center gap-3">
                    <Info className="w-5 h-5 text-textGray cursor-help" />
                  </h1>
                  <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-lg:gap-6 max-xxsm:grid-cols-1">
                    {cardTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedCardType === type.id;
                      return (
                        <button
                          key={type.id}
                          className={`py-6 px-2 cursor-pointer flex flex-col items-center gap-2 border-[2px] border-Gray font-[500] rounded-[7.7px] hover:bg-bgBlack hover:text-textWhite transition-all ${
                            isSelected
                              ? "bg-bgBlack text-textWhite"
                              : "bg-transparent"
                          }`}
                          onClick={() => setSelectedCardType(type.id)}
                        >
                          <Icon className="w-[50px] h-[50px] text-textGray" />
                          <div className="text-[16px] text-textGray select-none capitalize">
                            {type.name}
                          </div>
                          <div
                            className={`text-[11px] min-w-max rounded-full border-[1px] select-none border-primary px-2 ${
                              isSelected
                                ? type.badgeColor
                                : "border-primary text-primary"
                            }`}
                          >
                            {type.badge}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    type="button"
                    onClick={handleNextTab}
                    className="mt-14 main-btn select-none rounded-[5px]"
                  >
                    استمرار
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "الإعدادات" && (
            <div>
              <h1 className="pb-4 my-4 text-[24px] font-[500] border-b-[1px] border-Gray">
                الإعدادات
              </h1>
              <form className="mt-3">
                {/* تاريخ انتهاء البطاقة */}
              <div className="mb-2 text-[14px]">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="flex items-center gap-2">
                    تاريخ انتهاء البطاقة
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <RadioGroup value={expiryType} onValueChange={setExpiryType} className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 w-full font-[400] cursor-pointer">
                    <RadioGroupItem value="unlimited" id="unlimited" />
                    <span>غير محدود</span>
                  </label>
                  <label className="flex items-center gap-2 w-full font-[400] cursor-pointer">
                    <RadioGroupItem value="date" id="date" />
                    <span>فترات ثابتة</span>
                  </label>
                  <label className="flex items-center gap-2 w-full font-[400] cursor-pointer">
                    <RadioGroupItem value="daysAfterIssue" id="daysAfterIssue" />
                    <span>فترة ثابتة بعد إصدار البطاقة</span>
                  </label>
                </RadioGroup>
              </div>

              {/* تحديد عدد البطاقات */}
              <div className="mb-8 text-[14px]">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="flex items-center gap-2 ant-form-item-required">
                    تحديد عدد البطاقات التي يمكن إصدارها (0 = غير محدود)
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <NumberInput
                  value={cardLimit}
                  onChange={(e) => setCardLimit(Number(e.target.value))}
                  onIncrement={() => setCardLimit((prev) => prev + 1)}
                  onDecrement={() => setCardLimit((prev) => Math.max(0, prev - 1))}
                  showSuccessIcon={true}
                  className="w-full"
                  min={0}
                  placeholder="Card limit number"
                />
              </div>

              {/* عدد الطوابع المكتسبة عند إصدار البطاقة */}
              <div className="mt-3 mb-8 text-[14px]">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="flex items-center gap-2 ant-form-item-required">
                    عدد الطوابع المكتسبة عند إصدار البطاقة
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <NumberInput
                  value={initialStamps}
                  onChange={(e) => setInitialStamps(Number(e.target.value))}
                  onIncrement={() => setInitialStamps((prev) => prev + 1)}
                  onDecrement={() => setInitialStamps((prev) => Math.max(0, prev - 1))}
                  showSuccessIcon={true}
                  className="w-full"
                  min={0}
                  placeholder="initial stamps number"
                />
              </div>

              {/* الحد الأقصى للطوابع */}
              <div className="w-full">
                <div className="mb-8 text-[14px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2 ant-form-item-required">
                      الحد الأقصى للطوابع في العملية (0 = غير محدود)
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <NumberInput
                    value={maxStampsPerTransaction}
                    onChange={(e) => setMaxStampsPerTransaction(Number(e.target.value))}
                    onIncrement={() => setMaxStampsPerTransaction((prev) => prev + 1)}
                    onDecrement={() => setMaxStampsPerTransaction((prev) => Math.max(0, prev - 1))}
                    showSuccessIcon={true}
                    className="w-full"
                    min={0}
                    maxLength={1}
                  />
                </div>
                <div className="mb-8 text-[14px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2 ant-form-item-required">
                      الحد الأقصى للطوابع في اليوم (0 = غير محدود)
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <NumberInput
                    value={maxStampsPerDay}
                    onChange={(e) => setMaxStampsPerDay(Number(e.target.value))}
                    onIncrement={() => setMaxStampsPerDay((prev) => prev + 1)}
                    onDecrement={() => setMaxStampsPerDay((prev) => Math.max(0, prev - 1))}
                    showSuccessIcon={true}
                    className="w-full"
                    min={0}
                    maxLength={1}
                  />
                </div>
              </div>

              {/* فرض اختيار المنتج */}
              <div className="pt-6 mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <Label className="flex items-center gap-2">
                    فرض اختيار المنتج
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <div className="flex w-full justify-between items-center text-[14px] text-textGray">
                  <span>فرض اختيار المنتج لإعطاء الاختام والكاش باك (تعطيل الإدخال اليدوي)</span>
                  <Switch checked={requireProductSelection} onCheckedChange={setRequireProductSelection} />
                </div>
              </div>

              {/* المبلغ الأدنى للطوابع */}
              <div className="pb-6 border-b-[1px] border-Gray">
                <div className="mb-3">
                  <Label>المبلغ الأدنى للطوابع</Label>
                  <div className="space-y-2 mt-2">
                    <span className="text-[14px] text-textGray block">المبلغ الأدنى للطوابع للحصول عليها للطوابع</span>
                    <NumberInput
                      value={minAmountForStamps}
                      onChange={(e) => setMinAmountForStamps(Number(e.target.value))}
                      onIncrement={() => setMinAmountForStamps((prev) => prev + 1)}
                      onDecrement={() => setMinAmountForStamps((prev) => Math.max(1, prev - 1))}
                      disabled={true}
                      className="w-full"
                      prefix={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-saudi-riyal m-1"
                        >
                          <path d="m20 19.5-5.5 1.2"></path>
                          <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2"></path>
                          <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2"></path>
                          <path d="M20 10 4 13.5"></path>
                        </svg>
                      }
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* نموذج إصدار البطاقة */}
              <div className="mt-3 mb-8 border-b-[1px] border-Gray pb-4 text-[14px]">
                <div className="flex items-center gap-2 mb-4">
                  <Label className="flex items-center gap-2">
                    نموذج إصدار البطاقة
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-items-center text-[13px] font-normal">
                    <span>نوع الحقل</span>
                    <span>اسم الحقل</span>
                    <span>مطلوب</span>
                    <span></span>
                  </div>
                  {formFields.map((field) => (
                    <div key={field.id} className="grid grid-cols-4 gap-4 mb-3 items-center justify-items-center">
                      <Select value={field.type} onValueChange={(value) => {
                        setFormFields((prev) =>
                          prev.map((f) => (f.id === field.id ? { ...f, type: value } : f))
                        );
                      }}>
                        <SelectTrigger className="w-full rounded-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FName">FName</SelectItem>
                          <SelectItem value="LName">LName</SelectItem>
                          <SelectItem value="phone">phone</SelectItem>
                          <SelectItem value="dob">dob</SelectItem>
                          <SelectItem value="email">email</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={field.name}
                        onChange={(e) => {
                          setFormFields((prev) =>
                            prev.map((f) => (f.id === field.id ? { ...f, name: e.target.value } : f))
                          );
                        }}
                        placeholder="Enter field name"
                        className="w-full border px-2 py-1 rounded-sm"
                      />
                      <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => {
                          setFormFields((prev) =>
                            prev.map((f) => (f.id === field.id ? { ...f, required: !!checked } : f))
                          );
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormFields((prev) => prev.filter((f) => f.id !== field.id));
                        }}
                        className="text-textGray w-fit cursor-pointer hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormFields((prev) => [
                        ...prev,
                        { id: Date.now().toString(), type: "FName", name: "", required: false },
                      ]);
                    }}
                    className="main-btn w-full my-3 p-1"
                  >
                    أضف حقل
                  </button>
                </div>
              </div>

              {/* المواقع */}
              <div className="mt-3 mb-8 text-[14px]">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="flex items-center gap-2">
                    المواقع
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الموقع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المواقع</SelectItem>
                    <SelectItem value="location1">الموقع 1</SelectItem>
                    <SelectItem value="location2">الموقع 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* سياسة الخصوصية */}
              <div className="mt-3 mb-8 text-[14px]">
                <div className="flex items-center gap-2 mb-3">
                  <Label className="flex items-center gap-2">
                    اظهر خيار سياسة الخصوصية
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <div className="mb-3 flex justify-between items-center text-[14px] text-textGray">
                  <span>أوافق على أنه يمكن استخدام بياناتي الشخصية وتقديمها لأغراض التسويق المباشر</span>
                  <Switch checked={showPrivacyPolicy} onCheckedChange={setShowPrivacyPolicy} />
                </div>
              </div>

              {/* سياسة استخدام البطاقة */}
              <div className="mt-3 mb-8 text-[14px]">
                <div className="flex items-center gap-2 mb-3">
                  <Label className="flex items-center gap-2">
                    اظهر سياسة استخدام البطاقة
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </Label>
                </div>
                <div className="mb-3 flex justify-between items-center text-[14px] text-textGray">
                  <span>اظهر سياسة استخدام البطاقة للعملاء لقراءتها</span>
                  <Switch checked={showCardUsagePolicy} onCheckedChange={setShowCardUsagePolicy} />
                </div>
              </div>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextTab();
                  }}
                  className="main-btn py-1"
                >
                  استمرار
                </button>
              </form>
            </div>
          )}

          {activeTab === "التصميم" && (
            <div>
              <h1 className="pb-4 my-4 text-[24px] font-[500] border-b-[1px] border-Gray flex items-center gap-3">
                تصميم البطاقة
                <Info className="w-5 h-5 text-textGray cursor-help" />
              </h1>
              <form className="mt-3">
                {/* عدد الطوابع */}
                <div>
                  <h2 className="text-[18px] flex items-center gap-1">
                    عدد الطوابع
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <div className="mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={customStamps}
                        onCheckedChange={(checked) => setCustomStamps(checked === true)}
                      />
                      <h2 className="text-[16px] flex items-center gap-1">
                        طوابع مخصصة
                        <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                      </h2>
                    </label>
                  </div>
                  
                  {/* Grid of stamp count buttons */}
                  <div className="mt-6 mb-6 pb-6 grid grid-cols-10 gap-y-5 border-b-[1px] border-Gray max-lg:grid-cols-6 max-md:grid-cols-10 max-sm:grid-cols-8 max-xsm:grid-cols-6 max-xxsm:hidden">
                    {Array.from({ length: 29 }, (_, i) => i + 2).map((num) => (
                      <div key={num}>
                        <button
                          type="button"
                          onClick={() => setStampsCount(num)}
                          className={`cursor-pointer text-textWhite flex items-center justify-center text-center w-[40px] h-[40px] rounded-full transition-all ${
                            stampsCount === num ? "bg-button" : "bg-bgBlack"
                          }`}
                        >
                          {num}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile select */}
                  <div className="mb-4 mt-1 w-full hidden max-xxsm:flex">
                    <Select value={stampsCount.toString()} onValueChange={(value) => setStampsCount(Number(value))}>
                      <SelectTrigger className="w-full font-[400]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 29 }, (_, i) => i + 2).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* الطوابع النشطة والغير نشطة */}
                <div className="mb-6 pb-6 flex items-start gap-6 border-b-[1px] border-Gray max-md:flex-col">
                  {/* الطوابع النشطة */}
                  <div className="flex-col w-full">
                    <h2 className="text-[14px] flex items-center gap-1 mb-2">
                      الطوابع النشطة
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </h2>
                    <div className="w-full flex flex-col justify-between">
                      <div className="mb-3 w-full">
                        <Select value={activeStampType} onValueChange={setActiveStampType}>
                          <SelectTrigger className="w-full font-[400]">
                            <SelectValue>
                              {(() => {
                                const selectedIcon = stampIcons.find((icon) => icon.value === activeStampType);
                                const IconComponent = selectedIcon?.icon || Star;
                                return (
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-[14px] h-[14px] fill-black" />
                                    <h2>{selectedIcon?.label || "نجمة"}</h2>
                                  </div>
                                );
                              })()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {stampIcons.map((iconOption) => {
                              const IconComponent = iconOption.icon;
                              return (
                                <SelectItem key={iconOption.value} value={iconOption.value}>
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-[14px] h-[14px] fill-black" />
                                    <span>{iconOption.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full border-[1px] border-Gray rounded-[6px] p-2 flex items-center justify-between">
                        <div className="flex items-center justify-center">
                          <File className="w-6 h-6 text-Gray" />
                        </div>
                        <input
                          type="file"
                          ref={activeStampFileRef}
                          accept="image/*"
                          className="hidden"
                          id="activeStamp-upload"
                        />
                        <label htmlFor="activeStamp-upload" className="cursor-pointer">
                          <div className="font-[400] py-0 px-2 text-base main-btn">اختر ملف</div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* الطوابع غير النشطة */}
                  <div className="flex-col w-full">
                    <h2 className="text-[14px] flex items-center gap-1 mb-2">
                      الطوابع غير النشطة
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </h2>
                    <div className="w-full flex flex-col justify-between">
                      <div className="mb-3 w-full">
                        <Select value={inactiveStampType} onValueChange={setInactiveStampType}>
                          <SelectTrigger className="w-full font-[400]">
                            <SelectValue>
                              {(() => {
                                const selectedIcon = stampIcons.find((icon) => icon.value === inactiveStampType);
                                const IconComponent = selectedIcon?.icon || Star;
                                return (
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-[14px] h-[14px] fill-black" />
                                    <h2>{selectedIcon?.label || "نجمة"}</h2>
                                  </div>
                                );
                              })()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {stampIcons.map((iconOption) => {
                              const IconComponent = iconOption.icon;
                              return (
                                <SelectItem key={iconOption.value} value={iconOption.value}>
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-[14px] h-[14px] fill-black" />
                                    <span>{iconOption.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full border-[1px] border-Gray rounded-[6px] p-2 flex items-center justify-between">
                        <div className="flex items-center justify-center">
                          <File className="w-6 h-6 text-Gray" />
                        </div>
                        <input
                          type="file"
                          ref={inactiveStampFileRef}
                          accept="image/*"
                          className="hidden"
                          id="inactiveStamp-upload"
                        />
                        <label htmlFor="inactiveStamp-upload" className="cursor-pointer">
                          <div className="font-[400] py-0 px-2 text-base main-btn">اختر ملف</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* شعار */}
                <div>
                  <h2 className="text-[14px] flex items-center gap-1 mb-2">
                    شعار
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <div className="w-full border-[1px] border-Gray rounded-[6px] p-2 flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <File className="w-6 h-6 text-Gray" />
                    </div>
                    <input
                      type="file"
                      ref={logoFileRef}
                      accept="image/*"
                      className="hidden"
                      id="image"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="font-[400] py-0 px-2 text-base main-btn">اختر ملف</div>
                    </label>
                  </div>
                </div>

                {/* خلفية */}
                <div className="mt-4">
                  <h2 className="text-[14px] flex items-center gap-1 mb-2">
                    خلفية
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <div className="w-full border-[1px] border-Gray rounded-[6px] p-2 flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <File className="w-6 h-6 text-Gray" />
                    </div>
                    <input
                      type="file"
                      ref={backgroundFileRef}
                      accept="image/*"
                      className="hidden"
                      id="bg"
                    />
                    <label htmlFor="bg" className="cursor-pointer">
                      <div className="font-[400] py-0 px-2 text-base main-btn">اختر ملف</div>
                    </label>
                  </div>
                </div>

                {/* رمز رسالة الاشعارات */}
                <div className="mt-4">
                  <h2 className="text-[14px] flex items-center gap-1 mb-2">
                    رمز رسالة الاشعارات
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <div className="w-full border-[1px] border-Gray rounded-[6px] p-2 flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <File className="w-6 h-6 text-Gray" />
                    </div>
                    <input
                      type="file"
                      ref={pushIconFileRef}
                      accept="image/*"
                      className="hidden"
                      id="pushIconUrl"
                    />
                    <label htmlFor="pushIconUrl" className="cursor-pointer">
                      <div className="font-[400] py-0 px-2 text-base main-btn">اختر ملف</div>
                    </label>
                  </div>
                </div>

                {/* الألوان */}
                <div className="mt-6 pt-6 border-t-[1px] border-Gray">
                  <h2 className="text-[14px] mb-2 flex items-center gap-1">
                    الألوان
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <div className="grid gap-x-6 grid-cols-2 max-lg:grid-cols-1">
                    {/* لون الخلفية */}
                    <div className="mb-4">
                      <Label htmlFor="bg-color" title="لون الخلفية">
                        لون الخلفية
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="bg-color"
                            value={colors.backgroundColor}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, backgroundColor: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.backgroundColor }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.backgroundColor}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, backgroundColor: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* لون النص */}
                    <div className="mb-4">
                      <Label htmlFor="text-color" title="لون النص">
                        لون النص
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="text-color"
                            value={colors.textColor}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, textColor: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.textColor }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.textColor}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, textColor: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* لون خلفية المنطقة الوسطى */}
                    <div className="mb-4">
                      <Label htmlFor="middle-bg" title="لون خلفية المنطقة الوسطى">
                        لون خلفية المنطقة الوسطى
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="middle-bg"
                            value={colors.middleAreaBg}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, middleAreaBg: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.middleAreaBg }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.middleAreaBg}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, middleAreaBg: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* طابع نشط */}
                    <div className="mb-4">
                      <Label htmlFor="active-stamp" title="طابع نشط">
                        طابع نشط
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="active-stamp"
                            value={colors.activeStamp}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, activeStamp: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.activeStamp }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.activeStamp}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, activeStamp: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* خلفية تحت الطابع */}
                    <div className="mb-4">
                      <Label htmlFor="stamp-bg" title="خلفية تحت الطابع">
                        خلفية تحت الطابع
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="stamp-bg"
                            value={colors.stampBackground}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, stampBackground: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.stampBackground }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.stampBackground}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, stampBackground: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* لون الخط الخارجي */}
                    <div className="mb-4">
                      <Label htmlFor="border-color" title="لون الخط الخارجي">
                        لون الخط الخارجي
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="border-color"
                            value={colors.borderColor}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, borderColor: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.borderColor }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.borderColor}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, borderColor: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* طابع غير نشط */}
                    <div className="mb-4">
                      <Label htmlFor="inactive-stamp" title="طابع غير نشط">
                        طابع غير نشط
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="inactive-stamp"
                            value={colors.inactiveStamp}
                            onChange={(e) =>
                              setColors((prev) => ({ ...prev, inactiveStamp: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border border-Gray"
                            style={{ backgroundColor: colors.inactiveStamp }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Color"
                          value={colors.inactiveStamp}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, inactiveStamp: e.target.value }))
                          }
                          className="font-[400] flex-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextTab();
                  }}
                  className="mt-8 main-btn py-1"
                >
                  استمرار
                </button>
              </form>
            </div>
          )}

          {activeTab === "المعلومات" && (
            <div>
              <h1 className="pb-4 my-4 text-[24px] font-[500] border-b-[1px] border-Gray flex items-center gap-3">
                معلومات البطاقة
                <Info className="w-5 h-5 text-textGray cursor-help" />
              </h1>
              <form className="mt-3">
                {/* وصف البطاقة */}
                <div className="relative mt-3 text-[14px] mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2 ant-form-item-required">
                      وصف البطاقة
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      dir="ltr"
                      type="text"
                      placeholder="Write here..."
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
                      className="py-2 pr-10"
                      required
                    />
                    <Smile className="absolute right-3 top-1/2 -translate-y-1/2 text-textGray cursor-pointer max-xsm:hidden w-6 h-6" />
                  </div>
                </div>

                {/* كيفية كسب الطابع */}
                <div className="mt-3 text-[14px] mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2 ant-form-item-required">
                      كيفية كسب الطابع
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      dir="ltr"
                      type="text"
                      placeholder="Write here..."
                      value={howToEarnStamp}
                      onChange={(e) => setHowToEarnStamp(e.target.value)}
                      className="py-2 pr-10"
                      required
                    />
                    <Smile className="absolute right-3 top-1/2 -translate-y-1/2 text-textGray cursor-pointer max-xsm:hidden w-6 h-6" />
                  </div>
                </div>

                {/* اسم الشركة */}
                <div className="mt-3 text-[14px] mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2 ant-form-item-required">
                      اسم الشركة
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      dir="ltr"
                      type="text"
                      placeholder="Write here..."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="py-2 pr-10"
                      required
                    />
                    <Smile className="absolute right-3 top-1/2 -translate-y-1/2 text-textGray cursor-pointer max-xsm:hidden w-6 h-6" />
                  </div>
                </div>

                {/* شروط الاستخدام */}
                <div className="mt-6 pt-6 border-t-[1px] border-Gray flex flex-col gap-2">
                  <h2 className="text-[14px] flex items-center gap-1">
                    شروط الاستخدام
                    <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                  </h2>
                  <Textarea
                    dir="ltr"
                    placeholder="Write here..."
                    rows={6}
                    value={termsOfUse}
                    onChange={(e) => setTermsOfUse(e.target.value)}
                    className="py-2"
                  />
                </div>

                {/* معلومات المصدر */}
                <div className="mt-3 text-[14px] mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="flex items-center gap-2">
                      معلومات المصدر
                      <Info className="w-[15px] h-[15px] text-textGray cursor-help" />
                    </Label>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      dir="ltr"
                      placeholder="Company Name"
                      value={sourceCompanyName}
                      onChange={(e) => setSourceCompanyName(e.target.value)}
                      className="py-2"
                    />
                    <Input
                      type="email"
                      dir="ltr"
                      placeholder="Email"
                      value={sourceEmail}
                      onChange={(e) => setSourceEmail(e.target.value)}
                      className="py-2"
                    />
                    <div className="flex items-center gap-0 w-full h-11 border border-input rounded-md overflow-hidden">
                      <div className="border-r border-input flex items-center bg-background">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[120px] h-11 border-0 rounded-none">
                            <SelectValue>🇸🇦 +966</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+966">🇸🇦 +966</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971</SelectItem>
                            <SelectItem value="+965">🇰🇼 +965</SelectItem>
                            <SelectItem value="+974">🇶🇦 +974</SelectItem>
                            <SelectItem value="+973">🇧🇭 +973</SelectItem>
                            <SelectItem value="+968">🇴🇲 +968</SelectItem>
                            <SelectItem value="+961">🇱🇧 +961</SelectItem>
                            <SelectItem value="+962">🇯🇴 +962</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        type="text"
                        maxLength={9}
                        placeholder="547669684"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 h-11 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleSaveCard}
                  disabled={isSubmitting}
                  className="w-full main-btn py-1 flex items-center justify-center mt-4"
                >
                  Finish
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="w-[40%] ml-10 max-md:w-full max-md:ml-0">
          <div
            className="flex items-center overflow-hidden max-lg:flex-col max-md:m-auto"
            style={{ position: "sticky", top: "0px" }}
          >
            <div className="relative flex flex-col items-center" dir="ltr">
              <div className="absolute -top-6 right-[50%] translate-x-1/2 flex items-center justify-center">
                <Dot className="absolute -left-7 text-active" aria-hidden="true" width={24} height={24} />
                <span className="text-[12px] font-[600]">نشط</span>
              </div>
              {activeTab === "المعلومات" ? (
                <div className="overflow-hidden relative w-[300px] max-xsm:w-[200px]" dir="ltr">
                  <img alt="Active screen" src={iosFrame} className="w-full h-full object-contain" />
                  
                  {/* Main Card - White */}
                  <div
                    className="w-[85%] h-[61%] absolute top-0 translate-y-1/4 right-[50%] translate-x-[50%] rounded-[6px] shadow-[0px_2px_5px_#d5d5d5,-2px_-2px_10px_#ebebeb] overflow-hidden"
                    style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(0, 0, 0)" }}
                  >
                    {/* Small Card on Top */}
                    <div
                      className="w-[20%] h-[10%] absolute top-16 translate-y-1/4 right-[50%] translate-x-[50%] rounded-[3px] shadow-[0px_1px_5px_#d5d5d5,0px_1px_10px_#ebebeb] overflow-hidden max-xsm:top-5 max-xsm:w-[30%] max-xsm:h-[17%]"
                      style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(0, 0, 0)" }}
                    >
                      <div className="w-[101%] h-[15%] absolute top-[0%] right-[50%] translate-x-[50%] flex items-center px-[2px] text-[16px] max-xsm:text-[10px]">
                        <div className="w-full flex justify-between items-center text-[3px] max-xsm:text-[2px]">
                          <h1>stamp</h1>
                        </div>
                      </div>
                      <div
                        className="w-[101%] absolute top-[15%] right-[50%] translate-x-[50%] flex items-center px-[2px] h-[25%]"
                        style={{ backgroundColor: "rgb(255, 255, 255)" }}
                      ></div>
                      <div className="w-[101%] h-full absolute top-[41%] right-[50%] translate-x-[50%] flex flex-col px-[2px]">
                        <div className="text-[2px] font-[400] max-xsm:text-[2px]">
                          <div className="flex justify-between">
                            <h1>STAMPS UNTIL REWARD</h1>
                            <h1>AVAILABLE REWARDS</h1>
                          </div>
                          <div className="flex justify-between text-[3px] max-xsm:text-[3px]">
                            <h5>4 stamps</h5>
                            <h5>0 rewards</h5>
                          </div>
                        </div>
                        <div className="absolute top-1 left-[50%] translate-x-[-50%] max-xsm:top-2">
                          <div className="m-auto border-none pb-0" style={{ backgroundColor: "transparent", width: "40px", height: "40px" }}>
                            <div className="w-[40px] h-[40px] border border-gray-300 flex items-center justify-center">
                              <svg
                                className="w-[35px] h-[35px]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                                />
                              </svg>
                            </div>
                          </div>
                          <h2 className="text-[1.5px] flex items-center absolute top-[68%] left-[34%] justify-center max-xsm:text-[1.5px] max-xsm:left-[33%] max-xsm:top-[67%]">
                            powered by rehabsa
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Description Text */}
                    <h1
                      className="w-[270px] h-[3.9%] absolute top-[29%] translate-y-1/4 right-[50%] translate-x-[50%] rounded-[3px] overflow-y-scroll text-[14px] font-[500] text-center scroll max-xsm:w-[180px]"
                    >
                      {cardDescription}
                    </h1>

                    {/* Information Section with Scroll */}
                    <div className="w-[90%] border-t-[1px] border-Gray p-3 h-[57%] scroll absolute top-[21%] translate-y-1/4 right-[50%] translate-x-[50%] overflow-y-scroll overflow-x-hidden font-[300] text-[13px] flex flex-col gap-3 max-xsm:text-[10px]">
                      <div>
                        <h1>How to earn a stamp</h1>
                        <p className="text-textGray text-[14px] max-xsm:text-[11px] cursor-pointer hover:text-black">
                          {howToEarnStamp}
                        </p>
                      </div>
                      <div>
                        <h1>Company name</h1>
                        <p className="text-textGray text-[14px] max-xsm:text-[11px] cursor-pointer hover:text-black">
                          {companyName}
                        </p>
                      </div>
                      <div>
                        <h4>Terms of use</h4>
                        <pre className="text-textGray text-[14px] max-xsm:text-[11px] overflow-x-scroll scroll cursor-pointer hover:text-black whitespace-pre-wrap">
                          {termsOfUse}
                        </pre>
                      </div>
                      <h4 className="border-y-[1px] border-[#d5d5d5] py-3">
                        Issuer information
                        <p className="text-[12px] text-primary font-[500] hover:underline max-xsm:text-[11px] cursor-pointer hover:text-black">
                          {sourceCompanyName}
                        </p>
                        <p className="text-[12px] text-primary font-[500] hover:underline max-xsm:text-[11px] cursor-pointer hover:text-black">
                          {sourceEmail}
                        </p>
                      </h4>
                      <h2 className="text-textGray text-[14px] max-xsm:text-[11px] cursor-pointer hover:text-black">
                        Powered by rehabsa
                      </h2>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden relative w-[245px] max-xsm:w-[200px]">
                  <img alt="Active screen" src={iosFrame} className="w-full h-full object-contain" />
                  {/* Card Preview */}
                  <div
                    className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                    dir="rtl"
                    style={{
                      backgroundColor: activeTab === "التصميم"
                        ? colors.backgroundColor 
                        : "rgba(30, 50, 74, 0.9)",
                      color: activeTab === "التصميم"
                        ? colors.textColor 
                        : "rgb(255, 255, 255)",
                    }}
                  >
                  <div className="h-full flex flex-col p-2.5 md:p-3">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center mb-2">
                      <div className="text-center mb-1">
                        <div className="text-xs font-medium">
                          <span className="tracking-tight">{cardName}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-[10px] font-semibold opacity-90 text-center">
                          {selectedCardType === 0 ? "STAMPS" : "REFUND"} <span className="block text-right">2/{(activeTab === "التصميم" || activeTab === "المعلومات") ? stampsCount : 6}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stamps Icons for Stamps Card */}
                    {selectedCardType === 0 && (
                      <div 
                        className="flex items-center justify-center gap-1.5 mb-2.5 pb-2 border-b"
                        style={{ 
                          borderColor: (activeTab === "التصميم" || activeTab === "المعلومات") ? `${colors.textColor}33` : "rgba(255, 255, 255, 0.2)" 
                        }}
                      >
                        {Array.from({ length: (activeTab === "التصميم" || activeTab === "المعلومات") ? stampsCount : 6 }).map((_, index) => {
                          const isFilled = index < 2;
                          const iconType = isFilled ? activeStampType : inactiveStampType;
                          const iconOption = stampIcons.find((icon) => icon.value === iconType);
                          const showDesignColors = (activeTab === "التصميم" || activeTab === "المعلومات");
                          const fillColor = isFilled 
                            ? (showDesignColors ? colors.activeStamp : "#FF0000")
                            : (showDesignColors ? colors.inactiveStamp : "#CCCCCC");
                          
                          return (
                            <div
                              key={index}
                              className="relative flex items-center justify-center rounded-[50%] border"
                              style={{
                                backgroundColor: showDesignColors ? colors.stampBackground : "rgba(242, 241, 241, 0.804)",
                                borderColor: showDesignColors ? colors.borderColor : "rgb(0, 0, 0)",
                                width: "35px",
                                height: "35px",
                              }}
                              title={`${index + 1}`}
                            >
                              <svg
                                className="w-[14px] h-[14px] max-xsm:w-[18px] max-xsm:h-[18px]"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d={iconOption?.svgPath || stampIcons[0].svgPath}
                                  fill={fillColor}
                                />
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Content */}
                    {activeTab !== "التصميم" && (
                      <div 
                        className="flex-grow min-w-0 overflow-hidden text-center mb-2"
                        style={{
                          backgroundColor: activeTab === "المعلومات" ? colors.middleAreaBg : "transparent",
                          padding: activeTab === "المعلومات" && colors.middleAreaBg !== "#FFFFFF" ? "8px" : "0",
                          borderRadius: activeTab === "المعلومات" && colors.middleAreaBg !== "#FFFFFF" ? "4px" : "0",
                        }}
                      >
                        <h3 className="text-sm font-extralight line-clamp-1 mb-1">
                          {activeTab === "المعلومات" ? (cardDescription || (selectedCardType === 0 ? "طوابع المكافآت" : "استرداد نقدي")) : (selectedCardType === 0 ? "طوابع المكافآت" : "استرداد نقدي")}
                        </h3>
                        <div className="line-clamp-2 font-light text-[10px] leading-tight">
                          {activeTab === "المعلومات" 
                            ? (howToEarnStamp || (selectedCardType === 0 ? "اجمع الطوابع واحصل على مكافآت حصرية" : "استرداد نقدي على كل عملية شراء"))
                            : (selectedCardType === 0
                              ? "اجمع الطوابع واحصل على مكافآت حصرية"
                              : "استرداد نقدي على كل عملية شراء")}
                        </div>
                      </div>
                    )}
                    {activeTab === "التصميم" && (
                      <div className="flex-grow min-w-0"></div>
                    )}

                    {/* QR Code */}
                    <div className="flex items-center justify-center mb-2">
                      <div
                        className="rounded-lg w-[100px] h-[100px] flex place-content-center items-center shadow-md"
                        style={{ backgroundColor: "rgb(255, 255, 255)" }}
                      >
                        <svg
                          className="w-[90px] h-[90px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          style={{ stroke: "rgb(30, 50, 74)" }}
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

                    {/* Footer */}
                    <div className="flex self-end mt-auto pt-1.5 border-t border-white/20">
                      <div className="flex-grow text-right">
                        <div className="text-[7px] font-extralight opacity-80">المعرف</div>
                        <div className="text-[9px] font-light truncate">123-456-789-012</div>
                      </div>
                      <div className="flex-none w-14 text-left hidden md:block">
                        <div className="text-[7px] font-extralight opacity-80">الإصدار</div>
                        <div className="text-[9px] font-light">15 يناير 2025</div>
                      </div>
                      <div className="flex-none w-14 text-left">
                        <div className="text-[7px] font-extralight opacity-80">الانتهاء</div>
                        <div className="text-[9px] font-light">15 يناير 2026</div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              <h2 className="my-2 text-[20px] font-[500] text-center max-sm:text-[18px]">{cardName}</h2>
              <div className="w-full flex justify-center gap-3 mb-14">
                <button className="main-btn w-[170px] py-2 max-sm:w-[150px] max-sm:px-1 max-sm:py-0">
                  التفاصيل
                </button>
              </div>
            </div>
            {/* Platform Toggle */}
            <div className="ltr:ml-6 rtl:mr-6 flex items-center max-lg:mt-5 gap-4 flex-col max-xsm:mt-5 max-lg:flex-row">
              <div className="p-3 bg-Gray group hover:bg-button rounded-md cursor-pointer w-fit">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="group-hover:fill-white fill-foreground"
                >
                  <path d="M12.9672 5.44501C12.9672 5.57462 12.9416 5.70297 12.892 5.82272C12.8424 5.94246 12.7697 6.05127 12.6781 6.14292C12.5864 6.23457 12.4776 6.30728 12.3579 6.35688C12.2381 6.40648 12.1098 6.43201 11.9802 6.43201C11.8505 6.43201 11.7222 6.40648 11.6025 6.35688C11.4827 6.30728 11.3739 6.23457 11.2822 6.14292C11.1906 6.05127 11.1179 5.94246 11.0683 5.82272C11.0187 5.70297 10.9932 5.57462 10.9932 5.44501C10.9932 5.18324 11.0972 4.93219 11.2822 4.74709C11.4673 4.56199 11.7184 4.45801 11.9802 4.45801C12.2419 4.45801 12.493 4.56199 12.6781 4.74709C12.8632 4.93219 12.9672 5.18324 12.9672 5.44501ZM15.9293 6.43201C16.1911 6.43201 16.4421 6.32802 16.6272 6.14292C16.8123 5.95782 16.9163 5.70678 16.9163 5.44501C16.9163 5.18324 16.8123 4.93219 16.6272 4.74709C16.4421 4.56199 16.1911 4.45801 15.9293 4.45801C15.6676 4.45801 15.4165 4.56199 15.2314 4.74709C15.0463 4.93219 14.9423 5.18324 14.9423 5.44501C14.9423 5.70678 15.0463 5.95782 15.2314 6.14292C15.4165 6.32802 15.6676 6.43201 15.9293 6.43201Z"></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.41346 0.548472C7.49472 0.467161 7.5912 0.402659 7.6974 0.358651C7.8036 0.314643 7.91742 0.291992 8.03238 0.291992C8.14733 0.291992 8.26116 0.314643 8.36736 0.358651C8.47355 0.402659 8.57004 0.467161 8.65129 0.548472L10.084 1.97997C11.2181 1.30377 12.5144 0.947754 13.8348 0.949805H14.0763C15.4471 0.949805 16.7293 1.32547 17.8271 1.97997L19.2598 0.548472C19.4257 0.393912 19.6451 0.309768 19.8717 0.313768C20.0984 0.317767 20.3147 0.409598 20.475 0.569913C20.6353 0.730228 20.7272 0.946511 20.7312 1.1732C20.7352 1.39988 20.651 1.61927 20.4965 1.78514L19.2236 3.05914C20.471 4.28477 21.238 5.91678 21.3855 7.65931C21.7643 7.53302 22.1678 7.4986 22.5626 7.55887C22.9574 7.61915 23.3322 7.77239 23.6562 8.00598C23.9801 8.23956 24.2439 8.5468 24.4258 8.90235C24.6077 9.2579 24.7024 9.6516 24.7023 10.051V15.9741C24.7025 16.3712 24.609 16.7626 24.4292 17.1167C24.2494 17.4707 23.9885 17.7772 23.6678 18.0112C23.3471 18.2453 22.9756 18.4002 22.5837 18.4635C22.1917 18.5267 21.7903 18.4965 21.4123 18.3751V20.551C21.4123 21.6161 20.8931 22.5588 20.0951 23.1433V24.8583C20.0951 25.6139 19.795 26.3386 19.2607 26.8729C18.7264 27.4071 18.0017 27.7073 17.2461 27.7073C16.4905 27.7073 15.7659 27.4071 15.2316 26.8729C14.6973 26.3386 14.3971 25.6139 14.3971 24.8583V23.7593H13.514V24.8595C13.514 25.6151 13.2138 26.3397 12.6795 26.874C12.1452 27.4083 11.4206 27.7085 10.665 27.7085C9.90936 27.7085 9.18471 27.4083 8.65041 26.874C8.11612 26.3397 7.81596 25.6151 7.81596 24.8595V23.1433C7.40772 22.8456 7.07569 22.4555 6.84697 22.005C6.61826 21.5545 6.49935 21.0562 6.49996 20.551V18.3751C6.12191 18.4965 5.72055 18.5267 5.32858 18.4635C4.93661 18.4002 4.56514 18.2453 4.24442 18.0112C3.92371 17.7772 3.66284 17.4707 3.48307 17.1167C3.3033 16.7626 3.20972 16.3712 3.20996 15.9741V10.051C3.20987 9.65173 3.30464 9.25819 3.48646 8.90275C3.66827 8.54732 3.93194 8.24017 4.25573 8.00661C4.57953 7.77305 4.95418 7.61977 5.34882 7.55939C5.74347 7.499 6.14681 7.53325 6.52563 7.65931C6.67321 5.9168 7.44015 4.28483 8.68746 3.05914L7.41346 1.78514C7.2496 1.62108 7.15756 1.39868 7.15756 1.16681C7.15756 0.93493 7.2496 0.712535 7.41346 0.548472ZM8.53929 9.28097C8.46234 9.28159 8.38876 9.31259 8.33456 9.36722C8.28037 9.42185 8.24996 9.49569 8.24996 9.57264V20.551C8.24996 20.9367 8.4028 21.3068 8.67503 21.5801C8.94726 21.8534 9.3167 22.0078 9.70246 22.0093H18.2086C18.5944 22.0078 18.9638 21.8534 19.2361 21.5801C19.5083 21.3068 19.6611 20.9367 19.6611 20.551V9.57264C19.6611 9.49569 19.6307 9.42185 19.5765 9.36722C19.5223 9.31259 19.4487 9.28159 19.3718 9.28097H8.53929ZM19.3741 7.53097H19.611C19.4279 6.19295 18.7665 4.9665 17.749 4.07853C16.7315 3.19057 15.4268 2.7012 14.0763 2.70097H13.8348C12.4843 2.7012 11.1796 3.19057 10.1621 4.07853C9.1446 4.9665 8.48314 6.19295 8.30013 7.53097H19.3695H19.3741ZM16.1471 24.8595V23.7593H18.3451V24.8595C18.3451 25.0038 18.3167 25.1467 18.2615 25.28C18.2062 25.4134 18.1253 25.5345 18.0232 25.6366C17.9212 25.7386 17.8 25.8196 17.6667 25.8748C17.5334 25.93 17.3905 25.9585 17.2461 25.9585C17.1018 25.9585 16.9589 25.93 16.8256 25.8748C16.6922 25.8196 16.5711 25.7386 16.469 25.6366C16.367 25.5345 16.286 25.4134 16.2308 25.28C16.1756 25.1467 16.1471 25.0038 16.1471 24.8595ZM9.70013 23.7593H11.764V24.8595C11.764 25.1509 11.6482 25.4305 11.4421 25.6366C11.236 25.8427 10.9564 25.9585 10.665 25.9585C10.3735 25.9585 10.094 25.8427 9.88785 25.6366C9.68175 25.4305 9.56596 25.1509 9.56596 24.8595V23.7593H9.70013ZM22.1823 16.7453C21.9785 16.7453 21.783 16.6645 21.6386 16.5206C21.4943 16.3767 21.4129 16.1814 21.4123 15.9776V10.0475C21.4128 9.84326 21.4943 9.64759 21.6391 9.50351C21.7107 9.43217 21.7957 9.37565 21.8892 9.33716C21.9828 9.29868 22.0829 9.27899 22.184 9.27922C22.2852 9.27945 22.3852 9.2996 22.4786 9.3385C22.5719 9.37741 22.6567 9.43432 22.728 9.50599C22.7993 9.57765 22.8559 9.66266 22.8944 9.75617C22.9328 9.84968 22.9525 9.94985 22.9523 10.051V15.9741C22.9523 16.1784 22.8712 16.3742 22.7268 16.5186C22.5824 16.663 22.3865 16.7453 22.1823 16.7453ZM6.4988 10.0451C6.49818 9.84092 6.41646 9.64532 6.27162 9.50135C6.12678 9.35738 5.93068 9.27685 5.72646 9.27747C5.52224 9.27809 5.32664 9.35981 5.18267 9.50465C5.03871 9.64949 4.95818 9.84559 4.95879 10.0498V15.973C4.95802 16.1772 5.0384 16.3733 5.18226 16.5183C5.32612 16.6632 5.52166 16.7451 5.72588 16.7459C5.93009 16.7467 6.12625 16.6663 6.2712 16.5224C6.41615 16.3786 6.49802 16.183 6.4988 15.9788V10.0451Z"
                  ></path>
                </svg>
              </div>
              <div className="p-3 bg-Gray group hover:bg-button rounded-md cursor-pointer w-fit bg-button">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:stroke-white stroke-black"
                  strokeWidth="2"
                >
                  <path d="M14.6067 6.04964C14.4372 6.04964 14.2747 5.98244 14.1547 5.86277C14.0346 5.7431 13.967 5.58072 13.9665 5.41124C13.9665 4.22356 14.4383 3.08453 15.2781 2.24472C16.1179 1.40491 17.2569 0.933105 18.4446 0.933105C18.7993 0.933105 19.083 1.22057 19.083 1.57337C19.082 2.75975 18.6103 3.89726 17.7714 4.73616C16.9325 5.57506 15.795 6.04678 14.6086 6.04777L14.6067 6.04964ZM23.9457 19.5195C24.1921 19.7043 24.2723 20.0422 24.1323 20.3166C21.883 24.8227 20.0854 27.0664 18.4446 27.0664C17.6811 27.0664 16.9307 26.82 16.199 26.3384C15.6763 25.9942 15.0671 25.8044 14.4414 25.7909C13.8156 25.7773 13.1988 25.9406 12.6617 26.2619C11.7769 26.792 10.9313 27.0664 10.1305 27.0664C7.715 27.0664 3.7334 19.6334 3.7334 15.5528C3.7334 11.1998 6.01633 7.87711 9.4902 7.87711C11.1235 7.87711 12.5347 8.11977 13.7201 8.60511C14.2222 8.81417 14.7897 8.79924 15.2806 8.56404C16.2419 8.10111 17.5094 7.87711 19.0849 7.87711C21.0075 7.87711 22.6801 8.83471 24.0726 10.692C24.1745 10.8277 24.2183 10.9983 24.1945 11.1663C24.1707 11.3343 24.0812 11.486 23.9457 11.588C22.3907 12.7528 21.6422 14.0632 21.6422 15.5528C21.6422 17.0443 22.3907 18.3528 23.9457 19.5195Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
