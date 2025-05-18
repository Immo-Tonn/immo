import styles from '../Effect/Effect.module.css';
import effectPhoto from '@shared/assets/effect/effect-photo.svg';
import effectBuild from '@shared/assets/effect/effect-build.svg';
const Effect = () => {
  return (
    <section className={styles.effectSection}>
      <div className={styles.descriptionWrapper}>
        <span className={styles.line}></span>
        <p className={styles.description}>
          Objektstyling ist mehr als Dekoration. Es ist die Kunst, Räume
          lebendig wirken zu lassen. Wir inszenieren Immobilien so, dass sie
          nicht nur schön aussehen <br /> — <br />
          sondern sich wie Zuhause anfühlen. Weil der erste Eindruck keine
          zweite Chance bekommt.
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <img src={effectPhoto} alt="effect-photo" />
        <h2>Licht. Perspektive. Wirkung.</h2>
      </div>
      <div className={styles.descriptionWrapper}>
        <p className={styles.description}>
          Mit dem richtigen Blickwinkel und dem Spiel aus Schatten und Licht
          lassen wir Räume größer, wärmer und lebendiger wirken. Jedes Detail
          wird gezielt inszeniert – damit Ihre Immobilie nicht nur im Foto
          glänzt, sondern beim ersten Schritt über die Schwelle begeistert. Ihre
          Vorteile auf einen Blick:
          <span>
            <b>
              Höhere Sichtbarkeit auf Plattformen Mehr Anfragen & schnellere
              Verkäufe Preissteigerung von bis zu 15 % Alles aus einer Hand –
              stilvoll & stressfrei
            </b>
          </span>
        </p>
      </div>
      <img src={effectBuild} alt="effect-build" />
    </section>
  );
};
export default Effect;
