import styles from './Hero.module.css';
const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </div>
      <div className={styles.bottomBar}>
        <span>
          Kostenlose <br />
          Wertermittlung
        </span>
        <span>direkt anfordern</span>
      </div>
    </section>
  );
};

export default Hero;
