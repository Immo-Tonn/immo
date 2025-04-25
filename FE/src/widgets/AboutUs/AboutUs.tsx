import style from '../AboutUs/AboutUs.module.css';
import whiteLogo from '../../shared/assets/about-us/logo-white.svg';

const AboutUs = () => {
  return (
    <section className={style.aboutUsSection}>
      <span className={style.line}></span>
      <div className={style.contentWrapper}>
        <img src={whiteLogo} alt="logo" className={style.logo} />
        <div className={style.textBlock}>
          <h1>Was Sie von uns erwarten können</h1>
          <p>
            Mit einem professionellen Immobilienmakler an Ihrer Seite können Sie
            sicherstellen, dass der gesamte Prozess – von der ersten Idee bis
            zum erfolgreichen Abschluss – effizient, sicher und in Ihrem besten
            Interesse verläuft. Seit 1985 sind wir im Münsterland auf den
            Verkauf von Bestands‑ und Neubauimmobilien spezialisiert und nutzen
            exklusive Vermarktungsstrategien sowie ein über Jahrzehnte
            gewachsenes regionales Netzwerk, um für jedes Objekt das optimale
            Ergebnis zu erzielen. Unser erfahrenes Team begleitet Sie
            persönlich, hält Ihnen den Rücken frei und entwickelt sich
            kontinuierlich weiter, damit Sie jederzeit den besten Service
            erhalten.
          </p>
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
