import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/add-property');
    }
  }, [navigate]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return 'The password must contain at least one special character.';
    }

    return null;
  };

  const handleChangePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setError('The new password must be different from the current one.');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);

      const token = sessionStorage.getItem('adminToken');

      await axios.put(
        '/auth/change-password',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess('Password successfully changed');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/immobilien');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        minHeight: '100dvh',
        padding: '20px',
        fontFamily: 'var(--Roboto)',
      }}
    >
      <h1>Passwortänderung</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      {success && (
        <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>
      )}

      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="currentPassword"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Aktuelles Passwort:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',
                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="newPassword"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Neues Passwort:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',

                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showNewPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {newPassword && (
            <div style={{ marginTop: '5px' }}>
              <div
                style={{
                  height: '5px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              ></div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: '5px',
            }}
          >
            Passwortbestätigung:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',
                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '3px' }}>
              Die Passwörter stimmen nicht überein
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              margin: '0',
              padding: '10px 15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              flex: '1',
            }}
          >
            {loading ? 'Speichern...' : 'Kennword ändern'}
          </button>

          <Link
            to="/immobilien"
            style={{
              padding: '10px 15px',
              background: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              textAlign: 'center',
              flex: '1',
            }}
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
