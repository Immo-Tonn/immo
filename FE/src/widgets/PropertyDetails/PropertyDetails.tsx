import React from 'react';
import styles from './PropertyDetails.module.css';
import { PropertyDetailsProps, getPropertyDetails } from './models';
import { useNavigate } from 'react-router-dom';
import Button from '@shared/ui/Button/Button';

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className={styles.detailRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{String(value)}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className={styles.section}>
    <hr className={styles.hr} />
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  object,
  apartment,
  commercialBuilding,
  landPlot,
  residentialHouse,
}) => {
  const details = getPropertyDetails(
    object,
    apartment,
    commercialBuilding,
    landPlot,
    residentialHouse,
  );
  const navigate = useNavigate();

  return (
    <div className={styles.propertyLayout}>
      <div className={styles.mainContent}>
        {/* Центрированная кнопка, не выходящая за границы компонента */}
        <div className={styles.floatingButtonWrapper}>
          <button
            className={styles.calcButton}
            onClick={() => navigate('/finanzierung')}
          >
            Finanzierungsrechner
          </button>
        </div>

        <Section title="OBJEKTDATEN">
          <div className={styles.detailsLeft}>
            {Object.entries(details)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} />
              ))}
          </div>
        </Section>

        {(apartment?.additionalFeatures ||
          residentialHouse?.additionalFeatures ||
          commercialBuilding?.additionalFeatures) && (
          <Section title="AUSSTATTUNG">
            <p className={styles.narrowText}>
              {apartment?.additionalFeatures ??
                residentialHouse?.additionalFeatures ??
                commercialBuilding?.additionalFeatures}
            </p>
          </Section>
        )}

        {object.description && (
          <Section title="OBJEKTBESCHREIBUNG">
            <p className={styles.narrowText}>{object.description}</p>
          </Section>
        )}

        {object.location && (
          <Section title="LAGE">
            <p className={styles.narrowText}>{object.location}</p>
          </Section>
        )}

        {object.miscellaneous && (
          <Section title="SONSTIGES">
            <p className={styles.narrowText}>{object.miscellaneous}</p>
          </Section>
        )}
      </div>

      <aside className={styles.stickyAside}>
        <div className={styles.verticalDividerRight} />
        <div className={styles.detailsRight}>
          <div className={styles.tagline}>
            <p>Verlässlich.</p>
            <p>Persönlich.</p>
            <p>Vor Ort.</p>
          </div>
          <div className={styles.rightButton}>
            <Button
              initialText="Finanzierungsrechner"
              clickedText="Weiterleitung"
              className={styles.calcButton}
              onClick={() => navigate('/finanzierung')}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PropertyDetails;
