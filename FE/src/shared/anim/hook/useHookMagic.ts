import { useEffect } from 'react';
import ScrollMagic from 'scrollmagic';
import { parallaxMouseEffect } from '../animations';

const useHookMagic = () => {
  useEffect(() => {
    const controller = new ScrollMagic.Controller();

    const animations = [
      {
        className: '.parallax',
        tween: parallaxMouseEffect,
      },
    ];

    animations.forEach(({ className, tween }) => {
      new ScrollMagic.Scene({
        triggerElement: className,
      })
        .setTween(tween)
        .addTo(controller);
    });

    return () => controller.destroy(true);
  }, []);

  return null;
};

export default useHookMagic;
