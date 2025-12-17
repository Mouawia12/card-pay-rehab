import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchCardTemplates } from "@/lib/api";
import { toast } from "sonner";

// تعريف واجهة القالب
interface Template {
  id: number;
  name: string;
  title: string;
  description: string;
  bgColor: string;
  bgOpacity: number;
  bgImage?: string;
  textColor: string;
  cardType: number; // 0 = أختام, 1 = استرداد مالي
  totalStages: number;
  activeStampType: string;
  inactiveStampType: string;
  colors: {
    backgroundColor: string;
    textColor: string;
    middleAreaBg: string;
    activeStamp: string;
    stampBackground: string;
    borderColor: string;
    inactiveStamp: string;
  };
  cardDescription: string;
  howToEarnStamp: string;
  companyName: string;
  termsOfUse: string;
  sourceCompanyName: string;
  sourceEmail: string;
  phoneNumber: string;
  countryCode: string;
}

// 20 قالب متنوع
const defaultTemplates: Template[] = [
  {
    id: 1,
    name: "مقهى الورد",
    title: "كوبك مكافأة",
    description: "احصل على كوب مجاني بعد شراء 8 أكواب",
    bgColor: "#8B4513",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 8,
    activeStampType: "Coffee",
    inactiveStampType: "Coffee",
    colors: {
      backgroundColor: "#8B4513",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF6B35",
      stampBackground: "#F5E6D3",
      borderColor: "#8B4513",
      inactiveStamp: "#D3C5B0",
    },
    cardDescription: "اجمع الأختام واحصل على كوب قهوة مجاني ☕",
    howToEarnStamp: "احصل على ختم واحد مع كل كوب قهوة تشتريه",
    companyName: "مقهى الورد",
    termsOfUse: "1. احصل على ختم واحد مع كل كوب قهوة.\n2. اجمع 8 أختام للحصول على كوب مجاني.\n3. البطاقة صالحة لمدة سنة واحدة.",
    sourceCompanyName: "مقهى الورد",
    sourceEmail: "info@cafe-ward.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 2,
    name: "صالون الجمال",
    title: "تجميل مميز",
    description: "احصل على جلسة مجانية بعد 5 زيارات",
    bgColor: "#E91E63",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 5,
    activeStampType: "Heart",
    inactiveStampType: "Heart",
    colors: {
      backgroundColor: "#E91E63",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF1744",
      stampBackground: "#FCE4EC",
      borderColor: "#E91E63",
      inactiveStamp: "#F8BBD0",
    },
    cardDescription: "اعتن بجمالك واحصل على مكافآت حصرية 💄",
    howToEarnStamp: "احصل على ختم عند كل زيارة أو خدمة",
    companyName: "صالون الجمال",
    termsOfUse: "1. احصل على ختم واحد مع كل خدمة.\n2. اجمع 5 أختام للحصول على جلسة مجانية.\n3. الصلاحية غير محدودة.",
    sourceCompanyName: "صالون الجمال",
    sourceEmail: "info@beauty-salon.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 3,
    name: "مطعم الذواقة",
    title: "طعم ومكافأة",
    description: "احصل على وجبة مجانية بعد 10 وجبات",
    bgColor: "#FF5722",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 10,
    activeStampType: "Gift",
    inactiveStampType: "Gift",
    colors: {
      backgroundColor: "#FF5722",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF9800",
      stampBackground: "#FFE0B2",
      borderColor: "#FF5722",
      inactiveStamp: "#FFCCBC",
    },
    cardDescription: "استمتع بأطيب المأكولات واحصل على مكافآت 🍽️",
    howToEarnStamp: "احصل على ختم مع كل وجبة بقيمة 50 ريال أو أكثر",
    companyName: "مطعم الذواقة",
    termsOfUse: "1. الحد الأدنى للطلب 50 ريال.\n2. اجمع 10 أختام للحصول على وجبة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مطعم الذواقة",
    sourceEmail: "info@restaurant.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 4,
    name: "نادي اللياقة",
    title: "تمرين وادخر",
    description: "احصل على شهر مجاني بعد 6 أشهر",
    bgColor: "#009688",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 6,
    activeStampType: "Trophy",
    inactiveStampType: "Trophy",
    colors: {
      backgroundColor: "#009688",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#00BCD4",
      stampBackground: "#B2DFDB",
      borderColor: "#009688",
      inactiveStamp: "#80CBC4",
    },
    cardDescription: "حافظ على لياقتك واحصل على مكافآت 🏋️",
    howToEarnStamp: "احصل على ختم مع كل شهر اشتراك",
    companyName: "نادي اللياقة",
    termsOfUse: "1. احصل على ختم مع كل شهر اشتراك.\n2. اجمع 6 أختام للحصول على شهر مجاني.\n3. غير قابل للتحويل.",
    sourceCompanyName: "نادي اللياقة",
    sourceEmail: "info@gym.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 5,
    name: "متجر الأزياء",
    title: "موضة ومكافأة",
    description: "احصل على خصم 20% بعد 5 عمليات شراء",
    bgColor: "#9C27B0",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 5,
    activeStampType: "ShoppingBag",
    inactiveStampType: "ShoppingBag",
    colors: {
      backgroundColor: "#9C27B0",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#E91E63",
      stampBackground: "#F3E5F5",
      borderColor: "#9C27B0",
      inactiveStamp: "#CE93D8",
    },
    cardDescription: "تسوق بذوق واحصل على مكافآت 👗",
    howToEarnStamp: "احصل على ختم مع كل عملية شراء بقيمة 100 ريال أو أكثر",
    companyName: "متجر الأزياء",
    termsOfUse: "1. الحد الأدنى للشراء 100 ريال.\n2. اجمع 5 أختام للحصول على خصم 20%.\n3. الصلاحية غير محدودة.",
    sourceCompanyName: "متجر الأزياء",
    sourceEmail: "info@fashion-store.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 6,
    name: "سوبر ماركت الوفير",
    title: "ادخر واربح",
    description: "استرداد نقدي 2% على كل عملية شراء",
    bgColor: "#4CAF50",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 1,
    totalStages: 0,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#4CAF50",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#8BC34A",
      stampBackground: "#C8E6C9",
      borderColor: "#4CAF50",
      inactiveStamp: "#A5D6A7",
    },
    cardDescription: "اشتري واسترد نقداً 💰",
    howToEarnStamp: "احصل على 2% استرداد نقدي على كل عملية شراء",
    companyName: "سوبر ماركت الوفير",
    termsOfUse: "1. استرداد نقدي 2% على كل عملية.\n2. يمكن سحب المبلغ عند الوصول إلى 50 ريال.\n3. البطاقة صالحة لمدة سنة.",
    sourceCompanyName: "سوبر ماركت الوفير",
    sourceEmail: "info@supermarket.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 7,
    name: "صالون السيارات",
    title: "لمعان وسرعة",
    description: "احصل على خدمة مجانية بعد 4 زيارات",
    bgColor: "#2196F3",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 4,
    activeStampType: "Car",
    inactiveStampType: "Car",
    colors: {
      backgroundColor: "#2196F3",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#03A9F4",
      stampBackground: "#BBDEFB",
      borderColor: "#2196F3",
      inactiveStamp: "#90CAF9",
    },
    cardDescription: "اعتن بسيارتك واحصل على مكافآت 🚗",
    howToEarnStamp: "احصل على ختم مع كل خدمة غسيل أو تلميع",
    companyName: "صالون السيارات",
    termsOfUse: "1. احصل على ختم مع كل خدمة.\n2. اجمع 4 أختام للحصول على خدمة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "صالون السيارات",
    sourceEmail: "info@car-salon.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 8,
    name: "مكتبة المعرفة",
    title: "اقرأ وتعلم",
    description: "احصل على كتاب مجاني بعد 6 مشتريات",
    bgColor: "#795548",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 6,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#795548",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF9800",
      stampBackground: "#D7CCC8",
      borderColor: "#795548",
      inactiveStamp: "#BCAAA4",
    },
    cardDescription: "ابني مكتبتك واحصل على مكافآت 📚",
    howToEarnStamp: "احصل على ختم مع كل كتاب أو منتج تشتريه",
    companyName: "مكتبة المعرفة",
    termsOfUse: "1. احصل على ختم مع كل شراء.\n2. اجمع 6 أختام للحصول على كتاب مجاني.\n3. البطاقة صالحة لمدة سنتين.",
    sourceCompanyName: "مكتبة المعرفة",
    sourceEmail: "info@bookstore.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 9,
    name: "متحف الفنون",
    title: "ثقافة ومكافأة",
    description: "ادخل مجاناً بعد 3 زيارات",
    bgColor: "#607D8B",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 3,
    activeStampType: "Crown",
    inactiveStampType: "Crown",
    colors: {
      backgroundColor: "#607D8B",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FFC107",
      stampBackground: "#CFD8DC",
      borderColor: "#607D8B",
      inactiveStamp: "#90A4AE",
    },
    cardDescription: "استكشف الفنون واحصل على مكافآت 🎨",
    howToEarnStamp: "احصل على ختم مع كل زيارة للمتحف",
    companyName: "متحف الفنون",
    termsOfUse: "1. احصل على ختم مع كل زيارة.\n2. اجمع 3 أختام للحصول على دخول مجاني.\n3. الصلاحية غير محدودة.",
    sourceCompanyName: "متحف الفنون",
    sourceEmail: "info@museum.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 10,
    name: "مكتبة الألعاب",
    title: "لعب ومتعة",
    description: "احصل على لعبة مجانية بعد 7 مشتريات",
    bgColor: "#FF9800",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1606166186675-c1c48b91be72?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 7,
    activeStampType: "Gift",
    inactiveStampType: "Gift",
    colors: {
      backgroundColor: "#FF9800",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF5722",
      stampBackground: "#FFE0B2",
      borderColor: "#FF9800",
      inactiveStamp: "#FFCC80",
    },
    cardDescription: "استمتع بالألعاب واحصل على مكافآت 🎮",
    howToEarnStamp: "احصل على ختم مع كل لعبة أو منتج تشتريه",
    companyName: "مكتبة الألعاب",
    termsOfUse: "1. احصل على ختم مع كل شراء.\n2. اجمع 7 أختام للحصول على لعبة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مكتبة الألعاب",
    sourceEmail: "info@games-store.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 11,
    name: "صالون الحلاقة",
    title: "أناقة مميزة",
    description: "احصل على حلاقة مجانية بعد 5 زيارات",
    bgColor: "#1E324A",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 5,
    activeStampType: "Crown",
    inactiveStampType: "Crown",
    colors: {
      backgroundColor: "#1E324A",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FFD700",
      stampBackground: "#E8E8E8",
      borderColor: "#1E324A",
      inactiveStamp: "#CCCCCC",
    },
    cardDescription: "حافظ على أناقتك واحصل على مكافآت ✂️",
    howToEarnStamp: "احصل على ختم مع كل حلاقة أو خدمة",
    companyName: "صالون الحلاقة",
    termsOfUse: "1. احصل على ختم مع كل خدمة.\n2. اجمع 5 أختام للحصول على حلاقة مجانية.\n3. البطاقة صالحة لمدة سنة.",
    sourceCompanyName: "صالون الحلاقة",
    sourceEmail: "info@barbershop.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 12,
    name: "مطعم البيتزا",
    title: "بيتزا ومكافأة",
    description: "احصل على بيتزا مجانية بعد 8 طلبات",
    bgColor: "#F44336",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 8,
    activeStampType: "Heart",
    inactiveStampType: "Heart",
    colors: {
      backgroundColor: "#F44336",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF5722",
      stampBackground: "#FFCDD2",
      borderColor: "#F44336",
      inactiveStamp: "#EF9A9A",
    },
    cardDescription: "استمتع بأفضل بيتزا واحصل على مكافآت 🍕",
    howToEarnStamp: "احصل على ختم مع كل بيتزا تشتريها",
    companyName: "مطعم البيتزا",
    termsOfUse: "1. احصل على ختم مع كل بيتزا.\n2. اجمع 8 أختام للحصول على بيتزا مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مطعم البيتزا",
    sourceEmail: "info@pizza.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 13,
    name: "مخبز الطازج",
    title: "طازج ومكافأة",
    description: "احصل على منتج مجاني بعد 6 مشتريات",
    bgColor: "#FFC107",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    textColor: "#000000",
    cardType: 0,
    totalStages: 6,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#FFC107",
      textColor: "#000000",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF9800",
      stampBackground: "#FFF9C4",
      borderColor: "#000000",
      inactiveStamp: "#FFF59D",
    },
    cardDescription: "استمتع بمنتجات طازجة واحصل على مكافآت 🥖",
    howToEarnStamp: "احصل على ختم مع كل عملية شراء بقيمة 20 ريال أو أكثر",
    companyName: "مخبز الطازج",
    termsOfUse: "1. الحد الأدنى للشراء 20 ريال.\n2. اجمع 6 أختام للحصول على منتج مجاني.\n3. البطاقة صالحة لمدة سنة.",
    sourceCompanyName: "مخبز الطازج",
    sourceEmail: "info@bakery.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 14,
    name: "صالون التدليك",
    title: "استرخاء ومكافأة",
    description: "احصل على جلسة مجانية بعد 4 زيارات",
    bgColor: "#8BC34A",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 4,
    activeStampType: "Heart",
    inactiveStampType: "Heart",
    colors: {
      backgroundColor: "#8BC34A",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#4CAF50",
      stampBackground: "#DCEDC8",
      borderColor: "#8BC34A",
      inactiveStamp: "#AED581",
    },
    cardDescription: "استرخ واستمتع واحصل على مكافآت 💆",
    howToEarnStamp: "احصل على ختم مع كل جلسة تدليك",
    companyName: "صالون التدليك",
    termsOfUse: "1. احصل على ختم مع كل جلسة.\n2. اجمع 4 أختام للحصول على جلسة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "صالون التدليك",
    sourceEmail: "info@spa.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 15,
    name: "متجر الإلكترونيات",
    title: "تكنولوجيا ومكافأة",
    description: "استرداد نقدي 3% على كل عملية شراء",
    bgColor: "#00BCD4",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 1,
    totalStages: 0,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#00BCD4",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#0097A7",
      stampBackground: "#B2EBF2",
      borderColor: "#00BCD4",
      inactiveStamp: "#4DD0E1",
    },
    cardDescription: "تسوق التكنولوجيا واسترد نقداً 💻",
    howToEarnStamp: "احصل على 3% استرداد نقدي على كل عملية شراء",
    companyName: "متجر الإلكترونيات",
    termsOfUse: "1. استرداد نقدي 3% على كل عملية.\n2. يمكن سحب المبلغ عند الوصول إلى 100 ريال.\n3. البطاقة صالحة لمدة سنتين.",
    sourceCompanyName: "متجر الإلكترونيات",
    sourceEmail: "info@electronics.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 16,
    name: "مطعم الحلويات",
    title: "حلاوة ومكافأة",
    description: "احصل على قطعة مجانية بعد 5 مشتريات",
    bgColor: "#E91E63",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 5,
    activeStampType: "Gift",
    inactiveStampType: "Gift",
    colors: {
      backgroundColor: "#E91E63",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#F06292",
      stampBackground: "#F8BBD0",
      borderColor: "#E91E63",
      inactiveStamp: "#F48FB1",
    },
    cardDescription: "استمتع بأطيب الحلويات واحصل على مكافآت 🍰",
    howToEarnStamp: "احصل على ختم مع كل قطعة حلويات",
    companyName: "مطعم الحلويات",
    termsOfUse: "1. احصل على ختم مع كل شراء.\n2. اجمع 5 أختام للحصول على قطعة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مطعم الحلويات",
    sourceEmail: "info@desserts.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 17,
    name: "صالون الأظافر",
    title: "جمال ومكافأة",
    description: "احصل على خدمة مجانية بعد 6 زيارات",
    bgColor: "#9C27B0",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 6,
    activeStampType: "Heart",
    inactiveStampType: "Heart",
    colors: {
      backgroundColor: "#9C27B0",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#E91E63",
      stampBackground: "#F3E5F5",
      borderColor: "#9C27B0",
      inactiveStamp: "#CE93D8",
    },
    cardDescription: "اهتمي بأظافرك واحصلي على مكافآت 💅",
    howToEarnStamp: "احصلي على ختم مع كل خدمة أظافر",
    companyName: "صالون الأظافر",
    termsOfUse: "1. احصلي على ختم مع كل خدمة.\n2. اجميع 6 أختام للحصول على خدمة مجانية.\n3. البطاقة صالحة لمدة سنة.",
    sourceCompanyName: "صالون الأظافر",
    sourceEmail: "info@nail-salon.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 18,
    name: "مطعم السوشي",
    title: "ياباني أصيل",
    description: "احصل على وجبة مجانية بعد 9 طلبات",
    bgColor: "#3F51B5",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 9,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#3F51B5",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#5C6BC0",
      stampBackground: "#C5CAE9",
      borderColor: "#3F51B5",
      inactiveStamp: "#9FA8DA",
    },
    cardDescription: "استمتع بأفضل سوشي واحصل على مكافآت 🍣",
    howToEarnStamp: "احصل على ختم مع كل طلب بقيمة 80 ريال أو أكثر",
    companyName: "مطعم السوشي",
    termsOfUse: "1. الحد الأدنى للطلب 80 ريال.\n2. اجمع 9 أختام للحصول على وجبة مجانية.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مطعم السوشي",
    sourceEmail: "info@sushi.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 19,
    name: "مكتبة الألعاب الإلكترونية",
    title: "لعب وادخر",
    description: "استرداد نقدي 5% على كل لعبة",
    bgColor: "#FF6B35",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 1,
    totalStages: 0,
    activeStampType: "Star",
    inactiveStampType: "Star",
    colors: {
      backgroundColor: "#FF6B35",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#FF8C42",
      stampBackground: "#FFE5D9",
      borderColor: "#FF6B35",
      inactiveStamp: "#FFBFA0",
    },
    cardDescription: "اشتري الألعاب واسترد نقداً 🎮",
    howToEarnStamp: "احصل على 5% استرداد نقدي على كل لعبة تشتريها",
    companyName: "مكتبة الألعاب الإلكترونية",
    termsOfUse: "1. استرداد نقدي 5% على كل لعبة.\n2. يمكن سحب المبلغ عند الوصول إلى 50 ريال.\n3. البطاقة صالحة لمدة سنتين.",
    sourceCompanyName: "مكتبة الألعاب الإلكترونية",
    sourceEmail: "info@games-store.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
  {
    id: 20,
    name: "مطعم البرجر",
    title: "برجر ومكافأة",
    description: "احصل على برجر مجاني بعد 7 طلبات",
    bgColor: "#D32F2F",
    bgOpacity: 0.9,
    bgImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    textColor: "#FFFFFF",
    cardType: 0,
    totalStages: 7,
    activeStampType: "Plane",
    inactiveStampType: "Plane",
    colors: {
      backgroundColor: "#D32F2F",
      textColor: "#FFFFFF",
      middleAreaBg: "#FFFFFF",
      activeStamp: "#F44336",
      stampBackground: "#FFCDD2",
      borderColor: "#D32F2F",
      inactiveStamp: "#EF9A9A",
    },
    cardDescription: "استمتع بأطيب البرجر واحصل على مكافآت 🍔",
    howToEarnStamp: "احصل على ختم مع كل برجر تشتريه",
    companyName: "مطعم البرجر",
    termsOfUse: "1. احصل على ختم مع كل برجر.\n2. اجمع 7 أختام للحصول على برجر مجاني.\n3. الصلاحية سنة واحدة.",
    sourceCompanyName: "مطعم البرجر",
    sourceEmail: "info@burger.com",
    phoneNumber: "547669684",
    countryCode: "+966",
  },
];

