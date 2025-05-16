import Button from '@shared/ui/Button/Button';
import styles from './HowIsGoing.module.css';
const HowIsGoing = () => {
  return (
    <section className={styles.howIsGoingSection}>
      <div className={`${styles.textBlock}`}>
        <h3>Was wir bei der Bewertung berücksichtigen:</h3>
        <div className={styles.listWrapper}>
          <ul>
            <li>Aktuelle Markt- und Nachfragesituation</li>
            <li>Lage und Mikrolage der Immobilien</li>
            <li>Baujahr, Zustand, Ausstattung</li>
            <li>Vergleichswerte ähnlicher Objekte</li>
            <li>Potenziale für Modernisierung oder energetische Sanierung</li>
          </ul>
        </div>
        <h3>Wie läuft die Bewertung ab?</h3>
        <div className={styles.listWrapper}>
          <ol>
            <li>Unverbindliches Erstgespräch – telefonisch oder vor Ort</li>
            <li>Analyse der Objektunterlagen und Besichtigung</li>
            <li>Marktgerechte Bewertung mit transparentem Ergebnis</li>
            <li>
              Auf Wunsch: Beratung zu Verkauf, Finanzierung oder Sanierung
            </li>
          </ol>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            initialText="Kostenlose Wertermittlung starten"
            clickedText="Weiterleitung"
          />
        </div>
      </div>
    </section>
  );
};

export default HowIsGoing;
