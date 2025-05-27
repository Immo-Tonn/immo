import styles from './PropertyCard.module.css';
import { PropertyHeroProps } from '../PropertyHero/models';
import { NavLink } from 'react-router-dom';

const PropertyCard = ({ object, images }: PropertyHeroProps) => {
  const imageId = object?.images?.[0];
  const imageObj = images?.find(img => img._id === imageId);
  const backgroundUrl = imageObj?.url || null;

  const { title, address, price } = object;

  return (
    <NavLink to={`http://localhost:5173/immobilien/${object._id}`}>
      <div className={styles.cardWrapper}>
        {backgroundUrl ? (
          <img src={backgroundUrl} alt={title} className={styles.image} />
        ) : (
          <p className={styles.errorTitle}>Kein photo verfügbar</p>
        )}
        <div className={styles.cardOverlay}>
          <div className={styles.cardTitle}>{title}</div>
          <div className={styles.address}>{address?.city}</div>
          <div className={styles.details}>
            {price && <>Kaufpreis: {price} €</>}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default PropertyCard;
