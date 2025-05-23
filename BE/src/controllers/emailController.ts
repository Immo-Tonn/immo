import { Request, Response } from "express";
import nodemailer from "nodemailer";
import axios from "axios";
import qs from "qs";

export const sendContactEmail = async (req: Request, res: Response) => {
  console.log("Kontaktformular empfangen:", req.body);

  const { name, email, phone, message, recaptchaToken } = req.body;
  console.log({recaptchaToken});
  
  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA-Token fehlt." });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY ist nicht gesetzt.");
    return res.status(500).json({ message: "Serverkonfiguration fehlerhaft." });
  }

  try {
    // Проверка reCAPTCHA (POST запрос)
    const captchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      qs.stringify({
        secret: secretKey,
        response: recaptchaToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!captchaRes.data.success) {
      console.error("reCAPTCHA-Überprüfung fehlgeschlagen:", captchaRes.data);
      return res
        .status(400)
        .json({ message: "reCAPTCHA-Überprüfung fehlgeschlagen" });
    }

    // Настройка транспорта для nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Опции письма
    const mailOptions = {
      from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Neue Kontaktanfrage",
      html: `
        <h3>Neue Nachricht von der Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Nachricht:</strong><br/>${message}</p>
      `,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Nachricht wurde erfolgreich versendet" });
  } catch (error) {
    console.error("E-Mail Fehler:", error);
    res.status(500).json({
      message: "Serverfehler beim Versenden der Nachricht",
    });
  }
};
