import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export function SettingsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className={`text-3xl font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t("dashboardPages.settings.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Details Card */}
        <Card className={`shadow-lg border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-white ${isRTL ? 'lg:order-2' : ''}`}>
          <CardHeader className="pb-4 border-b-2 border-gray-200 bg-gradient-to-r from-blue-800 to-blue-900">
            <CardTitle className={`text-xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.settings.subscriptionDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.planDuration")}
                </Label>
                <p className={`text-2xl font-bold text-blue-900 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>1-year</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.price")}
                </Label>
                <p className={`text-2xl font-bold text-blue-900 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  800 <span className="text-sm font-normal text-gray-600">ريال</span>
                </p>
            </div>
            
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.remainingDays")}
                </Label>
                <p className={`text-2xl font-bold text-orange-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>355</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.currentStatus")}
                </Label>
                <div className={`mt-2 ${isRTL ? 'flex justify-end' : 'flex justify-start'}`}>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 text-sm px-4 py-2 font-semibold">
                    {t("dashboardPages.settings.active")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t-2 border-gray-200">
              <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dashboardPages.settings.startDate")}
              </Label>
              <p className={`text-base text-foreground font-medium ${isRTL ? 'text-right' : 'text-left'}`}>October 10, 2025</p>
            </div>

            <div className="space-y-2">
              <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dashboardPages.settings.endDate")}
              </Label>
              <p className={`text-base text-foreground font-medium ${isRTL ? 'text-right' : 'text-left'}`}>October 12, 2026</p>
            </div>

            <div className="space-y-2">
              <Label className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dashboardPages.settings.planType")}
              </Label>
              <p className={`text-base text-foreground font-medium ${isRTL ? 'text-right' : 'text-left'}`}>1-year</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Settings Card */}
        <Card className={`shadow-md border border-gray-200 ${isRTL ? 'lg:order-1' : ''}`}>
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className={`text-xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.settings.personalSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.firstName")}
                </Label>
                <Input 
                  id="firstName" 
                  defaultValue="Hussain" 
                  className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.lastName")}
                </Label>
                <Input 
                  id="lastName" 
                  defaultValue="Ali" 
                  className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dashboardPages.settings.storeName")}
              </Label>
              <Input 
                id="storeName" 
                defaultValue="مغاسل وتلميع تذكار" 
                className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dashboardPages.settings.phone")}
              </Label>
              <Input 
                id="phone" 
                defaultValue="556023195" 
                className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
              />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.currentPassword")}
                </Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  placeholder={t("dashboardPages.settings.currentPasswordPlaceholder")}
                  className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.newPassword")}
                </Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder={t("dashboardPages.settings.newPasswordPlaceholder")}
                  className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboardPages.settings.confirmPassword")}
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder={t("dashboardPages.settings.confirmPasswordPlaceholder")}
                  className={`${isRTL ? 'text-right' : 'text-left'} border-gray-300 focus:border-primary focus:ring-primary`}
                />
              </div>
            </div>

            <Button className="w-full mt-4 py-6 text-base font-medium shadow-sm hover:shadow-md transition-shadow">
              {t("dashboardPages.settings.saveChanges")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
