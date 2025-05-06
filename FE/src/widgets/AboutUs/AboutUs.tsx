import { useRef } from 'react';
import styles from './AboutUs.module.css';
import whiteLogo from '@shared/assets/about-us/logo-white.svg';
import '@shared/styles/animation.css';
import DynamicText from '@widgets/DynamicText/DynamicText';
import DynamicTitle from '@widgets/DynamicTitle/DynamicTitle';

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.aboutUsSection} ref={containerRef}>
      <h3 className={styles.firstTitleMobile}>
        Mehr als nur Immobilien – eine Partnerschaft, <br />
        die für Sie entfaltet
      </h3>
      <span className={styles.line}></span>
      <div className={styles.contentWrapper}>
        <img src={whiteLogo} alt="logo" className={styles.logoDesktop} />

        <div className={styles.textBlock}>
          <DynamicTitle />
          <DynamicText />
        </div>
      </div>
      <p className={styles.textBottom}>
        Ihr Maklerteam für Wohnimmobilien, Geschäftshäuser und hochwertige
        Investment
      </p>

      <span className={styles.line}></span>
    </section>
  );
};

export default AboutUs;
