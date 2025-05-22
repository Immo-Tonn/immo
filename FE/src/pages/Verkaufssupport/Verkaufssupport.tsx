import React, { useState } from 'react';

const Verkaufssupport: React.FC = () => {
  // Стили для верхнего изображения и оверлея
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
    padding: '15px',
    textAlign: 'center',
    boxSizing: 'border-box',
    zIndex: 3,
    fontSize: '36px',
    backgroundColor: 'rgba(20, 31, 40, 0.7)',
  };

  // Стили для основного контентного обертки
  const mainContentWrapperStyle: React.CSSProperties = {
    width: '1294px', // Фиксированная ширина для основного контента
    margin: '20px auto', // Центрирование
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20px', // Внутренний отступ для контента
    position: 'relative', // Важно для позиционирования абсолютно позиционированных дочерних элементов
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    overflow: 'hidden', // Скрываем любой потенциальный горизонтальный скролл
  };

  // Секция "WARUM EIN MAKLER?"
  const warumMaklerSectionStyle: React.CSSProperties = {
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center',
  };

  const warumMaklerContentWithLineStyle: React.CSSProperties = {
    flexGrow: 1,
    maxWidth: '600px',
    boxSizing: 'border-box',
    paddingRight: '30px',
    borderRight: '2px solid black',
  };

  const warumMaklerH3Style: React.CSSProperties = {
    textAlign: 'left',
    marginBottom: '30px',
    color: '#333',
  };

  const warumMaklerUlStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0',
  };

  const warumMaklerLiStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '15px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    lineHeight: '1.6',
    marginBottom: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const warumMaklerH4Style: React.CSSProperties = {
    color: '#333',
    marginBottom: '5px',
    fontSize: '1.1em',
  };

  const warumMaklerPStyle: React.CSSProperties = {
    color: '#555',
    fontSize: '0.95em',
    lineHeight: '1.5',
  };

  // === Стили для секции "IMMO TONN" ===

  // 1. Контейнер для фоновой картинки с надписью "IMMO TONN"
  const immoTonnImageBackgroundStyle: React.CSSProperties = {
    position: 'relative', // Важно для позиционирования надписи
    width: '100%', // Занимает 100% ширины родителя (mainContentWrapperStyle)
    height: '600px', // Высота блока с фоном
    backgroundImage: 'url(/public/images/immo-tonn.svg)', // Имя файла SVG
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '20px', // Отступ от картинки до следующего блока
    boxSizing: 'border-box',
  };

  const immoTonnOverlayTextStyle: React.CSSProperties = {
    position: 'absolute', // Абсолютное позиционирование внутри immoTonnImageBackgroundStyle
    right: '80px', // Отступ от правого края
    bottom: '100px', // Расстояние от низа
    fontSize: '48px', // Размер шрифта
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Полупрозрачный фон для читаемости
    padding: '8px 15px',
    borderRadius: '5px',
    textAlign: 'right', // Выравнивание внутри контейнера надписи
    lineHeight: '1.2', // Для двух строк
  };

  // 2. Контейнер для текстового контента, линии и большой фразы (ПОД КАРТИНКОЙ)

  const immoTonnContentSectionStyle: React.CSSProperties = {
    position: 'relative', // Важно для абсолютного позиционирования элементов внутри
    width: '100%',
    maxWidth: '1294px', // Используем ширину основного контентного блока
    margin: '0 auto', // Центрируем
    padding: '20px', // Общий внутренний отступ для этого блока
    boxSizing: 'border-box',
    minHeight: '350px', // ИЗМЕНЕНО: Увеличена минимальная высота, чтобы вместить текст и линию
    // marginBottom: '20px', // Отступ снизу, будет перекрыт marginTop кнопки
  };

  

  const immoTonnBigPhraseStyle: React.CSSProperties = {
    position: 'absolute', // Абсолютное позиционирование внутри immoTonnContentSectionStyle
    left: '20px', // Отступ от левого края immoTonnContentSectionStyle
    bottom: '20px', // Отступ от низа immoTonnContentSectionStyle
    fontWeight: 'bold',
    fontSize: '1.8em',
    lineHeight: '1.2',
    color: '#333',
    textAlign: 'left', // Выравниваем текст по левому краю
    maxWidth: '200px', // Чтобы текст не сильно растягивался
    zIndex: 2, // Чтобы был над линией
  };

  const immoTonnLineStyle: React.CSSProperties = {
    position: 'absolute', // Абсолютное позиционирование линии
    left: '347px', // 367px от края mainContentWrapperStyle - 20px padding = 347px
    top: '20px', // ИЗМЕНЕНО: Отступ сверху, чтобы линия начиналась с текстом
    bottom: '20px', // ИЗМЕНЕНО: Отступ снизу, чтобы линия заканчивалась с текстом
    width: '2px', // Толщина линии
    backgroundColor: 'black',
    zIndex: 1, // Чтобы была под текстом
  };

  const immoTonnTextListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0', // Убираем padding здесь
    margin: '0',
    textAlign: 'left', // Текст выравнивается по левому краю
    position: 'absolute', // Абсолютное позиционирование абзацев
    left: 'calc(347px + 2px + 65px)', // Позиция линии + толщина линии + 65px отступ
    right: '49px', // 49px от правого края immoTonnContentSectionStyle
    top: '20px', // Отступ сверху
    bottom: '20px', // Отступ снизу
    zIndex: 2, // Чтобы текст был над линией
  };

  const immoTonnTextListItemWrapperStyle: React.CSSProperties = {
    marginBottom: '15px',
    backgroundColor: '#fff', // Фон абзацев
    padding: '10px 15px', // Отступы внутри "квадратного" абзаца
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', // Легкая тень
    boxSizing: 'border-box', // Учитываем padding в ширине
  };

  const immoTonnTextH4Style: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  };

  const immoTonnTextPStyle: React.CSSProperties = {
    color: '#777',
    lineHeight: '1.6',
  };

  // Стили для кнопки "КОНТАКТ AUFNEHMEN"
  const kontaktButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '622px', // Ширина кнопки
    height: '82px', // Высота кнопки
    margin: '162px auto 30px auto', // ИЗМЕНЕНО: Отступ сверху 162px, снизу 30px
    padding: '15px 30px',
    backgroundColor: 'black', // Фон кнопки черный
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
    backgroundColor: '#333', // Немного светлее при наведении
  };

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div style={containerStyle}>
      <div style={imageContainerStyle}>
        <img src="/public/images/verkaufssupport.svg" alt="Full Width Image" style={imageStyle} />
        <div style={textOverlayStyle}>
          VERKAUFSSUPPORT - MEHR ALS NUR VERMITTLUNG - RUNDUM-SERVICE VOM PROFI
        </div>
      </div>

      <div style={mainContentWrapperStyle}>
        {/* Секция "WARUM EIN MAKLER?" */}
        <div style={warumMaklerSectionStyle}>
          <div style={warumMaklerContentWithLineStyle}>
            <h3 style={warumMaklerH3Style}>WARUM EIN MAKLER?</h3>
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
                <p style={warumMaklerPStyle}>Professionelle Fotos, Exposés und gezielte Werbung sorgen für maximale Sichtbarkeit.</p>
              </li>
              <li style={warumMaklerLiStyle}>
                <h4 style={warumMaklerH4Style}>Verhandlungsexpertise</h4>
                <p style={warumMaklerPStyle}>Als Vermittler führt der Makler faire und zielführende Verkaufsverhandlungen.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* === Секция "IMMO TONN" === */}

        {/* 1. Блок с фоновой картинкой и надписью "IMMO TONN" */}
        <div style={immoTonnImageBackgroundStyle}>
          <h3 style={immoTonnOverlayTextStyle}>
            IMMO <br /> TONN
          </h3>
        </div>

        {/* 2. Блок с текстовым контентом, линией и большой фразой (ПОД КАРТИНКОЙ) */}
        {/* Этот блок теперь в обычном потоке и имеет фиксированную высоту */}
        <div style={immoTonnContentSectionStyle}>
          {/* Большая фраза "Verlässlich. Persönlich. Vor Ort." (слева) */}
          <div style={immoTonnBigPhraseStyle}>
            Verlässlich. <br />
            Persönlich. <br />
            Vor Ort.
          </div>

          {/* Линия (абсолютно позиционирована) */}
          <div style={immoTonnLineStyle}></div>

          {/* Контейнер для абзацев текста (справа от линии) */}
          <ul style={immoTonnTextListStyle}>
            <li style={immoTonnTextListItemWrapperStyle}>
              <h4 style={immoTonnTextH4Style}>Rechtliche Sicherheit</h4>
              <p style={immoTonnTextPStyle}>Er unterstützt bei Verträgen, klärt Fragen und begleitet rechtlich bis zum Abschluss.</p>
            </li>
            <li style={immoTonnTextListItemWrapperStyle}>
              <h4 style={immoTonnTextH4Style}>Organisation und Besichtigungen</h4>
              <p style={immoTonnTextPStyle}>Der Makler plant und koordiniert alle Termine mit Interessenten effizient und zuverlässig.</p>
            </li>
            <li style={immoTonnTextListItemWrapperStyle}>
              <h4 style={immoTonnTextH4Style}>Finanzierungsberatung</h4>
              <p style={immoTonnTextPStyle}>Der Makler plant und koordiniert alle Termine mit Interessenten effizient und zuverlässig.</p>
            </li>
            <li style={immoTonnTextListItemWrapperStyle}>
              <h4 style={immoTonnTextH4Style}>Betreuung nach dem Verkauf</h4>
              <p style={immoTonnTextPStyle}>Auch nach dem Abschluss bleibt der Makler Ansprechpartner für Fragen und Übergaben.</p>
            </li>
          </ul>
        </div>

        {/* Кнопка "КОНТАКТ AUFNEHMEN" */}
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