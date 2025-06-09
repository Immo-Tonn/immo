import React, { useEffect, useRef } from 'react';
import styles from './HeroSupport.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';

const HeroSupport: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      fadeInOnScroll(ref, { x: 100 });
    }
  }, []);

  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <div className={styles.textWrapper}>
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
