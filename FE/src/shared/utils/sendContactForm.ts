import axios from 'axios';

export type ContactFormPayload = {
  name: string;

  phone: string;
  email: string;
  message: string;
  consent: boolean;
  recaptchaToken: string;
};

export const sendContactForm = async (data: ContactFormPayload) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/email`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ Fehler beim Senden des Kontaktformulars:',
      error?.response || error,
    );
    throw new Error(
      error?.response?.data?.message || 'Unbekannter Fehler beim Senden.',
    );
  }
};
