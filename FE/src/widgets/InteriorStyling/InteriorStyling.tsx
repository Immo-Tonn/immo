import Button from '@shared/ui/Button/Button';
import styles from '../InteriorStyling/InteriorStyling.module.css';
import ContactForm from '@pages/ContactForm/ContactForm';
const InteriorStyling = () => {
  return (
    <section className={styles.interiorStylingSection}>
      <h2>vom raum zum wunschobjekt</h2>
      <p>
        Sie haben die Immobilie. Wir verleihen ihr Charakter, Tiefe und
        Atmosphäre.
      </p>
      <p>
        Design, das sofort ein Gefühl von Zuhause vermittelt und zum Verweilen
        einlädt.
      </p>
      <p>
        Ob leerstehende Wohnung, Familienhaus oder Design-Loft – wir entwickeln
        individuelle Stylingkonzepte mit klarer Linie und Liebe zum Detail.
      </p>
      <span className={styles.line}></span>
      <div className={styles.formWrapper}>
        <ContactForm />
        <span className={styles.lineVertical}></span>
        <p>Verbindlich. Kompetent. Erfolgreich.</p>
      </div>
    </section>
  );
};

export default InteriorStyling;
