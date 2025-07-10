import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import styles from './MortgageCalculator.module.css';
import QuestionIcon from '@shared/assets/morgage-calculator/question.svg';
import MarkerIcon from '@shared/assets/morgage-calculator/marker.svg';
import Input from '@shared/ui/Input/Input';
import Button from '@shared/ui/Button/Button';

const formatGermanCurrency = (num: number) => {
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const infoTexts = {
  tax: {
    title: 'Grunderwerbsteuer',
    body: 'Die Höhe der Grunderwerbsteuer ist in Deutschland nicht einheitlich und variiert je nach Bundesland.',
  },
  notary: {
    title: 'Notar & Grundbuch',
    body: 'Die Kosten für Notar und Grundbucheintrag trägt in der Regel der Käufer.',
  },
  broker: {
    title: 'Käufer-Maklerprovision',
    body: 'Die Käufer-Maklerprovision richtet sich nach den Angaben im Exposé.',
  },
};

type Mode = 'calculateYears' | 'calculateRepayment';

const MortgageCalculator = () => {
  const location = useLocation();
  const [price, setPrice] = useState('');
  const [equity, setEquity] = useState('');
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [tax, setTax] = useState('6.5');
  const [notary, setNotary] = useState('1.5');
  const [broker, setBroker] = useState('2.0');
  const [repayment, setRepayment] = useState('2.0');
  const [interest, setInterest] = useState('3.5');
  const [years, setYears] = useState('30');
  const [monthly, setMonthly] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [mode, setMode] = useState<Mode>('calculateYears');
  const [customTax, setCustomTax] = useState('');
  const [customNotary, setCustomNotary] = useState('');
  const [customBroker, setCustomBroker] = useState('');
  const [validationError, setValidationError] = useState('');
  const [dynamicRepaymentOptions, setDynamicRepaymentOptions] = useState<
    string[]
  >([]);
  const [dynamicLaufzeitOptions, setDynamicLaufzeitOptions] = useState<
    string[]
  >([]);
  const [equityTooHighError, setEquityTooHighError] = useState(false);
  const [equityDecimalError, setEquityDecimalError] = useState(false);
  const [interestDecimalError, setInterestDecimalError] = useState(false);
  
const [interestRangeError, setInterestRangeError] = useState(false);
  const [rawInterest, setRawInterest] = useState('');

const [rawEquity, setRawEquity] = useState('');
const [showTaxError, setShowTaxError] = useState(false);
  const isValidPercent = (val: string) => /^([0-9]|10)([.,]\d)?$/.test(val);

  const customTaxError =
    tax === 'custom' && customTax !== '' && !isValidPercent(customTax);
  const customNotaryError =
    notary === 'custom' && customNotary !== '' && !isValidPercent(customNotary);
  const customBrokerError =
    broker === 'custom' && customBroker !== '' && !isValidPercent(customBroker);

  const parseValue = (val: string, fallback: any) =>
    parseFloat((val === 'custom' ? fallback : val).replace(',', '.')) || 0;

  const parsedPrice = parseFloat(price) || 0;
  const parsedEquity = parseFloat(equity.replace(',', '.')) || 0;
  const parsedInterest = parseFloat(interest) || 0;
  const parsedRepayment = parseFloat(repayment) || 0;
  const parsedYears = parseInt(years) || 0;

  const parsedTax = parseValue(tax, customTax);
  const parsedNotary = parseValue(notary, customNotary);
  const parsedBroker = parseValue(broker, customBroker);

  const notaryCost = (parsedPrice * parsedNotary) / 100;
  const brokerCost = (parsedPrice * parsedBroker) / 100;
  const taxCost = (parsedPrice * parsedTax) / 100;

  const totalAdditionalCosts = notaryCost + brokerCost + taxCost;
  const totalCost = parsedPrice + totalAdditionalCosts;
  const darlehen = totalCost - parsedEquity;

 const fixedRepaymentOptions = Array.from({ length: 91 }, (_, i) =>
  (1.0 + i * 0.1).toFixed(1),
);
  const fixedLaufzeitOptions = Array.from({ length: 40 }, (_, i) =>
    (i + 1).toString(),
  );

  const repaymentOptions = Array.from(
    new Set([...fixedRepaymentOptions, ...dynamicRepaymentOptions]),
  ).sort((a, b) => parseFloat(a) - parseFloat(b));
  const laufzeitOptions = Array.from(
    new Set([...fixedLaufzeitOptions, ...dynamicLaufzeitOptions]),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  const formatCurrencyDE = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return '';
    return num.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

 const handleEquityChange = (val: string) => {
  let normalized = val.replace(/\./g, ',');

  if (normalized === '') {
    setEquity('');
    setEquityDecimalError(false);
    setEquityTooHighError(false);
    return;
  }

  let cleaned = normalized.replace(/[^\d,]/g, '');

  const firstCommaIndex = cleaned.indexOf(',');
  if (firstCommaIndex !== -1) {
    const beforeComma = cleaned.slice(0, firstCommaIndex);
    const afterCommaRaw = cleaned.slice(firstCommaIndex + 1);
    const afterComma = afterCommaRaw.replace(/,/g, '');
    cleaned = beforeComma + ',' + afterComma;
  }

  const parts = cleaned.split(',');
  let formattedVal = cleaned;
  let limitedDecimal = '';
  if (parts.length === 2) {
    const [integerPart, decimalPart = ''] = parts;
    limitedDecimal = decimalPart.slice(0, 3);
    formattedVal = integerPart + ',' + limitedDecimal;
    setEquityDecimalError(limitedDecimal.length > 2);
  } else {
    setEquityDecimalError(false);
  }

  const valNum = parseFloat(formattedVal.replace(',', '.')) || 0;

  setEquity(formattedVal);

  // Здесь ключевая проверка
  if (valNum >= totalCost) {
    setEquityTooHighError(true);
  } else {
    setEquityTooHighError(false);
  }
};

const handleInterestChange = (value: string) => {
    // Заменить точки на запятые
    let val = value.replace(/\./g, ',');

    // Удалить все символы кроме цифр и запятой
    val = val.replace(/[^\d,]/g, '');

    const parts = val.split(',');

    // Только одна запятая и одна цифра после неё
    if (parts.length > 2) {
      val = parts[0] + ',' + parts[1].slice(0, 1);
    } else if (parts.length === 2) {
      val = parts[0] + ',' + parts[1].slice(0, 1);
    }

    // Проверка: значение ≤ 14
    const numericValue = parseFloat(val.replace(',', '.'));
    if (!isNaN(numericValue) && numericValue > 14) {
      return; // Не обновляем состояние
    }

    setRawInterest(val);
    setInterest(val); // Пока пользователь вводит — без %
  };

  useEffect(() => {
    if (location.state && location.state.price) {
      setPrice(String(location.state.price));
    }
  }, [location.state]);

   //Aвтоматический пересчёт
  useEffect(() => {
    if (!darlehen || parsedInterest === 0) return;
    const r = parsedInterest / 100;

    if (mode === 'calculateYears' && parsedRepayment > 0) {
      const annuitaet = darlehen * (r + parsedRepayment / 100);
      const n = Math.log(annuitaet / (annuitaet - darlehen * r)) / Math.log(1 + r);
      if (isFinite(n)) {
        const nRounded = Math.round(n).toString();
        if (!laufzeitOptions.includes(nRounded)) {
          setDynamicLaufzeitOptions(prev => [...prev, nRounded]);
        }
        setYears(nRounded);
      }
    }

    if (mode === 'calculateRepayment' && parsedYears > 0) {
      const n = parsedYears;
      const annuitaet = darlehen * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const zinsenJahr1 = darlehen * r;
      const tilgungJahr1 = annuitaet - zinsenJahr1;
      const tilgungProzent = (tilgungJahr1 / darlehen) * 100;
      const fixed = Number(tilgungProzent.toFixed(2));
      if (isFinite(fixed)) {
        const fixedStr = fixed.toFixed(1);
        if (!repaymentOptions.includes(fixedStr)) {
          setDynamicRepaymentOptions(prev => [...prev, fixedStr]);
        }
        setRepayment(fixedStr);
      }
    }
  }, [repayment, years, interest, totalCost, equity, mode]);

  useEffect(() => {
    if (!isNaN(darlehen) && darlehen > 0) {
      setLoanAmount(darlehen);
    } else {
      setLoanAmount(null);
    }
  }, [
    price,
    equity,
    tax,
    notary,
    broker,
    customTax,
    customNotary,
    customBroker,
  ]);

  useEffect(() => {
    setMonthly(null);
  }, [
    price,
    equity,
    tax,
    notary,
    broker,
    customTax,
    customNotary,
    customBroker,
    repayment,
    years,
    interest,
  ]);

  const handleCalc = () => {
    setInterestDecimalError(false);
    setInterestRangeError(false);
    setValidationError('');
    setMonthly(null);
    if (equityTooHighError) {
    setValidationError('Eigenkapital darf den Gesamtpreis nicht überschreiten.');
    return;
  }
    if (!equity || equity.trim() === '') {
      setValidationError('Bitte geben Sie Ihr Eigenkapital ein.');
      return;
    }
    if (
      (tax === 'custom' && (!customTax || customTaxError)) ||
      (notary === 'custom' && (!customNotary || customNotaryError)) ||
      (broker === 'custom' && (!customBroker || customBrokerError))
    ) {
      setValidationError(
        'Bitte korrigieren Sie die Eingabefehler in den benutzerdefinierten Feldern.',
      );
      return;
    }
    const validRepayment = parsedRepayment > 0;
    const validYears = parsedYears > 0;
    const validInterest = parsedInterest > 0;
    if (!(validRepayment && validYears && validInterest)) {
      return;
    }
    const r = parsedInterest / 100 / 12;
    const n = parsedYears * 12;
    const monthlyPayment =
      (darlehen * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthly(monthlyPayment);
    setLoanAmount(darlehen.toFixed(2) as any);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(32);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('IMMO  TONN', 22, 36);
    doc.setFontSize(10);
    doc.text('EST. 1985', 22, 41);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Finanzierungsrechner', 105, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Erstellt am: ${new Date().toLocaleDateString()}`, 170, 60, {
      align: 'right',
    });
    doc.setFontSize(13);
    let y = 70;
    const rowGap = 10;
    doc.text('Immobilienpreis:', 25, y);
    doc.text(`€ ${price}`, 110, y);
    y += rowGap;
    doc.text('Eigenkapital:', 25, y);
    doc.text(`€ ${equity}`, 110, y);
    y += rowGap;
    doc.text('Grunderwerbsteuer:', 25, y);
    doc.text(`${tax === 'custom' ? customTax : tax}%`, 110, y);
    y += rowGap;
    doc.text('Notar/Grundbuch:', 25, y);
    doc.text(`${notary === 'custom' ? customNotary : notary}%`, 110, y);
    y += rowGap;
    doc.text('Maklerprovision:', 25, y);
    doc.text(`${broker === 'custom' ? customBroker : broker}%`, 110, y);
    y += rowGap;
    doc.text('Darlehenssumme:', 25, y);
    doc.text(`€ ${loanAmount}`, 110, y);
    y += rowGap;
    doc.text('Zinssatz:', 25, y);
    doc.text(`${interest}%`, 110, y);
    y += rowGap;
    doc.text('Tilgung:', 25, y);
    doc.text(`${repayment}%`, 110, y);
    y += rowGap;
    doc.text('Laufzeit:', 25, y);
    doc.text(`${years} Jahre`, 110, y);
    y += rowGap + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 68, 106);
    doc.text('Monatliche Rate:', 25, y);
    doc.text(`€ ${monthly?.toFixed(2) || '0.00'}`, 110, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);
    let contactY = 250;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Kontakt', 105, contactY, { align: 'center' });
    contactY += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('0174 345 44 19', 105, contactY, { align: 'center' });
    contactY += 7;
    doc.text('tonn_andreas@web.de', 105, contactY, { align: 'center' });
    contactY += 7;
    doc.text('Sessendrupweg 54', 105, contactY, { align: 'center' });
    contactY += 6;
    doc.text('48161 Münster', 105, contactY, { align: 'center' });
    contactY += 8;
    doc.setFontSize(10);
    doc.setTextColor(15, 68, 106);
    doc.text('www.immotonn.de', 105, contactY, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.save('Finanzierung.pdf');
  };

  const taxOptions = ['3.5', '5.0', '5.5', '6.0', '6.5'];
  const notaryOptions = Array.from({ length: 11 }, (_, i) =>
    (1.0 + i * 0.1).toFixed(1),
  );
  const brokerOptions = Array.from({ length: 7 }, (_, i) =>
    (1.0 + i * 0.5).toFixed(1),
  );


  function validateCustomPercentInput(input: string): string {
  // Заменяем все точки на запятые
  let cleaned = input.replace(/\./g, ',');
  
  // Разрешаем только цифры и максимум одну запятую
  cleaned = cleaned.replace(/[^0-9,]/g, '');

  const parts = cleaned.split(',');
  
  // Больше одной запятой — удаляем лишние
  if (parts.length > 2) {
    cleaned = parts[0] + ',' + parts[1];
  }

  // Ограничим дробную часть до одной цифры
  if (parts.length === 2) {
    cleaned = parts[0] + ',' + parts[1].slice(0, 1);
  }

  return cleaned;
}
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Immobilien Finanzierung Rechner</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <label htmlFor="price">Immobilienpreis (€)</label>
          <div className={styles.inputWithIcon}>
            <input
              id="price"
              name="price"
              value={price}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 11) {
                  setPrice(val);
                }
              }}
            />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>
          {renderSelect(
            'Grunderwerbsteuer',
            tax,
            setTax,
            customTax,
            setCustomTax,
            'tax',
            taxOptions,
            undefined,
            customTaxError,
            setModalContent,
          )}
          {renderSelect(
            'Notar/Grundbuch',
            notary,
            setNotary,
            customNotary,
            setCustomNotary,
            'notary',
            notaryOptions,
            undefined,
            customNotaryError,
            setModalContent,
          )}
          {renderSelect(
            'Käufer Maklerprovision',
            broker,
            setBroker,
            customBroker,
            setCustomBroker,
            'broker',
            brokerOptions,
            undefined,
            customBrokerError,
            setModalContent,
          )}
          <p className={styles.sumLine}>
            € Gesamtpreis: {formatGermanCurrency(totalCost)}
          </p>
        </div>
        <div className={styles.col}>
          <label htmlFor="equity">Eigenkapital</label>
          <div className={styles.inputWithIcon}>
            <input
              id="equity"
              name="equity"
              value={equity}
              onChange={e => handleEquityChange(e.target.value)}
            />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>
          {equityTooHighError && (
            <p className={styles.error}>
              Eigenkapital muss kleiner als der Gesamtpreis sein.
            </p>
          )}
          {equityDecimalError && (
            <p className={styles.error}>
              Es dürfen nicht mehr als zwei Ziffern nach dem Komma eingegeben
              werden.
            </p>
          )}
          <label htmlFor="repayment">Tilgung</label>
