import React from 'react';
import styles from './ImageGalleryModal.module.css';
import { Image, Video } from '@shared/types/propertyTypes';
import Button from '@shared/ui/Button/Button';

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
      <div className={styles.videoWrapper}>
        <button className={styles.closeButton} onClick={onClose}>
        ×
        </button>
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
      <div className={styles.thumbnailRow}>
        {images.map((item: Image | Video, index) => {
          const active = index === currentIndex;
          const key = (item as any)._id ?? item.url ?? `media-${index}`;

          return (
            <div
              key={key}
              className={`${styles.thumbnail} ${active ? styles.active : ''}`}
              onClick={() => onSelect(index)}
            >
              <img
                src={isVideo(item) ? item.thumbnailUrl : item.url}
                alt={
                  isVideo(item)
                    ? item.title || 'Video preview'
                    : `Thumb ${index + 1}`
                }
                className={styles.thumbnailImage}
              />
              {isVideo(item) && <div className={styles.playIconThumb}>▶</div>}
            </div>
          );
        })}
      </div>

      <Button
        initialText="‹"
        clickedText="‹"
        className={styles.prevButton}
        onClick={onPrev}
      />
      <Button
        initialText="›"
        clickedText="›"
        className={styles.nextButton}
        onClick={onNext}
      />
    </div>
  );
};

export default ImageGalleryModal;
