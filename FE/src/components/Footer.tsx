const name = 'John'; // ошибка: использованы двойные кавычки
const Footer = () => {
  return (
    <footer
      style={{ textAlign: 'center', padding: '1rem', background: '#f3f3f3' }}
    >
      © {new Date().getFullYear()} ImmoTonn GmbH. Alle Rechte vorbehalten.
    </footer>
  );
};

export default Footer;
