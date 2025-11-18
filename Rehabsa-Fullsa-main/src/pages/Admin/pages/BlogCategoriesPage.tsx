import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Eye,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data for categories
const categories = [
  {
    id: "cat-1",
    name: "إدارة الأعمال",
    nameEn: "Business Management",
    description: "مقالات حول إدارة الأعمال والمشاريع",
    descriptionEn: "Articles about business and project management",
    postsCount: 3,
    color: "#3B82F6",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-15"
  },
  {
    id: "cat-2",
    name: "التسويق",
    nameEn: "Marketing",
    description: "استراتيجيات التسويق والتسويق الرقمي",
    descriptionEn: "Marketing strategies and digital marketing",
    postsCount: 2,
    color: "#10B981",
    createdAt: "2024-02-10",
    updatedAt: "2024-12-10"
  },
  {
    id: "cat-3",
    name: "التقنية",
    nameEn: "Technology",
    description: "أحدث التقنيات والتطورات التقنية",
    descriptionEn: "Latest technologies and technical developments",
    postsCount: 1,
    color: "#F59E0B",
    createdAt: "2024-03-05",
    updatedAt: "2024-12-20"
  },
  {
    id: "cat-4",
    name: "التسويق الرقمي",
    nameEn: "Digital Marketing",
    description: "تسويق رقمي ووسائل التواصل الاجتماعي",
    descriptionEn: "Digital marketing and social media",
    postsCount: 1,
    color: "#8B5CF6",
    createdAt: "2024-04-12",
    updatedAt: "2024-12-05"
  },
  {
    id: "cat-5",
    name: "التحليلات",
    nameEn: "Analytics",
    description: "تحليل البيانات والإحصائيات",
    descriptionEn: "Data analysis and statistics",
    postsCount: 1,
    color: "#EF4444",
    createdAt: "2024-05-20",
    updatedAt: "2024-11-28"
  }
];

export function BlogCategoriesPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [editedCategory, setEditedCategory] = React.useState<any>(null);
  const [newCategory, setNewCategory] = React.useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    color: "#3B82F6"
  });

  // Calculate stats
  const totalCategories = categories.length;
  const totalPosts = categories.reduce((sum, cat) => sum + cat.postsCount, 0);
  const mostUsedCategory = categories.reduce((prev, current) => 
    prev.postsCount > current.postsCount ? prev : current
  );

  const handleCreateCategory = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error(t("admin.blog.categoryNameRequired"));
      return;
    }
    if (!newCategory.nameEn.trim()) {
      toast.error(t("admin.blog.categoryNameEnRequired"));
      return;
    }

    toast.success(t("admin.blog.categoryCreateSuccess"));
    setIsCreateModalOpen(false);
    resetNewCategoryForm();
  };

  const resetNewCategoryForm = () => {
    setNewCategory({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      color: "#3B82F6"
    });
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category.id);
    setEditedCategory({ ...category });
  };

  const handleSaveEdit = () => {
    toast.success(t("admin.blog.categoryUpdateSuccess"));
    setEditingCategory(null);
    setEditedCategory(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedCategory(null);
  };

  const handleDeleteCategory = (_categoryId: string) => {
    toast.success(t("admin.blog.categoryDeleteSuccess"));
  };

  const colorOptions = [
    { name: "أزرق", nameEn: "Blue", value: "#3B82F6" },
    { name: "أخضر", nameEn: "Green", value: "#10B981" },
    { name: "برتقالي", nameEn: "Orange", value: "#F59E0B" },
    { name: "بنفسجي", nameEn: "Purple", value: "#8B5CF6" },
    { name: "أحمر", nameEn: "Red", value: "#EF4444" },
    { name: "وردي", nameEn: "Pink", value: "#EC4899" },
    { name: "رمادي", nameEn: "Gray", value: "#6B7280" },
    { name: "أسود", nameEn: "Black", value: "#111827" }
  ];

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Tag className="h-6 w-6" />
          {t("admin.blog.categories")}
        </h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateCategory} className={isRTL ? 'text-left' : 'text-right'}>
                <span>{t("admin.blog.createCategory")}</span>
                <Plus className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-2xl ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.blog.createCategory")}
                </DialogTitle>
                <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.blog.createCategoryDescription")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Category Name */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="categoryName" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.categoryName")} *
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.categoryNamePlaceholder")}
                  />
                </div>

                {/* English Name */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="categoryNameEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.categoryNameEn")} *
                  </Label>
                  <Input
                    id="categoryNameEn"
                    value={newCategory.nameEn}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, nameEn: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.categoryNameEnPlaceholder")}
                  />
                </div>

                {/* Description */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="description" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.description")}
                  </Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.descriptionPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* English Description */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="descriptionEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.descriptionEn")}
                  </Label>
                  <Textarea
                    id="descriptionEn"
                    value={newCategory.descriptionEn}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.descriptionEnPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* Color */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.color")}
                  </Label>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            newCategory.color === color.value ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewCategory(prev => ({ ...prev, color: color.value }))}
                          title={isRTL ? color.name : color.nameEn}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  {t("admin.blog.cancel")}
                </Button>
                <Button onClick={handleSaveNewCategory}>
                  {t("admin.blog.createCategory")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.blog.totalCategories")}
          value={totalCategories}
          icon={Tag}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.blog.totalPosts")}
          value={totalPosts}
          icon={FileText}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.blog.mostUsedCategory")}
          value={mostUsedCategory.name}
          icon={Eye}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.blog.averagePostsPerCategory")}
          value={Math.round(totalPosts / totalCategories)}
          icon={Tag}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.categoryName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.description")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.postsCount")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.color")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.createdAt")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {editingCategory === category.id ? (
                      <Input
                        value={editedCategory?.name || category.name}
                        onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                        className="font-bold w-full"
                      />
                    ) : (
                      <div>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm text-gray-600">{category.nameEn}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingCategory === category.id ? (
                      <Textarea
                        value={editedCategory?.description || category.description}
                        onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                        className="w-full min-w-[200px]"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-[200px]">
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{category.descriptionEn}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{category.postsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600">{category.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div>
                      <div className="text-sm">{category.createdAt}</div>
                      <div className="text-xs text-gray-500">{t("admin.blog.updated")}: {category.updatedAt}</div>
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.blog.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {editingCategory === category.id ? (
                          <>
                            <DropdownMenuItem onClick={handleSaveEdit}>
                              <CheckCircle className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                              {t("admin.blog.save")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCancelEdit}>
                              <XCircle className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                              {t("admin.blog.cancel")}
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.blog.delete")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
