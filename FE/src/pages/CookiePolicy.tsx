import React from 'react';

export const CookiePolicy = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Cookie-Richtlinie</h1>

      <p>
        Diese Website verwendet Cookies, um bestimmte Funktionen bereitzustellen und die Benutzererfahrung zu verbessern.
        Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie diese Website besuchen.
      </p>

      <h2>Arten von Cookies</h2>
      <ul>
        <li><strong>Notwendige Cookies:</strong> Erforderlich für den Betrieb der Website.</li>
        <li><strong>Analyse-Cookies:</strong> Helfen uns zu verstehen, wie Besucher die Website nutzen.</li>
        <li><strong>Marketing-Cookies:</strong> Dienen der Anzeige relevanter Werbung.</li>
      </ul>

      <h2>Ihre Wahlmöglichkeiten</h2>
      <p>
        Sie können jederzeit Ihre Cookie-Einstellungen anpassen. Klicken Sie hierzu auf den Link
        <a href="/cookies" style={{ marginLeft: '6px' }}>Cookie-Einstellungen</a>.
      </p>

      <h2>Weitere Informationen</h2>
      <p>
        Weitere Informationen zur Verarbeitung Ihrer Daten finden Sie in unserer
        <a href="/datenschutz" style={{ marginLeft: '6px' }}>Datenschutzerklärung</a>.
      </p>
    </div>
  );
};
