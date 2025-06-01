import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import Input from '@shared/ui/Input/Input';
import { ContactData, sendContactForm } from '../model/model';
import { useEffect, useRef, useState } from 'react';
import styles from './ContactForm.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@shared/ui/Button/Button';
import { fadeInOnScroll } from '@shared/anim/animations';
const ContactForm = () => {
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 50 } : { x: 100, y: -50 },
        );
    });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactData>();

  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ContactData) => {
    if (!captchaToken) {
      setCaptchaError('Bitte bestätigen Sie das CAPTCHA.');
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
      navigate('/kontakt/danke');
    } catch (err: any) {
      console.error('Fehler beim Absenden:', err);
      setSubmitError(
        err.message || 'Fehler beim Versenden. Bitte erneut versuchen.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper} ref={el => (refs.current[1] = el)}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Jetzt Kontakt aufnehmen</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {[
            {
              name: 'name',
              label: 'Vorname*',
              requiredMsg: 'Vorname ist erforderlich',
              autoComplete: 'given-name',
            },
            {
              name: 'surname',
              label: 'Nachname*',
              requiredMsg: 'Nachname ist erforderlich',
              autoComplete: 'family-name',
            },
            {
              name: 'email',
              label: 'E-Mail*',
              requiredMsg: 'E-Mail ist erforderlich',
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              patternMsg: 'Ungültige E-Mail-Adresse',
              autoComplete: 'email',
            },
            {
              name: 'phone',
              label: 'Telefon*',
              requiredMsg: 'Telefon ist erforderlich',
              pattern: /^[0-9+]{10,15}$/,
              patternMsg: 'Ungültige Telefonnummer',
              autoComplete: 'tel',
            },
          ].map(field => (
            <div key={field.name} className={styles.inputGroup}>
              <Input
                placeholder={field.label}
                autoComplete={field.autoComplete}
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
            <Input
              isTextarea
              placeholder="Nachricht"
              error={errors.message?.message}
              {...register('message', {
                required: 'Nachricht ist erforderlich',
                minLength: {
                  value: 5,
                  message: 'Nachricht ist zu kurz',
                },
              })}
            />
          </div>
          <div className={styles.checkboxContainer}>
            <Input
              id="consent"
              type="checkbox"
              {...register('consent', {
                required: 'Bitte stimmen Sie der Datenschutzerklärung zu.',
              })}
            />
            <label htmlFor="consent">
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
              hl="de"
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
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
            initialText="ABSCHICKEN"
            clickedText="Wird gesendet..."
          />
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
