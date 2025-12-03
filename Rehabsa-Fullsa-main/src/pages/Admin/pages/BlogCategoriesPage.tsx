import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tag, Plus, Edit, Trash2, MoreHorizontal, FileText } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  createBlogCategory,
  deleteBlogCategory,
  fetchBlogCategories,
  updateBlogCategory,
  type BlogCategory,
} from "@/lib/api";

type CategoryFormState = {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  color: string;
};

const defaultForm: CategoryFormState = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  color: "#3B82F6",
};

const colorOptions = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899", "#6B7280", "#111827"];

export function BlogCategoriesPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(defaultForm);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchBlogCategories();
      setCategories(response.data);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalPosts = categories.reduce((sum, cat) => sum + (cat.posts_count ?? 0), 0);
    const mostUsed =
      categories.reduce((prev, current) => ((prev.posts_count ?? 0) > (current.posts_count ?? 0) ? prev : current), categories[0]) ??
      null;
    return { totalCategories, totalPosts, mostUsed };
  }, [categories]);

  const openCreateModal = () => {
    setCategoryForm(defaultForm);
    setEditingCategoryId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: BlogCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name_ar: category.name_ar,
      name_en: category.name_en,
      description_ar: category.description_ar ?? "",
      description_en: category.description_en ?? "",
      color: category.color ?? "#3B82F6",
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name_ar.trim()) {
      toast.error(t("admin.blog.categoryNameRequired"));
      return;
    }
    if (!categoryForm.name_en.trim()) {
      toast.error(t("admin.blog.categoryNameEnRequired"));
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name_ar: categoryForm.name_ar.trim(),
        name_en: categoryForm.name_en.trim(),
        description_ar: categoryForm.description_ar.trim() || null,
        description_en: categoryForm.description_en.trim() || null,
        color: categoryForm.color,
      };
      if (editingCategoryId) {
        await updateBlogCategory(editingCategoryId, payload);
        toast.success(t("admin.blog.categoryUpdateSuccess"));
      } else {
        await createBlogCategory(payload);
        toast.success(t("admin.blog.categoryCreateSuccess"));
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const confirmText =
      t("admin.blog.categoryDeleteConfirm", { name: category ? category.name_ar : "" }) ?? t("admin.blog.delete");
    if (!window.confirm(confirmText)) return;
    try {
      await deleteBlogCategory(categoryId);
      toast.success(t("admin.blog.categoryDeleteSuccess"));
      await loadCategories();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? "flex-row" : "flex-row"}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "text-left" : "text-right"}`}>
          <Tag className="h-6 w-6" />
          {t("admin.blog.categories")}
        </h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateModal} className={isRTL ? "text-left" : "text-right"}>
              <span>{t("admin.blog.createCategory")}</span>
              <Plus className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
            </Button>
          </DialogTrigger>
          <DialogContent className={`max-w-2xl ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                {editingCategoryId ? t("admin.blog.editCategory") : t("admin.blog.createCategory")}
              </DialogTitle>
              <DialogDescription className={isRTL ? "text-right" : "text-left"}>
                {t("admin.blog.createCategoryDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.blog.categoryName")} *
                </Label>
                <Input
                  value={categoryForm.name_ar}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name_ar: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.blog.categoryNamePlaceholder")}
                />
              </div>

              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.blog.categoryNameEn")} *
                </Label>
                <Input
                  value={categoryForm.name_en}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name_en: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.blog.categoryNameEnPlaceholder")}
                />
              </div>

              <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.blog.description")}
                </Label>
                <Textarea
                  value={categoryForm.description_ar}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description_ar: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.blog.descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                  {t("admin.blog.descriptionEn")}
                </Label>
                <Textarea
                  value={categoryForm.description_en}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description_en: e.target.value }))}
                  className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("admin.blog.descriptionEnPlaceholder")}
                  rows={3}
                />
              </div>

              <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className={`${isRTL ? "text-right" : "text-left"}`}>{t("admin.blog.color")}</Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        categoryForm.color === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCategoryForm((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className={`${isRTL ? "flex-row-reverse" : ""}`}>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                {t("admin.blog.cancel")}
              </Button>
              <Button onClick={handleSaveCategory} disabled={isSaving}>
                {isSaving ? t("common.loading") : t("admin.blog.saveCategory")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.blog.totalCategories")}
          value={stats.totalCategories}
          icon={Tag}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.blog.totalPosts")}
          value={stats.totalPosts}
          icon={FileText}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.blog.mostUsedCategory")}
          value={stats.mostUsed ? (isRTL ? stats.mostUsed.name_ar : stats.mostUsed.name_en) : t("common.notAvailable")}
          icon={Eye}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.blog.lastUpdatedCategory")}
          value={stats.mostUsed?.updated_at ? new Date(stats.mostUsed.updated_at).toLocaleDateString() : "-"}
          icon={Edit}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.blog.categoryName")}</TableHead>
                <TableHead>{t("admin.blog.categoryNameEn")}</TableHead>
                <TableHead>{t("admin.blog.description")}</TableHead>
                <TableHead>{t("admin.blog.postsCount")}</TableHead>
                <TableHead>{t("admin.blog.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color ?? "#3B82F6" }}
                      />
                      {category.name_ar}
                    </div>
                  </TableCell>
                  <TableCell>{category.name_en}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {category.description_ar ?? t("common.notAvailable")}
                  </TableCell>
                  <TableCell>{category.posts_count ?? 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuLabel>{t("admin.blog.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => openEditModal(category)}>
                          <Edit className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                          {t("admin.blog.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                          {t("admin.blog.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
          )}
          {!isLoading && !categories.length && (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
