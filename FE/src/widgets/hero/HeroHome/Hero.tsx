import Button from '@shared/ui/Button/Button';
import styles from './HeroHome.module.css';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
const HeroHome = () => {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 50 } : { x: 100, y: -50 },
        );
    });
  }, []);

  return (
    <section className={styles.heroSection}>
      <p className={styles.topText} ref={el => (refs.current[1] = el)}>
        Der richtige Partner für Ihren
        <br />
        Immobilienverkauf
        <br /> im Münsterland
      </p>
      <div className={styles.bottomBar} ref={el => (refs.current[2] = el)}>
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
