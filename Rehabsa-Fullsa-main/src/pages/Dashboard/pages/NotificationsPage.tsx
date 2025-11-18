import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Smile, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

interface Location {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinates: string;
  address?: string;
}

// Helper function to get locations from localStorage
const getLocationsFromStorage = (): Location[] => {
  try {
    const saved = localStorage.getItem("dashboard_locations");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading locations from storage:", error);
  }
  // Default location if none exist
  return [
    {
      id: 1,
      name: "مغسلة وتلميع تذكار",
      description: "مغسلة تذكار تكفيك المشوار",
      date: "Fri Oct 10 2025",
      coordinates: "18.23325445786974 - 42.7489816467735",
    },
  ];
};

interface Notification {
  id: number;
  date: string;
  message: string;
  recipients: number;
}

const notificationsHistory: Notification[] = [
  {
    id: 1,
    date: "2025-11-03 06:48:08 PM",
    message: "لا يفوتك العرض\n\nتلميع داخلي وخارجي بـ 299 ريال فقط",
    recipients: 154,
  },
  {
    id: 2,
    date: "2025-10-23 12:52:57 PM",
    message: "لا تفوت عرض الخميس غسيل سيارتك بـ ١٩ ريال",
    recipients: 110,
  },
  {
    id: 3,
    date: "2025-10-22 11:10:56 AM",
    message: "لا تفوت العرض غسيل سيارتك بـ ١٩ ريال فقط اليوم وغدا الخميس .",
    recipients: 101,
  },
  {
    id: 4,
    date: "2025-10-21 08:05:42 PM",
    message: "لا تفوت العرض غسيلك بـ ١٩ ريال فقط غدا الاربعاء والخميس .",
    recipients: 99,
  },
  {
    id: 5,
    date: "2025-10-21 05:22:15 PM",
    message: "احصل على غسيل داخلي وخارجي فقط بـ 19 ريال غدا الاربعاء والخميس",
    recipients: 95,
  },
  {
    id: 6,
    date: "2025-10-12 05:23:13 PM",
    message: "ارحب يبو حسييين",
    recipients: 3,
  },
  {
    id: 7,
    date: "2025-10-11 12:01:02 AM",
    message: "لا تفوت العرض غسل سيارتك ب ١٩ ريال فقط\n\nمن الساعه ٩ صباحا إلى الساعه ٣",
    recipients: 2,
  },
  {
    id: 8,
    date: "2025-10-10 11:59:12 PM",
    message: "صباح الخير عميلنا\n\nلا تفوتك عروض التلميع\n\nخصم ٥٠٪؜ لمدة اسبوع",
    recipients: 2,
  },
  {
    id: 9,
    date: "2025-10-10 08:40:18 PM",
    message: "اهلا عبدالله ناصر تشرفنا في اي وقت",
    recipients: 2,
  },
  {
    id: 10,
    date: "2025-10-10 05:17:51 PM",
    message: "Hi",
    recipients: 1,
  },
];

