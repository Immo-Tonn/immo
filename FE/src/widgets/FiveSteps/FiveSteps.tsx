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
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
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
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
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
              aria-controls="panel3-content"
              id="panel3-header"
              sx={{
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
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
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
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
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
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{
                margin: '109px 19px 60px 0',
                width: '332px',
                height: '98px',
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
