import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { ParallaxOptions } from './models';
gsap.registerPlugin(ScrollTrigger);

export const parallaxMouseEffect = ({
  wrapperRef,
  targets,
}: ParallaxOptions) => {
  const wrapper = wrapperRef.current;
  if (!wrapper) return;

  const handleMouseMove = (e: MouseEvent) => {
    const { width, height, left, top } = wrapper.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;

    targets.forEach(({ ref, factor = 1 }) => {
      const element = ref.current;
      if (element) {
        gsap.to(element, {
          x: x / factor,
          y: y / factor,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleMouseLeave = () => {
    targets.forEach(({ ref }) => {
      const element = ref.current;
      if (element) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });
  };

  wrapper.addEventListener('mousemove', handleMouseMove);
  wrapper.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    wrapper.removeEventListener('mousemove', handleMouseMove);
    wrapper.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export const fadeInOnScroll = (
  elementRef: { current: HTMLElement | null },
  options: {
    x?: number;
    y?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
    scrub?: boolean;
  },
) => {
  const el = elementRef.current;
  if (!el) return;

  const {
    x = 0,
    y = 0,
    duration = 0.3,
    delay = 0,
    ease = 'sine.inOut',
    start = 'top 30%',
    scrub = false,
  } = options;

  el.style.pointerEvents = 'none';

  gsap.fromTo(
    el,
    {
      opacity: 0,
      x,
      y,
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none reverse',
        scrub,
        onEnter: () => (el.style.pointerEvents = 'auto'),
        onLeaveBack: () => (el.style.pointerEvents = 'none'),
      },
    },
  );
};

export const runningBoxShadow = (ref: any) => {
  const el = ref.current;
  if (!el) return;

  const radius = 10;
  const blur = 40;
  const color = 'rgba(0,0,0,0.5)';
  const duration = 2;

  gsap.to(
    {},
    {
      repeat: -1,
      duration,
      ease: 'linear',
      onUpdate: function () {
        const progress = this.progress();
        const angle = progress * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        el.style.boxShadow = `${x.toFixed(2)}px ${y.toFixed(2)}px ${blur}px ${color}`;
      },
    },
  );
};
