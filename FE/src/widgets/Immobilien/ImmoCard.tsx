import styles from './Immo.module.css';
import imageUrl from '@shared/assets/immobilien/Haus.png';

type ImmoCardProps = {
  image: string;
  street: string;
  city: string;
  status?: 'VERKAUFT' | 'RESERVIERT';
};

const ImmoCard = ({ image, street, city, status }: ImmoCardProps) => {
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

export default ImmoCard;
