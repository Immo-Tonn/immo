import Button from '@shared/ui/Button/Button';
import styles from './ValuationCTA.module.css';
import valuationPhoto from '@shared/assets/valuation-cta/valuation-photo.svg';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';

const ValuationCTA = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    runningBoxShadow(imgRef);

    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 0 } : { x: 100, y: -50 },
        );
      }
    });
  }, []);

  return (
    <section className={styles.valuationCTASection}>
      <div className={styles.textWrapper} ref={el => (refs.current[0] = el)}>
        <h2 className={styles.firstTitle}>
          <b>
            Viele Eigentümer fragen sich: Was ist meine Immobilie heute wert?
          </b>
        </h2>
        <p className={styles.description}>
          Ob aus Interesse, für eine mögliche Verkaufsentscheidung oder zur
          besseren finanziellen Planung – eine fundierte Wertermittlung schafft
          Sicherheit und Klarheit.
        </p>
        <p className={styles.description}>
          Als erfahrene Partner in der Versicherungs- und Immobilienbranche
          wissen wir bei Immo Tonn, worauf es ankommt: Marktkenntnis und
          persönliche Beratung.
        </p>
      </div>
      <div className={styles.imageWrapper} ref={el => (refs.current[1] = el)}>
        <h1 className={styles.secondTitle}>
          Lassen Sie Ihre Immobilie jetzt bewerten!
        </h1>
        <img
          ref={imgRef}
          src={valuationPhoto}
          alt="valuation-photo"
          style={{ boxShadow: '0 4px 41px 11px rgba(0, 0, 0, 0.25)' }}
        />
      </div>
      <div className={styles.bottomWrapper} ref={el => (refs.current[2] = el)}>
        <h2 className={styles.thirdTitle}>
          warum ist eine professionelle wertermittlung so wichtig?
        </h2>
        <p>
          Der Immobilienmarkt ist ständig in Bewegung. Faktoren wie Inflation,
          Zinssätze und die Lageentwicklung beeinflussen den Wert einer
          Immobilie. Wer verkaufen möchte, braucht eine zuverlässige
          Einschätzung – idealerweise von Experten, die sowohl den Immobilien-
          als auch den Versicherungsmarkt verstehen.
        </p>
      </div>

      <div className={styles.buttonWrapper} ref={el => (refs.current[3] = el)}>
        <Button
          initialText={'Wie viel ist mein Haus wert?'}
          clickedText="Weiterleitung..."
        />
      </div>
    </section>
  );
};

export default ValuationCTA;
