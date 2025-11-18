import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "../components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Search,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Edit,
  Trash2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  {
    id: "user-1",
    name: "أحمد محمد",
    email: "ahmed@cafe.com",
    phone: "+966501234567",
    role: "مالك متجر",
    store: "مقهى النخيل",
    status: "نشط",
    joinDate: "2024-01-15",
    lastLogin: "2025-01-15",
    permissions: ["إدارة المتجر", "إدارة العملاء", "إدارة البطاقات"]
  },
  {
    id: "user-2",
    name: "فاطمة أحمد",
    email: "fatima@salon.com",
    phone: "+966502345678",
    role: "مالك متجر",
    store: "صالون الجمال",
    status: "نشط",
    joinDate: "2024-03-20",
    lastLogin: "2025-01-14",
    permissions: ["إدارة المتجر", "إدارة العملاء", "إدارة البطاقات"]
  },
  {
    id: "user-3",
    name: "محمد علي",
    email: "mohammed@restaurant.com",
    phone: "+966503456789",
    role: "مالك متجر",
    store: "مطعم الشرق",
    status: "نشط",
    joinDate: "2023-12-10",
    lastLogin: "2025-01-13",
    permissions: ["إدارة المتجر", "إدارة العملاء", "إدارة البطاقات", "إدارة التقارير"]
  },
  {
    id: "user-4",
    name: "خالد السعد",
    email: "khalid@gym.com",
    phone: "+966504567890",
    role: "مالك متجر",
    store: "صالة الرياضة",
    status: "متوقف",
    joinDate: "2024-06-05",
    lastLogin: "2025-01-10",
    permissions: ["إدارة المتجر", "إدارة العملاء"]
  },
  {
    id: "user-5",
    name: "سعد القحطاني",
    email: "saad@carwash.com",
    phone: "+966505678901",
    role: "مالك متجر",
    store: "مغسلة السيارات",
    status: "تجريبي",
    joinDate: "2025-01-01",
    lastLogin: "2025-01-01",
    permissions: ["إدارة المتجر"]
  },
  {
    id: "user-6",
    name: "نورا السعيد",
    email: "nora@cafe.com",
    phone: "+966506789012",
    role: "مدير",
    store: "مقهى النخيل",
    status: "نشط",
    joinDate: "2024-08-15",
    lastLogin: "2025-01-12",
    permissions: ["إدارة العملاء", "إدارة البطاقات"]
  }
];

export function UsersPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");

  const handleExport = () => {
    toast.success(t("admin.users.exportSuccess"));
  };

  const handleActivateUser = (_userId: string) => {
    toast.success(t("admin.users.activationSuccess"));
  };

  const handleDeactivateUser = (_userId: string) => {
    toast.success(t("admin.users.deactivationSuccess"));
  };

  const handleSendEmail = (_userId: string) => {
    toast.success(t("admin.users.emailSent"));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "متوقف": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "تجريبي": { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["نشط"];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      "مالك متجر": { className: "bg-purple-100 text-purple-800" },
      "مدير": { className: "bg-blue-100 text-blue-800" },
      "موظف": { className: "bg-gray-100 text-gray-800" },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig["موظف"];
    
    return (
      <Badge variant="outline" className={config.className}>
        {role}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "نشط").length;
  const storeOwners = users.filter(user => user.role === "مالك متجر").length;
  const managers = users.filter(user => user.role === "مدير").length;

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Users className="h-6 w-6" />
          {t("admin.users.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className={isRTL ? 'text-left' : 'text-right'}>
            <span>{t("admin.users.export")}</span>
            <Download className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title="إجمالي المستخدمين"
          value={totalUsers}
          icon={Users}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title="المستخدمين النشطين"
          value={activeUsers}
          icon={UserCheck}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title="أصحاب المتاجر"
          value={storeOwners}
          icon={Shield}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title="المدراء"
          value={managers}
          icon={Users}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="relative flex-1 max-w-sm">
              <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-muted-foreground`} />
              <input
                type="text"
                placeholder={t("admin.users.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'} py-2 border border-gray-300 rounded-md`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.users.allStatuses")}</option>
              <option value="نشط">{t("admin.users.active")}</option>
              <option value="متوقف">{t("admin.users.inactive")}</option>
              <option value="تجريبي">{t("admin.users.trial")}</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.users.allRoles")}</option>
              <option value="مالك متجر">{t("admin.users.storeOwner")}</option>
              <option value="مدير">{t("admin.users.manager")}</option>
              <option value="موظف">{t("admin.users.employee")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.userName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.contact")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.role")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.store")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.joinDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.lastLogin")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.users.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    <div>
                      <div>{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div>
                      <div className="text-sm">{user.phone}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.store}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.joinDate}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuLabel>{t("admin.users.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.users.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.users.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(user.id)}>
                          <Mail className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.users.sendEmail")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "نشط" ? (
                          <DropdownMenuItem 
                            className="text-orange-600"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <UserX className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.users.deactivate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleActivateUser(user.id)}
                          >
                            <UserCheck className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.users.activate")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.users.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.users.shownFrom", { shown: filteredUsers.length, total: users.length })}
        </p>
      </div>
    </div>
  );
}
