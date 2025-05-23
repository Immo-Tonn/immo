import React, { useState, useEffect } from 'react';
import styles from './PropertyHero.module.css';
import ImageGalleryModal from '../ImageGalleryModal/ImageGalleryModal';
import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
  Image,
} from '@shared/types/propertyTypes';

interface PropertyHeroProps {
  object: RealEstateObject;
  images?: Image[];
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  const { title, address, price, status } = object;

  const livingArea = residentialHouse?.livingArea ?? apartment?.livingArea;
  const numberOfRooms = residentialHouse?.numberOfRooms ?? apartment?.numberOfRooms;
  const plotArea = residentialHouse?.plotArea ?? landPlot?.plotArea;
  const commercialArea = commercialBuilding?.area;

  const previewImages = images.slice(0, 3);
  const hasMoreImages = images.length > 3;

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isMobile]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbClick = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const shouldShowStatus = status === 'sold' || status === 'reserved';
  const statusLabel = status === 'sold' ? 'VERKAUFT' : 'RESERVIERT';

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{title}</h1>

      {isMobile && images.length > 0 && (
        <div className={styles.carouselContainer}>
          <div className={styles.carouselWrapper} onClick={() => handleThumbClick(currentIndex)}>
            {shouldShowStatus && (
              <div className={styles.statusBadge}>{statusLabel}</div>
            )}
            <img
              src={images[currentIndex]?.url}
              alt={`Bild ${currentIndex + 1}`}
              className={styles.carouselImage}
            />
          </div>
        </div>
      )}

      {!isMobile && (
        <div className={styles.imageContainer}>
          {images.length > 0 && images[0] ? (
            <>
              <div className={styles.mainImageWrapper} onClick={() => handleThumbClick(0)}>
                {shouldShowStatus && (
                  <div className={styles.statusBadge}>{statusLabel}</div>
                )}
                <img
                  src={images[0].url}
                  alt="Objekt Hauptbild"
                  className={styles.mainImage}
                />
              </div>

              <div className={styles.sideImages}>
                {previewImages.slice(1).map((img, index) => {
                  const actualIndex = index + 1;
                  const isLastPreview = index === 1;
                  return (
                    <div
                      key={img.id}
                      className={`${styles.smallImageWrapper} ${
                        isLastPreview && hasMoreImages ? styles.overlayWrapper : ''
                      }`}
                      onClick={() => handleThumbClick(actualIndex)}
                    >
                      <img
                        src={img.url}
                        alt={`Bild ${actualIndex + 1}`}
                        className={styles.smallImage}
                      />
                      {isLastPreview && hasMoreImages && (
                        <div className={styles.overlay}>Mehr Bilder</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.placeholderImage}>Kein Bild verfügbar</div>
          )}
        </div>
      )}

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>{price.toLocaleString()} €</h3>
          <h6>Kaufpreis</h6>
        </div>

        {livingArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{livingArea} m²</h3>
              <h6>Wohnfläche</h6>
            </div>
          </>
        )}

        {numberOfRooms !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{numberOfRooms}</h3>
              <h6>Zimmer</h6>
            </div>
          </>
        )}

        {plotArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{plotArea} m²</h3>
              <h6>Grundstück</h6>
            </div>
          </>
        )}

        {commercialArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{commercialArea} m²</h3>
              <h6>Fläche</h6>
            </div>
          </>
        )}
      </div>

      <div className={styles.address}>
        {address.city}, {address.district}
      </div>

      {showModal && images.length > 0 && (
        <ImageGalleryModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setShowModal(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={handleThumbClick}
        />
      )}
    </section>
  );
};

export default PropertyHero;
