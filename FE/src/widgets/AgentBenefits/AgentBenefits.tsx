import React, { useEffect, useRef } from 'react';
import styles from './AgentBenefits.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';

const AgentBenefits: React.FC = () => {
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { y: 100, x: -40 });
  }, []);

  return (
    <section ref={ref}>
      <div className={styles.wrapper}>
        <div className={styles.whyAgentSection}>
          <div className={styles.whyAgentContentWithLine}>
            <h3 className={styles.whyAgentH3}>warum ein makler?</h3>
            <ul className={styles.whyAgentUl}>
              <li className={styles.whyAgentLi}>
                <h4 className={styles.whyAgentH4}>Marktanalyse & Beratung</h4>
                <p className={styles.whyAgentP}>
                  Der Makler analysiert den Markt und empfiehlt den optimalen
                  Angebotspreis für Ihre Immobilie.
                </p>
              </li>
              <li className={styles.whyAgentLi}>
                <h4 className={styles.whyAgentH4}>Immobilienbewertung</h4>
                <p className={styles.whyAgentP}>
                  Mit modernen Verfahren ermittelt der Makler den realistischen
                  Marktwert.
                </p>
              </li>
              <li className={styles.whyAgentLi}>
                <h4 className={styles.whyAgentH4}>Effektives Marketing</h4>
                <p className={styles.whyAgentP}>
                  Professionelle Fotos, Exposés und gezielte Werbung sorgen für
                  maximale Sichtbarkeit.
                </p>
              </li>
              <li className={styles.whyAgentLi}>
                <h4 className={styles.whyAgentH4}>Verhandlungsexpertise</h4>
                <p className={styles.whyAgentP}>
                  Als Vermittler führt der Makler faire und zielführende
                  Verkaufsverhandlungen.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.immoTonnImageBackground}>
        <div className={styles.contentWrapper}>
          <h3 className={styles.immoTonnOverlayText}>
            IMMO <br /> TONN
          </h3>
        </div>
      </div>
    </section>
  );
};

export default AgentBenefits;
