import React from 'react';
import styles from './ImageGalleryModal.module.css';
import { Image, Video } from '@shared/types/propertyTypes';

interface ImageGalleryModalProps {
  images: (Image | Video)[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const isVideo = (item: Image | Video): item is Video => {
  return 'thumbnailUrl' in item;
};

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
}) => {
  const currentItem = images[currentIndex];
  if (!currentItem) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.videoModal} onClick={handleBackdropClick}>
      {/* Основной медиа-блок */}
      <div className={styles.videoWrapper}>
        {isVideo(currentItem) ? (
          <iframe
            key={currentItem.url}
            src={currentItem.url}
            title={currentItem.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.mediaContent}
          />
        ) : (
          <img
            src={currentItem.url}
            alt={`Image ${currentIndex + 1}`}
            className={styles.mediaContent}
          />
        )}
      </div>

      {/* Лента миниатюр */}
      <div className={styles.thumbnailRow}>
        {images.map((item, index) => {
          const active = index === currentIndex;
          const video = isVideo(item);
          const key = (item as any)._id ?? item.url ?? `media-${index}`;

          return (
            <div
              key={key}
              className={`${styles.thumbnail} ${active ? styles.active : ''}`}
              onClick={() => onSelect(index)}
            >
              {video ? (
                <>
                  <iframe
                    src={item.url}
                    title={item.title || 'Video Preview'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.thumbnailIframe}
                  />
                  <div className={styles.playIconThumb}>▶</div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={`Thumb ${index + 1}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <button className={styles.prevButton} onClick={onPrev}>‹</button>
      <button className={styles.nextButton} onClick={onNext}>›</button>
    </div>
  );
};

export default ImageGalleryModal;
