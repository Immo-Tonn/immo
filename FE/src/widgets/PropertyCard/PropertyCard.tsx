import { forwardRef } from 'react';
import styles from './PropertyCard.module.css';
import { PropertyHeroProps } from '@shared/types/propertyTypes';
import { NavLink } from 'react-router-dom';

const PropertyCard = forwardRef<HTMLLIElement, PropertyHeroProps>(
  ({ object, images, residentialHouse }, ref) => {
    const imageId = object?.images?.[0];
    const imageObj = images?.find(img => img._id === imageId);
    const backgroundUrl = imageObj?.url || null;

    const { title, address, price, status } = object;

    const livingArea = residentialHouse?.livingArea;
    const numberOfRooms = residentialHouse?.numberOfRooms;

    return (
      <li ref={ref}>
        <NavLink to={`/immobilien/${object._id}`}>
          <div className={styles.cardWrapper}>
            {backgroundUrl ? (
              <img src={backgroundUrl} alt={title} className={styles.image} />
            ) : (
              <p className={styles.errorTitle}>Kein Foto verfügbar</p>
            )}
            <span className={styles.status}>{status}</span>
            <div className={styles.cardOverlay}>
              <p className={styles.cardTitle}>{title}</p>
              <p className={styles.address}>{address?.city}</p>
              <div className={styles.details}>
                {price !== undefined && <p>Kaufpreis: {price} € </p>}
                {livingArea !== undefined && (
                  <p>| Wohnfläche: {livingArea} m² | </p>
                )}
                {numberOfRooms !== undefined && <p> {numberOfRooms} Zimmer</p>}
              </div>
            </div>
          </div>
        </NavLink>
      </li>
    );
  },
);

export default PropertyCard;
