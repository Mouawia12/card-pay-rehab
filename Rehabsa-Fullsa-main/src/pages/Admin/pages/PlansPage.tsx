import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CreditCard,
  Check,
  X,
  Save,
  MoreHorizontal,
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
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    id: "plan-1",
    name: "الأساسية",
    description: "خطة مناسبة للشركات الصغيرة والمتاجر الناشئة",
    monthlyPrice: 199,
    yearlyPrice: 1990, // 10% discount
    currency: "SAR",
    features: [
      "1 نوع بطاقة",
      "1 مدير",
      "1 فرع",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني"
    ],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 1000
    },
    isActive: true,
    subscribers: 45,
    revenue: "SAR 8,955"
  },
  {
    id: "plan-2",
    name: "المتقدمة",
    description: "خطة شاملة للشركات المتوسطة",
    monthlyPrice: 299,
    yearlyPrice: 2990, // 10% discount
    currency: "SAR",
    features: [
      "3 أنواع بطاقات",
      "3 مدراء",
      "2-3 فروع",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني متقدم",
      "تقارير مفصلة"
    ],
    limitations: {
      cardTypes: 3,
      managers: 3,
      branches: 3,
      maxCustomers: 5000
    },
    isActive: true,
    subscribers: 35,
    revenue: "SAR 10,465"
  },
  {
    id: "plan-3",
    name: "المميزة",
    description: "خطة متقدمة للشركات الكبيرة",
    monthlyPrice: 499,
    yearlyPrice: 4990, // 10% discount
    currency: "SAR",
    features: [
      "10 أنواع بطاقات",
      "50 مدير",
      "فروع غير محدودة",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني مخصص",
      "تقارير متقدمة",
      "API مخصص"
    ],
    limitations: {
      cardTypes: 10,
      managers: 50,
      branches: -1, // unlimited
      maxCustomers: -1 // unlimited
    },
    isActive: true,
    subscribers: 20,
    revenue: "SAR 9,980"
  },
  {
    id: "plan-4",
    name: "تجريبي",
    description: "خطة تجريبية مجانية لمدة شهر",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "SAR",
    features: [
      "1 نوع بطاقة",
      "1 مدير",
      "1 فرع",
      "بطاقات محدودة (100)",
      "إشعارات محدودة",
      "دعم أساسي"
    ],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 100
    },
    isActive: true,
    subscribers: 15,
    revenue: "SAR 0"
  }
];

