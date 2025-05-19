import React from 'react';
import ImmoCard from '@widgets/Immobilien/ImmoCard';
import styles from './RealEstate.module.css'; // если есть стили для страницы

import placeholderImage from '@shared/assets/immobilien/Haus.png'; // твоя заглушка

const propertyList = [
  {
    id: 1,
    title: 'Moderne Wohnung in Berlin',
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
  },
  {
    id: 2,
    title: 'Familienhaus in München',
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
  },
  {
    id: 3,
    title: 'Altbauwohnung in Hamburg',
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
  },
  {
    id: 4,
    title: 'Penthouse in Frankfurt',
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
  },
];

const RealEstate = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Immobilienangebote</h1>
      <div className={styles.cardList}>
        {propertyList.map(property => (
          <ImmoCard
            key={property.id}
            title={property.title}
            street={property.street}
            city={property.city}
            image={property.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RealEstate;
