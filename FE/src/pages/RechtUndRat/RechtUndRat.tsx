import ContactForm from '@features/contact/ui/ContactForm';
import styles from './RechtUndRat.module.css';
import rechtHero from '@shared/assets/recht/hero-recht.webp';
import rechtMain from '@shared/assets/recht/recht-und-rat.webp';
import rechtSecondary from '@shared/assets/recht/recht-und-rat_2.webp';

const RechtUndRat = () => {
  return (
    <>
      <img src={rechtHero} className={styles.image} alt="Beratung Schritt 1" />
      <h2>
        RECHTLICHE SICHERHEIT & PRAKTISCHE <br />
        TIPPS RUND UM KAUF UND VERKAUF
      </h2>

      <div className={styles.textBlockL}>
        <div className={styles.blockTitle}>
          <h1>Vorbereitung schafft Sicherheit und Erfolg</h1>
        </div>
        <div className={styles.blockText}>
          <p>
            Wir begleiten Sie von Anfang an. <br /> Für Verkäufer helfen wir bei
            der Zusammenstellung aller notwendigen Unterlagen – wie
            Grundbuchauszug, Energieausweis und Informationen zu Renovierungen.{' '}
            <br /> Käufern stellen wir alle verfügbaren Objektunterlagen
            transparent zur Verfügung und erklären die Details verständlich –
            von der rechtlichen Situation bis zu technischen Merkmalen und
            versteckten Kosten.
          </p>
        </div>
      </div>

      <hr />

      <div className={styles.textBlockR}>
        <div className={styles.blockText}>
          <p>
            Wir wissen, wie man eine Immobilie optimal präsentiert. <br />{' '}
            Verkäufern geben wir wertvolle Tipps zur Vorbereitung der Immobilie
            für Besichtigungen: Beleuchtung, Ordnung, neutrale Einrichtung und
            angenehme Atmosphäre – alles spielt eine Rolle. Zusätzlich bieten
            wir professionellen Objekt-Styling an. <br /> Käufern helfen wir,
            die entscheidenden Faktoren zu bewerten, die den Preis und die
            Wohnqualität beeinflussen können.
          </p>
        </div>
        <div className={styles.blockTitle}>
          <h1>Mit Stil und Übersicht zur erfolgreichen Besichtigung</h1>
        </div>
      </div>

      <img src={rechtMain} className={styles.image} alt="Beratung Schritt 2" />

      <div className={styles.textBlockL}>
        <div className={styles.blockTitle}>
          <h1>Sicherheit und Struktur bei jedem Schritt.</h1>
        </div>
        <div className={styles.blockText}>
          <p>
            Rechtliche Klarheit ist die Grundlage für Vertrauen. <br /> Wir
            prüfen den Eigentumsnachweis, mögliche Belastungen, Baugenehmigungen
            und die Richtigkeit aller Unterlagen. <br /> Verkäufern helfen wir,
            potenzielle rechtliche Hürden im Vorfeld zu beseitigen. <br />{' '}
            Käufern erklären wir die Dokumente verständlich und beraten zu allen
            wichtigen Vertragspunkten. <br /> Auf Wunsch empfehlen wir Ihnen
            Notare aus unserem Partnernetzwerk – für eine sichere Abwicklung.
          </p>
        </div>
      </div>

      <hr />

      <div className={styles.textBlockR}>
        <div className={styles.blockText}>
          <p>
            Ein realistischer Preis und eine gute Verhandlungsführung sind
            entscheidend. <br /> Verkäufern helfen wir bei der
            Marktwertermittlung auf Basis von Lage, Zustand und
            Vergleichsobjekten. <br /> Käufern erklären wir die Preisstruktur
            und geben eine Einschätzung, wo faire Verhandlungsspielräume
            bestehen. <br /> Wir moderieren Gespräche respektvoll und
            lösungsorientiert.
          </p>
        </div>
        <div className={styles.blockTitle}>
          <h1>Faire Preisfindung und erfolgreiche Verhandlungen</h1>
        </div>
      </div>

      <img
        src={rechtSecondary}
        className={styles.image}
        alt="Beratung Schritt 3"
      />

      <div className={styles.textBlockL}>
        <div className={styles.blockTitle}>
          <h1>Keine übereilten Entscheidungen treffen</h1>
        </div>
        <div className={styles.blockText}>
          <p>
            Immobilientransaktionen brauchen Zeit und Klarheit. <br /> Wir
            schaffen einen geschützten Rahmen, in dem Käufer und Verkäufer in
            Ruhe und gut informiert Entscheidungen treffen können. Dabei sorgen
            wir für Sicherheit und Transparenz auf allen Ebenen.
          </p>
        </div>
      </div>

      <hr />

      <p className={styles.ziel}>
        Unser Ziel ist es, Kauf und Verkauf von Immobilien klar, verständlich
        und sicher zu gestalten. <br />
        Wir setzen uns dafür ein, dass die Interessen beider Seiten
        berücksichtigt werden - und das Ergebnis für alle stimmt.
      </p>

      <ContactForm />
    </>
  );
};

export default RechtUndRat;