export function TemplatesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCardTemplates();
        if (response.data.length) {
          setTemplates(response.data as Template[]);
          setUsingFallback(false);
        } else {
          setTemplates(defaultTemplates);
          setUsingFallback(true);
        }
      } catch (error: any) {
        toast.error(error.message || "تعذر تحميل القوالب، تم عرض القوالب الافتراضية.");
        setTemplates(defaultTemplates);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // دالة لتحويل hex إلى rgb
  const hexToRgb = (hex: string) => {
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

  // دالة للتعامل مع استخدام القالب
  const handleUseTemplate = (template: Template) => {
    // حفظ بيانات القالب في localStorage
    localStorage.setItem('selected_template', JSON.stringify(template));
    // التنقل إلى صفحة إنشاء البطاقة
    navigate('/dashboard/cards/create');
  };

  return (
    <div className="px-10">
      <h1 className="mb-12 mt-4 text-[24px] font-[500] flex items-center gap-1">
        {t("dashboardPages.cards.templates") || "قوالب جاهزة"}
      </h1>
      {isLoading && (
        <p className="text-sm text-muted-foreground mb-4">{t("common.loading") || "جاري تحميل القوالب..."}</p>
      )}
      {usingFallback && !isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {t("dashboardPages.cards.fallbackMessage") || "نعرض حالياً القوالب التجريبية حتى تتوفر بياناتك."}
        </p>
      )}
      <div className="ml-5 flex items-center flex-start flex-wrap max-sm:flex-col gap-x-4 gap-y-10">
        {templates.map((template) => {
          const rgb = hexToRgb(template.bgColor);
          const gradientStyle = template.bgImage
            ? {
                backgroundImage: `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${template.bgOpacity}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${template.bgOpacity})), url("${template.bgImage}")`,
              }
            : {
                backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${template.bgOpacity})`,
              };

          return (
            <div key={template.id} className="max-md:px-2">
              <div className="px-4 flex-[1] flex items-center justify-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto" dir="ltr">
                <div className="relative flex flex-col items-center">
                  <div className="overflow-hidden relative w-[245px] max-xsm:w-[200px]">
                    <img alt="Template preview" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
                    {/* Card inside iOS frame */}
                    <div
                      className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                      style={{
                        ...gradientStyle,
                        color: template.textColor,
                      }}
                      dir="rtl"
                    >
                      <div className="h-full flex flex-col p-2.5 md:p-3">
                        {/* Header */}
                        <div className="flex flex-col items-center justify-center mb-2">
                          <div className="text-center mb-1">
                            <div className="text-xs font-medium">
                              <span className="tracking-tight">{template.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-[10px] font-semibold opacity-90 text-center">
                              {template.cardType === 0 ? `الأختام: 0/${template.totalStages}` : "استرداد مالي"}
                            </span>
                          </div>
                        </div>

                        {/* Stages Indicators - فقط للبطاقات من نوع أختام */}
                        {template.cardType === 0 && (
                          <div className="flex items-center justify-center gap-1.5 mb-2.5 pb-2 border-b border-white/20">
                            {Array.from({ length: template.totalStages }).map((_, index) => {
                              return (
                                <div
                                  key={index}
                                  className="relative flex items-center justify-center"
                                >
                                  <Star
                                    className="fill-yellow-500/30 text-yellow-500/30"
                                    size={16}
                                    strokeWidth={2}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-grow min-w-0 overflow-hidden text-center mb-2">
                          <h3 className="text-sm font-extralight line-clamp-1 mb-1">{template.title}</h3>
                          <div className="line-clamp-2 font-light text-[10px] leading-tight">{template.description}</div>
                        </div>

                        {/* QR Code */}
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
                              style={{ stroke: template.bgColor }}
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
                            <div className="text-[7px] font-extralight opacity-80">القالب</div>
                            <div className="text-[9px] font-light truncate">#{template.id}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="my-2 text-[20px] font-[500] text-center max-sm:text-[18px]">{template.name}</h2>
                  <div className="w-full flex justify-center mb-14">
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="main-btn w-[170px] py-2 max-sm:w-[150px] max-sm:px-1 max-sm:py-0"
                    >
                      {t("dashboardPages.cards.useTemplate") || "استخدام القالب"}
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

