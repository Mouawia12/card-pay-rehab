import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Pin, Smile, Pencil, Trash2, BellRing } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { useTranslation } from "react-i18next";
import { LocationMap } from "@/components/LocationMap";
import iosPhoneSvg from "@/assets/ios.svg";
import { toast } from "sonner";

// Helper functions to manage locations in localStorage
const getLocationsFromStorage = () => {
  try {
    const saved = localStorage.getItem("dashboard_locations");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading locations from storage:", error);
  }
  // Return empty array if no locations exist
  return [];
};

const saveLocationsToStorage = (locations: any[]) => {
  try {
    localStorage.setItem("dashboard_locations", JSON.stringify(locations));
    // Dispatch custom event to notify components in same window
    window.dispatchEvent(new CustomEvent("customStorageChange"));
  } catch (error) {
    console.error("Error saving locations to storage:", error);
    throw error;
  }
};

export function LocationsPage() {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    address: "",
    locationName: "",
    welcomeMessage: "",
  });
  const [showLocations, setShowLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [addedLocations, setAddedLocations] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  // Load locations from localStorage on mount
  useEffect(() => {
    const loadLocations = () => {
      const locations = getLocationsFromStorage();
      setAddedLocations(locations);
    };

    // Load immediately on mount
    loadLocations();
    
    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dashboard_locations") {
        loadLocations();
      }
    };
    
    // Listen for custom storage event (from same window)
    const handleCustomStorageChange = () => {
      loadLocations();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleCustomStorageChange);
    window.addEventListener("focus", loadLocations);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleCustomStorageChange);
      window.removeEventListener("focus", loadLocations);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    // You can call a geocoding API here to get the address
    // For now, we'll just set coordinates
    setFormData(prev => ({
      ...prev,
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }));
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.locationName.trim()) {
      toast.error("يرجى إدخال اسم الموقع");
      return;
    }

    if (!selectedLocation) {
      toast.error("يرجى اختيار موقع على الخريطة");
      return;
    }

    // Show loading toast
    toast.loading("جاري إضافة الموقع...", {
      description: "يرجى الانتظار"
    });

    const newLocation = {
      id: Date.now(), // Simple ID generation
      name: formData.locationName,
      description: formData.welcomeMessage || "",
      date: new Date().toDateString(),
      coordinates: `${selectedLocation[0].toFixed(6)} - ${selectedLocation[1].toFixed(6)}`,
      address: formData.address || `${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)}`,
    };

    const updatedLocations = [...addedLocations, newLocation];
    setAddedLocations(updatedLocations);
    saveLocationsToStorage(updatedLocations);

    // Dismiss loading toast and show success
    setTimeout(() => {
      toast.dismiss();
      toast.success("تم إضافة الموقع بنجاح!", {
        description: `تم إضافة موقع: ${formData.locationName}`
      });
    }, 500);

    // Reset form after adding
    setFormData({
      address: "",
      locationName: "",
      welcomeMessage: "",
    });
    setSelectedLocation(null);
  };

  const handleDeleteLocation = (id: number) => {
    const location = addedLocations.find((loc) => loc.id === id);
    if (location) {
      setItemToDelete({ id, name: location.name });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteLocation = () => {
    if (itemToDelete) {
      const updatedLocations = addedLocations.filter((loc) => loc.id !== itemToDelete.id);
      setAddedLocations(updatedLocations);
      saveLocationsToStorage(updatedLocations);
      
      toast.success("تم حذف الموقع بنجاح!", {
        description: `تم حذف موقع: ${itemToDelete.name}`
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="w-[86%] min-h-[100vh] py-3 relative max-xl:w-full">
      <div className="px-10">
        <h1 className="text-[24px] font-[500]">المواقع</h1>
        
        <div 
          className={`absolute w-[50%] h-[100%] top-0 z-[-1] max-lg:hidden ${
            isRTL 
              ? 'border-r-[1px] border-gray-300 right-0' 
              : 'border-l-[1px] border-gray-300 left-0'
          }`}
        ></div>

        <div className="max-lg:flex max-lg:flex-col-reverse max-lg:gap-3">
          {/* Left Section - Form */}
          <div className={`w-[50%] ${isRTL ? 'float-right' : 'float-left'} max-lg:w-full`}>
            {showLocations && (
              <div className="flex flex-col items-start gap-2">
                <p className="mb-3 pb-3 text-[12px] text-gray-500 font-[400] border-b border-gray-300">
                  عندما يكون عملاءك بالقرب من الموقع في دائرة قطرها ٣٠٠ قدم، سيرون الرسالة علي شاشة الجوال
                </p>
                <Button 
                  variant="outline" 
                  className="text-[14px] font-medium w-full px-16"
                  onClick={() => setShowLocations(!showLocations)}
                >
                  إخفاء المواقع
                </Button>
              </div>
            )}

            {showLocations && (
              <form onSubmit={handleAddLocation} className="flex flex-col items-start max-xxsm:w-full">
                <div className="mt-3 w-full flex flex-col gap-2 text-[12px] font-[400]">
                  {/* Address Field */}
                  <div className="space-y-2">
                    <p className="w-full mb-2">
                      <div 
                        className="text-blue-600 border border-[#d9d9d9] py-3 rounded-md px-3 flex items-center gap-2 group cursor-pointer hover:border-blue-600 transition-colors"
                        onClick={() => {
                          // Scroll to map section when Pin is clicked
                          const mapElement = document.querySelector('[class*="mt-6 w-full h-[230px]"]');
                          mapElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        <Pin className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px]">ضع الدبوس على الخريطة للحصول على العنوان</span>
                      </div>
                    </p>
                    <Input
                      type="text"
                      placeholder="العنوان"
                      disabled
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="py-3"
                    />
                  </div>

                  {/* Location Name Field */}
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="اسم الموقع"
                      value={formData.locationName}
                      onChange={(e) => handleInputChange("locationName", e.target.value)}
                      className="py-3"
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="mt-6 w-full h-[230px] rounded-md overflow-hidden border border-gray-300">
                  <LocationMap
                    height="230px"
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </div>

                {/* Welcome Message */}
                <div className="mt-6 mb-6 flex flex-col gap-2 relative w-full">
                  <Textarea
                    maxLength={100}
                    placeholder="رسالة الترحيب بالإشعار"
                    value={formData.welcomeMessage}
                    onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
                    className="border-[1px] h-[120px] rounded-[5px] p-3 text-[12px] font-normal resize-none"
                  />
                  <Smile className="absolute right-[3%] top-[25%] text-gray-500 cursor-pointer w-5 h-5" />
                  <Button type="submit" className="mt-3 text-[14px] font-medium w-fit px-16">
                    إضافة الموقع
                  </Button>
                </div>
              </form>
            )}

            {/* Added Locations */}
            {showLocations && (
              <>
                <h2 className="mt-10 w-full text-[24px] font-[500] pb-4 border-b-[1px] border-gray-300">
                  المواقع المضافة
                </h2>
                {addedLocations.map((location) => (
                  <div key={location.id} className="w-full my-5 mx-2 p-3 flex flex-col bg-gray-50 border border-gray-300 rounded-md">
                    <div className="relative top-[-50%] translate-y-[-75%] flex items-center justify-between font-[400] text-[13px] rounded-md">
                      <span className="py-1 px-2 bg-white border border-gray-300 rounded">
                        {location.date}
                      </span>
                      <span className="px-2 bg-white border border-gray-300 rounded">
                        <span className="max-xxsm:hidden select-text">{location.coordinates}</span>
                      </span>
                    </div>
                    <p className="font-[500] text-[22px]">{location.name}</p>
                    <p>{location.description}</p>
                    <div className="flex items-center gap-4 ml-auto mt-3">
                      <Pencil className="w-[22px] h-[22px] cursor-pointer text-gray-600 hover:text-gray-800" />
                      <Trash2 
                        className="w-[23px] h-[23px] text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDeleteLocation(location.id)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right Section - Phone Preview */}
          <div className={`w-[50%] ${isRTL ? 'float-left' : 'float-right'} flex items-center justify-center max-lg:w-full`}>
            <div className="flex items-center max-lg:flex-col max-md:p-0 max-md:mt-0 max-md:m-auto">
              <div className="relative flex flex-col items-center" dir="ltr">
                <div className="overflow-hidden relative w-[300px] max-xsm:w-[200px]">
                  <img 
                    alt="iPhone preview" 
                    className="w-full h-auto"
                    src={iosPhoneSvg}
                    onError={(e) => {
                      // Fallback: create a phone frame with CSS if image fails to load
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.phone-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'phone-fallback w-[300px] h-[600px] bg-gray-800 rounded-[40px] p-2 shadow-2xl border-8 border-gray-900';
                        fallback.innerHTML = `
                          <div class="w-full h-full bg-white rounded-[30px] overflow-hidden relative">
                            <div class="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[20px] bg-gray-900 rounded-full"></div>
                          </div>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="w-[85%] h-[61%] absolute top-0 translate-y-[105%] right-[50%] translate-x-[50%] rounded-[6px] overflow-hidden pointer-events-none">
                    <div className="m-1">
                      <div className="w-full flex flex-col bg-gray-700/60 backdrop-blur-sm shadow-md rounded-md p-4 text-white border border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <BellRing className="w-[18px] h-[18px] text-white flex-shrink-0" />
                            <h1 className="text-[13px] font-medium">
                              {formData.locationName || "SHOP NAME"}
                            </h1>
                          </div>
                          <span className="text-[10px] opacity-80">now</span>
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed break-words">
                          {formData.welcomeMessage || "Write your notification message with emojies 👀 🎫 💬 😍"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
              {itemToDelete && t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.locations.title") || "الموقع",
                name: itemToDelete.name
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
              onClick={confirmDeleteLocation}
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
