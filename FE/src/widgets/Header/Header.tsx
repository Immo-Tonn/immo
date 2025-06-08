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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer = open => () => {
    setIsMenuOpen(open);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Wertermittlung', path: '/wertermittlung' },
    { label: 'Immobilien', path: '/immobilien' },
    { label: 'Finanzierung', path: '/finanzierung' },
    { label: 'Kontakt', path: '/kontakt' },
  ];

  return (
    <header>
      <div className={styles.headerWrapper}>
        <div className={styles.headerTop}>
          <img className={styles.logo} src={logo} alt="logo" />

          <nav className={styles.nav}>
            {navLinks.map(link => (
              <NavLink key={link.path} to={link.path}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <IconButton
            className={styles.burger}
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="top"
            open={isMenuOpen}
            onClose={toggleDrawer(false)}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#1C1829',
                },
              },
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <img src={logo} alt="logo" style={{ height: '114px' }} />
              <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </div>

            <List sx={{ display: 'flex', padding: 0 }}>
              {navLinks.map(link => (
                <ListItem
                  key={link.path}
                  component={NavLink}
                  to={link.path}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText
                    primary={link.label}
                    sx={{
                      color: 'white',
                      fontSize: '20px',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Drawer>

          <div className={styles.contact}>
            <ul className={styles.headerContacts}>
              <li>
                <div className={styles.contactIcon}>
                  <img src={telephone} alt="phone" />
                </div>
                <a href="tel:01743454419" className={styles.contactText}>
                  0174 345 44 19
                </a>
              </li>
              <li>
                <div className={styles.contactIcon}>
                  <img src={eMail} alt="mail" />
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
                  <img src={location} alt="location" width={26} height={26} />
                </div>
                <a
                  href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster"
                  className={styles.contactText}
                >
                  Sessendrupweg 54
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster"
                  className={styles.contactText}
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
