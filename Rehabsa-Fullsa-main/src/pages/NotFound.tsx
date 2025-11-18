import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    setIsAnimating(true);
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Language Switcher in top right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* 404 Animation */}
            <div className={`mb-8 transition-all duration-1000 ${isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="relative inline-block">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  404
                </h1>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>

            {/* Error Message */}
            <div className={`mb-8 transition-all duration-1000 delay-300 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('notFound.message')}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {t('notFound.subtitle')}
              </p>
              <p className="text-sm text-gray-500">
                {t('notFound.pathInfo')}: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{location.pathname}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <Button 
                onClick={handleGoHome}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                {t('notFound.returnHome')}
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t('notFound.goBack')}
              </Button>
              
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t('notFound.refresh')}
              </Button>
            </div>

            {/* Quick Links */}
            <div className={`mt-8 pt-6 border-t border-gray-200 transition-all duration-1000 delay-700 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-sm text-gray-500 mb-4">{t('notFound.popularPages')}:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {t('navigation.home')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/about')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {t('navigation.about')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/contact')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {t('navigation.contact')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/blog')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {t('navigation.blog')}
                </Button>
              </div>
            </div>

            {/* Help Section */}
            <div className={`mt-6 transition-all duration-1000 delay-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-xs text-gray-400">
                {t('notFound.helpText')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
