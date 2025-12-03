import React, { useEffect, useMemo, useState } from "react";
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
  MessageSquare,
  Calendar,
  User,
  Tag,
  BookOpen,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  MoreHorizontal,
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
  deleteBlogComment,
  deleteBlogPost,
  fetchBlogPost,
  updateBlogComment,
  type BlogCommentRecord,
  type BlogPostDetails,
} from "@/lib/api";

const estimateReadingTime = (content?: string | null) => {
  if (!content) return 0;
  const words = content.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const [post, setPost] = useState<BlogPostDetails | null>(null);
  const [comments, setComments] = useState<BlogCommentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentAction, setCommentAction] = useState<number | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetchBlogPost(id);
        setPost(response.data);
        setComments(response.data.comments ?? []);
      } catch (error: any) {
        toast.error(error?.message || t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, t]);

  const postStats = useMemo(() => {
    if (!post) return { views: 0, likes: 0, readingTime: 0 };
    const views = (post as any).views ?? (post as any).views_count ?? 0;
    const likes = (post as any).likes ?? (post as any).likes_count ?? 0;
    const readingTime = estimateReadingTime(post.content);
    return { views, likes, readingTime };
  }, [post]);

  const handleApproveComment = async (commentId: number) => {
    setCommentAction(commentId);
    try {
      await updateBlogComment(commentId, "approved");
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, status: "approved" } : comment)));
      toast.success(t("admin.blog.commentApproved"));
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setCommentAction(null);
    }
  };

  const handleRejectComment = async (commentId: number) => {
    setCommentAction(commentId);
    try {
      await updateBlogComment(commentId, "rejected");
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, status: "rejected" } : comment)));
      toast.success(t("admin.blog.commentRejected"));
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setCommentAction(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm(t("admin.blog.commentDeleteConfirm") ?? t("admin.blog.delete"))) return;
    setCommentAction(commentId);
    try {
      await deleteBlogComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success(t("admin.blog.commentDeleted"));
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setCommentAction(null);
    }
  };

  const handleEditPost = () => {
    if (!post) return;
    navigate("/admin/blog", { state: { editPostId: post.id } });
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm(t("admin.blog.deletePostConfirm") ?? t("admin.blog.delete"))) return;
    setIsDeletingPost(true);
    try {
      await deleteBlogPost(post.id);
      toast.success(t("admin.blog.deleteSuccess"));
      navigate("/admin/blog");
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsDeletingPost(false);
    }
  };

  const getCommentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">{t("admin.blog.approved")}</Badge>;
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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {t("common.noData")}
      </div>
    );
  }

  return (
    <div className={`flex flex-1 flex-col gap-4 p-4 w-full ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/blog")}
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin.blog.backToBlog")}
        </Button>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
          <Button onClick={handleEditPost} className={isRTL ? "text-left" : "text-right"}>
            <Edit className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
            {t("admin.blog.edit")}
          </Button>
          <Button variant="outline" onClick={handleDeletePost} className="text-red-600 hover:text-red-700">
            {isDeletingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            {t("admin.blog.delete")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="flex-1">
                  <CardTitle className={`text-2xl mb-2 ${isRTL ? "text-right" : "text-left"}`}>{post.title}</CardTitle>
                  <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{post.author?.name ?? "-"}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatDate(post.published_at)}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {postStats.readingTime} {t("admin.blog.minutes")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex flex-col gap-2 ${isRTL ? "items-start" : "items-end"}`}>
                  <Badge variant="outline">{isRTL ? post.category?.name_ar ?? "-" : post.category?.name_en ?? "-"}</Badge>
                  {post.is_featured && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {t("admin.blog.featured")}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Tag className="h-4 w-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div
                className={`prose max-w-none ${isRTL ? "text-right" : "text-left"}`}
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? "text-right" : "text-left"}`}>
                <MessageSquare className="h-5 w-5" />
                {t("admin.blog.comments")} ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 && (
                <div className="text-sm text-muted-foreground">{t("admin.blog.noComments")}</div>
              )}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{comment.author_name}</span>
                        <span className="text-sm text-gray-500">({comment.author_email})</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {getCommentStatusIcon(comment.status)}
                        {getCommentStatusBadge(comment.status)}
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${isRTL ? "text-right" : "text-left"}`}>{comment.content}</p>
                    <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                        <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <ThumbsUp className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{comment.likes ?? 0}</span>
                        </div>
                        {comment.replies_count ? (
                          <span className="text-xs text-gray-500">
                            {comment.replies_count} {t("admin.blog.replies")}
                          </span>
                        ) : null}
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
                            <DropdownMenuItem
                              onSelect={() => handleApproveComment(comment.id)}
                              disabled={commentAction === comment.id}
                            >
                              <CheckCircle className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.blog.approve")}
                            </DropdownMenuItem>
                          )}
                          {comment.status !== "rejected" && (
                            <DropdownMenuItem
                              onSelect={() => handleRejectComment(comment.id)}
                              disabled={commentAction === comment.id}
                            >
                              <XCircle className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
                              {t("admin.blog.reject")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() => handleDeleteComment(comment.id)}
                            disabled={commentAction === comment.id}
                          >
                            <Trash2 className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={`text-lg ${isRTL ? "text-right" : "text-left"}`}>
                {t("admin.blog.postInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{t("admin.blog.status")}</span>
                <span>{post.status === "published" ? t("admin.blog.published") : t("admin.blog.draft")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("admin.blog.views")}</span>
                <span>{postStats.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("admin.blog.likes")}</span>
                <span>{postStats.likes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("admin.blog.comments")}</span>
                <span>{comments.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
