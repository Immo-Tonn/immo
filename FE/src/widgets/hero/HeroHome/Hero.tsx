import Button from '@shared/ui/Button/Button';
import styles from '../HeroHome/HeroHome.module.css';
import { useEffect, useRef } from 'react';
import { parallaxScrolling } from '@shared/anim/animations';
const HeroHome = () => {
  const topText = useRef(null);
  const heroSection = useRef(null);
  const bottomBar = useRef(null);
  useEffect(() => {
    parallaxScrolling(topText, heroSection, bottomBar);
  }, []);
  return (
    <section className={styles.heroSection} ref={heroSection}>
      <p className={styles.topText} ref={topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </p>

      <div className={styles.bottomBar} ref={bottomBar}>
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
