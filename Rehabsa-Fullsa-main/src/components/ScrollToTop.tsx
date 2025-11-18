import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // الانتقال إلى أعلى الصفحة عند تغيير المسار
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
