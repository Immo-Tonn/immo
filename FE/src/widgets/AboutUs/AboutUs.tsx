import { useRef } from 'react';
import style from './AboutUs.module.css';
import whiteLogo from '@shared/assets/about-us/logo-white.svg';
import '@shared/styles/animation.css';

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className={style.aboutUsSection}
      ref={containerRef}
      data-scroll-container
    >
      <span className={style.line}></span>

      <div className={style.contentWrapper}>
        <img
          src={whiteLogo}
          alt="logo"
          className={style.logo}
          data-scroll
          data-scroll-speed="1"
        />
        <div className={style.textBlock} data-scroll data-scroll-speed="2">
          <h1>
            Ihr zuverlässiger Partner für Immobilien in NRW – <br />
            Das dürfen Sie von uns erwarten:
          </h1>
          <p>
            Mit einem professionellen Immobilienmakler an Ihrer Seite können Sie
            sicherstellen, dass der gesamte Prozess – von der ersten Idee bis
            zum erfolgreichen Abschluss – effizient, sicher und in Ihrem besten
            Interesse verläuft. Seit 1985 sind wir im Münsterland auf den
            Verkauf von Bestands‑ und Neubauimmobilien spezialisiert und nutzen
            exklusive Vermarktungsstrategien sowie ein über Jahrzehnte
            gewachsenes regionales Netzwerk, um für jedes Objekt das optimale
            Ergebnis zu erzielen. <br />
            Unser erfahrenes Team begleitet Sie persönlich, hält Ihnen den
            Rücken frei und entwickelt sich kontinuierlich weiter, damit Sie
            jederzeit den besten Service erhalten.
          </p>
        </div>
      </div>

      <p className={style.textBottom} data-scroll data-scroll-speed="1.5">
        Ihr Maklerteam für Wohnimmobilien, Geschäftshäuser und hochwertige
        Investment
      </p>

      <span className={style.line}></span>
    </section>
  );
};

export default AboutUs;
