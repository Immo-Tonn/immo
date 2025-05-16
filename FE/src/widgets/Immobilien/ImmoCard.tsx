import styles from './Immo.module.css';
import imageUrl from '@shared/assets/immobilien/Haus.png';

type ImmoCardProps = {
  image: string;
  street: string;
  city: string;
};

const ImmoCard = ({ image, street, city }: ImmoCardProps) => {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay}>
        <div className={styles.street}>{street}</div>
        <div className={styles.city}>{city}</div>
      </div>
    </div>
  );
};

export default ImmoCard;