export function NotificationsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [locations, setLocations] = useState<Location[]>(getLocationsFromStorage());
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [targetType, setTargetType] = useState<"all" | "selected">("all");
  const [message, setMessage] = useState("");
  const [recipientCount] = useState(156);
  const previewMessage = "Write your notification message with emojies 👀 🎫 💬 😍";

  const maxLength = 100;

  // Load locations from localStorage on mount and when storage changes
  useEffect(() => {
    const loadLocations = () => {
      const loadedLocations = getLocationsFromStorage();
      setLocations(loadedLocations);
      
      // Auto-select first location if none selected and locations exist
      setSelectedLocationId((prev) => {
        if (!prev && loadedLocations.length > 0) {
          return loadedLocations[0].id.toString();
        }
        return prev;
      });
    };

    loadLocations();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadLocations();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const selectedLocation = locations.find(
    (loc) => loc.id.toString() === selectedLocationId
  );

  return (
    <div className="w-[86%] min-h-[100vh] py-3 relative max-xl:w-full">
      <h1 className="text-[24px] font-[500] px-10">{t("dashboard.notifications") || "الإشعارات"}</h1>
      
      {/* Background decoration - hidden on mobile */}
      <div className="absolute w-[50%] h-[100%] top-0 z-[-1] max-lg:hidden px-10"></div>

      <div className="flex items-start justify-between gap-24 max-lg:flex-col-reverse max-lg:items-center max-lg:gap-5 px-10">
        {/* Left Side - Form */}
        <div className="flex flex-col items-start w-full border-Gray ltr:border-r-[1px] ltr:pr-6 rtl:border-l-[1px] rtl:pl-6">
          <p className="mb-4 text-[12px] text-textGray font-[400]">
            ستظهر هذه الرسالة على شاشة قفل هواتف العملاء وأيضًا على ظهر بطاقاتهم.
          </p>

          <div className="w-full flex flex-col gap-2 text-[12px] font-[400]">
            <h2 className="w-full pt-6 border-t-[1px] border-Gray text-[14px] font-[600]">
              حدد الموقع المستهدف
            </h2>

            <Select 
              value={selectedLocationId} 
              onValueChange={setSelectedLocationId}
              disabled={locations.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={locations.length === 0 ? "لا توجد مواقع متاحة" : "اختر الموقع"} />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {locations.length === 0 && (
              <p className="text-[11px] text-textGray mt-2">
                لا توجد مواقع محفوظة. يرجى إضافة موقع من صفحة{" "}
                <Link to="/dashboard/locations" className="text-primary underline hover:text-primary/80">
                  المواقع
                </Link>
              </p>
            )}

            <div className="flex gap-10 items-center text-[14px] font-[500] max-sm:flex-col max-sm:gap-5">
              <button
                className={`w-full main-btn ${targetType === "all" ? "" : "opacity-50"}`}
                onClick={() => setTargetType("all")}
              >
                لكل العملاء
              </button>
              <button
                className={`w-full border-btn ${targetType === "selected" ? "" : "opacity-50"}`}
                onClick={() => setTargetType("selected")}
              >
                فقط القطاعات المحددة
              </button>
            </div>
          </div>

          {/* Recipient Count */}
          <div className="w-full py-6 flex items-center gap-3 place-content-center">
            <Users className="w-[15px] h-6 text-textGray" />
            <span className="text-[12px] text-textGray font-[400]">
              {recipientCount} سوف يستلم رسالتك
            </span>
          </div>

          {/* Message Input */}
          <div className="mb-8 flex flex-col gap-2 relative w-full">
            <textarea
              maxLength={maxLength}
              placeholder="Notification message..."
              dir="ltr"
              className="border-[1px] border-Gray h-[120px] rounded-[5px] p-3 text-[12px] font-normal resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Smile className="absolute right-[3%] top-[25%] text-Gray cursor-pointer w-6 h-6" />
            <button
              className="main-btn text-[14px] font-medium w-fit px-16"
              disabled={!message.trim()}
            >
              إرسال
            </button>
          </div>

          {/* Notifications History */}
          <h2 className="w-full text-[24px] font-[500] pb-4 border-b-[1px] border-Gray">
            تاريخ الإشعارات
          </h2>

          <div className="w-full flex flex-col gap-0">
            {notificationsHistory.map((notification) => (
              <div
                key={notification.id}
                className="w-full my-5 mx-2 p-3 flex flex-col bg-muted border border-Gray rounded-md"
              >
                <div className="relative -top-4 flex items-center justify-between font-[400] text-[13px] mb-2">
                  <span className="py-1 px-2 bg-background border border-Gray rounded">
                    {notification.date}
                  </span>
                  <span className="px-2 bg-background border border-Gray rounded">
                    <span className="max-xxsm:hidden">وصلت الى: &nbsp;</span>
                    {notification.recipients}
                  </span>
                </div>
                <p className="whitespace-pre-line mt-2">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Phone Preview */}
        <div className="flex-[1] w-full flex items-center justify-center">
          <div className="flex items-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto">
            <div className="relative flex flex-col items-center" dir="ltr">
              <div className="overflow-hidden relative w-[300px] max-xsm:w-[200px]">
                <img
                  alt="Active screen"
                  src="/dashboard/ios.svg"
                  className="w-full h-full object-contain"
                />
                {/* Notification Preview */}
                <div className="w-[85%] h-[61%] absolute top-0 translate-y-[105%] right-[50%] translate-x-[50%] rounded-[6px] overflow-hidden">
                  <div className="m-1">
                    <div className="w-full flex flex-col bg-gray-700/60 shadow-md rounded-md p-4 text-white">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex gap-2 items-center text-[10px]">
                          <BellRing
                            className="w-[18px] h-[18px]"
                            strokeWidth={2.25}
                            stroke="#ffffff"
                          />
                          <h1 className="text-[13px]">{selectedLocation?.name || "اسم الموقع"}</h1>
                        </div>
                        <span>now</span>
                      </div>
                      <p className="mt-1 text-[12px]">{message || previewMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
