import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Tag,
  BookOpen,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Clock,
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

// Mock data for blog post details
const blogPostDetails = {
  id: "post-1",
  title: "أفضل الممارسات في إدارة المتاجر الإلكترونية",
  titleEn: "Best Practices for E-commerce Store Management",
  content: `
    <h2>مقدمة</h2>
    <p>في عالم التجارة الإلكترونية المتطور، أصبحت إدارة المتاجر الإلكترونية أمراً بالغ الأهمية لنجاح أي عمل تجاري. في هذا المقال، سنستعرض أفضل الممارسات التي يجب اتباعها عند إدارة المتاجر الإلكترونية.</p>
    
    <h3>1. تحسين تجربة المستخدم</h3>
    <p>تجربة المستخدم هي العامل الأساسي في نجاح أي متجر إلكتروني. يجب أن يكون الموقع سهل الاستخدام، سريع التحميل، ومتوافق مع جميع الأجهزة.</p>
    
    <h3>2. إدارة المخزون</h3>
    <p>إدارة المخزون بشكل صحيح يساعد في تجنب نفاد المنتجات أو تراكمها. استخدم أنظمة إدارة المخزون المتقدمة لتتبع المنتجات بدقة.</p>
    
    <h3>3. التسويق الرقمي</h3>
    <p>استخدم استراتيجيات التسويق الرقمي المختلفة مثل تحسين محركات البحث (SEO) والتسويق عبر وسائل التواصل الاجتماعي لزيادة الوصول للعملاء.</p>
    
    <h3>4. خدمة العملاء</h3>
    <p>قدم خدمة عملاء ممتازة من خلال قنوات متعددة مثل الدردشة المباشرة والبريد الإلكتروني والهاتف.</p>
    
    <h3>الخلاصة</h3>
    <p>إدارة المتاجر الإلكترونية تتطلب تخطيطاً دقيقاً وتنفيذاً احترافياً. اتباع هذه الممارسات سيساعدك في بناء متجر إلكتروني ناجح ومربح.</p>
  `,
  author: "أحمد محمد",
  authorEmail: "ahmed@example.com",
  category: "إدارة الأعمال",
  categoryEn: "Business Management",
  status: "published",
  views: 1250,
  comments: 15,
  likes: 89,
  publishDate: "2024-12-15",
  lastModified: "2024-12-15",
  tags: ["إدارة", "متاجر", "نصائح", "تجارة إلكترونية"],
  featured: true,
  readingTime: "8 دقائق"
};

const comments = [
  {
    id: "comment-1",
    author: "محمد علي",
    email: "mohammed@example.com",
    content: "مقال رائع ومفيد جداً. شكراً لك على هذه النصائح القيمة.",
    status: "approved",
    date: "2024-12-16",
    likes: 5,
    replies: 2
  },
  {
    id: "comment-2",
    author: "فاطمة أحمد",
    email: "fatima@example.com",
    content: "هل يمكنك كتابة مقال عن التسويق عبر وسائل التواصل الاجتماعي؟",
    status: "pending",
    date: "2024-12-16",
    likes: 2,
    replies: 0
  },
  {
    id: "comment-3",
    author: "خالد السعد",
    email: "khalid@example.com",
    content: "أعتقد أن إدارة المخزون هي التحدي الأكبر في التجارة الإلكترونية.",
    status: "approved",
    date: "2024-12-17",
    likes: 8,
    replies: 1
  },
  {
    id: "comment-4",
    author: "نورا حسن",
    email: "nora@example.com",
    content: "مقال ممتاز! استفدت كثيراً من النصائح المذكورة.",
    status: "rejected",
    date: "2024-12-17",
    likes: 1,
    replies: 0
  }
];

