import { useState } from 'react';
import Input from '@shared/ui/Input/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^[0-9+]{10,15}$/.test(phone);

  const isValidName = (name: string) => /^[A-Za-zÄäÖöÜüß\s'-]{2,}$/.test(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/[^0-9+]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === 'name') {
      const cleaned = value.replace(/[^A-Za-zÄäÖöÜüß\s'-]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.message
    ) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (!isValidName(formData.name)) {
      setError('Bitte geben Sie einen gültigen Namen ein.');
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError(
        'Bitte geben Sie eine gültige Telefonnummer ein (10–15 Ziffern).',
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (formData.message.length < 5) {
      setError('Ihre Nachricht ist zu kurz.');
      return;
    }

    if (!formData.consent) {
      setError('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }

    setError('');
    setSubmitted(true);
    console.log('Gesendet:', formData);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Kontaktformular</h1>
      {submitted ? (
        <p style={{ color: 'green' }}>
          Danke! Ihre Nachricht wurde erfolgreich versendet.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Name:"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Max Mustermann"
          />
          <Input
            label="Telefonnummer:"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+49..."
          />
          <Input
            label="E-Mail-Adresse:"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="beispiel@email.de"
          />
          <Input
            label="Ihre Nachricht:"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            isTextarea
            placeholder="Schreiben Sie uns etwas..."
          />

          <label style={{ display: 'block', margin: '0.5rem 0' }}>
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            &nbsp; Ich stimme der Verarbeitung meiner Daten gemäß der
            Datenschutzerklärung zu.
          </label>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            style={{ padding: '0.7rem 1.5rem', marginTop: '1rem' }}
          >
            Absenden
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
