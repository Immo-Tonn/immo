import ContactForm from '@features/contact/ui/ContactForm';
import styles from './LawAndAdvice.module.css';
import rechtHero from '@shared/assets/law-and-advice/hero-law.webp';
import rechtMain from '@shared/assets/law-and-advice/law-and-advice.webp';
import rechtSecondary from '@shared/assets/law-and-advice/law-and-advice_2.webp';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';

const LawAndAdvice = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    runningBoxShadow(imgRef);
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 50 } : { x: 100, y: -50 },
        );
    });
  }, []);

  return (
    <section className={styles.rechtSection}>
      <div className={styles.imageWrapper}>
        <img
          src={rechtHero}
          className={styles.image}
          alt="Beratung Schritt 1"
          ref={el => {
            refs.current[0] = el;
          }}
        />
        <div className={styles.firstTitleWrapper}>
          <h1>Recht & Rat</h1>
        </div>
      </div>

      <h2
        ref={el => {
          refs.current[2] = el;
        }}
      >
        rechtliche sicherheit & praktische <br />
        tipps rund um kauf und verkauf
      </h2>

      <div
        className={styles.textBlockL}
        ref={el => {
          refs.current[1] = el;
        }}
      >
        <div className={styles.blockTitle}>
          <h2>Vorbereitung schafft Sicherheit und Erfolg</h2>
        </div>
        <div className={styles.blockText}>
          <p>
            Wir begleiten Sie von Anfang an. <br /> Für Verkäufer helfen wir bei
            der Zusammenstellung aller notwendigen Unterlagen – wie
            Grundbuchauszug, Energieausweis und Informationen zu Renovierungen.
            <br /> Käufern stellen wir alle verfügbaren Objektunterlagen
            transparent zur Verfügung und erklären die Details verständlich –
            von der rechtlichen Situation bis zu technischen Merkmalen und
            versteckten Kosten.
          </p>
        </div>
      </div>

      <hr />

      <div
        className={styles.textBlockR}
        ref={el => {
          refs.current[3] = el;
        }}
      >
        <div className={styles.blockText}>
          <p>
            Wir wissen, wie man eine Immobilie optimal präsentiert. <br />
            Verkäufern geben wir wertvolle Tipps zur Vorbereitung der Immobilie
            für Besichtigungen: Beleuchtung, Ordnung, neutrale Einrichtung und
            angenehme Atmosphäre – alles spielt eine Rolle. Zusätzlich bieten
            wir professionellen Objekt-Styling an. <br /> Käufern helfen wir,
            die entscheidenden Faktoren zu bewerten, die den Preis und die
            Wohnqualität beeinflussen können.
          </p>
        </div>
        <div className={styles.blockTitle}>
          <h2>Mit Stil und Übersicht zur erfolgreichen Besichtigung</h2>
        </div>
      </div>
      <div
        ref={el => {
          refs.current[5] = el;
        }}
      >
        <img
          src={rechtMain}
          className={styles.image}
          alt="Beratung Schritt 2"
          ref={imgRef}
        />
      </div>
      <div
        className={styles.textBlockL}
        ref={el => {
          refs.current[4] = el;
        }}
      >
        <div className={styles.blockTitle}>
          <h2>Sicherheit und Struktur bei jedem Schritt.</h2>
        </div>
        <div className={styles.blockText}>
          <p>
            Rechtliche Klarheit ist die Grundlage für Vertrauen. <br /> Wir
            prüfen den Eigentumsnachweis, mögliche Belastungen, Baugenehmigungen
            und die Richtigkeit aller Unterlagen. <br /> Verkäufern helfen wir,
            potenzielle rechtliche Hürden im Vorfeld zu beseitigen. <br />
            Käufern erklären wir die Dokumente verständlich und beraten zu allen
            wichtigen Vertragspunkten. <br /> Auf Wunsch empfehlen wir Ihnen
            Notare aus unserem Partnernetzwerk – für eine sichere Abwicklung.
          </p>
        </div>
      </div>

      <hr />

      <div
        className={styles.textBlockR}
        ref={el => {
          refs.current[6] = el;
        }}
      >
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
          <h2>Faire Preisfindung und erfolgreiche Verhandlungen</h2>
        </div>
      </div>

      <img
        src={rechtSecondary}
        className={styles.image}
        alt="Beratung Schritt 3"
        ref={el => {
          refs.current[7] = el;
        }}
      />

      <div className={styles.textBlockL}>
        <div
          className={styles.blockTitle}
          ref={el => {
            refs.current[9] = el;
          }}
        >
          <h2>Keine übereilten Entscheidungen treffen</h2>
        </div>
        <div
          className={styles.blockText}
          ref={el => {
            refs.current[10] = el;
          }}
        >
          <p>
            Immobilientransaktionen brauchen Zeit und Klarheit. <br /> Wir
            schaffen einen geschützten Rahmen, in dem Käufer und Verkäufer in
            Ruhe und gut informiert Entscheidungen treffen können. Dabei sorgen
            wir für Sicherheit und Transparenz auf allen Ebenen.
          </p>
        </div>
      </div>

      <hr />

      <p
        className={styles.ziel}
        ref={el => {
          refs.current[8] = el;
        }}
      >
        Unser Ziel ist es, Kauf und Verkauf von Immobilien klar, verständlich
        und sicher zu gestalten. <br />
        Wir setzen uns dafür ein, dass die Interessen beider Seiten
        berücksichtigt werden - und das Ergebnis für alle stimmt.
      </p>

      <ContactForm />
    </section>
  );
};

export default LawAndAdvice;
