import React from 'react';

const Verkaufssupport: React.FC = () => {
  const containerStyle = {
    width: '1294px',
    margin: '20px auto',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  };

  const verkaufssupportStyle = {
    textAlign: 'center',
    padding: '20px',
    marginBottom: '30px',
  };

  const verkaufssupportImgStyle = {
    maxWidth: '80%',
    height: 'auto',
    marginBottom: '15px',
  };

  const verkaufssupportH2Style = {
    fontSize: '2.2em',
    color: '#333',
    marginBottom: '10px',
  };

  const warumMaklerStyle = {
    padding: '30px',
    marginBottom: '30px',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #eee',
  };

  const warumMaklerH3Style = {
    fontSize: '1.8em',
    color: '#333',
    marginBottom: '20px',
  };

  const warumMaklerUlStyle = {
    listStyle: 'none',
    padding: '0',
  };

  const warumMaklerLiStyle = {
    marginBottom: '25px',
  };

  const warumMaklerH4Style = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  };

  const warumMaklerPStyle = {
    color: '#777',
    lineHeight: '1.6',
  };

  const immoTonnStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: '#e0e0e0',
    marginBottom: '30px',
  };

  const immoTonnImgStyle = {
    maxWidth: '400px',
    height: 'auto',
    marginRight: '30px',
  };

  const immoTonnTextStyle = {
    flexGrow: '1',
  };

  const immoTonnTextH3Style = {
    fontSize: '1.8em',
    color: '#333',
    marginBottom: '15px',
  };

  const immoTonnTextUlStyle = {
    listStyle: 'none',
    padding: '0',
  };

  const immoTonnTextLiStyle = {
    marginBottom: '20px',
  };

  const immoTonnTextH4Style = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  };

  const immoTonnTextPStyle = {
    color: '#777',
    lineHeight: '1.6',
  };

  const kontaktButtonStyle = {
    display: 'block',
    width: '250px',
    margin: '30px auto',
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.1em',
    cursor: 'pointer',
    border: 'none',
  };

  const kontaktButtonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <div style={verkaufssupportStyle}>
        <img src="/public/images/verkaufssupport.svg" alt="Verkaufssupport" style={verkaufssupportImgStyle} />
        <h2 style={verkaufssupportH2Style}>VERKAUFSSUPPORT - MEHR ALS NUR VERMITTLUNG - RUNDUM-SERVICE VOM PROFI</h2>
      </div>

      <div style={warumMaklerStyle}>
        <h3 style={warumMaklerH3Style}>WARUM EIN MAKLER?</h3>
        <ul style={warumMaklerUlStyle}>
          <li style={warumMaklerLiStyle}>
            <h4 style={warumMaklerH4Style}>Marktanalyse & Beratung</h4>
            <p style={warumMaklerPStyle}>Fundierte Marktkenntnisse sichern den optimalen Angebotspreis für Ihre Immobilie.</p>
          </li>
          <li style={warumMaklerLiStyle}>
            <h4 style={warumMaklerH4Style}>Effektives Marketing</h4>
            <p style={warumMaklerPStyle}>Professionelle Präsentation und gezielte Vermarktungsstrategien für eine schnelle Vermittlung.</p>
          </li>
          <li style={warumMaklerLiStyle}>
            <h4 style={warumMaklerH4Style}>Verhandlungsgeschick</h4>
            <p style={warumMaklerPStyle}>Erfahrene Makler führen erfolgreiche Verkaufsverhandlungen.</p>
          </li>
          
        </ul>
      </div>

      <div style={immoTonnStyle}>
        <img src="/public/images/immo-tonn.svg" alt="IMMO TONN" style={immoTonnImgStyle} />
        <div style={immoTonnTextStyle}>
          <h3 style={immoTonnTextH3Style}>IMMO TONN</h3>
          <ul style={immoTonnTextUlStyle}>
            <li style={immoTonnTextLiStyle}>
              <h4 style={immoTonnTextH4Style}>Rechtliche Sicherheit</h4>
              <p style={immoTonnTextPStyle}>Wir kennen die aktuellen Richtlinien und begleiten Sie sicher bis zum Abschluss.</p>
            </li>
            <li style={immoTonnTextLiStyle}>
              <h4 style={immoTonnTextH4Style}>Umfassende Betreuung</h4>
              <p style={immoTonnTextPStyle}>Von der ersten Besichtigung bis zur Schlüsselübergabe - wir sind für Sie da.</p>
            </li>
            <li style={immoTonnTextLiStyle}>
              <h4 style={immoTonnTextH4Style}>Verlässlichkeit. Persönlich. Vor Ort.</h4>
              <p style={immoTonnTextPStyle}>Ihre Zufriedenheit ist unser Ziel. Wir sind persönlich für Sie da.</p>
            </li>
            {/* Добавьте остальные пункты списка по аналогии */}
          </ul>
        </div>
      </div>

      <button style={kontaktButtonStyle} onMouseOver={(e) => Object.assign(e.currentTarget.style, kontaktButtonHoverStyle)} onMouseOut={(e) => Object.assign(e.currentTarget.style, kontaktButtonStyle)}>KONTAKT AUFNEHMEN</button>
    </div>
  );
};

export default Verkaufssupport;