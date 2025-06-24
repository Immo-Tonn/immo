import { useEffect, useRef } from 'react';
import styles from './HeroValuation.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';

const HeroValuation = () => {
  const ref = useRef(null);
  useEffect(() => {
    fadeInOnScroll(ref, { x: 100 });
  }, []);
  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <p>
        Immobilienbewertung mit Immo Tonn – Wir kennen den Wert Ihres Zuhauses
      </p>
      <div className={styles.contentWrapper}>
        <div className={styles.textWrapper}>
          <p>Immobilienbewertung mit Herz und Verstand</p>
        </div>
      </div>
    </section>
  );
};

export default HeroValuation;
