import { useRef } from 'react';
import style from './AboutUs.module.css';
import whiteLogo from '@shared/assets/about-us/logo-white.svg';
import '@shared/styles/animation.css';
import DynamicText from '@widgets/DynamicText/DynamicText';

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={style.aboutUsSection} ref={containerRef}>
      <span className={style.line}></span>

      <div className={style.contentWrapper}>
        <div className={style.logoWrapper}>
          <img src={whiteLogo} alt="logo" className={style.logo} />
        </div>
        <div className={style.textBlock}>
          <h1>
            Ihr zuverlässiger Partner für Immobilien in NRW – <br />
            Das dürfen Sie von uns erwarten:
          </h1>
          <DynamicText />
        </div>
      </div>

      <p className={style.textBottom}>
        Ihr Maklerteam für Wohnimmobilien, Geschäftshäuser und hochwertige
        Investment
      </p>

      <span className={style.line}></span>
    </section>
  );
};

export default AboutUs;
