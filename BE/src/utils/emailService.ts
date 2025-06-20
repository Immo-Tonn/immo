import nodemailer from 'nodemailer';

// Create a transport for sending email
const createTransport = () => {
  console.log('Creating a transport with settings:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
  });
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ADMIN, // your email address
      pass: process.env.EMAIL_ADMIN_PASS, // password or app-specific password
    },
    // Additional settings for GMX
    tls: {
      rejectUnauthorized: false, // In some cases this may be necessary
    },
    debug: true, // To debug SMTP connection
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  tempPassword: string,
): Promise<boolean> => {
  try {
    console.log('Start sending email to address:', email);
    const transporter = createTransport();

    // Проверка соединения
    try {
      const verify = await transporter.verify();
      console.log('Checking SMTP connection:', verify);
    } catch (verifyError) {
      console.error('Error checking SMTP connection:', verifyError);
    }

    const info = await transporter.sendMail({
      from: `"Admin Immobilien" <${process.env.EMAIL_ADMIN}>`,
      to: email,
      subject: 'Reset password for admin panel',
      text: `Your new temporary password: ${tempPassword}\n\nAfter logging in, we recommend changing your password to a more secure one.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2>Passwort für das Admin-Panel zurücksetzen</h2>
          <p>Sie haben eine Zurücksetzung des Passworts für das Admin-Panel Ihrer Immobilien-Website angefordert.</p>
          <p>Ihr neues temporäres Passwort: <strong>${tempPassword}</strong></p>
          <p>Wir empfehlen Ihnen, nach der Anmeldung Ihr Passwort in ein sichereres zu ändern.</p>
          <p>Mit freundlichen Grüßen,<br>Ihr Immobilien Team</p>
        </div>
      `,
    });

    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
