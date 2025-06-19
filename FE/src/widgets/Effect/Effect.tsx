import styles from './Effect.module.css';
import effectPhoto from '@shared/assets/effect/effect-photo.webp';
import effectBuild from '@shared/assets/effect/effect-build.webp';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, parallaxMouseEffect } from '@shared/anim/animations';
const Effect = () => {
  const wrapperRef = useRef(null);
  const elem1 = useRef(null);
  const elem2 = useRef(null);
  const elem3 = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { y: -60, x: -120 });
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [
        { ref: elem1, factor: 2 },
        { ref: elem2, factor: 1 },
        { ref: elem3, factor: 2 },
      ],
    });
    return cleanup;
  }, []);
  return (
    <section className={styles.effectSection} ref={ref}>
      <div className={styles.descriptionWrapper}>
        <span className={styles.line}></span>
        <p className={styles.description}>
          Objektstyling ist mehr als Dekoration. Es ist die Kunst, Räume
          lebendig wirken zu lassen. Wir inszenieren Immobilien so, dass sie
          nicht nur schön aussehen <br /> — <br />
          sondern sich wie Zuhause anfühlen. Weil der erste Eindruck keine
          zweite Chance bekommt.
        </p>
      </div>
      <div className={styles.imageWrapper} ref={wrapperRef}>
        <img
          src={effectPhoto}
          alt="effect-photo"
          className={styles.effectPhoto}
          ref={elem1}
        />
        <h2 ref={elem2}>Licht. Perspektive. Wirkung.</h2>
      </div>
      <div className={styles.descriptionWrapper}>
        <p className={styles.description}>
          Mit dem richtigen Blickwinkel und dem Spiel aus Schatten und Licht
          lassen wir Räume größer, wärmer und lebendiger wirken.
          <br /> Jedes Detail wird gezielt inszeniert – damit Ihre Immobilie
          nicht nur im Foto glänzt, sondern beim ersten Schritt über die
          Schwelle begeistert.
          <br />
          Ihre Vorteile auf einen Blick:
          <strong>
            <ul>
              <li>Höhere Sichtbarkeit auf Plattformen</li>
              <li>Mehr Anfragen & schnellere Verkäufe</li>
              <li>Preissteigerung von bis zu 15 %</li>
              <li>Alles aus einer Hand – stilvoll & stressfrei</li>
            </ul>
          </strong>
        </p>
      </div>
      <img src={effectBuild} alt="effect-build" />
    </section>
  );
};
export default Effect;
