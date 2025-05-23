import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);
export const parallaxMouseEffect = (
  wrapperRef,
  logoRef,
  textRef,
  bottomTextRef,
) => {
  const wrapper = wrapperRef.current;
  const logo = logoRef.current;
  const text = textRef.current;
  const bottomText = bottomTextRef.current;

  if (!wrapper || !logo || !text || !bottomText) return; // without null when function makes return

  const handleMouseMove = e => {
    const { width, height, left, top } = wrapper.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;

    gsap.to(logo, {
      x: x / 1.5,
      y: y / 1.5,
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to(text, { x: x, y: y, duration: 0.4, ease: 'power2.out' });

    gsap.to(bottomText, {
      x: x / 2,
      y: y / 2,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to([logo, text, bottomText], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  wrapper.addEventListener('mousemove', handleMouseMove);
  wrapper.addEventListener('mouseleave', handleMouseLeave);

  // 🧹 Удаляем слушатели при размонтировании
  return () => {
    wrapper.removeEventListener('mousemove', handleMouseMove);
    wrapper.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export const parallaxScrolling = (topText, heroSection, bottomBar) => {
  const text = topText.current;
  const section = heroSection.current;
  const bottom = bottomBar.current;
  // Параллакс текст
  gsap.to(text, {
    yPercent: 60,
    ease: 'circ.inOut',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    },
  });
  gsap.to(bottom, {
    yPercent: 50,
    ease: 'circ.in',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    },
  });
};

export const fadeInOnScroll = (elementRef: { current: HTMLElement | null }) => {
  const el = elementRef.current;

  gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    },
  );
};

export const runningBoxShadow = ref => {
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
