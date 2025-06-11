import Button from '@shared/ui/Button/Button';
import styles from './HeroHome.module.css';
import { Link } from 'react-router-dom';
import { fadeInOnScroll, parallaxMouseEffect } from '@shared/anim/animations';
import { useEffect, useRef } from 'react';
const HeroHome = () => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0
            ? { x: -100, y: 0, duration: 0.85 }
            : { x: 100, y: -50, duration: 0.2 },
        );
      }
    });
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [{ ref: textRef, factor: 2 }],
    });
    return cleanup;
  }, []);
  return (
    <section className={styles.heroSection}>
      <div
        className={styles.heroContentWrapper}
        ref={el => (refs.current[0] = el)}
      >
        <div className={styles.topTextWrapper} ref={wrapperRef}>
          <p className={styles.topText} ref={textRef}>
            Der richtige Partner für Ihren
            <br />
            Immobilienverkauf
            <br />
            im Münsterland
          </p>
        </div>

        <div className={styles.bottomBar} ref={el => (refs.current[2] = el)}>
          <div className={styles.buttonWrapper}>
            <Link to="/wertermittlung">
              <Button
                initialText="Kostenlose Wertermittlung"
                clickedText="Weiterleitung......"
              />
            </Link>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              initialText="direkt anfordern"
              clickedText="Weiterleitung......"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
