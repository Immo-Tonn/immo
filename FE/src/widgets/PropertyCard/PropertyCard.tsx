import styles from './PropertyCard.module.css';

type PropertyCardProps = {
  image: string;
  street: string;
  city: string;
  status?: 'VERKAUFT' | 'RESERVIERT';
};

const PropertyCard = ({ image, street, city, status }: PropertyCardProps) => {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${image})` }}>
      {status && <div className={styles.statusBadge}>{status}</div>}
      <div className={styles.overlay}>
        <div className={styles.street}>{street}</div>
        <div className={styles.city}>{city}</div>
        <div className={styles.details}>
          Wohnfläche: 190 m²&nbsp;|&nbsp;7 Zimmer&nbsp;|&nbsp;Kaufpreis: 479000
          €
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
