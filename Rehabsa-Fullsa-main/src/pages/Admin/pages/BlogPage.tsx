import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatsCard } from "../components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  BookOpen,
  Users,
  MessageSquare,
  FileText,
  Trash2,
  Loader2,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createBlogPost,
  deleteBlogPost,
  fetchBlogCategories,
  fetchBlogPost,
  fetchBlogPosts,
  updateBlogPost,
  type BlogCategory,
  type BlogPostRecord,
} from "@/lib/api";
import type { CheckedState } from "@radix-ui/react-checkbox";

type PostFormState = {
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  status: "draft" | "published";
  is_featured: boolean;
  tags: string[];
  cover_image: string;
};

const defaultPostForm: PostFormState = {
  title: "",
  excerpt: "",
  content: "",
  category_id: "",
  status: "draft",
  is_featured: false,
  tags: [],
  cover_image: "",
};

export function BlogPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<PostFormState>(defaultPostForm);
  const [tagInput, setTagInput] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchBlogPosts();
      setPosts(response.data);
      setSelectedPosts((prev) => prev.filter((id) => response.data.some((post) => post.id === id)));
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetchBlogCategories();
      setCategories(response.data);
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    }
  }, [t]);

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, [loadPosts, loadCategories]);

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const state = (location.state || {}) as { editPostId?: number };
    if (state.editPostId) {
      openEditModal(state.editPostId);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.slug ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || (post.category?.id?.toString() ?? "") === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, searchTerm, statusFilter, categoryFilter]);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const draftPosts = posts.filter((post) => post.status === "draft").length;
  const totalComments = posts.reduce((sum, post) => sum + (post.comments ?? 0), 0);

  const statusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">{t("admin.blog.published")}</Badge>;
      case "draft":
      default:
        return <Badge variant="secondary">{t("admin.blog.draft")}</Badge>;
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return t("admin.blog.notPublished");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US");
  };

  const getCategoryLabel = (category?: BlogCategory | null) => {
    if (!category) return t("common.notAvailable");
    return isRTL ? category.name_ar : category.name_en;
  };

  const resetForm = () => {
    setPostForm(defaultPostForm);
    setTagInput("");
    setEditingPostId(null);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (postForm.tags.includes(tagInput.trim())) return;
    setPostForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setPostForm((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = useCallback(
    async (postId: number) => {
      try {
        const response = await fetchBlogPost(postId);
        const data = response.data;
        setPostForm({
          title: data.title,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          category_id: data.category?.id ? String(data.category.id) : "",
          status: data.status,
          is_featured: data.is_featured,
          tags: data.tags ?? [],
          cover_image: data.cover_image ?? "",
        });
        setEditingPostId(postId);
        setIsModalOpen(true);
      } catch (error: any) {
        toast.error(error?.message || t("common.error"));
      }
    },
    [t],
  );

  const handleSavePost = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) {
      toast.error(t("admin.blog.titleRequired"));
      return;
    }

    const payload = {
      title: postForm.title.trim(),
      excerpt: postForm.excerpt.trim() || null,
      content: postForm.content,
      category_id: postForm.category_id ? Number(postForm.category_id) : null,
      status: postForm.status,
      is_featured: postForm.is_featured,
      tags: postForm.tags,
      cover_image: postForm.cover_image.trim() || null,
    };

    setIsSavingPost(true);
    try {
      if (editingPostId) {
        await updateBlogPost(editingPostId, payload);
        toast.success(t("admin.blog.updateSuccess"));
      } else {
        await createBlogPost(payload);
        toast.success(t("admin.blog.createSuccess"));
      }
      setIsModalOpen(false);
      resetForm();
      await loadPosts();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm(t("admin.blog.deletePostConfirm") ?? t("admin.blog.delete"))) return;
    try {
      await deleteBlogPost(postId);
      toast.success(t("admin.blog.deleteSuccess"));
      await loadPosts();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    }
  };

  const handleBulkAction = async (action: "publish" | "draft" | "delete") => {
    if (!selectedPosts.length) {
      toast.error(t("admin.blog.selectPostsFirst"));
      return;
    }

    setBulkLoading(true);
    try {
      for (const postId of selectedPosts) {
        if (action === "delete") {
          await deleteBlogPost(postId);
        } else {
          await updateBlogPost(postId, { status: action === "publish" ? "published" : "draft" });
        }
      }
      if (action === "delete") {
        toast.success(t("admin.blog.bulkDeleteSuccess", { count: selectedPosts.length }));
      } else if (action === "publish") {
        toast.success(t("admin.blog.bulkPublishSuccess", { count: selectedPosts.length }));
      } else {
        toast.success(t("admin.blog.bulkDraftSuccess", { count: selectedPosts.length }));
      }
      setSelectedPosts([]);
      await loadPosts();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelectAll = (checked: CheckedState) => {
    if (checked === true) {
      setSelectedPosts(filteredPosts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const toggleSelectPost = (postId: number, checked: CheckedState) => {
    setSelectedPosts((prev) => {
      if (checked === true) {
        return [...prev, postId];
      }
      return prev.filter((id) => id !== postId);
    });
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? "flex-row" : "flex-row"}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? "text-left" : "text-right"}`}>
          <BookOpen className="h-6 w-6" />
          {t("admin.blog.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal} className={isRTL ? "text-left" : "text-right"}>
                <span>{t("admin.blog.createPost")}</span>
                <Plus className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-3xl ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                  {editingPostId ? t("admin.blog.editPost") : t("admin.blog.createPost")}
                </DialogTitle>
                <DialogDescription className={isRTL ? "text-right" : "text-left"}>
                  {t("admin.blog.createPostDescription")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.blog.postTitle")} *
                  </Label>
                  <Input
                    value={postForm.title}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("admin.blog.titlePlaceholder")}
                  />
                </div>

                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>{t("admin.blog.excerpt")}</Label>
                  <Textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("admin.blog.excerptPlaceholder")}
                    rows={3}
                  />
                </div>

                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.blog.content")} *
                  </Label>
                  <Textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("admin.blog.contentPlaceholder")}
                    rows={8}
                  />
                </div>

                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.blog.coverImage")}
                  </Label>
                  <Input
                    value={postForm.cover_image}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, cover_image: e.target.value }))}
                    className={`col-span-3 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("admin.blog.coverImagePlaceholder")}
                  />
                </div>

                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.blog.category")} *
                  </Label>
                  <Select
                    value={postForm.category_id}
                    onValueChange={(value) => setPostForm((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("admin.blog.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {isRTL ? category.name_ar : category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                    {t("admin.blog.tags")}
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder={t("admin.blog.addTag")}
                        className={`${isRTL ? "text-right" : "text-left"}`}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      />
                      <Button onClick={handleAddTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postForm.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTag(tag)}
                            className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                      {t("admin.blog.status")}
                    </Label>
                    <Select
                      value={postForm.status}
                      onValueChange={(value: "draft" | "published") =>
                        setPostForm((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("admin.blog.draft")}</SelectItem>
                        <SelectItem value="published">{t("admin.blog.published")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Label className={`${isRTL ? "text-right" : "text-left"}`}>
                      {t("admin.blog.featured")}
                    </Label>
                    <div className={`col-span-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Switch
                        checked={postForm.is_featured}
                        onCheckedChange={(checked) => setPostForm((prev) => ({ ...prev, is_featured: checked }))}
                      />
                      <span className="text-sm">
                        {postForm.is_featured ? t("admin.blog.featured") : t("admin.blog.notFeatured")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className={`${isRTL ? "flex-row-reverse" : ""}`}>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  {t("admin.blog.cancel")}
                </Button>
                <Button onClick={handleSavePost} disabled={isSavingPost}>
                  {isSavingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editingPostId ? t("admin.blog.edit") : t("admin.blog.createPost")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.blog.totalPosts")}
          value={totalPosts}
          icon={FileText}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.blog.publishedPosts")}
          value={publishedPosts}
          icon={BookOpen}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.blog.drafts")}
          value={draftPosts}
          icon={Edit}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
        <AdminStatsCard
          title={t("admin.blog.totalComments")}
          value={totalComments}
          icon={MessageSquare}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
      </div>

      <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-2.5 ${isRTL ? "left-2" : "right-2"} h-4 w-4 text-gray-500`} />
          <Input
            placeholder={t("admin.blog.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTL ? "pl-8 pr-4 text-right" : "pr-8 pl-4 text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("admin.blog.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.blog.allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {isRTL ? category.name_ar : category.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("admin.blog.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.blog.allStatuses")}</SelectItem>
            <SelectItem value="published">{t("admin.blog.published")}</SelectItem>
            <SelectItem value="draft">{t("admin.blog.draft")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedPosts.length > 0 && (
        <Alert>
          <AlertDescription className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <span>{t("admin.blog.selectedPosts", { count: selectedPosts.length })}</span>
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button size="sm" variant="outline" disabled={bulkLoading} onClick={() => handleBulkAction("publish")}>
                {bulkLoading ? t("common.loading") : t("admin.blog.publish")}
              </Button>
              <Button size="sm" variant="outline" disabled={bulkLoading} onClick={() => handleBulkAction("draft")}>
                {bulkLoading ? t("common.loading") : t("admin.blog.draft")}
              </Button>
              <Button size="sm" variant="outline" disabled={bulkLoading} onClick={() => handleBulkAction("delete")}>
                {bulkLoading ? t("common.loading") : t("admin.blog.delete")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.postTitle")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.author")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.category")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.status")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.comments")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.publishDate")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("admin.blog.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => toggleSelectPost(post.id, checked)}
                    />
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
                    <div>
                      <div className="font-semibold">{post.title}</div>
                      {post.is_featured && (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 mt-1">
                          {t("admin.blog.featured")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Users className="h-4 w-4 text-gray-500" />
                      {post.author?.name ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <Badge variant="outline">{getCategoryLabel(post.category ?? null)}</Badge>
                  </TableCell>
                  <TableCell>{statusBadge(post.status)}</TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      {post.comments ?? 0}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {formatDate(post.published_at)}
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
                        <DropdownMenuItem onSelect={() => navigate(`/admin/blog/${post.id}`)}>
                          <Eye className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                          {t("admin.blog.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openEditModal(post.id)}>
                          <Edit className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                          {t("admin.blog.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onSelect={() => handleDeletePost(post.id)}>
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
          {!isLoading && !filteredPosts.length && (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
          )}
        </CardContent>
      </Card>

      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
        <p className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {t("admin.blog.shownFrom", { shown: filteredPosts.length, total: posts.length })}
        </p>
      </div>
    </div>
  );
}
