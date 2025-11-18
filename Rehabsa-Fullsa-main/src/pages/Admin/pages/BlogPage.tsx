import React from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for blog posts
const blogPosts = [
  {
    id: "post-1",
    title: "أفضل الممارسات في إدارة المتاجر الإلكترونية",
    titleEn: "Best Practices for E-commerce Store Management",
    content: "في هذا المقال سنتحدث عن أفضل الممارسات التي يجب اتباعها عند إدارة المتاجر الإلكترونية...",
    author: "أحمد محمد",
    category: "إدارة الأعمال",
    categoryEn: "Business Management",
    status: "published",
    comments: 15,
    views: 1250,
    publishDate: "2024-12-15",
    lastModified: "2024-12-15",
    tags: ["إدارة", "متاجر", "نصائح"],
    featured: true
  },
  {
    id: "post-2",
    title: "كيفية زيادة مبيعاتك عبر الإنترنت",
    titleEn: "How to Increase Your Online Sales",
    content: "هناك عدة استراتيجيات يمكنك استخدامها لزيادة مبيعاتك عبر الإنترنت...",
    author: "فاطمة أحمد",
    category: "التسويق",
    categoryEn: "Marketing",
    status: "published",
    comments: 8,
    views: 890,
    publishDate: "2024-12-10",
    lastModified: "2024-12-10",
    tags: ["مبيعات", "تسويق", "إنترنت"],
    featured: false
  },
  {
    id: "post-3",
    title: "أساسيات الأمان في المواقع الإلكترونية",
    titleEn: "Website Security Fundamentals",
    content: "الأمان هو أحد أهم الجوانب التي يجب مراعاتها عند إنشاء موقع إلكتروني...",
    author: "محمد علي",
    category: "التقنية",
    categoryEn: "Technology",
    status: "draft",
    comments: 0,
    views: 0,
    publishDate: "",
    lastModified: "2024-12-20",
    tags: ["أمان", "مواقع", "تقنية"],
    featured: false
  },
  {
    id: "post-4",
    title: "دليل شامل لتحسين محركات البحث SEO",
    titleEn: "Complete SEO Optimization Guide",
    content: "تحسين محركات البحث هو عملية مهمة لزيادة ظهور موقعك في نتائج البحث...",
    author: "خالد السعد",
    category: "التسويق الرقمي",
    categoryEn: "Digital Marketing",
    status: "published",
    comments: 22,
    views: 2100,
    publishDate: "2024-12-05",
    lastModified: "2024-12-05",
    tags: ["SEO", "تحسين", "محركات البحث"],
    featured: true
  },
  {
    id: "post-5",
    title: "أهمية تحليل البيانات في اتخاذ القرارات",
    titleEn: "The Importance of Data Analysis in Decision Making",
    content: "تحليل البيانات أصبح ضرورة حتمية في عالم الأعمال الحديث...",
    author: "نورا حسن",
    category: "التحليلات",
    categoryEn: "Analytics",
    status: "published",
    comments: 12,
    views: 1560,
    publishDate: "2024-11-28",
    lastModified: "2024-11-28",
    tags: ["بيانات", "تحليل", "قرارات"],
    featured: false
  }
];

const categories = [
  { id: "cat-1", name: "إدارة الأعمال", nameEn: "Business Management", postsCount: 3 },
  { id: "cat-2", name: "التسويق", nameEn: "Marketing", postsCount: 2 },
  { id: "cat-3", name: "التقنية", nameEn: "Technology", postsCount: 1 },
  { id: "cat-4", name: "التسويق الرقمي", nameEn: "Digital Marketing", postsCount: 1 },
  { id: "cat-5", name: "التحليلات", nameEn: "Analytics", postsCount: 1 }
];

