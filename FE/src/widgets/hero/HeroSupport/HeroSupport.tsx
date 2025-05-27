// src/components/SalesSupport/HeaderSection.tsx
import React from 'react';
import styles from './HeroSupport.module.css';
import salesSupportImg from '@shared/assets/salessupport/sales-support-image.webp';
interface HeaderSectionProps {
  isMobile: boolean;
}

const HeroSupport: React.FC<HeaderSectionProps> = ({ isMobile }) => {
  return (
    <div className={styles.imageContainer}>
      <img
        src={salesSupportImg}
        alt="sales-support-image"
        className={styles.image}
      />
      <div
        className={`${styles.textOverlay} ${isMobile ? styles.textOverlayMobile : ''}`}
      >
        VERKAUFSSUPPORT - MEHR ALS NUR VERMITTLUNG - RUNDUM-SERVICE VOM PROFI
      </div>
    </div>
  );
};

export default HeroSupport;
