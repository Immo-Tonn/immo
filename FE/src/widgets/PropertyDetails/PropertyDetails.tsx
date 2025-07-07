import React from 'react';
import styles from './PropertyDetails.module.css';
import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
} from '@shared/types/propertyTypes';
import { useNavigate } from 'react-router-dom';

interface PropertyDetailsProps {
  object: RealEstateObject;
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
}

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className={styles.detailRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{String(value)}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles.section}>
    <hr className={styles.hr} />
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

const getPropertyDetails = (
  object: RealEstateObject,
  apartment?: Apartment,
  commercial?: CommercialBuilding,
  land?: LandPlot,
  house?: ResidentialHouse
): Record<string, any> => {
  return {
    Land: object.address?.country,
    'ID Nummer': object.number,
    Objektart: object.type,
    ...(apartment?.type && { Wohnungstyp: apartment.type }),
    ...(house?.type && {Haustyp: house.type}),
    ...(commercial?.buildingType && { Gebäudetyp: commercial.buildingType }),


    Wohnfläche: house?.livingArea ?? apartment?.livingArea,
    Grundstück: house?.plotArea ? `${house.plotArea} m²` : land?.plotArea ? `${land.plotArea} m²` : undefined,
    Nutzfläche: house?.usableArea,
    Baujahr: house?.yearBuilt ?? apartment?.yearBuilt ?? commercial?.yearBuilt,
    Zimmer: house?.numberOfRooms ?? apartment?.numberOfRooms,
    Schlafzimmer: house?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
    Badezimmer: house?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
    Etage: apartment?.floor,
    'Anzahl Etagen': apartment?.totalFloors ?? house?.numberOfFloors,
    Stellplätze: house?.garageParkingSpaces,
    Energieeffizienzklasse:
      house?.energyEfficiencyClass ?? apartment?.energyEfficiencyClass ?? commercial?.additionalFeatures,
    Energieträger: house?.energySource ?? apartment?.energySource,
    Heizung: house?.heatingType ?? apartment?.heatingType,
    'Frei ab': object.freeWith,
    Nutzung: commercial?.purpose ?? land?.recommendedUsage,
    Infrastruktur: land?.infrastructureConnection,
    Bebauungsplan: land?.buildingRegulations,
  };
};


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
    residentialHouse
  );
  const navigate = useNavigate();

  return (
    <div className={styles.propertyLayout}>
      <div className={styles.mainContent}>
        <div className={styles.floatingButtonWrapper}>
          <button className={styles.calcButton} onClick={() => navigate('/finanzierung')}>
            Finanzierungsrechner
          </button>
        </div>

          <Section title="OBJEKTDATEN">
     {object.status && (     
      <div className={styles.status}>
        <span className={styles.label}>Objektstatus:</span>
      <div className={styles.statusBanner}>       
        {object.status === 'active' && 'aktiv'}
        {object.status === 'sold' && 'verkauft'}
        {object.status === 'reserved' && 'reserviert'}
        {object.status === 'archived' && 'archiviert'}
      </div>
       </div>
     )}
 


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
            <button className={styles.calcButton} onClick={() => navigate('/finanzierung')}>
              Finanzierungsrechner
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PropertyDetails;