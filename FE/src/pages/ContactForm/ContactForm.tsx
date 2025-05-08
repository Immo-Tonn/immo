import { useForm } from 'react-hook-form';
import Input from '@shared/ui/Input/Input';
import { ContactData } from './model';
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactData>();

  const onSubmit = (data: ContactData) => {
    console.log('Gesendet:', data);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Kontaktformular</h1>
      {isSubmitSuccessful ? (
        <p style={{ color: 'green' }}>
          Danke! Ihre Nachricht wurde erfolgreich versendet.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Name:"
            placeholder="Max Mustermann"
            {...register('name', {
              required: 'Name ist erforderlich',
              pattern: {
                value: /^[A-Za-zÄäÖöÜüß\s'-]{2,}$/,
                message: 'Ungültiger Name',
              },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Telefonnummer:"
            type="tel"
            placeholder="+49..."
            {...register('phone', {
              required: 'Telefonnummer ist erforderlich',
              pattern: {
                value: /^[0-9+]{10,15}$/,
                message: 'Ungültige Telefonnummer',
              },
            })}
            error={errors.phone?.message}
          />

          <Input
            label="E-Mail-Adresse:"
            type="email"
            placeholder="beispiel@email.de"
            {...register('email', {
              required: 'E-Mail ist erforderlich',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ungültige E-Mail-Adresse',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Ihre Nachricht:"
            isTextarea
            placeholder="Schreiben Sie uns etwas..."
            {...register('message', {
              required: 'Nachricht ist erforderlich',
              minLength: {
                value: 5,
                message: 'Nachricht ist zu kurz',
              },
            })}
            error={errors.message?.message}
          />

          <label style={{ display: 'block', margin: '0.5rem 0' }}>
            <input
              type="checkbox"
              {...register('consent', {
                required: 'Bitte stimmen Sie der Datenschutzerklärung zu.',
              })}
            />
            &nbsp; Ich stimme der Verarbeitung meiner Daten gemäß der
            Datenschutzerklärung zu.
          </label>
          {errors.consent && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>
              {errors.consent.message}
            </span>
          )}

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

export default ContactForm;
