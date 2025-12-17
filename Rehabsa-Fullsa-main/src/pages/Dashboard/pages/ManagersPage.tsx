import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

const managers = [
  {
    id: 1,
    name: "Hussain Ali",
    email: "asefd1103@gmail.com",
    phone: "+966546023195",
    createdAt: "Fri Oct 10 2025",
    lastLogin: "Fri Oct 10 2025",
  },
];

export function ManagersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isArabic ? (
          <>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("dashboardPages.managers.searchManager")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t("dashboardPages.managers.addManager")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("dashboardPages.managers.addNewManager")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("dashboardPages.managers.firstName")}</Label>
                        <Input id="firstName" placeholder={t("dashboardPages.managers.firstNamePlaceholder")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("dashboardPages.managers.lastName")}</Label>
                        <Input id="lastName" placeholder={t("dashboardPages.managers.lastNamePlaceholder")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("dashboardPages.managers.email")}</Label>
                      <Input id="email" type="email" placeholder={t("dashboardPages.managers.emailPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("dashboardPages.managers.phone")}</Label>
                      <div className="flex gap-2">
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="+966" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+966">+966</SelectItem>
                            <SelectItem value="+971">+971</SelectItem>
                            <SelectItem value="+965">+965</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input id="phone" placeholder={t("dashboardPages.managers.phonePlaceholder")} className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t("dashboardPages.managers.password")}</Label>
                      <Input id="password" type="password" placeholder={t("dashboardPages.managers.passwordPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("dashboardPages.managers.confirmPassword")}</Label>
                      <Input id="confirmPassword" type="password" placeholder={t("dashboardPages.managers.confirmPasswordPlaceholder")} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      {t("dashboardPages.managers.cancel")}
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      إضافة مدير
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" disabled className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                حذف مدير
              </Button>
            </div>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.managers.title")}
            </h1>
          </>
        ) : (
          <>
            <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("dashboardPages.managers.title")}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("dashboardPages.managers.searchManager")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t("dashboardPages.managers.addManager")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("dashboardPages.managers.addNewManager")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("dashboardPages.managers.firstName")}</Label>
                        <Input id="firstName" placeholder={t("dashboardPages.managers.firstNamePlaceholder")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("dashboardPages.managers.lastName")}</Label>
                        <Input id="lastName" placeholder={t("dashboardPages.managers.lastNamePlaceholder")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("dashboardPages.managers.email")}</Label>
                      <Input id="email" type="email" placeholder={t("dashboardPages.managers.emailPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("dashboardPages.managers.phone")}</Label>
                      <div className="flex gap-2">
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="+966" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+966">+966</SelectItem>
                            <SelectItem value="+971">+971</SelectItem>
                            <SelectItem value="+965">+965</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input id="phone" placeholder={t("dashboardPages.managers.phonePlaceholder")} className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t("dashboardPages.managers.password")}</Label>
                      <Input id="password" type="password" placeholder={t("dashboardPages.managers.passwordPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("dashboardPages.managers.confirmPassword")}</Label>
                      <Input id="confirmPassword" type="password" placeholder={t("dashboardPages.managers.confirmPasswordPlaceholder")} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      {t("dashboardPages.managers.cancel")}
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      إضافة مدير
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" disabled className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                حذف مدير
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Managers Table */}
      <div className="relative overflow-x-auto">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-xs py-2">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className="flex items-center gap-1">
                      اسم العميل
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[200px]">
                    <div className="flex items-center gap-1">
                      البريد الإلكتروني
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      تاريخ الإنشاء
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className="flex items-center gap-1">
                      رقم الهاتف
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      آخر تسجيل دخول
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="text-xs py-2">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap font-medium">
                      {manager.name}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {manager.email}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {manager.createdAt}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {manager.phone}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {manager.lastLogin}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Shown 1 From 1 Manager
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground ml-4">
              1 / page
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

