import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';
import styles from './AdminDropdownMenu.module.css';

interface AdminDropdownMenuProps {
  onLogout: () => void;
}

const AdminDropdownMenu: React.FC<AdminDropdownMenuProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Обработчик клика вне меню для его закрытия
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик удаления регистрации админа
  const handleDeleteAdmin = async (): Promise<void> => {
    // Запрашиваем подтверждение пароля
    const confirmPassword = window.prompt(
      'Um das Löschen zu bestätigen, geben Sie Ihr Passwort ein:',
    );

    if (!confirmPassword) {
      return; // Отмена ввода или оставил поле пустым
    }

    try {
      const token = sessionStorage.getItem('adminToken');

      // Отправляем запрос на удаление админа
      await axios.delete('/auth/delete-admin', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: confirmPassword }, // Отправляем пароль для подтверждения
      });

      // После успешного удаления
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      alert('Adminregistrierung entfernt');
      navigate('/add-property');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Fehler beim Löschen der Registrierung');
    } finally {
      setIsMenuOpen(false);
    }
  };

  // Обработчик перехода на страницу смены пароля
  const handleChangePassword = () => {
    setIsMenuOpen(false);
    navigate('/change-password');
  };

  // Обработчик перехода на страницу создания объекта
  const handleCreateObject = () => {
    setIsMenuOpen(false);
    navigate('/create-object');
  };

  // Обработчик выхода
  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <div className={styles.adminDropdown} ref={menuRef}>
      <button
        className={styles.adminButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Admin
      </button>

      {isMenuOpen && (
        <div className={styles.adminDropdownContent}>
          {/* Кнопка смены пароля */}
          <button
            className={styles.adminDropdownItem}
            onClick={handleChangePassword}
          >
            Passwort ändern
          </button>
          {/* Кнопка создания объекта */}
            <button
              className={styles.adminDropdownItem}
              onClick={handleCreateObject}
            >
              Objekt erstellen
            </button>

          <button
            className={styles.adminDropdownItem}
            onClick={handleDeleteAdmin}
          >
            Registrierung löschen
          </button>
          <button className={styles.adminDropdownItem} onClick={handleLogout}>
            Ausloggen
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdownMenu;
