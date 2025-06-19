import React from 'react';
import styles from './HeroSupport.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useEffect, useRef } from 'react';
interface HeaderSectionProps {
  isMobile: boolean;
}

const HeroSupport: React.FC<HeaderSectionProps> = ({ isMobile }) => {
  const ref = useRef(null);
  useEffect(() => {
    fadeInOnScroll(ref, { x: 100 });
  }, []);
  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <div className={styles.textWrapper}>
        <div
          className={`${styles.textOverlay} ${isMobile ? styles.textOverlayMobile : ''}`}
        >
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
