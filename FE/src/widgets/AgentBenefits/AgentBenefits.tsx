import React, { useEffect, useRef } from 'react';
import styles from './AgentBenefits.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';

interface AgentBenefitsSectionProps {
  isMobile: boolean;
  isTablet: boolean;
}

const AgentBenefits: React.FC<AgentBenefitsSectionProps> = ({
  isMobile,
  isTablet,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    fadeInOnScroll(ref, { y: 100, x: -40 });
  }, []);
  return (
    <section ref={ref}>
      <div
        className={`${styles.whyAgentSection} ${isTablet ? styles.whyAgentSectionTablet : ''}`}
      >
        <div
          className={`${styles.whyAgentContentWithLine} ${isTablet ? styles.whyAgentContentWithLineTablet : ''}`}
        >
          <h3 className={styles.whyAgentH3}>warum ein makler?</h3>
          <ul className={styles.whyAgentUl}>
            <li className={styles.whyAgentLi}>
              <h4
                className={`${styles.whyAgentH4} ${isMobile ? styles.whyAgentH4Mobile : ''}`}
              >
                Marktanalyse & Beratung
              </h4>
              <p
                className={`${styles.whyAgentP} ${isMobile ? styles.whyAgentPMobile : ''}`}
              >
                Der Makler analysiert den Markt und empfiehlt den optimalen
                Angebotspreis für Ihre Immobilie.
              </p>
            </li>
            <li className={styles.whyAgentLi}>
              <h4
                className={`${styles.whyAgentH4} ${isMobile ? styles.whyAgentH4Mobile : ''}`}
              >
                Immobilienbewertung
              </h4>
              <p
                className={`${styles.whyAgentP} ${isMobile ? styles.whyAgentPMobile : ''}`}
              >
                Mit modernen Verfahren ermittelt der Makler den realistischen
                Marktwert.
              </p>
            </li>
            <li className={styles.whyAgentLi}>
              <h4
                className={`${styles.whyAgentH4} ${isMobile ? styles.whyAgentH4Mobile : ''}`}
              >
                Effektives Marketing
              </h4>
              <p
                className={`${styles.whyAgentP} ${isMobile ? styles.whyAgentPMobile : ''}`}
              >
                Professionelle Fotos, Exposés und gezielte Werbung sorgen für
                maximale Sichtbarkeit.
              </p>
            </li>
            <li className={styles.whyAgentLi}>
              <h4
                className={`${styles.whyAgentH4} ${isMobile ? styles.whyAgentH4Mobile : ''}`}
              >
                Verhandlungsexpertise
              </h4>
              <p
                className={`${styles.whyAgentP} ${isMobile ? styles.whyAgentPMobile : ''}`}
              >
                Als Vermittler führt der Makler faire und zielführende
                Verkaufsverhandlungen.
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`${styles.immoTonnImageBackground} ${isMobile ? styles.immoTonnImageBackgroundMobile : ''}`}
      >
        <div className={styles.contentWrapper}>
          <h3
            className={`${styles.immoTonnOverlayText} ${isMobile ? styles.immoTonnOverlayTextMobile : ''}`}
          >
            IMMO <br /> TONN
          </h3>
        </div>
      </div>
    </section>
  );
};
export default AgentBenefits;
