import Button from '@shared/ui/Button/Button';
import styles from './HeroHome.module.css';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
const HeroHome = () => {
  const ref = useRef(null);
  useEffect(() => {
    fadeInOnScroll(ref, { y: 100 });
  }, []);

  return (
    <section className={styles.heroSection}>
      <p className={styles.topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </p>
      <div className={styles.bottomBar}>
        <div className={styles.buttonWrapper}>
          <Button
            initialText="Kostenlose Wertermittlung"
            clickedText="Weiterleitung"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button initialText="direkt anfordern" clickedText="Weiterleitung" />
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
