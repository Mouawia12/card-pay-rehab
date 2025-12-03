import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "../components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
  type AdminUserRecord,
  type AdminUsersStats,
} from "@/lib/api";

export function UsersPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [stats, setStats] = useState<AdminUsersStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "merchant",
    is_active: true,
  });
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAdminUsers();
      setUsers(response.data.users);
      setStats(response.data.stats);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExport = () => {
    toast.success(t("admin.users.exportSuccess"));
  };

  const handleToggleStatus = async (user: AdminUserRecord, activate: boolean) => {
    try {
      await updateAdminUser(user.id, { is_active: activate });
      toast.success(t("admin.users.statusUpdated"));
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    }
  };

  const handleSendEmail = (_userId: number) => {
    toast.success(t("admin.users.emailSent"));
  };

  const openUserDialog = (user: AdminUserRecord, mode: "view" | "edit") => {
    setSelectedUser(user);
    setDialogMode(mode);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      role: user.raw_role,
      is_active: user.is_active,
    });
    setIsUserDialogOpen(true);
  };

  const handleUserFormChange = (field: string, value: string | boolean) => {
    setUserForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsSavingUser(true);
    try {
      await updateAdminUser(selectedUser.id, {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        is_active: userForm.is_active,
      });
      toast.success(t("admin.users.updateSuccess"));
      setIsUserDialogOpen(false);
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = (user: AdminUserRecord) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      await deleteAdminUser(userToDelete.id);
      toast.success(t("admin.users.deleteSuccess"));
      setUserToDelete(null);
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsDeletingUser(false);
    }
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

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.store ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const totalUsers = stats?.total ?? 0;
  const activeUsers = stats?.active ?? 0;
  const storeOwners = stats?.store_owners ?? 0;
  const managers = stats?.managers ?? 0;

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
                      <div className="text-sm">{user.phone ?? "-"}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.store ?? t("common.notAvailable")}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.join_date ?? "-"}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {user.last_login ?? "-"}
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
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            openUserDialog(user, "view");
                          }}
                        >
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.users.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            openUserDialog(user, "edit");
                          }}
                        >
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
                            onSelect={(event) => {
                              event.preventDefault();
                              handleToggleStatus(user, false);
                            }}
                          >
                            <UserX className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.users.deactivate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleToggleStatus(user, true);
                            }}
                          >
                            <UserCheck className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.users.activate")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(event) => {
                            event.preventDefault();
                            handleDeleteUser(user);
                          }}
                        >
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
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("common.loading")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("admin.users.shownFrom", { shown: filteredUsers.length, total: users.length })}
        </p>
      </div>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "view" ? t("admin.users.detailsTitle") : t("admin.users.editTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">{t("admin.users.name")}</Label>
              <Input
                id="user-name"
                value={userForm.name}
                onChange={(e) => handleUserFormChange("name", e.target.value)}
                disabled={dialogMode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">{t("admin.users.email")}</Label>
              <Input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(e) => handleUserFormChange("email", e.target.value)}
                disabled={dialogMode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">{t("admin.users.phone")}</Label>
              <Input
                id="user-phone"
                value={userForm.phone}
                onChange={(e) => handleUserFormChange("phone", e.target.value)}
                disabled={dialogMode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">{t("admin.users.roleLabel")}</Label>
              <select
                id="user-role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={userForm.role}
                onChange={(e) => handleUserFormChange("role", e.target.value)}
                disabled={dialogMode === "view"}
              >
                <option value="merchant">{t("admin.users.storeOwner")}</option>
                <option value="staff">{t("admin.users.manager")}</option>
                <option value="admin">{t("admin.users.employee")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-status">{t("admin.users.statusLabel")}</Label>
              <select
                id="user-status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={userForm.is_active ? "active" : "inactive"}
                onChange={(e) => handleUserFormChange("is_active", e.target.value === "active")}
                disabled={dialogMode === "view"}
              >
                <option value="active">{t("admin.users.active")}</option>
                <option value="inactive">{t("admin.users.inactive")}</option>
              </select>
            </div>
            {selectedUser && (
              <div className="space-y-2 md:col-span-2">
                <Label>{t("admin.users.permissions")}</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.length ? (
                    selectedUser.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {permission}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">{t("admin.users.noPermissions")}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          {dialogMode === "edit" && (
            <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                {t("admin.users.cancel")}
              </Button>
              <Button onClick={handleSaveUser} disabled={isSavingUser}>
                {isSavingUser ? t("common.loading") : t("admin.users.save")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.users.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && t("admin.users.deleteConfirm", { name: userToDelete.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t("admin.users.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} disabled={isDeletingUser} className="bg-red-600">
              {isDeletingUser ? t("common.loading") : t("admin.users.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
