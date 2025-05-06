import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '@shared/assets/header/logo.svg';
import telephone from '@shared/assets/header/telephone.svg';
import eMail from '@shared/assets/header/e-mail.svg';
import location from '@shared/assets/header/google.svg';
const Header = () => {
  return (
    <header>
      <div className={styles.headerTop}>
        <div className={styles.headerLogo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.headerMainRight}>
          <div className={styles.headerRight}>
            <ul className={styles.headerContacts}>
              <li>
                <div className={styles.contactIcon}>
                  <img src={telephone} alt="phone" className="icon" />
                </div>
                <div className={styles.contactText}>0174 345 44 19</div>
              </li>
              <li>
                <div className={styles.contactIcon}>
                  <img src={eMail} alt="mail" className="icon" />
                </div>
                <div className={styles.contactText}>tonn_andreas@web.de</div>
              </li>
              <li>
                <div className={styles.contactIcon}>
                  <img
                    src={location}
                    alt="location"
                    className="icon"
                    style={{ width: '47px', height: '49px' }}
                  />
                </div>
                <div className={styles.contactText}>Sessendrupweg 54</div>
              </li>
              <li>
                <div className={styles.contactIcon}></div>
                <div className={styles.contactText}>48161 Münster</div>
              </li>
            </ul>
          </div>

          <div className={styles.headerNav}>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/wertermittlung">Wertermittlung</NavLink>
              </li>
              <li>
                <NavLink to="/immobilien">Immobilien</NavLink>
              </li>
              <li>
                <NavLink to="/finanzierung">Finanzierung</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.headerMobile}>
        <ul className={styles.headerContactsMobile}>
          <li>
            <div className={styles.contactIcon}>
              <img src={telephone} alt="phone" className="icon" />
            </div>
            <div className={styles.contactText}>0174 345 44 19</div>
          </li>
          <li>
            <div className={styles.contactIcon}>
              <img src={eMail} alt="mail" className="icon" />
            </div>
            <div className={styles.contactText}>tonn_andreas@web.de</div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
