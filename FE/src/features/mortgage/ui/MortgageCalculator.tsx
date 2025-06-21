import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import styles from './MortgageCalculator.module.css';
import QuestionIcon from '@shared/assets/morgage-calculator/question.svg';
import MarkerIcon from '@shared/assets/morgage-calculator/marker.svg';
import Input from '@shared/ui/Input/Input';
const formatGermanCurrency = (num: number) => {
  return num
    .toFixed(2) // всегда 2 знака после запятой, например 1234.56
    .replace('.', ',') // заменяем точку на запятую: 1234,56
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // ставим точки для тысяч: 1.234,56
};

const infoTexts = {
  tax: {
    title: 'Grunderwerbsteuer',
    body: 'Die Höhe der Grunderwerbsteuer ist in Deutschland nicht einheitlich und variiert je nach Bundesland.',
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
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);
  const [mode, setMode] = useState<Mode>('calculateYears');
  const [customTax, setCustomTax] = useState('');
  const [customNotary, setCustomNotary] = useState('');
  const [customBroker, setCustomBroker] = useState('');
  const [validationError, setValidationError] = useState('');
  const [dynamicRepaymentOptions, setDynamicRepaymentOptions] = useState<string[]>([]);
  const [dynamicLaufzeitOptions, setDynamicLaufzeitOptions] = useState<string[]>([]);
  const [equityTooHighError, setEquityTooHighError] = useState(false);
  const [equityDecimalError, setEquityDecimalError] = useState(false);


  const [interestDecimalError, setInterestDecimalError] = useState(false);
const [interestRangeError, setInterestRangeError] = useState(false);
  const isValidPercent = (val: string) => /^([0-9]|10)([.,]\d)?$/.test(val);

  // const customTaxError = tax === 'custom' && !isValidPercent(customTax);
  // const customNotaryError = notary === 'custom' && !isValidPercent(customNotary);
  // const customBrokerError = broker === 'custom' && !isValidPercent(customBroker);
  const customTaxError = tax === 'custom' && customTax !== '' && !isValidPercent(customTax);
const customNotaryError = notary === 'custom' && customNotary !== '' && !isValidPercent(customNotary);
const customBrokerError = broker === 'custom' && customBroker !== '' && !isValidPercent(customBroker);

  const parseValue = (val: string, fallback: string) =>
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

  const fixedRepaymentOptions = Array.from({ length: 19 }, (_, i) => (1 + i * 0.5).toFixed(1));
  const fixedLaufzeitOptions = Array.from({ length: 40 }, (_, i) => (i + 1).toString());

  const repaymentOptions = Array.from(new Set([...fixedRepaymentOptions, ...dynamicRepaymentOptions])).sort((a, b) => parseFloat(a) - parseFloat(b));
  const laufzeitOptions = Array.from(new Set([...fixedLaufzeitOptions, ...dynamicLaufzeitOptions])).sort((a, b) => parseInt(a) - parseInt(b));
// const formatCurrencyDE = (num: number) => {
//   return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };
const [priceError, setPriceError] = useState("");

const formatCurrencyDE = (num: number | null | undefined) => {
  if (num === null || num === undefined || isNaN(num)) return '';



  return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


const handleEquityChange = (val: string) => {
  // Проверка и обрезка лишних цифр после запятой
  const parts = val.split(/[,\.]/);

  let formattedVal = val;

  if (parts.length === 2) {
    // const integerPart = parts[0];
    // const decimalPart = parts[1];
 const [integerPart, decimalPart = ''] = parts;
    // Обрезаем после 3 знаков
    const limitedDecimal = decimalPart.slice(0, 3);
    formattedVal = integerPart + ',' + limitedDecimal;

    // Показываем ошибку, если > 2 знаков
    setEquityDecimalError(limitedDecimal.length > 2);
  } else {
    setEquityDecimalError(false);
  }

  setEquity(formattedVal);

  // Проверка превышения стоимости
  const valNum = parseFloat(formattedVal.replace(',', '.')) || 0;
  setEquityTooHighError(valNum > totalCost);
};
const handleInterestChange = (val: string) => {
  setInterest(val);

  // Проверка количества знаков после запятой
  const parts = val.split(/[,\.]/);
  if (parts.length === 2 && parts[1].length > 1) {
    setInterestDecimalError(true);
  } else {
    setInterestDecimalError(false);
  }

  // Проверка диапазона — только если это валидное число
  const normalized = val.replace(',', '.');
  const parsed = parseFloat(normalized);

  if (!isNaN(parsed)) {
    setInterestRangeError(parsed <= 0 || parsed >= 14);
  } else {
    setInterestRangeError(false);
  }
};
  

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
}, [price, equity, tax, notary, broker, customTax, customNotary, customBroker]);


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
  interest
]);


