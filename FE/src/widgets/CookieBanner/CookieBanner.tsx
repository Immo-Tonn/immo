import { useEffect, useState } from 'react';
import styles from "../CookieBanner/CookieBanner.module.css"

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'all');
    setVisible(false);
  };

  const acceptNecessaryCookies = () => {
    localStorage.setItem('cookiesAccepted', 'necessary');
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'none');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner}>
      <p>
        Diese Website verwendet Cookies, um Ihr Nutzererlebnis zu verbessern.
        Sie können Ihre Cookie-Einstellungen auswählen.
      </p>
      <div className={styles.buttons}>
        <button className={styles.primary} onClick={acceptCookies}>Alle akzeptieren</button>
        <button className={styles.secondary} onClick={acceptNecessaryCookies}>Nur notwendige Cookies</button>
        <button className={styles.secondary} onClick={declineCookies}>Ablehnen</button>
      </div>
    </div>
  );
};