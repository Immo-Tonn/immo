import styles from './Intro.module.css';
const Intro = () => {
  return (
    <section className={styles.introSection}>
      <div className={styles.contentWrapper}>
        <div className={styles.textWrapper}>
          <p>Immobilienbewertung mit Herz und Verstand</p>
        </div>
      </div>
    </section>
  );
};

export default Intro;
