import { Link, useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '@shared/assets/about-us/logo-white.svg';
import Button from '@shared/ui/Button/Button';

const Footer = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/kontakt');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.topStripe} />

      <div className={styles.wrapper}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <img src={logo} alt="logo" className={styles.footerLogo} />
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/legalnotice">Impressum</Link>
              </li>
              <li>
                <Link to="/privacypolicy">Datenschutz</Link>
              </li>
              <li>
                <Link to="/cancellationpolicy">Widerrufsrecht</Link>
              </li>
            </ul>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.footerCenter}>
              <p>Sessendrupweg 54</p>
              <p>48161 Münster</p>
              <p>Tel.: 0251 625 60 763</p>
              <p>Mobil: 0174 345 44 19</p>
              <p>www.tonn-versicherung.de</p>
            </div>

            <div className={styles.footerButtonWrapper}>
              <Button
                initialText="Kontaktieren Sie uns"
                className={styles.contactButton}
                clickedText="Weiterleitung"
                onClick={handleContactClick}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomStripe}>
        <p>Immo Tonn. All rights reserved 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
