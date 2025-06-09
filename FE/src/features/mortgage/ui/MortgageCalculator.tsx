import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import styles from './MortgageCalculator.module.css';
import QuestionIcon from '@shared/assets/calculator/question.svg';
import MarkerIcon from '@shared/assets/calculator/marker.svg';

const infoTexts = {
  tax: {
    title: 'Grunderwerbsteuer',
    body: 'Die Grunderwerbsteuer wird automatisch auf Basis des Bundeslands berechnet.',
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
  const [loanAmount, setLoanAmount] = useState('');
  const [tax, setTax] = useState('6.5');
  const [repayment, setRepayment] = useState('2.0');
  const [notary, setNotary] = useState('1.5');
  const [interest, setInterest] = useState('3.5');
  const [broker, setBroker] = useState('2.0');
  const [years, setYears] = useState('30');
  const [monthly, setMonthly] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);
  const [mode, setMode] = useState<Mode>('calculateYears');
  const [dynamicRepaymentOptions, setDynamicRepaymentOptions] = useState<string[]>([]);
  const [dynamicLaufzeitOptions, setDynamicLaufzeitOptions] = useState<string[]>([]);

  const formatNumber = (val: string) => val.replace(',', '.').replace('%', '').replace(/[^\d.]/g, '');

  const parsedPrice = parseFloat(price) || 0;
  const parsedEquity = parseFloat(equity) || 0;
  const parsedInterest = parseFloat(formatNumber(interest)) || 0;
  const parsedRepayment = parseFloat(formatNumber(repayment)) || 0;
  const parsedYears = parseInt(years) || 0;

  const notaryCost = (parsedPrice * (parseFloat(formatNumber(notary)) || 0)) / 100;
  const brokerCost = (parsedPrice * (parseFloat(formatNumber(broker)) || 0)) / 100;
  const taxCost = (parsedPrice * (parseFloat(formatNumber(tax)) || 0)) / 100;

  const totalAdditionalCosts = notaryCost + brokerCost + taxCost;
  const totalCost = parsedPrice + totalAdditionalCosts;
  const darlehen = totalCost - parsedEquity;

  const fixedRepaymentOptions = Array.from({ length: 19 }, (_, i) => (1 + i * 0.5).toFixed(1));
  const fixedLaufzeitOptions = Array.from({ length: 40 }, (_, i) => (i + 1).toString());

  const repaymentOptions = Array.from(new Set([...fixedRepaymentOptions, ...dynamicRepaymentOptions])).sort((a, b) => parseFloat(a) - parseFloat(b));
  const laufzeitOptions = Array.from(new Set([...fixedLaufzeitOptions, ...dynamicLaufzeitOptions])).sort((a, b) => parseInt(a) - parseInt(b));

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

  const handleCalc = () => {
    const validRepayment = parsedRepayment > 0;
    const validYears = parsedYears > 0;
    const validInterest = parsedInterest > 0;

    if (!(validRepayment && validYears && validInterest)) {
      setMonthly(null);
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
    doc.text(`Grunderwerbsteuer: ${tax}%`, 20, 60);
    doc.text(`Notar/Grundbuch: ${notary}%`, 20, 70);
    doc.text(`Maklerprovision: ${broker}%`, 20, 80);
    doc.text(`Darlehenssumme: €${loanAmount}`, 20, 90);
    doc.text(`Zinssatz: ${interest}%`, 20, 100);
    doc.text(`Tilgung: ${repayment}%`, 20, 110);
    doc.text(`Laufzeit: ${years} Jahre`, 20, 120);
    doc.text(`Monatliche Rate: €${monthly?.toFixed(2) || '0.00'}`, 20, 140);
    doc.save('Finanzierung.pdf');
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Immobilien Finanzierung Rechner</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <label>Immobilienpreis (€)</label>
          <div className={styles.inputWithIcon}>
            <input value={price} onChange={e => setPrice(e.target.value)} />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>

          <label>
            Grunderwerbsteuer
            <img src={QuestionIcon} className={styles.icon} onClick={() => setModalContent(infoTexts.tax)} />
          </label>
          <div className={styles.inputWithPercent}>
            <input value={tax} onChange={e => setTax(e.target.value)} />
            <span className={styles.percent}>%</span>
          </div>

          <label>
            Notar/Grundbuch
            <img src={QuestionIcon} className={styles.icon} onClick={() => setModalContent(infoTexts.notary)} />
          </label>
          <div className={styles.inputWithPercent}>
            <input value={notary} onChange={e => setNotary(e.target.value)} />
            <span className={styles.percent}>%</span>
          </div>

          <label>
            Käufer Maklerprovision
            <img src={QuestionIcon} className={styles.icon} onClick={() => setModalContent(infoTexts.broker)} />
          </label>
          <div className={styles.inputWithPercent}>
            <input value={broker} onChange={e => setBroker(e.target.value)} />
            <span className={styles.percent}>%</span>
          </div>

          <p className={styles.sumLine}>€ Gesamtpreis: {totalCost.toFixed(2)}</p>
        </div>

        <div className={styles.col}>
          <label>Eigenkapital</label>
          <div className={styles.inputWithIcon}>
            <input value={equity} onChange={e => setEquity(e.target.value)} />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>

          <label>Tilgung</label>
          <select
            value={repayment}
            onChange={e => {
              setMode('calculateYears');
              setRepayment(e.target.value);
            }}
          >
            {repaymentOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label>Sollzins p. a.</label>
          <div className={styles.inputWithIcon}>
            <input value={interest} onChange={e => setInterest(e.target.value)} />
            <img src={MarkerIcon} className={styles.markerIcon} />
          </div>

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
          <input value={loanAmount} readOnly />

          <div className={styles.rateLabel}>Monatliche Rate</div>
          {monthly !== null && (
            <div className={styles.monthly}>
              <CountUp end={monthly} decimals={2} prefix="€ " duration={1.5} />
            </div>
          )}

          <button onClick={handleCalc} className={styles.btn}>Berechnen</button>
          <button onClick={exportPDF} className={styles.btn}>Export als PDF</button>
        </div>
      </div>

      <p className={styles.hint}>
        <strong>Wichtiger Hinweis:</strong> Die hier berechnete monatliche Rate stellt lediglich eine unverbindliche Beispielrechnung dar...
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