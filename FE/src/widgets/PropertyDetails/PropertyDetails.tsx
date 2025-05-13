import React from 'react';

interface PropertyDetailsProps {
  object: any;
  apartment?: Record<string, any>;
  commercialBuilding?: Record<string, any>;
  landPlot?: Record<string, any>;
  residentialHouse?: Record<string, any>;
}

const renderDetails = (data: Record<string, any>, title: string) => {
  const entries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null);

  if (entries.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {entries.map(([key, value]) => (
          <li key={key}>
            <strong>{formatKey(key)}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatKey = (key: string) => {
  // Преобразует camelCase в "Camel Case"
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  object,
  apartment,
  commercialBuilding,
  landPlot,
  residentialHouse,
}) => {
  return (
    <section>
      <h2>Immobilieninformationen</h2>
      {renderDetails(object, 'Allgemeine Angaben')}
      {apartment && renderDetails(apartment, 'Wohnung')}
      {commercialBuilding && renderDetails(commercialBuilding, 'Gewerbegebäude')}
      {landPlot && renderDetails(landPlot, 'Grundstück')}
      {residentialHouse && renderDetails(residentialHouse, 'Haus')}
    </section>
  );
};

export default PropertyDetails;
