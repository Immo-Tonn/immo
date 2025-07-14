import Button from '@shared/ui/Button/Button';
import styles from './HeroHome.module.css';
import { Link } from 'react-router-dom';
const HeroHome = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContentWrapper}>
        <div className={styles.topTextWrapper}>
          <p className={styles.topText}>
            Der richtige Partner für Ihren
            <br />
            Immobilienverkauf
            <br />
            im Münsterland
          </p>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.buttonWrapper}>
            <Link to="/wertermittlung">
              <Button
                initialText="Kostenlose Wertermittlung"
                clickedText="Weiterleitung..."
              />
            </Link>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              initialText="direkt anfordern"
              clickedText="Weiterleitung..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
