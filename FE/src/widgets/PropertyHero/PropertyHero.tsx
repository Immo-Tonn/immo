import React, { useState } from 'react';
import styles from './PropertyHero.module.css';

interface Address {
  city: string;
  zip: number;
}

interface Image {
  id: string;
  url: string;
  type: string;
}

interface Apartment {
  livingArea?: number;
  numberOfRooms?: number;
}

interface LandPlot {
  plotArea?: number;
}

interface ResidentialHouse {
  livingArea?: number;
  numberOfRooms?: number;
  plotArea?: number;
}

interface CommercialBuilding {
  area?: number;
}

interface RealEstateObject {
  description: string;
  address: Address;
  price: number;
}

interface PropertyHeroProps {
  object: RealEstateObject;
  images?: Image[];
  apartment?: Apartment;
  residentialHouse?: ResidentialHouse;
  landPlot?: LandPlot;
  commercialBuilding?: CommercialBuilding;
}

const PropertyHero: React.FC<PropertyHeroProps> = ({
  object,
  images = [],
  apartment,
  residentialHouse,
  landPlot,
  commercialBuilding,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { description, address, price } = object;

  const livingArea =
    residentialHouse?.livingArea ?? 
    apartment?.livingArea ?? 
    undefined;

  const numberOfRooms =
    residentialHouse?.numberOfRooms ?? 
    apartment?.numberOfRooms ?? 
    undefined;

  const plotArea =
    residentialHouse?.plotArea ?? 
    landPlot?.plotArea ?? 
    undefined;

  const commercialArea = commercialBuilding?.area;

  const previewImages = images.slice(0, 3);
  const hasMoreImages = images.length > 3;

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{description}</h1>

      <div className={styles.imageContainer}>
        {images.length > 0 && (
          <img src={images[0].url} alt="Objekt Hauptbild" className={styles.mainImage} />
        )}

        <div className={styles.sideImages}>
          {previewImages.slice(1).map((img, index) => (
            <div
              key={img.id}
              className={`${styles.smallImageWrapper} ${
                index === 1 && hasMoreImages ? styles.overlayWrapper : ''
              }`}
              onClick={() => index === 1 && hasMoreImages && setShowModal(true)}
            >
              <img src={img.url} alt={`Bild ${index + 2}`} className={styles.smallImage} />
              {index === 1 && hasMoreImages && (
                <div className={styles.overlay}>Mehr Bilder</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span>{price.toLocaleString()} €</span>
          <strong>Kaufpreis</strong>
        </div>

        {livingArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <span>{livingArea} m²</span>
              <strong>Wohnfläche</strong>
            </div>
          </>
        )}

        {numberOfRooms !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <span>{numberOfRooms}</span>
              <strong>Zimmer</strong>
            </div>
          </>
        )}

        {plotArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <span>{plotArea} m²</span>
              <strong>Grundstück</strong>
            </div>
          </>
        )}

        {commercialArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <span>{commercialArea} m²</span>
              <strong>Fläche</strong>
            </div>
          </>
        )}
      </div>

      <div className={styles.address}>
        {address.city}, {address.zip}
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent}>
            {images.map((img) => (
              <img key={img.id} src={img.url} alt="Vollbild" className={styles.modalImage} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyHero;