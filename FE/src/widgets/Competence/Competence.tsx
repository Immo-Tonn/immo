import styles from './Competence.module.css';
import lightBuilding from '@shared/assets/competence/light-bulding.svg';
const Competence = () => {
  return (
    <section className={styles.competenceSection}>
      <h2 className={styles.firstTitle}>Vertrauen durch Kompetenz</h2>
      <span className={styles.line}></span>
      <p>
        Unsere Kunden besitzen nicht nur Immobilien – sie sind oft auch bei uns
        versichert. Das heißt: Wir kennen ihre Situation, ihre Immobilie und
        ihre Bedürfnisse.
      </p>
      <p>
        Genau darin liegt unser Vorteil: Wir kombinieren Wissen aus zwei Welten
        – Immobilienbewertung und Versicherungsberatung – für eine ganzheitliche
        Betreuung.
      </p>
      <img src={lightBuilding} alt="light-house" />

      <div className={`${styles.titleWrapper}`}>
        <h2 className={`${styles.secondTitle}`}>
           Jetzt unverbindlich anfragen – Ihr Immo Tonn Team ist für Sie da!
        </h2>
      </div>
    </section>
  );
};

export default Competence;
