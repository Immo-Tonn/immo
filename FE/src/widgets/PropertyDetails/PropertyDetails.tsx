import React from 'react';
import styles from './PropertyDetails.module.css';
import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
} from '@shared/types/propertyTypes';

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
  <>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
    <hr className={styles.hr} />
  </>
);

const getPropertyDetails = (
  object: RealEstateObject,
  apartment?: Apartment,
  commercial?: CommercialBuilding,
  land?: LandPlot,
  house?: ResidentialHouse
): Record<string, any> => ({
  Land: object.address?.country,
  'Nummer ID': object._id,
  Objektart: object.type,
  Wohnfläche: house?.livingArea ?? apartment?.livingArea,
  Grundstück: house?.plotArea ?? land?.plotArea,
  Nutzfläche: house?.usableArea,
  Baujahr: house?.yearBuilt ?? apartment?.yearBuilt ?? commercial?.yearBuilt,
  Zimmern: house?.numberOfRooms ?? apartment?.numberOfRooms,
  Schlafzimmer: house?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
  Badezimmer: house?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
  Etage: apartment?.floor,
  'Anzahl Etagen': apartment?.totalFloors ?? house?.numberOfFloors,
  Garage: house?.garageParkingSpaces,
  Energieeffizienzklasse: house?.energyEfficiencyClass ?? apartment?.energyEfficiencyClass ?? commercial?.additionalFeatures,
  Energieträger: house?.energySource ?? apartment?.energySource,
  Heizung: house?.heatingType ?? apartment?.heatingType,
  'Frei ab': object.freeWith,
  Nutzung: commercial?.purpose ?? land?.recommendedUsage,
  Infrastruktur: land?.infrastructureConnection,
  Bebauungsplan: land?.buildingRegulations,
});

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  object,
  apartment,
  commercialBuilding,
  landPlot,
  residentialHouse,
}) => {
  const details = getPropertyDetails(object, apartment, commercialBuilding, landPlot, residentialHouse);

  return (
    <section className={styles.section}>
      <Section title="OBJEKTDATEN">
        <div className={styles.detailsContainer}>
          <div className={styles.detailsContent}>
            {Object.entries(details)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} />
              ))}
          </div>
          <div className={styles.verticalDivider} />
        </div>
      </Section>

      {(apartment?.additionalFeatures ||
        residentialHouse?.additionalFeatures ||
        commercialBuilding?.additionalFeatures) && (
        <Section title="AUSSTATTUNG">
          <p className={styles.text}>
            {apartment?.additionalFeatures ??
              residentialHouse?.additionalFeatures ??
              commercialBuilding?.additionalFeatures}
          </p>
        </Section>
      )}

      {object.description && (
        <Section title="OBJEKTBESCHREIBUNG">
          <p className={styles.text}>{object.description}</p>
        </Section>
      )}

      {object.location && (
        <Section title="LAGE">
          <p className={styles.text}>{object.location}</p>
        </Section>
      )}

      {object.miscellaneous && (
        <Section title="SONSTIGES">
          <p className={styles.text}>{object.miscellaneous}</p>
        </Section>
      )}
    </section>
  );
};

export default PropertyDetails;
