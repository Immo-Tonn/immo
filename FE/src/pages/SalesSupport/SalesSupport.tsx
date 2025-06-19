import { useState, useEffect } from 'react';
import styles from './SalesSupport.module.css';
import HeroSupport from '@widgets/hero/HeroSupport/HeroSupport';
import AgentBenefits from '@widgets/AgentBenefits/AgentBenefits';
import ImmoTonnContent from '@widgets/ImmoContent/ImmoTonnContent';

const SalesSupport: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= 576;
  const isTablet = screenWidth <= 765;

  return (
    <>
      <HeroSupport isMobile={isMobile} />
      <div
        className={`${styles.mainContentWrapper} ${isMobile ? styles.mainContentWrapperMobile : isTablet ? styles.mainContentWrapperTablet : ''}`}
      >
        <AgentBenefits isMobile={isMobile} isTablet={isTablet} />
        <ImmoTonnContent isMobile={isMobile} isTablet={isTablet} />
      </div>
    </>
  );
};

export default SalesSupport;
