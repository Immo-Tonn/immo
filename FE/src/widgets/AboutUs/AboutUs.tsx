import { useEffect, useRef } from 'react';
import styles from '../AboutUs/AboutUs.module.css';
import whiteLogo from '@shared/assets/about-us/logo-white.svg';
import DynamicText from '@widgets/DynamicText/DynamicText';
import DynamicTitle from '@widgets/DynamicTitle/DynamicTitle';
import { parallaxMouseEffect } from '@shared/anim/animations';

const AboutUs = () => {
  const wrapperRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const bottomTextRef = useRef(null);

  useEffect(() => {
    const cleanup = parallaxMouseEffect(
      wrapperRef,
      logoRef,
      textRef,
      bottomTextRef,
    );
    return cleanup;
  }, []);

  return (
    <section className={styles.aboutUsSection}>
      <h3 className={`${styles.firstTitleMobile}`}>
        Mehr als nur Immobilien – eine Partnerschaft, die für Sie entfaltet
      </h3>
      <span className={styles.line}></span>
      <div className={styles.contentWrapper} ref={wrapperRef}>
        <img
          src={whiteLogo}
          alt="logo"
          className={`${styles.logoDesktop}`}
          ref={logoRef}
        />

        <div className={styles.textBlock} ref={textRef}>
          <DynamicTitle />
          <DynamicText />
        </div>
      </div>
      <p className={styles.textBottom} ref={bottomTextRef}>
        Ihr Maklerteam für Wohnimmobilien, Geschäftshäuser und hochwertige
        Investment
      </p>

      <span className={styles.line}></span>
    </section>
  );
};

export default AboutUs;
