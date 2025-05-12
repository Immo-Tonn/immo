import Button from '@shared/ui/Button/Button';
import styles from './Hero.module.css';
import { useEffect, useRef } from 'react';
import { parallaxScrolling } from '@shared/anim/animations';
const Hero = () => {
  const topText = useRef(null);
  const heroSection = useRef(null);
  const bottomBar = useRef(null);
  const pathRef = useRef();
  useEffect(() => {
    parallaxScrolling(topText, heroSection, bottomBar);
    const path = [
      { x: 100, y: 0 },
      { x: 300, y: 100 },
      { x: 500, y: -100 },
      { x: 700, y: 0 },
    ];
  }, []);
  return (
    <section className={styles.heroSection} ref={heroSection}>
      <p className={styles.topText} ref={topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </p>

      <div className={styles.bottomBar} ref={bottomBar}>
        <div className={styles.buttonWrapper}>
          <Button
            initialText={'Kostenlose\nWertermittlung'}
            addLineBreak
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

export default Hero;
