import { useRef } from 'react';
import { useLocomotiveScroll } from '@shared/anim/useLocomotiveScroll';

export const ScrollLayout = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLocomotiveScroll(containerRef);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-screen bg-white"
    >
      {children}
    </div>
  );
};
