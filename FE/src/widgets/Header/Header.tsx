import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import styles from './Header.module.css';
import logo from '@shared/assets/header/logo.svg';
import telephone from '@shared/assets/header/telephone.svg';
import eMail from '@shared/assets/header/e-mail.svg';
import location from '@shared/assets/header/google.svg';

interface NavLink {
  label: string;
  path: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsMenuOpen(open);
  };

  const navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Wertermittlung', path: '/wertermittlung' },
    { label: 'Immobilien', path: '/immobilien' },
    { label: 'Finanzierung', path: '/finanzierung' },
    { label: 'Kontakt', path: '/kontakt' },
  ];

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className={styles.headerWrapper}>
        <div className={styles.headerTop}>
          <img className={styles.logo} src={logo} alt="logo" />

          <nav className={styles.nav}>
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : ''
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <IconButton
            className={styles.burgerButton}
            onClick={toggleDrawer(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="top"
            open={isMenuOpen}
            onClose={toggleDrawer(false)}
            slotProps={{
              paper: {
                className: styles.drawerPaper,
              },
            }}
          >
            <div className={styles.drawerHeader}>
              <img src={logo} alt="logo-mobile" className={styles.drawerLogo} />
              <IconButton
                onClick={toggleDrawer(false)}
                className={styles.drawerCloseButton}
                aria-label="Close menu"
              >
                <CloseIcon />
              </IconButton>
            </div>

            <List className={styles.drawerList}>
              {navLinks.map(link => (
                <ListItem
                  key={link.path}
                  component={NavLink}
                  to={link.path}
                  onClick={handleNavLinkClick}
                  className={styles.drawerListItem}
                >
                  <ListItemText
                    primary={link.label}
                    className={styles.listItemText}
                  />
                </ListItem>
              ))}
            </List>
          </Drawer>

          <div className={styles.contact}>
            <ul className={styles.headerContacts}>
              <li>
                <div className={styles.contactIcon}>
                  <img src={telephone} alt="Phone" />
                </div>
                <a href="tel:01743454419" className={styles.contactText}>
                  0174 345 44 19
                </a>
              </li>
              <li>
                <div className={styles.contactIcon}>
                  <img src={eMail} alt="email" />
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
                    alt="adress"
                    style={{ width: '26px', height: '26px' }}
                  />
                </div>
                <a
                  href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster/@52.000885,7.5495001,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9b0fb68b86337:0x6c01106fad5b0129!8m2!3d52.000885!4d7.552075!16s%2Fg%2F11bw3zj4mf?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                  className={styles.contactText}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sessendrupweg 54
                </a>
              </li>
              <li>
                <span className={styles.contactIcon}></span>
                <a
                  href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster/@52.000885,7.5495001,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9b0fb68b86337:0x6c01106fad5b0129!8m2!3d52.000885!4d7.552075!16s%2Fg%2F11bw3zj4mf?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                  className={styles.contactText}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  48161 Münster
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
