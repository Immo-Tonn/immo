import Button from '@shared/ui/Button/Button';
import styles from './ImmoTonnContent.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';

const ImmoTonnContent: React.FC = () => {
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { x: 100, y: -50 });
  }, []);

  const listItemData = [
    {
      title: 'Rechtliche Sicherheit',
      description:
        'Er unterstützt bei Verträgen, klärt Fragen und begleitet rechtlich bis zum Abschluss.',
    },
    {
      title: 'Organisation und Besichtigungen',
      description:
        'Der Makler plant und koordiniert alle Termine mit Interessenten effizient und zuverlässig.',
    },
    {
      title: 'Finanzierungsberatung',
      description:
        'Der Makler plant und koordiniert alle Termine mit Interessenten effizient und zuverlässig.',
    },
    {
      title: 'Betreuung nach dem Verkauf',
      description:
        'Auch nach dem Abschluss bleibt der Makler Ansprechpartner für Fragen und Übergaben.',
    },
  ];

  return (
    <>
      <section className={styles.immoTonnContentSection} ref={ref}>
        <div className={styles.immoTonnLeftSectionWrapper}>
          <p className={styles.immoTonnBigPhrase}>
            Verlässlich. <br /> Persönlich. <br /> Vor Ort.
          </p>
          <span className={styles.immoTonnLine}></span>
        </div>
        <ul className={styles.immoTonnTextList}>
          {listItemData.map((item, index) => (
            <li key={index} className={styles.immoTonnTextListItemWrapper}>
              <h4 className={styles.immoTonnTextH4}>{item.title}</h4>
              <p className={styles.immoTonnTextP}>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className={styles.buttonWrapper}>
        <Link to="/kontakt">
          <Button
            className={styles.salesSupportButton}
            initialText="KONTAKTAUFNEHMEN"
            clickedText="Weiterleitung..."
          />
        </Link>
      </div>
    </>
  );
};

export default ImmoTonnContent;
