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
    });

    scroll.on('scroll', obj => {
      console.log(obj.scroll.y);
    });

    return () => {
      scroll.destroy();
    };
  }, [containerRef]);
};
