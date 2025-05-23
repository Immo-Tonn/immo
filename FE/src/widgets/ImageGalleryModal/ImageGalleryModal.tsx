import Button from '@shared/ui/Button/Button';
import styles from './ImageGalleryModal.module.css';

interface Image {
  id: string;
  url: string;
  type: string;
}

interface ImageGalleryModalProps {
  images: Image[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
}) => {
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalImageWrapper}>
          <Button
            initialText="‹"
            clickedText="‹"
            className={styles.navLeft}
            onClick={onPrev}
          />
          <img
            src={currentImage.url}
            alt="Großbild"
            className={styles.modalImage}
          />
          <Button
            initialText="›"
            clickedText="›"
            className={styles.navRight}
            onClick={onNext}
          />
        </div>

        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Thumb ${index + 1}`}
              className={`${styles.thumbnail} ${
                index === currentIndex ? styles.activeThumbnail : ''
              }`}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
