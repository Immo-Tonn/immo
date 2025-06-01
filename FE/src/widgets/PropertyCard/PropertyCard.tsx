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
      <li ref={ref}>
        <NavLink to={`http://localhost:5173/immobilien/${object._id}`}>
          <div className={styles.cardWrapper}>
            {backgroundUrl ? (
              <img src={backgroundUrl} alt={title} className={styles.image} />
            ) : (
              <p className={styles.errorTitle}>Kein photo verfügbar</p>
            )}
            <span className={styles.status}>{status}</span>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>
                <p>{title}</p>
              </div>
              <div className={styles.address}>
                <p>{address?.city}</p>
              </div>
              <div className={styles.details}>
                {price && <p>Kaufpreis: {price} €</p>}
              </div>
            </div>
          </div>
        </NavLink>
      </li>
    );
  },
);

export default PropertyCard;
