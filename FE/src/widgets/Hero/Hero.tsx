import Button from '@shared/ui/Button/Button';
import styles from './Hero.module.css';
const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.topText}>
        Der richtige Partner für Ihren Immobilienverkauf
      </div>
      <div className={styles.bottomBar}>
        <Button text={'Kostenlose\nWertermittlung'} addLineBreak />
        <Button text="direkt anfordern" />
      </div>
    </section>
  );
};

export default Hero;
