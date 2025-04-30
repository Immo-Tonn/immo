import React from "react";

const LegalNotice = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Impressum</h1>
      <p>
        <strong>Angaben gemäß § 5 TMG:</strong>
      </p>
      <p>
        ImmoTonn
        <br />
        Sessendrupweg 54
        <br />
        48161 Münster
        <br />
        Deutschland
      </p>

      <p>
        <strong>Vertreten durch:</strong>
        <br />
        Andreas Tonn
      </p>

      <p>
        <strong>Kontakt:</strong>
        <br />
        Telefon: 0251 625 60 763
        <br />
        E-Mail: tonn_andreas@web.de
      </p>

      <p>
        <strong>Umsatzsteuer-ID:</strong>
        <br />
        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
        DE123456789
      </p>
    </div>
  );
};

export default LegalNotice;
