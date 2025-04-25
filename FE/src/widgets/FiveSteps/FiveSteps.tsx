import styles from './FiveSteps.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import Button from '../../shared/ui/Button';
const FiveSteps = () => {
  return (
    <section className={styles.fiveStepsSection}>
      <div className={styles.title}>
        <h2>in 5 Schritten zum Verkauf Ihrer Immobilie</h2>
      </div>

      <div className={styles.contentWrapper}>
        <ul className={styles.itemList}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <li>Kostenlose Immobilienbewertung & Erstberatung</li>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <li>Auftragserteilung</li>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <li>Fototermin, Expose-Erstellung & Veröffentlichung</li>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <li>Anfragen und Besichtigungen</li>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <li>Notartermin und Beurkundung</li>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Button text="Verkauf" />
        </ul>
      </div>
    </section>
  );
};

export default FiveSteps;
