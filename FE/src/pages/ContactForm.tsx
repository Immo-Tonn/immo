import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';
import { sendContactForm } from '@shared/utils/sendContactForm';
import { useNavigate } from 'react-router-dom'; // ✅ Добавлено для перехода
import styles from './ContactForm.module.css';

type ContactData = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactData>();

  const navigate = useNavigate(); // ✅ Навигатор для перехода
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❌ Старое состояние успеха — закомментировано
  // const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ContactData) => {
    if (!captchaToken) {
      setCaptchaError('Bitte bestätigen Sie das CAPTCHA.');
      // setIsSuccess(false); // ❌ если будешь возвращать — раскомментируй
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactForm({
        ...data,
        recaptchaToken: captchaToken,
      });

      reset();
      setCaptchaToken(null);

      // ✅ Новый вариант: переход на страницу Dankeseite
      navigate('/kontakt/danke');

      // ❌ Старый вариант: показать сообщение на той же странице
      // setIsSuccess(true);
    } catch (err: any) {
      console.error('Fehler beim Absenden:', err);
      // setIsSuccess(false); // ❌ если вернёшь старый подход
      setSubmitError(
        err.message || 'Fehler beim Versenden. Bitte erneut versuchen.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.verticalLineLeft}></div>
      <div className={styles.verticalLineRight}></div>

      <div className={styles.container}>
        <h2 className={styles.heading}>Jetzt Kontakt aufnehmen</h2>

        {/* ❌ Старая реализация успеха — закомментирована */}
        {/*
        {isSuccess ? (
          <p className={styles.success}>
            Danke! Ihre Nachricht wurde erfolgreich versendet.
          </p>
        ) : (
        */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {[
            {
              name: 'name',
              label: 'Vorname*',
              requiredMsg: 'Vorname ist erforderlich',
            },
            {
              name: 'surname',
              label: 'Nachname*',
              requiredMsg: 'Nachname ist erforderlich',
            },
            {
              name: 'email',
              label: 'E-Mail*',
              requiredMsg: 'E-Mail ist erforderlich',
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              patternMsg: 'Ungültige E-Mail-Adresse',
            },
            {
              name: 'phone',
              label: 'Telefon*',
              requiredMsg: 'Telefon ist erforderlich',
              pattern: /^[0-9+]{10,15}$/,
              patternMsg: 'Ungültige Telefonnummer',
            },
          ].map(field => (
            <div key={field.name} className={styles.inputGroup}>
              <input
                placeholder={field.label}
                className={styles.input}
                {...register(field.name as keyof ContactData, {
                  required: field.requiredMsg,
                  ...(field.pattern && {
                    pattern: {
                      value: field.pattern,
                      message: field.patternMsg,
                    },
                  }),
                })}
              />
              {errors[field.name as keyof ContactData] && (
                <span className={styles.error}>
                  {errors[field.name as keyof ContactData]?.message as string}
                </span>
              )}
            </div>
          ))}

          <div className={styles.inputGroup}>
            <textarea
              placeholder="Nachricht"
              className={styles.textarea}
              {...register('message', {
                required: 'Nachricht ist erforderlich',
                minLength: {
                  value: 5,
                  message: 'Nachricht ist zu kurz',
                },
              })}
            />
            {errors.message && (
              <span className={styles.error}>{errors.message.message}</span>
            )}
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              {...register('consent', {
                required: 'Bitte stimmen Sie der Datenschutzerklärung zu.',
              })}
            />
            <label>
              Ja, ich habe die Datenschutzerklärung gelesen und bin damit
              einverstanden, dass meine Angaben zur Kontaktaufnahme und für
              Rückfragen elektronisch gespeichert und verarbeitet werden.
            </label>
          </div>
          {errors.consent && (
            <span className={styles.error}>{errors.consent.message}</span>
          )}

          <div className={styles.captchaContainer}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="normal"
              onChange={token => {
                setCaptchaToken(token);
                setCaptchaError(null);
              }}
              onExpired={() => {
                setCaptchaToken(null);
                setCaptchaError(
                  'CAPTCHA ist abgelaufen, bitte erneut bestätigen.',
                );
              }}
            />
            {captchaError && <p className={styles.error}>{captchaError}</p>}
          </div>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gesendet...' : 'ABSCHICKEN'}
          </button>
        </form>
        {/* )} */}
      </div>
    </div>
  );
};

export default ContactForm;
