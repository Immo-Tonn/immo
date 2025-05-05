import Button from '@shared/ui/Button/Button';
import styles from './Hero.module.css';
const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <p className={styles.topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </p>

      <div className={styles.bottomBar}>
        <div className={styles.buttonWrapper}>
          <Button
            initialText={'Kostenlose\nWertermittlung'}
            addLineBreak
            clickedText="Weiterleitung"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button initialText="direkt anfordern" clickedText="Weiterleitung" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