<select
  id="repayment"
  name="repayment"
  value={repayment}
  onChange={e => {
    setMode('calculateYears');
    setRepayment(e.target.value);
  }}
>
  {repaymentOptions.map(opt => (
    <option key={opt} value={opt}>
      {opt}%
    </option>
  ))}
</select>
         <label htmlFor="interest">Sollzins p. a.(%)</label>
<div className={styles.inputWithIcon}>
  <input
    type="text"
    value={interest}
    onChange={e => handleInterestChange(e.target.value)}
    onBeforeInput={e => {
      if (!e.data) return;

      const input = e.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const inserted = e.data === '.' ? ',' : e.data;

      const proposed =
        selectionStart !== null && selectionEnd !== null
          ? input.value.slice(0, selectionStart) + inserted + input.value.slice(selectionEnd)
          : input.value + inserted;

      const cleaned = proposed.replace('%', '');
      const parts = cleaned.split(',');

      const numericValue = parseFloat(cleaned.replace(',', '.'));

      const tooManyDecimals = parts.length === 2 && parts[1].length > 1;
      const tooHighOrLow = !isNaN(numericValue) && (numericValue <= 0 || numericValue > 14);

      setInterestDecimalError(tooManyDecimals);
      setInterestRangeError(tooHighOrLow);

      if (!/^[\d,]*$/.test(inserted)) {
        e.preventDefault();
        return;
      }

      if ((proposed.match(/,/g) || []).length > 1 || tooManyDecimals || tooHighOrLow) {
        e.preventDefault();
        return;
      }
    }}
    inputMode="decimal"
  />
  <img src={MarkerIcon} className={styles.markerIcon} />
