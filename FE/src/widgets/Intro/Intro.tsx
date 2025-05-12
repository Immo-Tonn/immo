import Button from '@shared/ui/Button/Button';
import styles from './Intro.module.css';
const Intro = () => {
  return (
    <section className={styles.introSection}>
      <h1 className={styles.firstTitle}>
        Immobilienbewertung mit Immo Tonn – Wir kennen den Wert Ihres
        <br /> Zuhauses
      </h1>
      <div className={styles.contentWrapper}>
        <div className={styles.buttonWrapper}>
          <Button
            initialText={'Immobilienbewertung mit Herz und Verstand'}
            clickedText="Weiterleitung"
          />
        </div>
      </div>
    </section>
  );
};

export default Intro;
