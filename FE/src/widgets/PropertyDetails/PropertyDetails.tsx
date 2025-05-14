import React from 'react';
import styles from './PropertyDetails.module.css';

import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
} from '@pages/PropertyPage'; 

interface PropertyDetailsProps {
  object: RealEstateObject;
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
}

const renderDetailRow = (label: string, value: any) => (
  <div className={styles.detailRow} key={label}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{String(value)}</span>
  </div>
);

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ object, apartment, commercialBuilding, landPlot, residentialHouse}) => {


  const details: Record<string, any> = {
    Land: object.address?.country,
    'Nummer ID': object._id,
    Objektart: object.type,
    Wohnfläche: residentialHouse?.livingArea ?? apartment?.livingArea,
    Grundstück: residentialHouse?.plotArea ?? landPlot?.plotArea,
    Nutzfläche: residentialHouse?.usableArea,
    Baujahr: residentialHouse?.yearBuilt ?? apartment?.yearBuilt ?? commercialBuilding?.yearBuilt,
    Zimmern: residentialHouse?.numberOfRooms ?? apartment?.numberOfRooms,
    Schlafzimmer: residentialHouse?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
    Badezimmer: residentialHouse?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
    Etage: apartment?.floor,
    'Anzahl Etagen': apartment?.totalFloors ?? residentialHouse?.numberOfFloors,
    Garage: residentialHouse?.garageParkingSpaces,
    Energieeffizienzklasse:
      residentialHouse?.energyEfficiencyClass ??
      apartment?.energyEfficiencyClass ??
      commercialBuilding?.additionalFeatures,
    Energieträger:
      residentialHouse?.energySource ?? apartment?.energySource,
    Heizung:
      residentialHouse?.heatingType ?? apartment?.heatingType,
    'Frei ab': object.freeWith,
    Nutzung: commercialBuilding?.purpose ?? landPlot?.recommendedUsage,
    Infrastruktur: landPlot?.infrastructureConnection,
    Bebauungsplan: landPlot?.buildingRegulations,
  };

  const renderedRows = Object.entries(details)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => renderDetailRow(key, value));

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>OBJEKTDATEN</h2>
      <div className={styles.detailsContainer}>
        <div className={styles.detailsContent}>{renderedRows}</div>
        <div className={styles.verticalDivider} />
      </div>

      <hr className={styles.hr} />

      {(apartment?.additionalFeatures ||
        residentialHouse?.additionalFeatures ||
        commercialBuilding?.additionalFeatures) && (
        <>
          <h2 className={styles.sectionTitle}>AUSSTATTUNG</h2>
          <p className={styles.text}>
            {apartment?.additionalFeatures ??
              residentialHouse?.additionalFeatures ??
              commercialBuilding?.additionalFeatures}
          </p>
          <hr className={styles.hr} />
        </>
      )}

      {object.description && (
        <>
          <h2 className={styles.sectionTitle}>OBJEKTBESCHREIBUNG</h2>
          <p className={styles.text}>{object.description}</p>
          <hr className={styles.hr} />
        </>
      )}

      {object.location && (
        <>
          <h2 className={styles.sectionTitle}>LAGE</h2>
          <p className={styles.text}>{object.location}</p>
          <hr className={styles.hr} />
        </>
      )}

      {object.miscellaneous && (
        <>
          <h2 className={styles.sectionTitle}>SONSTIGES</h2>
          <p className={styles.text}>{object.miscellaneous}</p>
        </>
      )}
    </section>
  );
};

export default PropertyDetails;
