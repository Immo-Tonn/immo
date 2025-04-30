import Button from '@shared/ui/Button/Button';
import styles from './Hero.module.css';
const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </div>
      <div className={styles.bottomBar}>
        <Button
          initialText={'Kostenlose\nWertermittlung'}
          clickedText="Weiterleitung"
          addLineBreak
        />
        <Button initialText="direkt anfordern" clickedText="Weiterleitung" />
      </div>
    </section>
  );
};

export default Hero;
