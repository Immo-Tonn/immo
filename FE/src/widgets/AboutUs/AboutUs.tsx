import { useEffect, useRef } from 'react';
import styles from './AboutUs.module.css';
import DynamicText from '@widgets/DynamicText/DynamicText';
import DynamicTitle from '@widgets/DynamicTitle/DynamicTitle';
import { parallaxMouseEffect } from '@shared/anim/animations';

const AboutUs = () => {
  const wrapperRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const bottomTextRef = useRef(null);

  useEffect(() => {
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [
        { ref: logoRef, factor: 2 },
        { ref: textRef, factor: 1 },
        { ref: bottomTextRef, factor: 2 },
      ],
    });

    return cleanup;
  }, []);

  return (
    <section className={styles.aboutUsSection}>
      <div className={styles.contentWrapper} ref={wrapperRef}>
        <div className={styles.textBlock} ref={textRef}>
          <div className={styles.titleWrapper}>
            <h1>
              Ihr zuverlässiger Partner für <br />
              Immobilien in NRW – <br />
              Das dürfen Sie von uns erwarten:
            </h1>
            <div className={styles.textWrapper}>
              <p>
                Mit einem professionellen Immobilienmakler an Ihrer Seite können
                Sie sicherstellen, dass der gesamte Prozess – von der ersten
                Idee bis zum erfolgreichen Abschluss – effizient, sicher und in
                Ihrem besten Interesse verläuft.
              </p>
              <p>
                Seit 1985 sind wir im <strong>Münsterland</strong> auf den
                Verkauf von Bestands‑ und Neubauimmobilien spezialisiert und
                nutzen exklusive Vermarktungsstrategien sowie ein über
                Jahrzehnte gewachsenes regionales Netzwerk, um für jedes Objekt
                das optimale Ergebnis zu erzielen.
              </p>
              <p>
                Unser erfahrenes Team begleitet Sie persönlich, hält Ihnen den
                Rücken frei und entwickelt sich kontinuierlich weiter, damit Sie
                jederzeit den besten Service erhalten.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.textBottom} ref={bottomTextRef}>
        <b>
          Ihr Maklerteam für Wohnimmobilien, <br />
          Geschäftshäuser und hochwertige Investment
        </b>
      </p>
    </section>
  );
};

export default AboutUs;
