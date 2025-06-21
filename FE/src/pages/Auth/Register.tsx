import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [adminExists, setAdminExists] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminExists = async (): Promise<void> => {
      try {
        setCheckingAdmin(true);

        console.log('Checking for an admin...');

        const response = await axios.get('/auth/admin-exists');
        console.log('Server response:', response.data);

        const exists = (response.data as { adminExists: boolean }).adminExists;
        console.log('Admin exists', exists);

        setAdminExists(exists);

        if (exists) {
          console.log('Redirect to login page...');
          navigate('/add-property');
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !fullName || !username || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }
    const validatePassword = (password: string): string | null => {
      if (password.length < 8) {
        return 'Пароль должен содержать минимум 8 символов';
      }

      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return 'Пароль должен содержать хотя бы один специальный символ';
      }

      return null;
    };

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Sending registration data...');

      await axios.post('/auth/register', {
        email,
        fullName,
        username,
        password,
      });

      console.log('Registration successful, redirecting...');

      navigate('/add-property');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h1>Checking system...</h1>
        <p>Please wait...</p>
      </div>
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
