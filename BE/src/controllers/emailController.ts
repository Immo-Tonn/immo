import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import axios from 'axios';
import qs from 'qs';

export const sendContactEmail = async (req: Request, res: Response) => {
  console.log('📥 Kontaktformular empfangen:', req.body);

  const { name, email, phone, message, recaptchaToken } = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY ist nicht gesetzt.');
    return res.status(500).json({ message: 'Serverkonfiguration fehlerhaft.' });
  }

  try {
    const captchaRes = await axios.post(
      verifyUrl,
      qs.stringify({
        secret: secretKey,
        response: recaptchaToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA-Token fehlt.' });
    }
    console.log('🔐 ReCAPTCHA Antwort:', captchaRes.data);

    if (!captchaRes.data.success) {
      console.error('❌ ReCAPTCHA-Überprüfung fehlgeschlagen');
      return res
        .status(400)
        .json({ message: 'reCAPTCHA-Überprüfung fehlgeschlagen' });
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.strato.de',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Neue Kontaktanfrage',
      html: `
        <h3>Neue Nachricht von der Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Nachricht:</strong><br/>${message}</p>
      `,
    };

    console.log('📤 Versende Nachricht an:', mailOptions.to);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Nachricht gesendet:', info.response);
    res.status(200).json({ message: 'Nachricht wurde erfolgreich versendet' });
  } catch (error: any) {
    console.error('❌ Fehler beim Mailversand:', error?.message || error);
    res.status(500).json({
      message: 'Serverfehler beim Versenden der Nachricht',
    });
  }
};
