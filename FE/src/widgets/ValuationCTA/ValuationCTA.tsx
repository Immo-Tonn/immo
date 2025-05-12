import Button from '@shared/ui/Button/Button';
import styles from './ValuationCTA.module.css';
import valuationPhoto from '@shared/assets/valuation-cta/valuation-photo.svg';
const ValuationCTA = () => {
  return (
    <section className={styles.ValuationCTASection}>
      <div className={styles.textWrapper}>
        <h2 className={styles.firstTitle}>
          <b>
            Viele Eigentümer fragen sich: Was ist meine Immobilie heute wert?
          </b>
        </h2>
        <p className={styles.description}>
          Ob aus Interesse, für eine mögliche Verkaufsentscheidung oder zur
          besseren finanziellen Planung – eine fundierte Wertermittlung schafft
          Sicherheit und Klarheit. Als erfahrene Partner in der Versicherungs-
          und Immobilienbranche wissen wir bei Immo Tonn, worauf es ankommt:
          Marktkenntnis und persönliche Beratung.
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <h1 className={styles.secondTitle}>
          Lassen Sie Ihre Immobilie jetzt bewerten!
        </h1>
        <img src={valuationPhoto} alt="valuation-photo" />
      </div>
      <div className={styles.bottomWrapper}>
        <h2 className={styles.thirdTitle}>
          warum ist eine professionelle wertermittlung so wichtig?
        </h2>
        <p>
          Der Immobilienmarkt ist ständig in Bewegung. Faktoren wie Inflation,
          Zinssätze und die Lageentwicklung beeinflussen den Wert einer
          Immobilie. Wer verkaufen möchte, braucht eine zuverlässige
          Einschätzung – idealerweise von Experten, die sowohl den Immobilien-
          als auch den Versicherungsmarkt verstehen.
        </p>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          initialText={'Wie viel ist mein Haus wert?'}
          clickedText="Weiterleitung"
        />
      </div>
    </section>
  );
};

export default ValuationCTA;
