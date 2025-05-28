import { forwardRef } from 'react';
import styles from './PropertyCard.module.css';
import { PropertyHeroProps } from '../PropertyHero/models';
import { NavLink } from 'react-router-dom';

const PropertyCard = forwardRef<HTMLLIElement, PropertyHeroProps>(
  ({ object, images }, ref) => {
    const imageId = object?.images?.[0];
    const imageObj = images?.find(img => img._id === imageId);
    const backgroundUrl = imageObj?.url || null;

    const { title, address, price, status } = object;

    return (
      <li ref={ref} className={styles.cardItem}>
        <NavLink
          className={styles.cardLink}
          to={`http://localhost:5173/immobilien/${object._id}`}
        >
          <div className={styles.cardWrapper}>
            {backgroundUrl ? (
              <img src={backgroundUrl} alt={title} className={styles.image} />
            ) : (
              <p className={styles.errorTitle}>Kein photo verfügbar</p>
            )}
            <span className={styles.status}>{status}</span>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>{title}</div>
              <div className={styles.address}>{address?.city}</div>
              <div className={styles.details}>
                {price && <>Kaufpreis: {price} €</>}
              </div>
            </div>
          </div>
        </NavLink>
      </li>
    );
  },
);

export default PropertyCard;
