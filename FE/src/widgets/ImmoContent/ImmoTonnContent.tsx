import styles from './ImmoTonnContent.module.css';

interface ImmoTonnContentSectionProps {
  isMobile: boolean;
  isTablet: boolean;
}

const ImmoTonnContent: React.FC<ImmoTonnContentSectionProps> = ({
  isMobile,
  isTablet,
}) => {
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
    <div
      className={`${styles.immoTonnContentSection} ${isMobile ? styles.immoTonnContentSectionMobile : isTablet ? styles.immoTonnContentSectionTablet : ''}`}
    >
      {isMobile ? (
        <>
          <ul className={styles.immoTonnTextListMobile}>
            {listItemData.map((item, index) => (
              <li key={index} className={styles.immoTonnTextListItemWrapper}>
                <h4 className={styles.immoTonnTextH4Mobile}>{item.title}</h4>
                <p className={styles.immoTonnTextPMobile}>{item.description}</p>
              </li>
            ))}
          </ul>
          <div className={styles.immoTonnPhraseLine}></div>
          <div className={styles.immoTonnBigPhraseMobile}>
            Verlässlich. <br />
            Persönlich. <br />
            Vor Ort.
          </div>
        </>
      ) : isTablet ? (
        <>
          <div className={styles.immoTonnLeftSectionWrapper}>
            <div className={styles.immoTonnLine}></div>
            <p className={styles.immoTonnBigPhraseTablet}>
              Verlässlich. <br />
              Persönlich. <br />
              Vor Ort.
            </p>
          </div>
          <ul className={styles.immoTonnTextListTablet}>
            {listItemData.map((item, index) => (
              <li key={index} className={styles.immoTonnTextListItemWrapper}>
                <h4 className={styles.immoTonnTextH4Tablet}>{item.title}</h4>
                <p className={styles.immoTonnTextPTab}>{item.description}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className={styles.immoTonnBigPhraseDesktop}>
            Verlässlich. <br />
            Persönlich. <br />
            Vor Ort.
          </div>
          <div className={styles.immoTonnLine}></div>
          <ul className={styles.immoTonnTextListDesktop}>
            {listItemData.map((item, index) => (
              <li key={index} className={styles.immoTonnTextListItemWrapper}>
                <h4 className={styles.immoTonnTextH4Desktop}>{item.title}</h4>
                <p className={styles.immoTonnTextPDesktop}>
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
export default ImmoTonnContent;