const handleCalc = () => {
  setValidationError('');
  setMonthly(null); // Сбрасываем предыдущий результат

  if (!equity || equity.trim() === '') {
    setValidationError('Bitte geben Sie Ihr Eigenkapital ein.');
    return;
  }

  // Проверяем кастомные поля, если выбран 'custom'
  if ((tax === 'custom' && (!customTax || customTaxError)) ||
      (notary === 'custom' && (!customNotary || customNotaryError)) ||
      (broker === 'custom' && (!customBroker || customBrokerError))) {
    setValidationError('Bitte korrigieren Sie die Eingabefehler in den benutzerdefinierten Feldern.');
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
  const monthlyPayment = (darlehen * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  setMonthly(monthlyPayment);
  setLoanAmount(darlehen.toFixed(2));
};

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('ImmoTonn Finanzierungsrechner', 20, 20);
    doc.setFontSize(12);
    doc.text(`Immobilienpreis: €${price}`, 20, 40);
    doc.text(`Eigenkapital: €${equity}`, 20, 50);
    doc.text(`Grunderwerbsteuer: ${tax === 'custom' ? customTax : tax}%`, 20, 60);
    doc.text(`Notar/Grundbuch: ${notary === 'custom' ? customNotary : notary}%`, 20, 70);
    doc.text(`Maklerprovision: ${broker === 'custom' ? customBroker : broker}%`, 20, 80);
    doc.text(`Darlehenssumme: €${loanAmount}`, 20, 90);
    doc.text(`Zinssatz: ${interest}%`, 20, 100);
    doc.text(`Tilgung: ${repayment}%`, 20, 110);
    doc.text(`Laufzeit: ${years} Jahre`, 20, 120);
    doc.text(`Monatliche Rate: €${monthly?.toFixed(2) || '0.00'}`, 20, 140);
    doc.save('Finanzierung.pdf');
  };

  const taxOptions = ['3.5', '5.0', '5.5', '6.0', '6.5'];
  const notaryOptions = Array.from({ length: 11 }, (_, i) => (1.0 + i * 0.1).toFixed(1));
  const brokerOptions = Array.from({ length: 7 }, (_, i) => (1.0 + i * 0.5).toFixed(1));

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Immobilien Finanzierung Rechner</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <label>Immobilienpreis (€)</label>
          <div className={styles.inputWithIcon}>
            <input
  value={price}
  onChange={e => {
    const val = e.target.value.replace(/\D/g, ''); // удаляем всё, кроме цифр
    if (val.length <= 11) {
      setPrice(val);
    }
  }}
/>
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>
          

          {renderSelect('Grunderwerbsteuer', tax, setTax, customTax, setCustomTax, 'tax', taxOptions, undefined, customTaxError,
        setModalContent)}
          {renderSelect('Notar/Grundbuch', notary, setNotary, customNotary, setCustomNotary, 'notary', notaryOptions, undefined, customNotaryError,
        setModalContent)}
          {renderSelect('Käufer Maklerprovision', broker, setBroker, customBroker, setCustomBroker, 'broker', brokerOptions, undefined, customBrokerError,
        setModalContent)}

          <p className={styles.sumLine}>€ Gesamtpreis: {formatGermanCurrency(totalCost)}</p>
        </div>

        <div className={styles.col}>
          <label>Eigenkapital</label>
          <div className={styles.inputWithIcon}>
             <input
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
  <p className={styles.error}>Es dürfen nicht mehr als zwei Ziffern nach dem Komma eingegeben werden.</p>
)}
{/* {equityTooHighError && (
  <p className={styles.error}>Eigenkapital darf den Kaufpreis nicht übersteigen.</p>
)} */}

          {renderSelect('Tilgung', repayment, setRepayment, '', () => {}, 'tax', repaymentOptions, () => setMode('calculateYears'))}

         <label>Sollzins p. a.</label>