export function BlogPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedPosts, setSelectedPosts] = React.useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [_editingPost, _setEditingPost] = React.useState<string | null>(null);
  const [_editedPost, _setEditedPost] = React.useState<any>(null);
  const [newPost, setNewPost] = React.useState({
    title: "",
    titleEn: "",
    content: "",
    category: "",
    status: "draft",
    featured: false,
    tags: [] as string[],
    author: "المدير"
  });
  const [newTag, setNewTag] = React.useState("");

  // Filter posts based on search and filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || post.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const totalPosts = blogPosts.length;
  const publishedPosts = blogPosts.filter(post => post.status === "published").length;
  const draftPosts = blogPosts.filter(post => post.status === "draft").length;
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const _handleExport = () => {
    toast.success(t("admin.blog.exportSuccess"));
  };

  const handleBulkAction = (action: string) => {
    if (selectedPosts.length === 0) {
      toast.error(t("admin.blog.selectPostsFirst"));
      return;
    }
    
    switch (action) {
      case "publish":
        toast.success(t("admin.blog.bulkPublishSuccess", { count: selectedPosts.length }));
        break;
      case "draft":
        toast.success(t("admin.blog.bulkDraftSuccess", { count: selectedPosts.length }));
        break;
      case "delete":
        toast.success(t("admin.blog.bulkDeleteSuccess", { count: selectedPosts.length }));
        break;
    }
    setSelectedPosts([]);
  };

  const handleCreatePost = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewPost = () => {
    if (!newPost.title.trim()) {
      toast.error(t("admin.blog.titleRequired"));
      return;
    }
    if (!newPost.content.trim()) {
      toast.error(t("admin.blog.contentRequired"));
      return;
    }
    if (!newPost.category) {
      toast.error(t("admin.blog.categoryRequired"));
      return;
    }

    toast.success(t("admin.blog.createSuccess"));
    setIsCreateModalOpen(false);
    resetNewPostForm();
  };

  const resetNewPostForm = () => {
    setNewPost({
      title: "",
      titleEn: "",
      content: "",
      category: "",
      status: "draft",
      featured: false,
      tags: [],
      author: "المدير"
    });
    setNewTag("");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleEditPost = (post: any) => {
    _setEditingPost(post.id);
    _setEditedPost({ ...post });
  };

  const _handleSaveEdit = () => {
    toast.success(t("admin.blog.updateSuccess"));
    _setEditingPost(null);
    _setEditedPost(null);
  };

  const _handleCancelEdit = () => {
    _setEditingPost(null);
    _setEditedPost(null);
  };

  const handleDeletePost = (_postId: string) => {
    toast.success(t("admin.blog.deleteSuccess"));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="bg-green-100 text-green-800">{t("admin.blog.published")}</Badge>;
      case "draft":
        return <Badge variant="secondary">{t("admin.blog.draft")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <BookOpen className="h-6 w-6" />
          {t("admin.blog.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreatePost} className={isRTL ? 'text-left' : 'text-right'}>
                <span>{t("admin.blog.createPost")}</span>
                <Plus className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-3xl ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.blog.createPost")}
                </DialogTitle>
                <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.blog.createPostDescription")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Post Title */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="postTitle" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.postTitle")} *
                  </Label>
                  <Input
                    id="postTitle"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.titlePlaceholder")}
                  />
                </div>

                {/* English Title */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="postTitleEn" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.titleEn")}
                  </Label>
                  <Input
                    id="postTitleEn"
                    value={newPost.titleEn}
                    onChange={(e) => setNewPost(prev => ({ ...prev, titleEn: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.titleEnPlaceholder")}
                  />
                </div>

                {/* Content */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="content" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.content")} *
                  </Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.blog.contentPlaceholder")}
                    rows={8}
                  />
                </div>

                {/* Category */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.category")} *
                  </Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("admin.blog.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {isRTL ? category.name : category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.blog.tags")}
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder={t("admin.blog.addTag")}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button onClick={handleAddTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {newPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
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

                {/* Status and Featured */}
                <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.blog.status")}
                    </Label>
                    <Select value={newPost.status} onValueChange={(value) => setNewPost(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("admin.blog.draft")}</SelectItem>
                        <SelectItem value="published">{t("admin.blog.published")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.blog.featured")}
                    </Label>
                    <div className={`col-span-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Switch
                        checked={newPost.featured}
                        onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {newPost.featured ? t("admin.blog.featured") : t("admin.blog.notFeatured")}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  {t("admin.blog.cancel")}
                </Button>
                <Button onClick={handleSaveNewPost}>
                  {t("admin.blog.createPost")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-2.5 ${isRTL ? 'left-2' : 'right-2'} h-4 w-4 text-gray-500`} />
          <Input
            placeholder={t("admin.blog.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTL ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("admin.blog.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.blog.allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {isRTL ? category.name : category.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Alert>
          <AlertDescription className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t("admin.blog.selectedPosts", { count: selectedPosts.length })}</span>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                {t("admin.blog.publish")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("draft")}>
                {t("admin.blog.draft")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                {t("admin.blog.delete")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.postTitle")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.author")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.category")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.comments")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.publishDate")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.blog.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    <div>
                      <div className="font-semibold">{post.title}</div>
                      {post.featured && (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 mt-1">
                          {t("admin.blog.featured")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-4 w-4 text-gray-500" />
                      {post.author}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(post.status)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      {post.comments}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {post.publishDate || t("admin.blog.notPublished")}
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
                        <DropdownMenuItem onClick={() => navigate(`/admin/blog/${post.id}`)}>
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.blog.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPost(post)}>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.blog.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.blog.delete")}
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
          {t("admin.blog.shownFrom", { shown: filteredPosts.length, total: blogPosts.length })}
        </p>
      </div>
    </div>
  );
}
