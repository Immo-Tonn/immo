import styles from '../HeroValuation/HeroValuation.module.css';
const HeroValuation = () => {
  return (
    <section className={styles.heroValuationSection}>
      <p>
        Immobilienbewertung mit Immo Tonn – Wir kennen den Wert Ihres Zuhauses
      </p>
      <div className={styles.contentWrapper}>
        <div className={styles.textWrapper}>
          <p>Immobilienbewertung mit Herz und Verstand</p>
        </div>
      </div>
    </section>
  );
};

export default HeroValuation;
