import ContactForm from "@pages/ContactForm"
import styles from "./RechtUndRat.module.css"
import image from "@shared/assets/recht/image.png"
import image1 from "@shared/assets/recht/image1.png"
import image2 from "@shared/assets/recht/image2.png"

const RechtUndRat = () => {
  return (
    <>
      <img src={image} className={styles.image} alt="Beratung Schritt 1" />

      <h2>RECHTLICHE SICHERHEIT & PRAKTISCHE <br/>
TIPPS RUND UM KAUF UND VERKAUF</h2>

      <div className={styles.textBlockL}>
        <div>
          <h1>Vorbereitung schafft Sicherheit und Erfolg</h1>
          </div>
          <div>
          <p>
            Wir begleiten Sie von Anfang an. Für Verkäufer helfen wir bei der Zusammenstellung aller notwendigen
            Unterlagen – wie Grundbuchauszug, Energieausweis und Informationen zu Renovierungen. Käufern stellen wir
            alle verfügbaren Objektunterlagen transparent zur Verfügung und erklären die Details verständlich – von der
            rechtlichen Situation bis zu technischen Merkmalen und versteckten Kosten.
          </p>
        </div>
      </div>

      <hr/>

      <div className={styles.textBlockR}>
          <div>
          <p>
            Wir wissen, wie man eine Immobilie optimal präsentiert. Verkäufern geben wir wertvolle Tipps zur
            Vorbereitung der Immobilie für Besichtigungen: Beleuchtung, Ordnung, neutrale Einrichtung und angenehme
            Atmosphäre – alles spielt eine Rolle. Zusätzlich bieten wir professionellen Objekt-Styling an. Käufern
            helfen wir, die entscheidenden Faktoren zu bewerten, die den Preis und die Wohnqualität beeinflussen
            können.
          </p>
          </div>
        <div>
          <h1>Mit Stil und Übersicht zur erfolgreichen Besichtigung</h1>
          </div>
        </div>

      <img src={image1} className={styles.image} alt="Beratung Schritt 2" />

      <div className={styles.textBlockL}>
        <div>
          <h1>Sicherheit und Struktur bei jedem Schritt.</h1>
          </div>
          <div>
          <p>
            Rechtliche Klarheit ist die Grundlage für Vertrauen. Wir prüfen den Eigentumsnachweis, mögliche Belastungen,
            Baugenehmigungen und die Richtigkeit aller Unterlagen. Verkäufern helfen wir, potenzielle rechtliche Hürden
            im Vorfeld zu beseitigen. Käufern erklären wir die Dokumente verständlich und beraten zu allen wichtigen
            Vertragspunkten. Auf Wunsch empfehlen wir Ihnen Notare aus unserem Partnernetzwerk – für eine sichere
            Abwicklung.
          </p>
        </div>
      </div>

      <hr/>

      <div className={styles.textBlockR}>
        <div>
          <p>
            Ein realistischer Preis und eine gute Verhandlungsführung sind entscheidend. Verkäufern helfen wir bei der
            Marktwertermittlung auf Basis von Lage, Zustand und Vergleichsobjekten. Käufern erklären wir die
            Preisstruktur und geben eine Einschätzung, wo faire Verhandlungsspielräume bestehen. Wir moderieren
            Gespräche respektvoll und lösungsorientiert.
          </p>
        </div>
        <div>
          <h1>Faire Preisfindung und erfolgreiche Verhandlungen</h1>
          </div>
      </div>

      <img src={image2} className={styles.image} alt="Beratung Schritt 3" />

      <div className={styles.textBlockL}>
        <div>
          <h1>Keine übereilten Entscheidungen treffen</h1>
          </div>
          <div>
          <p>
            Immobilientransaktionen brauchen Zeit und Klarheit. Wir schaffen einen geschützten Rahmen, in dem Käufer und Verkäufer in Ruhe und gut informiert Entscheidungen treffen können. Dabei sorgen wir für Sicherheit und Transparenz auf allen Ebenen.
          </p>
        </div>
      </div>

      <hr/>

      <p>Unser Ziel ist es, Kauf und Verkauf von Immobilien klar, verständlich und sicher zu gestalten.
 Wir setzen uns dafür ein, dass die Interessen beider Seiten berücksichtigt werden - und das Ergebnis für alle stimmt.</p>

      <ContactForm/>
    </>
  )
}

export default RechtUndRat
