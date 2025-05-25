import React, { useState, useEffect } from 'react';

const Verkaufssupport: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= 576;
  const isTablet = screenWidth <= 768;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const imageContainerStyle: React.CSSProperties = {
    zIndex: 1,
    width: '100%',
    maxWidth: 'none',
    height: 'auto',
    position: 'relative',
  };

  const imageStyle: React.CSSProperties = {
    zIndex: 2,
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  };

  const textOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    color: 'white',
    padding: isMobile ? '10px' : '15px',
    textAlign: 'center',
    boxSizing: 'border-box',
    zIndex: 3,
    fontSize: isMobile ? '20px' : '36px', // Уменьшаем размер шрифта на мобильных
    backgroundColor: 'rgba(20, 31, 40, 0.7)',
  };

  const mainContentWrapperStyle: React.CSSProperties = {
    width: isMobile ? 'calc(100% - 20px)' : (isTablet ? 'calc(100% - 40px)' : '1294px'), // Учитываем padding на мобильных
    margin: '20px auto',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: isMobile ? '10px' : (isTablet ? '10px 20px' : '20px'), // 10px со всех сторон для мобильных
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    overflow: 'hidden', // Скрываем горизонтальную прокрутку
    boxSizing: 'border-box', // Учитываем padding в расчете ширины
  };

  const warumMaklerSectionStyle: React.CSSProperties = {
    maxWidth: isTablet ? '100%' : '800px',
    width: '100%',
    margin: '0 auto',
    padding: isTablet ? '10px 0' : '20px 0',
    display: 'flex',
    flexDirection: isTablet ? 'column' : 'row', // Колонкой на планшете/мобильном
    alignItems: isTablet ? 'center' : 'flex-start', // Центрируем элементы на планшете/мобильном
    justifyContent: 'center',
  };

  const warumMaklerContentWithLineStyle: React.CSSProperties = {
    flexGrow: 1,
    maxWidth: isTablet ? '100%' : '600px',
    boxSizing: 'border-box',
    paddingRight: isTablet ? '0' : '30px', // Убираем правый padding на планшете/мобильном
    borderRight: isTablet ? 'none' : '2px solid black', // Убираем вертикальную линию на планшете/мобильном
    borderBottom: isTablet ? '2px solid black' : 'none', // Горизонтальная линия для планшета/мобильного
    paddingBottom: isTablet ? '20px' : '0', // Добавляем padding под линию для планшета/мобильного
    marginBottom: isTablet ? '20px' : '0', // Добавляем margin
    width: '100%', // Занимаем всю доступную ширину
  };

  const warumMaklerH3Style: React.CSSProperties = {
    textAlign: 'center', // Всегда по центру на мобильных/планшетах
    marginBottom: '30px',
    color: '#333',
  };

  const warumMaklerUlStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Всегда центрируем элементы списка на планшете/мобильном
  };

  const warumMaklerLiStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '10px', // Единый padding для мобильных/планшетов
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    lineHeight: '1.6',
    marginBottom: '20px',
    width: '90%', // 90% ширины для мобильных/планшетов
    boxSizing: 'border-box',
    textAlign: 'center', // Всегда центрируем текст на мобильных/планшетах
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    borderRadius: '5px',
  };

  const warumMaklerH4Style: React.CSSProperties = {
    color: '#333',
    marginBottom: '5px',
    fontSize: isMobile ? '1em' : '1.1em', // Адаптивный размер шрифта
  };

  const warumMaklerPStyle: React.CSSProperties = {
    color: '#555',
    fontSize: isMobile ? '0.8em' : '0.95em', // Адаптивный размер шрифта
    lineHeight: '1.5',
  };

  const immoTonnImageBackgroundStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: isMobile ? '200px' : '450px', // Уменьшаем высоту на мобильных
    backgroundImage: 'url(/public/images/immo-tonn.svg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '20px',
    boxSizing: 'border-box',
  };

  const immoTonnOverlayTextStyle: React.CSSProperties = {
    position: 'absolute',
    right: isMobile ? '15px' : '40px',
    bottom: isMobile ? '40px' : '100px',
    fontSize: isMobile ? '20px' : '48px', // Уменьшаем размер шрифта на мобильных
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '8px 15px',
    borderRadius: '5px',
    textAlign: 'right',
    lineHeight: '1.2',
  };

  const immoTonnContentSectionStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '1294px',
    margin: '0 auto',
    padding: isMobile ? '10px 0' : (isTablet ? '10px' : '20px'), // Адаптивный padding
    boxSizing: 'border-box',
    minHeight: 'auto', // Автоматическая высота для всех брейкпоинтов
    marginBottom: '20px',

    // Условное отображение в зависимости от размера экрана
    display: isMobile ? 'flex' : 'grid',
    flexDirection: isMobile ? 'column' : 'row', // Столбцом на мобильных
    alignItems: isMobile ? 'center' : 'start', // Центрируем на мобильных
    gridTemplateColumns: isTablet ? 'auto 1fr' : '1fr 2px 2fr', // Планшет: линия+фраза | список. Десктоп: фраза | линия | список
    gap: isTablet ? '20px' : '65px',
  };

  // NEW: Контейнер для вертикальной линии и фразы на планшете (на мобильном не используется)
  const immoTonnLeftSectionWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Центрируем элементы для мобильных
    width: '100%',
    marginLeft: '0', // Убираем margin для мобильных
    marginBottom: isMobile ? '20px' : '0', // Добавляем пространство под линией/фразой на мобильных
  };

  const immoTonnBigPhraseStyle: React.CSSProperties = {
    fontWeight: 'bold',
    lineHeight: '1.2',
    color: '#333',
    zIndex: 2,
    fontSize: isMobile ? '1.2em' : (isTablet ? '1.4em' : '1.8em'), // Адаптивный размер шрифта
    textAlign: 'center', // Всегда по центру на мобильных
    maxWidth: '100%',
    width: 'auto',
    marginBottom: isMobile ? '20px' : '0', // Добавляем отступ снизу на мобильных
    // Grid свойства для десктопа
    gridColumn: isTablet ? undefined : '1 / 2', // Десктоп: первая колонка
    gridRow: isTablet ? undefined : '1 / 2',
    alignSelf: isTablet ? undefined : 'end', // Десктоп: выравнивание по низу
  };

  const immoTonnLineStyle: React.CSSProperties = {
    backgroundColor: 'black',
    zIndex: 1,
    width: '2px', // Всегда вертикальная линия
    height: 'auto', // Растягивается по вертикали
    display: isMobile ? 'none' : 'block', // Скрываем на мобильных
    // Grid свойства для десктопа
    gridColumn: isTablet ? undefined : '2 / 3', // Десктоп: вторая колонка
    gridRow: isTablet ? undefined : '1 / 2',
    alignSelf: isTablet ? undefined : 'stretch', // Десктоп: растягивается по вертикали
    margin: isTablet ? '0' : '0 auto',
  };

  // NEW: Стиль для горизонтальной линии на мобильных
  const immoTonnPhraseLineStyle: React.CSSProperties = {
    width: '80%', // Ширина линии
    height: '2px',
    backgroundColor: 'black',
    margin: '20px auto', // Центрируем и добавляем отступы
  };

  const immoTonnTextListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    zIndex: 2,
    textAlign: isMobile ? 'center' : 'left', // По центру на мобильных
    width: '100%',
    // Grid свойства для десктопа и планшета
    gridColumn: isTablet ? '2 / 3' : '3 / 4', // Планшет: вторая колонка. Десктоп: третья колонка
    gridRow: '1 / 2', // Всегда в первой строке
    marginLeft: '0',
  };

  const immoTonnTextListItemWrapperStyle: React.CSSProperties = {
    marginBottom: '15px',
    backgroundColor: '#fff',
    padding: isMobile ? '10px' : '10px 15px', // Единый padding для мобильных
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  };

  const immoTonnTextH4Style: React.CSSProperties = {
    fontSize: isMobile ? '1em' : (isTablet ? '1.1em' : '1.2em'), // Адаптивный размер шрифта
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  };

  const immoTonnTextPStyle: React.CSSProperties = {
    color: '#777',
    fontSize: isMobile ? '0.8em' : (isTablet ? '0.85em' : '0.95em'), // Адаптивный размер шрифта
    lineHeight: '1.6',
  };

  const kontaktButtonStyle: React.CSSProperties = {
    display: 'block',
    width: isMobile ? 'calc(100% - 20px)' : '622px', // Полная ширина на мобильных с учетом padding
    height: '82px',
    margin: isMobile ? '30px auto' : (isTablet ? '30px auto' : '162px auto 30px auto'), // Отступы для мобильных
    padding: '15px 30px',
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.1em',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s ease',
  };

  const kontaktButtonHoverStyle: React.CSSProperties = {
    backgroundColor: '#333',
  };

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div style={containerStyle}>
      {/* Глобальный стиль для предотвращения горизонтальной прокрутки */}
      <style>{`
        html, body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div style={imageContainerStyle}>
        <img src="/public/images/verkaufssupport.svg" alt="Full Width Image" style={imageStyle} />
        <div style={textOverlayStyle}>
          VERKAUFSSUPPORT - MEHR ALS NUR VERMITTLUNG - RUNDUM-SERVICE VOM PROFI
        </div>
      </div>

      <div style={mainContentWrapperStyle}>
        <div style={warumMaklerSectionStyle}>
          <div style={warumMaklerContentWithLineStyle}>
            <h3 style={warumMaklerH3Style}>
              WARUM EIN <br /> MAKLER?
            </h3>
            <ul style={warumMaklerUlStyle}>
              <li style={warumMaklerLiStyle}>
                <h4 style={warumMaklerH4Style}>Marktanalyse & Beratung</h4>
                <p style={warumMaklerPStyle}>Fundierte Marktkenntnisse sichern den optimalen Angebotspreis für Ihre Immobilie.</p>
              </li>
              <li style={warumMaklerLiStyle}>
                <h4 style={warumMaklerH4Style}>Immobilienbewertung</h4>
                <p style={warumMaklerPStyle}>Mit modernen Verfahren ermittelt der Makler den realistischen Marktwert.</p>
              </li>
              <li style={warumMaklerLiStyle}>
                <h4 style={warumMaklerH4Style}>Effektives Marketing</h4>
                <p style={warumMaklerPStyle}>Professionelle Fotos, Exposés и gezielte Werbung sorgen für maximale Sichtbarkeit.</p>
              </li>
              <li style={warumMaklerLiStyle}>
                <h4 style={warumMaklerH4Style}>Verhandlungsexpertise</h4>
                <p style={warumMaklerPStyle}>Als Vermittler führt der Makler faire und zielführende Verkaufsverhandlungen.</p>
              </li>
            </ul>
          </div>
        </div>

        <div style={immoTonnImageBackgroundStyle}>
          <h3 style={immoTonnOverlayTextStyle}>
            IMMO <br /> TONN
          </h3>
        </div>

        <div style={immoTonnContentSectionStyle}>
          {isMobile ? (
            // Мобильный макет: сначала список, затем горизонтальная линия, затем фраза
            <>
              <ul style={immoTonnTextListStyle}> {/* Список */}
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Rechtliche Sicherheit</h4>
                  <p style={immoTonnTextPStyle}>Er unterstützt bei Verträgen, klärt Fragen und begleitet rechtlich bis zum Abschluss.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Organisation und Besichtigungen</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant und koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Finanzierungsberatung</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant и koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Betreuung nach dem Verkauf</h4>
                  <p style={immoTonnTextPStyle}>Auch nach dem Abschluss bleibt der Makler Ansprechpartner для Fragen and Übergaben.</p>
                </li>
              </ul>
              <div style={immoTonnPhraseLineStyle}></div> {/* Горизонтальная линия */}
              <div style={immoTonnBigPhraseStyle}> {/* Фраза под линией */}
                Verlässlich. <br />
                Persönlich. <br />
                Vor Ort.
              </div>
            </>
          ) : isTablet ? (
            // Макет планшета: левая секция (линия + фраза) и правая секция (список) в ряд
            <>
              <div style={immoTonnLeftSectionWrapperStyle}> {/* Левая секция колонка */}
                <div style={immoTonnLineStyle}></div> {/* Вертикальная линия */}
                <div style={immoTonnBigPhraseStyle}> {/* Фраза под линией */}
                  Verlässlich. <br />
                  Persönlich. <br />
                  Vor Ort.
                </div>
              </div>
              <ul style={immoTonnTextListStyle}> {/* Правая секция элементы списка */}
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Rechtliche Sicherheit</h4>
                  <p style={immoTonnTextPStyle}>Er unterstützt bei Verträgen, klärt Fragen und begleitet rechtlich bis zum Abschluss.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Organisation und Besichtigungen</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant und koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Finanzierungsberatung</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant и koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Betreuung nach dem Verkauf</h4>
                  <p style={immoTonnTextPStyle}>Auch nach dem Abschluss bleibt der Makler Ansprechpartner для Fragen and Übergaben.</p>
                </li>
              </ul>
            </>
          ) : (
            // Десктопный макет: фраза, линия и список в сетке
            <>
              <div style={immoTonnBigPhraseStyle}>
                Verlässlich. <br />
                Persönlich. <br />
                Vor Ort.
              </div>
              <div style={immoTonnLineStyle}></div>
              <ul style={immoTonnTextListStyle}>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Rechtliche Sicherheit</h4>
                  <p style={immoTonnTextPStyle}>Er unterstützt bei Verträgen, klärt Fragen und begleitet rechtlich bis zum Abschluss.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Organisation und Besichtigungen</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant und koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Finanzierungsberatung</h4>
                  <p style={immoTonnTextPStyle}>Der Makler plant и koordiniert alle Termine mit Interessenten effizient и zuverlässig.</p>
                </li>
                <li style={immoTonnTextListItemWrapperStyle}>
                  <h4 style={immoTonnTextH4Style}>Betreuung nach dem Verkauf</h4>
                  <p style={immoTonnTextPStyle}>Auch nach dem Abschluss bleibt der Makler Ansprechpartner для Fragen and Übergaben.</p>
                </li>
              </ul>
            </>
          )}
        </div>

        <button
          style={isHovered ? { ...kontaktButtonStyle, ...kontaktButtonHoverStyle } : kontaktButtonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          KONTAKT AUFNEHMEN
        </button>
      </div>
    </div>
  );
};

export default Verkaufssupport;
