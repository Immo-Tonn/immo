import Button from '@shared/ui/Button/Button';
import styles from './HowIsGoing.module.css';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
const HowIsGoing = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { y: 100 } : { y: -150 },
        );
      }
    });
  }, []);
  return (
    <section className={styles.howIsGoingSection}>
      <div className={styles.textBlock} ref={el => (refs.current[0] = el)}>
        <h3>Was wir bei der Bewertung berücksichtigen:</h3>
        <div className={styles.listWrapper} ref={el => (refs.current[1] = el)}>
          <ul>
            <li>Aktuelle Markt- und Nachfragesituation</li>
            <li>Lage und Mikrolage der Immobilien</li>
            <li>Baujahr, Zustand, Ausstattung</li>
            <li>Vergleichswerte ähnlicher Objekte</li>
            <li>Potenziale für Modernisierung oder energetische Sanierung</li>
          </ul>
        </div>
        <h3>Wie läuft die Bewertung ab?</h3>
        <div className={styles.listWrapper} ref={el => (refs.current[2] = el)}>
          <ol>
            <li>Unverbindliches Erstgespräch – telefonisch oder vor Ort</li>
            <li>Analyse der Objektunterlagen und Besichtigung</li>
            <li>Marktgerechte Bewertung mit transparentem Ergebnis</li>
            <li>
              Auf Wunsch: Beratung zu Verkauf, Finanzierung oder Sanierung
            </li>
          </ol>
        </div>
        <div
          className={styles.buttonWrapper}
          ref={el => (refs.current[3] = el)}
        >
          <Button
            initialText="Kostenlose Wertermittlung starten"
            clickedText="Weiterleitung..."
          />
        </div>
      </div>
    </section>
  );
};

export default HowIsGoing;
