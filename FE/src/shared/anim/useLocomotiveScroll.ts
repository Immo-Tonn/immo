import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export const useLocomotiveScroll = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,

      smoothMobile: true, // Плавная прокрутка на мобильных устройствах
      tablet: { smooth: true }, // Для планшетов
    });

    scroll.on('scroll', obj => {
      console.log(obj.scroll.y);
    });

    // Обновить прокрутку, если содержимое изменяется или появляется новый контент
    const updateScroll = () => {
      scroll.update();
    };

    // Для динамически изменяемого контента
    window.addEventListener('resize', updateScroll);
    window.addEventListener('load', updateScroll);

    return () => {
      scroll.destroy();
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('load', updateScroll);
    };
  }, [containerRef]);
};
