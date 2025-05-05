import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '@shared/assets/header/logo.svg';
import telephone from '@shared/assets/header/telephone.svg';
import eMail from '@shared/assets/header/e-mail.svg';
import location from '@shared/assets/header/google.svg';
const Header = () => {
  return (
    <header>
      <div className={styles.headerWrapper}>
        <div className={styles.headerTop}>
          <img className={styles.headerLogo} src={logo} alt="logo" />
          <div className={styles.headerMainRight}>
            <div className={styles.headerRight}>
              <ul className={styles.headerContacts}>
                <li>
                  <div className={styles.contactIcon}>
                    <img src={telephone} alt="phone" className="icon" />
                  </div>
                  <a href="tel:01743454419" className={styles.contactText}>
                    0174 345 44 19
                  </a>
                </li>
                <li>
                  <div className={styles.contactIcon}>
                    <img src={eMail} alt="mail" className="icon" />
                  </div>
                  <a
                    href="mailto:tonn_andreas@web.de"
                    className={styles.contactText}
                  >
                    tonn_andreas@web.de
                  </a>
                </li>
                <li>
                  <div className={styles.contactIcon}>
                    <img
                      src={location}
                      alt="location"
                      className="icon"
                      style={{ width: '26px', height: '26px' }}
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster/@52.000885,7.5495001,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9b0fb68b86337:0x6c01106fad5b0129!8m2!3d52.000885!4d7.552075!16s%2Fg%2F11bw3zj4mf?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                    className={styles.contactText}
                  >
                    Sessendrupweg 54
                  </a>
                </li>
                <li>
                  <div className={styles.contactIcon}></div>
                  <a
                    href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster/@52.000885,7.5495001,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9b0fb68b86337:0x6c01106fad5b0129!8m2!3d52.000885!4d7.552075!16s%2Fg%2F11bw3zj4mf?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                    className={styles.contactText}
                  >
                    48161 Münster
                  </a>
                </li>
              </ul>
            </div>
          </div>
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
      <div className={styles.headerMobile}>
        <ul className={styles.headerContactsMobile}>
          <li>
            <div className={styles.contactIcon}>
              <img src={eMail} alt="mail" className="icon" />
            </div>
            <a className={styles.contactText}>tonn_andreas@web.de</a>
          </li>
          <li>
            <div className={styles.contactIcon}>
              <img src={telephone} alt="phone" className="icon" />
            </div>
            <a className={styles.contactText}>0174 345 44 19</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
