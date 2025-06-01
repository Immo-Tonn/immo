import { useEffect, useRef } from 'react';
import styles from './Competence.module.css';
import lightBuilding from '@shared/assets/competence/light-bulding.webp';
import { fadeInOnScroll } from '@shared/anim/animations';
const Competence = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 0 } : { x: 150, y: -150 },
        );
      }
    });
  }, []);
  return (
    <section className={styles.competenceSection}>
      <h2 className={styles.firstTitle} ref={el => (refs.current[0] = el)}>
        Vertrauen durch Kompetenz
      </h2>
      <span className={styles.line}></span>
      <p ref={el => (refs.current[1] = el)}>
        Unsere Kunden besitzen nicht nur Immobilien – sie sind oft auch bei uns
        versichert. Das heißt: Wir kennen ihre Situation, ihre Immobilie und
        ihre Bedürfnisse.
      </p>
      <p ref={el => (refs.current[2] = el)}>
        Genau darin liegt unser Vorteil: Wir kombinieren Wissen aus zwei Welten
        – Immobilienbewertung und Versicherungsberatung – für eine ganzheitliche
        Betreuung.
      </p>

      <img
        src={lightBuilding}
        alt="light-house"
        ref={el => (refs.current[3] = el)}
      />

      <div className={styles.titleWrapper}>
        <h2 className={styles.secondTitle} ref={el => (refs.current[4] = el)}>
           Jetzt unverbindlich anfragen – Ihr Immo Tonn Team ist für Sie da!
        </h2>
      </div>
    </section>
  );
};

export default Competence;
