import { useLayoutEffect, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './scrollauto.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // прокрутка при переходе по маршрутам
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  // Отслеживание прокрутки. Если скролл>0,99 высоты окна, кнопка Visible
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      setIsVisible(scrollY > 0.99 * vh);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`stt stt__block_black ${isVisible ? 'stt__active' : ''}`}
      onClick={scrollToTop}
    ></div>
  );
};

export default ScrollToTop;