export function BlogDetailsPage() {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const handleApproveComment = (_commentId: string) => {
    toast.success(t("admin.blog.commentApproved"));
  };

  const handleRejectComment = (_commentId: string) => {
    toast.success(t("admin.blog.commentRejected"));
  };

  const handleDeleteComment = (_commentId: string) => {
    toast.success(t("admin.blog.commentDeleted"));
  };

  const handleEditPost = () => {
    toast.success(t("admin.blog.editPost"));
  };

  const handleDeletePost = () => {
    toast.success(t("admin.blog.deletePost"));
  };

  const getCommentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">{t("admin.blog.approved")}</Badge>;
      case "pending":
        return <Badge variant="secondary">{t("admin.blog.pending")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("admin.blog.rejected")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCommentStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-1 flex-col gap-4 p-4 w-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Button variant="outline" onClick={() => navigate("/admin/blog")} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <ArrowLeft className="h-4 w-4" />
          {t("admin.blog.backToBlog")}
        </Button>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button onClick={handleEditPost} className={isRTL ? 'text-left' : 'text-right'}>
            <Edit className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            {t("admin.blog.edit")}
          </Button>
          <Button variant="outline" onClick={handleDeletePost} className="text-red-600 hover:text-red-700">
            <Trash2 className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            {t("admin.blog.delete")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <CardTitle className={`text-2xl mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {blogPostDetails.title}
                  </CardTitle>
                  <CardTitle className={`text-lg text-gray-600 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {blogPostDetails.titleEn}
                  </CardTitle>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{blogPostDetails.author}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{blogPostDetails.publishDate}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{blogPostDetails.readingTime}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex flex-col gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
                  <Badge variant="outline">{blogPostDetails.category}</Badge>
                  {blogPostDetails.featured && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {t("admin.blog.featured")}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Tag className="h-4 w-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {blogPostDetails.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div 
                className={`prose max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{ __html: blogPostDetails.content }}
              />
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <MessageSquare className="h-5 w-5" />
                {t("admin.blog.comments")} ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-sm text-gray-500">({comment.email})</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {getCommentStatusIcon(comment.status)}
                        {getCommentStatusBadge(comment.status)}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {comment.content}
                    </p>
                    
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <ThumbsUp className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{comment.likes}</span>
                        </div>
                        {comment.replies > 0 && (
                          <span className="text-xs text-gray-500">
                            {comment.replies} {t("admin.blog.replies")}
                          </span>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                          <DropdownMenuLabel>{t("admin.blog.actions")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {comment.status !== "approved" && (
                            <DropdownMenuItem onClick={() => handleApproveComment(comment.id)}>
                              <CheckCircle className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                              {t("admin.blog.approve")}
                            </DropdownMenuItem>
                          )}
                          {comment.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => handleRejectComment(comment.id)}>
                              <XCircle className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                              {t("admin.blog.reject")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.blog.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Stats */}
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.blog.postStats")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{t("admin.blog.views")}</span>
                </div>
                <span className="font-semibold">{blogPostDetails.views}</span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{t("admin.blog.comments")}</span>
                </div>
                <span className="font-semibold">{blogPostDetails.comments}</span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ThumbsUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{t("admin.blog.likes")}</span>
                </div>
                <span className="font-semibold">{blogPostDetails.likes}</span>
              </div>
            </CardContent>
          </Card>

          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.blog.postInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.status")}</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {t("admin.blog.published")}
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.category")}</span>
                <Badge variant="outline">{blogPostDetails.category}</Badge>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.publishDate")}</span>
                <span className="text-sm">{blogPostDetails.publishDate}</span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.lastModified")}</span>
                <span className="text-sm">{blogPostDetails.lastModified}</span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.readingTime")}</span>
                <span className="text-sm">{blogPostDetails.readingTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Comment Stats */}
          <Card>
            <CardHeader>
              <CardTitle className={`${isRTL ? 'text-right' : 'text-left'}`}>
                {t("admin.blog.commentStats")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.approved")}</span>
                <span className="font-semibold text-green-600">
                  {comments.filter(c => c.status === "approved").length}
                </span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.pending")}</span>
                <span className="font-semibold text-yellow-600">
                  {comments.filter(c => c.status === "pending").length}
                </span>
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-gray-600">{t("admin.blog.rejected")}</span>
                <span className="font-semibold text-red-600">
                  {comments.filter(c => c.status === "rejected").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
