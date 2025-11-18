import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

// بيانات تجريبية للمدونات
const blogPosts = [
  {
    id: 1,
    title: "مقدمة في تطوير التطبيقات الحديثة",
    excerpt: "تعلم أساسيات تطوير التطبيقات باستخدام أحدث التقنيات والأدوات المتاحة في السوق اليوم.",
    content: "في هذا المقال، سنستكشف أساسيات تطوير التطبيقات الحديثة...",
    author: "أحمد محمد",
    date: "2024-01-15",
    category: "تطوير",
    tags: ["React", "JavaScript", "Frontend"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
    readTime: "5 دقائق"
  },
  {
    id: 2,
    title: "أفضل الممارسات في تصميم واجهات المستخدم",
    excerpt: "اكتشف أهم النصائح والحيل لتصميم واجهات مستخدم جذابة وسهلة الاستخدام.",
    content: "تصميم واجهات المستخدم هو فن وعلم في نفس الوقت...",
    author: "فاطمة علي",
    date: "2024-01-12",
    category: "تصميم",
    tags: ["UI/UX", "Design", "User Experience"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center",
    readTime: "7 دقائق"
  },
  {
    id: 3,
    title: "كيفية تحسين أداء المواقع الإلكترونية",
    excerpt: "تعلم الطرق الفعالة لتحسين سرعة وأداء المواقع الإلكترونية لتحسين تجربة المستخدم.",
    content: "أداء الموقع الإلكتروني عامل حاسم في نجاح أي مشروع رقمي...",
    author: "محمد حسن",
    date: "2024-01-10",
    category: "أداء",
    tags: ["Performance", "Optimization", "Web"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
    readTime: "6 دقائق"
  },
  {
    id: 4,
    title: "مستقبل الذكاء الاصطناعي في التطوير",
    excerpt: "استكشف كيف سيغير الذكاء الاصطناعي مستقبل تطوير البرمجيات والتطبيقات.",
    content: "الذكاء الاصطناعي يثور على عالم التطوير بسرعة مذهلة...",
    author: "سارة أحمد",
    date: "2024-01-08",
    category: "ذكاء اصطناعي",
    tags: ["AI", "Machine Learning", "Future"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center",
    readTime: "8 دقائق"
  },
  {
    id: 5,
    title: "أساسيات الأمان السيبراني للمطورين",
    excerpt: "تعلم أهم مبادئ الأمان السيبراني التي يجب على كل مطور معرفتها.",
    content: "الأمان السيبراني أصبح ضرورة حتمية في عالم التطوير...",
    author: "خالد محمود",
    date: "2024-01-05",
    category: "أمان",
    tags: ["Security", "Cybersecurity", "Best Practices"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center",
    readTime: "9 دقائق"
  },
  {
    id: 6,
    title: "إدارة المشاريع التقنية بنجاح",
    excerpt: "اكتشف أفضل الطرق لإدارة المشاريع التقنية وتحقيق النجاح في التسليم.",
    content: "إدارة المشاريع التقنية تتطلب مهارات خاصة ومختلفة...",
    author: "نور الدين",
    date: "2024-01-03",
    category: "إدارة",
    tags: ["Project Management", "Leadership", "Agile"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center",
    readTime: "6 دقائق"
  },
  {
    id: 7,
    title: "تعلم React من الصفر إلى الاحتراف",
    excerpt: "دليل شامل لتعلم مكتبة React وتطوير تطبيقات ويب تفاعلية حديثة.",
    content: "React هي واحدة من أشهر مكتبات JavaScript لتطوير واجهات المستخدم...",
    author: "علي أحمد",
    date: "2024-01-01",
    category: "تطوير",
    tags: ["React", "JavaScript", "Frontend", "Tutorial"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    readTime: "12 دقيقة"
  },
  {
    id: 8,
    title: "أساسيات قواعد البيانات الحديثة",
    excerpt: "تعلم كيفية تصميم وإدارة قواعد البيانات بكفاءة وأمان.",
    content: "قواعد البيانات هي العمود الفقري لأي تطبيق حديث...",
    author: "مريم السعيد",
    date: "2023-12-28",
    category: "تطوير",
    tags: ["Database", "SQL", "NoSQL", "Backend"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop&crop=center",
    readTime: "10 دقائق"
  },
  {
    id: 9,
    title: "تصميم تجربة المستخدم الرقمية",
    excerpt: "كيفية تصميم تجارب مستخدم متميزة تحقق أهداف العمل وتلبي احتياجات المستخدمين.",
    content: "تصميم تجربة المستخدم يتطلب فهماً عميقاً لسلوك المستخدمين...",
    author: "يوسف محمد",
    date: "2023-12-25",
    category: "تصميم",
    tags: ["UX Design", "User Research", "Prototyping", "Usability"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&crop=center",
    readTime: "8 دقائق"
  },
  {
    id: 10,
    title: "التحول الرقمي في المؤسسات",
    excerpt: "كيفية قيادة التحول الرقمي بنجاح في المؤسسات التقليدية.",
    content: "التحول الرقمي أصبح ضرورة حتمية لبقاء المؤسسات في السوق...",
    author: "رانيا حسن",
    date: "2023-12-22",
    category: "إدارة",
    tags: ["Digital Transformation", "Strategy", "Innovation", "Leadership"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center",
    readTime: "11 دقيقة"
  }
];

const categories = ["الكل", "تطوير", "تصميم", "أداء", "ذكاء اصطناعي", "أمان", "إدارة"];

const Blog = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  // فلترة المدونات حسب البحث والفئة
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "الكل" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop&crop=center" 
            alt="Blog Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground drop-shadow-lg">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 drop-shadow-md">
              {t('blog.subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="ابحث في المدونة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 text-right bg-background/95 backdrop-blur-sm border-border/20 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container-custom">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">لم يتم العثور على مقالات تطابق بحثك</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                    
                    {/* Category overlay */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
                        {post.category}
                      </Badge>
                    </div>
                    
                    {/* Read time overlay */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="outline" className="bg-background/90 text-foreground backdrop-blur-sm">
                        {post.readTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag size={10} className="ml-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {t('blog.readMore')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('blog.newsletter.title')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('blog.newsletter.subtitle')}
            </p>
            
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
              />
              <Button className="btn-primary">
                {t('blog.newsletter.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
