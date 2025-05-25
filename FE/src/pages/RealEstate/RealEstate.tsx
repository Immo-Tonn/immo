import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import placeholderImage from '@shared/assets/competence/light-bulding.webp';

type Property = {
  id: number;
  street: string;
  city: string;
  image: string;
  status?: 'VERKAUFT' | 'RESERVIERT';
};

const propertyList: Property[] = [
  {
    id: 1,
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
    status: 'VERKAUFT',
  },
  {
    id: 2,
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
    status: 'RESERVIERT',
  },
  {
    id: 3,
    street: 'Asseln Koenigstrasse',
    city: 'Dortmund',
    image: placeholderImage,
  },
  {
    id: 4,
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
          <PropertyCard
            key={property.id}
            street={property.street}
            city={property.city}
            image={property.image}
            status={property.status}
          />
        ))}
      </div>
    </div>
  );
};

export default RealEstate;
