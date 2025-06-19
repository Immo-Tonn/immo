// immo/FE/src/pages/Auth/Register.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Layout from "../../components/Layout";
import axios from '@features/utils/axiosConfig';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [adminExists, setAdminExists] = useState<boolean>(false); // Изначально считаем, что админа нет
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true); // Состояние проверки
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Проверка наличия администратора в системе
  useEffect(() => {
    const checkAdminExists = async (): Promise<void> => {
      try {
        setCheckingAdmin(true);
        // Добавим логирование для отладки
        console.log('Проверка наличия админа...');

        const response = await axios.get('/auth/admin-exists');
        console.log('Ответ сервера:', response.data);

        const exists = (response.data as { adminExists: boolean }).adminExists;
        console.log('Админ существует:', exists);

        setAdminExists(exists);

        // Если админ уже существует, перенаправляем на страницу входа
        if (exists) {
          console.log('Перенаправление на страницу входа...');
          navigate('/add-property');
        }
      } catch (error) {
        console.error('Ошибка при проверке админа:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, [navigate]);

  // Обработчик регистрации
  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Проверка наличия всех полей
    if (!email || !fullName || !username || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }

    // // Проверка длины пароля
    // if (password.length < 8) {
    //   setError('Пароль должен содержать минимум 8 символов');
    //   return;
    // }

    // Валидация пароля
    const validatePassword = (password: string): string | null => {
      if (password.length < 8) {
        return 'Пароль должен содержать минимум 8 символов';
      }

      //     if (!/\d/.test(password)) {
      //       return "Пароль должен содержать хотя бы одну цифру";
      //     }

      //     if (!/[A-Z]/.test(password)) {
      //       return "Пароль должен содержать хотя бы одну заглавную букву";
      //     }

      //     if (!/[a-z]/.test(password)) {
      //       return "Пароль должен содержать хотя бы одну строчную букву";
      //     }

      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return 'Пароль должен содержать хотя бы один специальный символ';
      }

      return null;
    };

    // Проверка сложности пароля
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Добавим логирование
      console.log('Отправка данных регистрации...');

      await axios.post('/auth/register', {
        email,
        fullName,
        username,
        password,
      });

      console.log('Регистрация успешна, перенаправление...');

      // После успешной регистрации перенаправляем на страницу входа
      navigate('/add-property');
    } catch (error: any) {
      console.error('Ошибка регистрации:', error.response?.data || error);
      setError(error.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  // Если идет проверка, показываем индикатор загрузки
  if (checkingAdmin) {
    return (
      // <Layout>
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h1>Проверка системы...</h1>
        <p>Пожалуйста, подождите...</p>
      </div>
      // </Layout>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin-registrierung</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      {adminExists ? (
        <div>
          <p>Der Administrator ist bereits im System registriert.</p>
          <Link to="/add-property" style={{ color: '#2196F3' }}>
            Zur Login-Seite
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="fullName"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Vor- und Nachname:
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="username"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Benutzername:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Пароль:
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                // type="password"
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: 'grey',
                  borderWidth: '0.5px',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  flex: '1',
                  height: '36px',
                  fontSize: '16px',
                  padding: '0 10px',
                  marginTop: '2px',
                  border: '1px solid #ccc',
                  borderLeft: 'none',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div style={{ marginTop: '20px' }}>
            <Link to="/add-property" style={{ color: '#2196F3' }}>
              Zurück zur Anmeldeseite
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
