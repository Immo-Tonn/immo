import styles from './FiveSteps.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import Button from '@shared/ui/Button/Button';

const FiveSteps = () => {
  return (
    <section className={styles.fiveStepsSection}>
      <div className={styles.firstTitleWrap}>
        <h3 className={styles.firstTitle}>
          Mehr als nur Immobilien – eine Partnerschaft, <br />
          die für Sie entfaltet
        </h3>
      </div>
      <div className={styles.secondTitleWrap}>
        <h2 className={styles.secondTitle}>
          in 5 Schritten zum Verkauf Ihrer Immobilie
        </h2>
      </div>

      <div className={styles.contentWrapper}>
        <ul className={styles.itemList}>
          <Accordion
            sx={{
              m: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              <li className={styles.accordionItem}>
                Kostenlose Immobilienbewertung & Erstberatung
              </li>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Die Eckdaten Ihrer Immobilie – Lage, Größe, Baujahr und Wohnfläche
              – geben eine erste Preiseinschätzung. Den tatsächlichen Marktwert
              bestimmen wir jedoch bei einem Vor-Ort-Termin, bei dem wir alle
              wichtigen Details berücksichtigen. In einem persönlichen Gespräch
              erhalten Sie unsere Bewertung, die Vermarktungsstrategie und Tipps
              zur möglichen Wertsteigerung.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              m: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              <li className={styles.accordionItem}>Auftragserteilung</li>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Nehmen Sie sich Zeit, unsere Bewertung und Empfehlungen in Ruhe zu
              prüfen. Bei Fragen oder Wünschen stehen wir Ihnen jederzeit zur
              Verfügung. Sobald Sie überzeugt sind, besiegelt ein schriftlicher
              Vermittlungsauftrag unsere Zusammenarbeit. Ab diesem Moment
              begleiten wir Sie mit umfassender Unterstützung und wertvollen
              Kontakten – etwa zu lokalen Handwerksbetrieben für
              Modernisierungen oder Finanzierungen.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              m: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
              flexDirection: 'row-reverse',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              <li className={styles.accordionItem}>
                Fototermin, Expose-Erstellung & Veröffentlichung
              </li>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Wir holen alle relevanten Informationen von Ämtern und
              Verwaltungen ein, um Interessenten bestmöglich zu informieren. Mit
              vollständigen Unterlagen, professionellen Fotos und einem
              aussagekräftigen Exposé präsentieren wir Ihre Immobilie optimal.
              Die Vermarktung erfolgt nach der gemeinsam festgelegten Strategie
              – gezielt über passende Medien und Kanäle.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              m: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              <li className={styles.accordionItem}>
                Anfragen und Besichtigungen
              </li>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: 'Inter, sans-serif',
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Seien Sie sicher: Nur ernsthafte Kaufinteressenten mit konkreten
              Absichten werden Ihre Immobilie besichtigen. Dies gewährleisten
              wir durch ausführliche Vorgespräche mit allen potenziellen
              Käufern. "Besichtigungstourismus" gibt es bei uns nicht. Sollten
              Sie noch in Ihrer Immobilie wohnen, stimmen wir die
              Besichtigungstermine selbstverständlich flexibel mit Ihnen ab.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              m: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
              sx={{
                flexDirection: 'row-reverse',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              <li className={styles.accordionItem}>
                Notartermin und Beurkundung
              </li>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Professionelle Verhandlungsführung & reibungsloser
              Verkaufsabschluss Als Ihr Immobilienpartner übernehmen wir die
              Preisverhandlungen in Ihrem Sinne. Dank einer klar definierten
              Strategie und enger Abstimmung mit Ihnen müssen Sie sich nicht
              selbst in die Verhandlungen einbringen. Als Makler agieren wir als
              Vermittler mit dem Ziel, eine faire Einigung zu erzielen, mit der
              beide Seiten zufrieden sind. Nach der Einigung übermitteln wir
              alle Details an den Notar, der den Kaufvertragsentwurf erstellt
              und beiden Parteien zur Prüfung zusendet. Sobald beide Seiten
              zustimmen, wird der Notartermin zur Vertragsunterzeichnung
              festgelegt. Nach Zahlungseingang auf Ihrem Konto kümmern wir uns
              um die Immobilienübergabe sowie die Meldungen an den Versicherer
              und die zuständige Kommune. Und dann ist es offiziell:
              #ERFOLGREICH VERKAUFT!
            </AccordionDetails>
          </Accordion>

          <div className={styles.buttonWrapper}>
            <Button
              style={{
                margin: '109px 19px 60px 0',
                width: 'clamp(275px, 10vw, 332px)',
                height: 'clamp(27px, 10vw, 98px)',
                border: 'none',
                cursor: 'pointer',
                background: '#163054',
                fontWeight: 400,
                fontSize: '32px',
                textAlign: 'center',
                color: '#f5f5f5',
              }}
              initialText="Verkauf"
              clickedText="Weiterleitung"
            />
          </div>
        </ul>
      </div>
    </section>
  );
};

export default FiveSteps;