<div className={styles.inputWithIcon}>
  <input
    value={interest}
    onChange={e => handleInterestChange(e.target.value)}
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

          <label>Laufzeit (Jahre)</label>
          <select
            value={years}
            onChange={e => {
              setMode('calculateRepayment');
              setYears(e.target.value);
            }}
          >
            {laufzeitOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className={styles.col}>
          <label>Darlehenssumme</label>
          {/* <input value={formatGermanCurrency(parseFloat(loanAmount))} readOnly /> */}
<input value={formatCurrencyDE(loanAmount)} readOnly />
          <div className={styles.rateLabel}>Monatliche Rate</div>
         {monthly !== null && (
  <div className={styles.monthly}>
    <CountUp
      end={monthly}
      decimals={2}
      prefix="€ "
      duration={1.5}
      formattingFn={formatGermanCurrency}
    />
  </div>
)}

          <button onClick={handleCalc} className={styles.btn}>Berechnen</button>
          <button onClick={exportPDF} className={styles.btn}>Export als PDF</button>

         {validationError && (
  <p className={styles.error}>
    Die monatliche Rate wird nach der Eingabe gültiger Werte berechnet.
  </p>
)}
        </div>
      </div>
<p className={styles.hint}>
   <strong>Wichtiger Hinweis:</strong><br />
    Die hier berechnete monatliche Rate stellt lediglich eine unverbindliche Beispielrechnung dar<br />
  und dient nur zur ersten Orientierung. Sie ersetzt keine individuelle Finanzierungsberatung.
  Die <br /> tatsächlichen Konditionen können je nach Anbieter, Bonität und weiteren Faktoren abweichen.<br />
  Für die Richtigkeit, Vollständigkeit und Aktualität der Angaben wird keine Haftung übernommen.
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

const renderSelect = (
  label: string,
  value: string,
  onChange: (val: string) => void,
  customValue: string,
  setCustomValue: (val: string) => void,
  infoKey: keyof typeof infoTexts,
  options: string[],
  modeToggle?: () => void,
  showError?: boolean,
  onInfoClick?: (info: { title: string; body: string }) => void // <-- добавлено
) => {
  const showCustom = value === 'custom';

  return (
    <>
      <label>
        {label}
        <img
  src={QuestionIcon}
  className={styles.icon}
  onClick={() => onInfoClick?.(infoTexts[infoKey])}
/>
      </label>
      <div className={styles.selectWrapper}>
        <select
          value={value}
          onChange={e => {
            const selected = e.target.value;
            if (infoKey === 'tax' || infoKey === 'notary' || infoKey === 'broker') {
              onChange(selected);
            } else {
              modeToggle?.();
              onChange(selected);
            }
          }}
          className={styles.select}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}%</option>
          ))}
          <option value="custom">eigener Wert</option>
        </select>
        {showCustom && (
          <div className={styles.inputWithPercent}>
            <Input
              value={customValue}
              onChange={e => setCustomValue(e.target.value)}
            />
            <span>%</span>
          </div>
        )}
      </div>
      {showError && <p className={styles.error}>Bitte geben Sie einen gültigen Wert zwischen 0 und 10 ein (max. eine Nachkommastelle).</p>}
    </>
  );
};

export default MortgageCalculator;