import { fadeInOnScroll } from '@shared/anim/animations';
import styles from './HeroObject.module.css';
import { useEffect, useRef } from 'react';

const HeroObject = () => {
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { y: 50, x: -120 });
  }, []);
  return (
    <section className={styles.objectSection} ref={ref}>
      <h1 className={styles.firstTitle}>ÄSTHETIK TRIFFT EMOTION</h1>
    </section>
  );
};

export default HeroObject;
