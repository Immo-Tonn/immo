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
  Video,
} from '@shared/types/propertyTypes';

interface PropertyHeroProps {
  object: RealEstateObject;
  images?: (Image | undefined)[];
  videos?: (Video | undefined)[];
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
}

const PropertyHero: React.FC<PropertyHeroProps> = ({
  object,
  images = [],
  videos = [],
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

  const filteredImages: Image[] = images.filter((img): img is Image => img !== undefined);
  const filteredVideos: Video[] = videos.filter((vid): vid is Video => vid !== undefined);
  const mediaItems: (Image | Video)[] = [...filteredImages, ...filteredVideos];

  // Ограничиваем количество медиа ровно тремя для превью
  const previewMedia = mediaItems.slice(0, 3);
  const hasMoreMedia = mediaItems.length > 3;

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || mediaItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [mediaItems.length, isMobile]);

const handlePrev = (e?: React.MouseEvent) => {
  e?.stopPropagation();
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
  );
};

const handleNext = (e?: React.MouseEvent) => {
  e?.stopPropagation();
  setCurrentIndex((prevIndex) =>
    prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
  );
};


  const handleThumbClick = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const shouldShowStatus = status === 'sold' || status === 'reserved';
  const statusLabel = status === 'sold' ? 'VERKAUFT' : 'RESERVIERT';

  const isVideo = (item: Image | Video): item is Video =>
    'thumbnailUrl' in item && item.url.startsWith('https://iframe.mediadelivery.net/play/');

  const currentMedia = mediaItems[currentIndex];
  const firstMedia = mediaItems[0];

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{title}</h1>

      {isMobile && currentMedia && (
        <div className={styles.carouselContainer}>
          <div className={styles.carouselWrapper} onClick={() => handleThumbClick(currentIndex)}>
            {shouldShowStatus && <div className={styles.statusBadge}>{statusLabel}</div>}
            {isVideo(currentMedia) ? (
              <div className={styles.videoFrameWrapper}>
                <iframe
                  src={currentMedia.url}
                  title={currentMedia.title || 'Video Player'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoFrame}
                />
              </div>
            ) : (
              <img
                src={currentMedia.url}
                alt={`Bild ${currentIndex + 1}`}
                className={styles.carouselImage}
              />
            )}
          </div>
        </div>
      )}

      {!isMobile && firstMedia && (
        <div className={styles.imageContainer}>
          <div
            className={styles.mainImageWrapper}
            onClick={() => handleThumbClick(0)}
            style={{ cursor: 'pointer' }}
          >
            {shouldShowStatus && <div className={styles.statusBadge}>{statusLabel}</div>}
            {isVideo(firstMedia) ? (
              <div className={styles.videoFrameWrapper}>
                <iframe
                  src={firstMedia.url}
                  title={firstMedia.title || 'Video Player'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoFrame}
                />
              </div>
            ) : (
              <img src={firstMedia.url} alt="Bild" className={styles.mainImage} />
            )}
          </div>

          <div className={styles.sideImages}>
            {previewMedia.slice(1, 3).map((item, idx) => {
              const actualIndex = idx + 1;
              const isLastPreview = idx === 1;
              const uniqueKey = isVideo(item) ? `video-${item.url}` : `image-${item.url}`;

              return (
                <div
                  key={uniqueKey}
                  className={`${styles.smallImageWrapper} ${
                    isLastPreview && hasMoreMedia ? styles.overlayWrapper : ''
                  }`}
                  onClick={() => handleThumbClick(actualIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  {isVideo(item) ? (
                    <div className={styles.videoFrameWrapper} style={{ pointerEvents: 'none' }}>
                      <iframe
                        src={item.url}
                        title={item.title || 'Video Player'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.videoFrame}
                      />
                    </div>
                  ) : (
                    <img src={item.url} alt={`Bild ${actualIndex + 1}`} className={styles.smallImage} />
                  )}
                  {isLastPreview && hasMoreMedia && <div className={styles.overlay}>Mehr Medien</div>}
                </div>
              );
            })}
          </div>
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

      {showModal && mediaItems.length > 0 && (
        <ImageGalleryModal
          images={mediaItems}
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
