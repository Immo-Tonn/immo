import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '@shared/assets/lottie/mail-sent.json';
// ✅ Новый способ импорта
import Confetti from 'react-confetti';
import styles from './DankePage.module.css';

const DankePage = () => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize(); // установить при монтировании
    window.addEventListener('resize', updateSize); // подписка

    return () => window.removeEventListener('resize', updateSize); // очистка
  }, []);

  return (
    <div className={styles.wrapper}>
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div className={styles.card}>
        <Lottie
          animationData={animationData} // ✅ Используем импортированный JSON
          style={{ width: 180, height: 180, marginBottom: 20 }}
        />
        <h1>Vielen Dank!</h1>
        <p>Ihre Nachricht wurde erfolgreich versendet.</p>
        <button onClick={() => navigate('/')}>Zurück zur Startseite</button>
      </div>
    </div>
  );
};

export default DankePage;
