import { useState, useEffect } from 'react';
import styles from './DynamicText.module.css';
const MobileText = () => (
  <>
    <h2>Das dürfen Sie von uns erwarten:</h2>
    <ul>
      <li>
        Reibungsloser Prozess von der ersten Idee bis zum erfolgreichen
        Abschluss
      </li>
      <li>Expertise im Verkauf von Bestands- und Neubauimmobilien seit 1985</li>
      <li>Starkes regionales Netzwerk und exklusive Vermarktungsstrategien</li>
      <li>Individuelle Betreuung durch ein erfahrenes und engagiertes Team</li>
      <li>Garantierter bester Service zu jeder Zeit</li>
    </ul>
  </>
);

const DesktopText = () => (
  <>
    <p>
      Mit einem professionellen Immobilienmakler an Ihrer Seite können Sie
      sicherstellen, dass der gesamte Prozess – von der ersten Idee bis zum
      erfolgreichen Abschluss – effizient, sicher und in Ihrem besten Interesse
      verläuft. Seit 1985 sind wir im Münsterland auf den Verkauf von Bestands‑
      und Neubauimmobilien spezialisiert und nutzen exklusive
      Vermarktungsstrategien sowie ein über Jahrzehnte gewachsenes regionales
      Netzwerk, um für jedes Objekt das optimale Ergebnis zu erzielen.
      <br />
      Unser erfahrenes Team begleitet Sie persönlich, hält Ihnen den Rücken frei
      und entwickelt sich kontinuierlich weiter, damit Sie jederzeit den besten
      Service erhalten.
    </p>
  </>
);

const DynamicText = () => {
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
    <div className={styles.textWrapper}>
      {isMobile ? <MobileText /> : <DesktopText />}
    </div>
  );
};

export default DynamicText;
