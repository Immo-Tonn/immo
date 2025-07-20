import React, { useEffect, useRef } from 'react';
import styles from './HeroSupport.module.css';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';

const HeroSupport: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    runningBoxShadow(imgRef);
    if (ref.current) {
      fadeInOnScroll(ref, { x: 100 });
    }
  }, []);

  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <div className={styles.textWrapper} ref={imgRef}>
        <div className={styles.textOverlay}>
          <p>
            verkaufssupport - mehr als <br />
            nur vermittlung - rundum-service vom <br />
            profi
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSupport;
