import { useState, useEffect } from 'react';
import styles from './DynamicTitle.module.css';
const MobileTitle = () => (
  <>
    <h1> Ihr zuverlässiger Partner für Immobilien in NRW </h1>
  </>
);

const DesktopTitle = () => (
  <>
    <h1>
      Ihr zuverlässiger Partner für Immobilien in NRW – <br />
      Das dürfen Sie von uns erwarten:
    </h1>
  </>
);

const DynamicTitle = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 576px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 576px)');
    const handler = e => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className={styles.titleWrapper}>
      {isMobile ? <MobileTitle /> : <DesktopTitle />}
    </div>
  );
};

export default DynamicTitle;