export function PlansPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [editingPlan, setEditingPlan] = React.useState<string | null>(null);
  const [editedPlan, setEditedPlan] = React.useState<any>(null);
  const [showAddFeature, setShowAddFeature] = React.useState<string | null>(null);
  const [newFeature, setNewFeature] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newPlan, setNewPlan] = React.useState({
    name: "",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "SAR",
    features: [] as string[],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 1000
    },
    isActive: true
  });
  const [newFeatureInput, setNewFeatureInput] = React.useState("");

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan.id);
    setEditedPlan({ ...plan });
  };

  const handleSavePlan = () => {
    toast.success(t("admin.plans.updateSuccess"));
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const handleDeletePlan = (_planId: string) => {
    toast.success(t("admin.plans.deleteSuccess"));
  };

  const handleCreatePlan = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewPlan = () => {
    if (!newPlan.name.trim()) {
      toast.error(t("admin.plans.nameRequired"));
      return;
    }
    if (!newPlan.description.trim()) {
      toast.error(t("admin.plans.descriptionRequired"));
      return;
    }
    if (newPlan.monthlyPrice <= 0) {
      toast.error(t("admin.plans.monthlyPriceRequired"));
      return;
    }
    if (newPlan.yearlyPrice <= 0) {
      toast.error(t("admin.plans.yearlyPriceRequired"));
      return;
    }
    if (newPlan.features.length === 0) {
      toast.error(t("admin.plans.featuresRequired"));
      return;
    }

    // هنا يمكن إضافة منطق حفظ الخطة الجديدة
    toast.success(t("admin.plans.createSuccess"));
    setIsCreateModalOpen(false);
    resetNewPlanForm();
  };

  const resetNewPlanForm = () => {
    setNewPlan({
      name: "",
      description: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "SAR",
      features: [],
      limitations: {
        cardTypes: 1,
        managers: 1,
        branches: 1,
        maxCustomers: 1000
      },
      isActive: true
    });
    setNewFeatureInput("");
  };

  const handleAddFeatureToNewPlan = () => {
    if (newFeatureInput.trim()) {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeatureInput.trim()]
      }));
      setNewFeatureInput("");
    }
  };

  const handleRemoveFeatureFromNewPlan = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = (_planId: string) => {
    if (newFeature.trim()) {
      setEditedPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
      setShowAddFeature(null);
    }
  };

  const handleRemoveFeature = (_planId: string, featureIndex: number) => {
    setEditedPlan(prev => ({
      ...prev,
      features: prev.features.filter((_: any, index: number) => index !== featureIndex)
    }));
  };

  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const totalRevenue = plans.reduce((sum, plan) => {
    const revenue = parseFloat(plan.revenue.replace(/[^\d.]/g, ''));
    return sum + revenue;
  }, 0);

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Shield className="h-6 w-6" />
          {t("admin.plans.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreatePlan} className={isRTL ? 'text-left' : 'text-right'}>
                <span>{t("admin.plans.createPlan")}</span>
                <Plus className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-2xl ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.plans.createPlan")}
                </DialogTitle>
                <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
                  {t("admin.plans.createPlanDescription")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Plan Name */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="planName" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.plans.planName")} *
                  </Label>
                  <Input
                    id="planName"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.plans.planNamePlaceholder")}
                  />
                </div>

                {/* Description */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label htmlFor="description" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.plans.description")} *
                  </Label>
                  <Textarea
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    className={`col-span-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t("admin.plans.descriptionPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* Prices */}
                <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label htmlFor="monthlyPrice" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.plans.monthlyPrice")} *
                    </Label>
                    <div className={`col-span-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        id="monthlyPrice"
                        type="number"
                        value={newPlan.monthlyPrice}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, monthlyPrice: parseInt(e.target.value) || 0 }))}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                        min="0"
                      />
                      <span className="text-sm text-gray-600">{newPlan.currency}</span>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label htmlFor="yearlyPrice" className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("admin.plans.yearlyPrice")} *
                    </Label>
                    <div className={`col-span-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        id="yearlyPrice"
                        type="number"
                        value={newPlan.yearlyPrice}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, yearlyPrice: parseInt(e.target.value) || 0 }))}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                        min="0"
                      />
                      <span className="text-sm text-gray-600">{newPlan.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.plans.features")} *
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        placeholder={t("admin.plans.addFeature")}
                        className={`${isRTL ? 'text-right' : 'text-left'}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeatureToNewPlan()}
                      />
                      <Button onClick={handleAddFeatureToNewPlan} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {newPlan.features.map((feature, index) => (
                        <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm flex-1">{feature}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFeatureFromNewPlan(index)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Limitations */}
                <div className={`grid grid-cols-4 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.plans.limitations")}
                  </Label>
                  <div className={`col-span-3 grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`grid grid-cols-2 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label htmlFor="cardTypes" className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.plans.cardTypes")}
                      </Label>
                      <Input
                        id="cardTypes"
                        type="number"
                        value={newPlan.limitations.cardTypes}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          limitations: { ...prev.limitations, cardTypes: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                      />
                    </div>
                    
                    <div className={`grid grid-cols-2 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label htmlFor="managers" className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.plans.managers")}
                      </Label>
                      <Input
                        id="managers"
                        type="number"
                        value={newPlan.limitations.managers}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          limitations: { ...prev.limitations, managers: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                      />
                    </div>
                    
                    <div className={`grid grid-cols-2 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label htmlFor="branches" className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.plans.branches")}
                      </Label>
                      <Input
                        id="branches"
                        type="number"
                        value={newPlan.limitations.branches}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          limitations: { ...prev.limitations, branches: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                      />
                    </div>
                    
                    <div className={`grid grid-cols-2 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label htmlFor="maxCustomers" className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t("admin.plans.maxCustomers")}
                      </Label>
                      <Input
                        id="maxCustomers"
                        type="number"
                        value={newPlan.limitations.maxCustomers}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          limitations: { ...prev.limitations, maxCustomers: parseInt(e.target.value) || 1000 }
                        }))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Status */}
                <div className={`grid grid-cols-4 items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("admin.plans.status")}
                  </Label>
                  <div className={`col-span-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Switch
                      id="isActive"
                      checked={newPlan.isActive}
                      onCheckedChange={(checked) => setNewPlan(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive" className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      {newPlan.isActive ? t("admin.plans.active") : t("admin.plans.inactive")}
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  {t("admin.plans.cancel")}
                </Button>
                <Button onClick={handleSaveNewPlan}>
                  {t("admin.plans.createPlan")}
          </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title={t("admin.plans.totalPlans")}
          value={plans.length}
          icon={Shield}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.plans.totalSubscribers")}
          value={totalSubscribers}
          icon={Users}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.plans.totalRevenue")}
          value={`SAR ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.plans.activePlans")}
          value={plans.filter(plan => plan.isActive).length}
          icon={CreditCard}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Plans Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.planName")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.description")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.monthlyPrice")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.yearlyPrice")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.features")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.subscribers")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.status")}
                </TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>
                  {t("admin.plans.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
        {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                  {editingPlan === plan.id ? (
                    <Input
                      value={editedPlan?.name || plan.name}
                      onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
                        className="font-bold w-full"
                    />
                  ) : (
                    plan.name
                  )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <Textarea
                        value={editedPlan?.description || plan.description}
                        onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })}
                        className="w-full min-w-[200px]"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-[200px]">
                        <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Input
                          type="number"
                          value={editedPlan?.monthlyPrice || plan.monthlyPrice}
                          onChange={(e) => setEditedPlan({ ...editedPlan, monthlyPrice: parseInt(e.target.value) })}
                          className="w-20"
                        />
                        <span className="text-sm">{plan.currency}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold">{plan.monthlyPrice}</span>
                        <span className="text-sm text-gray-600">{plan.currency}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Input
                          type="number"
                          value={editedPlan?.yearlyPrice || plan.yearlyPrice}
                          onChange={(e) => setEditedPlan({ ...editedPlan, yearlyPrice: parseInt(e.target.value) })}
                          className="w-20"
                        />
                        <span className="text-sm">{plan.currency}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold">{plan.yearlyPrice}</span>
                        <span className="text-sm text-gray-600">{plan.currency}</span>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                          {t("admin.plans.yearlyDiscount")}
                  </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className="max-w-[300px]">
                      {editingPlan === plan.id ? (
                        <div className="space-y-2">
                          <div className="space-y-1">
                            {(editedPlan?.features || plan.features).map((feature: string, index: number) => (
                              <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                <span className="text-xs">{feature}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveFeature(plan.id, index)}
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {showAddFeature === plan.id ? (
                            <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Input
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder={t("admin.plans.addFeature")}
                                className="text-xs"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddFeature(plan.id)}
                              />
                      <Button
                        size="sm"
                                onClick={() => handleAddFeature(plan.id)}
                                className="h-6 px-2"
                      >
                                <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                                onClick={() => setShowAddFeature(null)}
                                className="h-6 px-2"
                      >
                                <X className="h-3 w-3" />
                      </Button>
                    </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowAddFeature(plan.id)}
                              className="text-xs h-6"
                            >
                              <Plus className={`h-3 w-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                              {t("admin.plans.addFeature")}
                            </Button>
                  )}
                </div>
                      ) : (
                        <div className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span className="text-xs">{feature}</span>
              </div>
                          ))}
                          {plan.features.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{plan.features.length - 3} {t("admin.plans.moreFeatures")}
                </p>
              )}
                  </div>
                )}
              </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{plan.subscribers}</span>
              </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? t("admin.plans.active") : t("admin.plans.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuLabel>{t("admin.plans.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                          <Edit className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.plans.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                          {t("admin.plans.view")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {editingPlan === plan.id ? (
                          <>
                            <DropdownMenuItem onClick={handleSavePlan}>
                              <Save className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    {t("admin.plans.save")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCancelEdit}>
                              <X className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    {t("admin.plans.cancel")}
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                            {t("admin.plans.delete")}
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