</div>

{interestDecimalError && (
  <p className={styles.error}>
    Nach dem Komma darf nur eine Ziffer eingegeben werden.
  </p>
)}
{interestRangeError && (
  <p className={styles.error}>
    Der Sollzins muss größer als 0 und kleiner als 14 sein.
  </p>
)}



          <label htmlFor="years">Laufzeit (Jahre)</label>
          <select
            id="years"
            name="years"
            value={years}
            onChange={e => {
              setMode('calculateRepayment');
              setYears(e.target.value);
            }}
          >
            {laufzeitOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.col}>
          <label htmlFor="loanAmount">Darlehenssumme</label>
          <input
            id="loanAmount"
            name="loanAmount"
            value={formatCurrencyDE(loanAmount)}
            readOnly
          />
        <div className={styles.rateLabel}>
  Monatliche Rate:{' '}
  {monthly !== null && (
    <span className={styles.monthly}>
      <CountUp
        end={monthly}
        decimals={2}
        prefix="€ "
        duration={1.5}
        formattingFn={formatGermanCurrency}
      />
    </span>
  )}
</div>
          <Button
            initialText="Berechnen"
            clickedText="im Prozess"
            onClick={handleCalc}
            className={styles.btn}
          />
          <Button
            onClick={exportPDF}
            className={styles.btn}
            initialText="Export als PDF"
            clickedText="im Prozess"
          />
          {validationError && (
            <p className={styles.error}>
              Die monatliche Rate wird nach der Eingabe gültiger Werte
              berechnet.
            </p>
          )}
        </div>
      </div>
      <p className={styles.hint}>
        <strong>Wichtiger Hinweis:</strong>
        <br />
        Die hier berechnete monatliche Rate stellt lediglich eine unverbindliche
        Beispielrechnung dar
        <br />
        und dient nur zur ersten Orientierung. Sie ersetzt keine individuelle
        Finanzierungsberatung. Die <br /> tatsächlichen Konditionen können je
        nach Anbieter, Bonität und weiteren Faktoren abweichen.
        <br />
        Für die Richtigkeit, Vollständigkeit und Aktualität der Angaben wird
        keine Haftung übernommen.
      </p>
      {modalContent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{modalContent.title}</h3>
            <p>{modalContent.body}</p>
            <button onClick={() => setModalContent(null)}>Schließen</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MortgageCalculator;

function renderSelect(
  label: any,
  value: any,
  onChange: any,
  customValue: any,
  setCustomValue: any,
  infoKey: any,
  options: any,
  modeToggle: any,
  showError: any,
    onInfoClick: any,
) {
  const showCustom = value === 'custom';

  return (
    <>
      <label>
        {label}
        <img
          src={QuestionIcon}
          className={styles.icon}
          onClick={() => onInfoClick?.(infoTexts[infoKey])}
          alt={`${label} info`}
        />
      </label>

      <div className={styles.selectWrapper}>
        <select
          value={value}
          onChange={e => {
            const selected = e.target.value;
            if (
              infoKey === 'tax' ||
              infoKey === 'notary' ||
              infoKey === 'broker'
            ) {
              onChange(selected);
            } else {
              modeToggle?.();
              onChange(selected);
            }

            // если пользователь выбрал НЕ custom, сбрасываем ошибку
            if (selected !== 'custom' && typeof setShowError === 'function') {
              setShowError(false);
            }
          }}
          className={styles.select}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}%
            </option>
          ))}
          <option value="custom">eigener Wert</option>
        </select>

        {showCustom && (
          <div className={styles.inputWithPercent}>
     <Input
  id={`${infoKey}-custom`}
  name={`${infoKey}-custom`}
  value={customValue}
  onChange={e => {
  let val = e.target.value;

  // Заменяем запятую на точку
  val = val.replace(',', '.');

  // Проверка: разрешаем максимум 2 цифры перед точкой и одну после
  const regex = /^\d{0,2}(\.\d?)?$/;

  if (regex.test(val)) {
    const number = parseFloat(val);

    // Разрешаем пустую строку — чтобы можно было стереть значение
    if (val === '' || (number <= 10 && !isNaN(number))) {
      setCustomValue(val);
    }
  }
}}
  onBlur={e => {
    const val = e.target.value.trim();
    const number = parseFloat(val);

    // Проверка: число от 0 до 10, максимум одна цифра после точки
    const isValid =
      /^([0-9]|10)(\.\d)?$/.test(val) && !isNaN(number) && number <= 10;

    if (typeof setShowError === 'function') {
      setShowError(!isValid);
    }
  }}
  inputMode="decimal"
  label={
    infoKey === 'tax' || infoKey === 'notary' || infoKey === 'broker'
      ? ''
      : `Custom ${label}`
  }
/>
            <span>%</span>
          </div>
        )}
      </div>

      {showError && (
        <p className={styles.error}>
          Bitte geben Sie einen gültigen Wert zwischen 0 und 10 ein (max. eine
          Nachkommastelle).
        </p>
      )}
    </>
  );
}
