import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  User,
  Building,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Map } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("يرجى إدخال بريد إلكتروني صحيح"),
  company: z.string().optional(),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  subject: z.string().min(1, "الموضوع مطلوب"),
  message: z.string().min(1, "الرسالة مطلوبة").min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  const { t: _t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Contact form data:", data);
      setIsSubmitted(true);
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      reset();
    } catch {
      toast.error("حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "الهاتف",
      value: "+966 55 992 3942",
      description: "متاح من السبت إلى الخميس",
      link: "tel:+966559923942"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "البريد الإلكتروني",
      value: "info@bookk.com",
      description: "نرد خلال 24 ساعة",
      link: "mailto:info@bookk.com"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "الموقع",
      value: "مكة المكرمة، المملكة العربية السعودية",
      description: "مكتبنا الرئيسي",
      link: "https://maps.google.com/?q=Mecca,Saudi+Arabia"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "ساعات العمل",
      value: "السبت - الخميس: 9:00 ص - 6:00 م",
      description: "الجمعة: مغلق",
      link: null
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Success Message */}
        <section className="pt-24 pb-16">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4 text-foreground">
                شكراً لك!
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                تم إرسال رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn-primary px-8 py-3"
                >
                  إرسال رسالة أخرى
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3"
                >
                  العودة للرئيسية
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(68, 117, 149, 0.1)' }}></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              تواصل معنا
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              نحن هنا لمساعدتك! تواصل معنا للحصول على الدعم أو الاستفسارات حول خدماتنا
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  معلومات التواصل
                </h2>
                <p className="text-muted-foreground text-lg">
                  نحن متاحون لمساعدتك في أي وقت. اختر الطريقة المناسبة للتواصل معنا.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(68, 117, 149, 0.1)', color: '#447595' }}>
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a 
                              href={info.link}
                              className="font-medium transition-colors"
                              style={{ color: '#447595' }}
                              onMouseEnter={(e) => e.target.style.color = 'rgba(68, 117, 149, 0.8)'}
                              onMouseLeave={(e) => e.target.style.color = '#447595'}
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-foreground font-medium">
                              {info.value}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Contact */}
              <Card style={{ background: 'linear-gradient(135deg, rgba(68, 117, 149, 0.05), rgba(68, 117, 149, 0.1))', borderColor: 'rgba(68, 117, 149, 0.2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MessageCircle className="h-5 w-5" style={{ color: '#447595' }} />
                    تواصل سريع
                  </CardTitle>
                  <CardDescription>
                    للحصول على استجابة فورية، اتصل بنا مباشرة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+966559923942"
                    className="w-full flex items-center justify-center gap-2 py-3 text-white font-medium rounded-md transition-colors"
                    style={{ backgroundColor: '#447595' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(68, 117, 149, 0.9)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#447595'}
                  >
                    <Phone className="h-4 w-4" />
                    اتصل الآن: +966 55 992 3942
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    أرسل لنا رسالة
                  </CardTitle>
                  <CardDescription>
                    املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        الاسم الكامل *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          className="pl-10"
                          {...register("name")}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        البريد الإلكتروني *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          className="pl-10"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Company Field */}
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        الشركة (اختياري)
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="أدخل اسم الشركة"
                          className="pl-10"
                          {...register("company")}
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        رقم الهاتف *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="أدخل رقم هاتفك"
                          className="pl-10"
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        الموضوع *
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="أدخل موضوع الرسالة"
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        الرسالة *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="اكتب رسالتك هنا..."
                        className="min-h-[120px] resize-none"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full py-3 text-white font-medium"
                      style={{ backgroundColor: '#447595' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(68, 117, 149, 0.9)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#447595'}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              موقعنا في مكة المكرمة
            </h2>
            <p className="text-muted-foreground text-lg">
              نحن موجودون في قلب مكة المكرمة لخدمتك
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <Map 
                  center={[21.3891, 39.8579]} // مكة المكرمة coordinates
                  zoom={15}
                  height="400px"
                />
                <div className="absolute top-4 right-4 z-[1000]">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/90 hover:bg-white shadow-md"
                    onClick={() => window.open('https://maps.google.com/?q=Mecca,Saudi+Arabia', '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    عرض على خرائط جوجل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};
