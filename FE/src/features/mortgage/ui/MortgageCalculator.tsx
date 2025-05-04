import { useState } from 'react';
import jsPDF from 'jspdf';
import { calcMonthly } from '../model/model';
import Button from '@shared/ui/Button/Button';
import styles from './MortgageCalculator.module.css';
const MortgageCalculator = () => {
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(4);
  const [years, setYears] = useState(25);
  const [monthly, setMonthly] = useState<number | null>(null);

  const handleCalc = () => setMonthly(calcMonthly(price, down, rate, years));

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('ImmoTonn Finanzierungsrechner', 20, 20);

    doc.setFontSize(12);
    doc.text(`Immobilienpreis: €${price}`, 20, 40);
    doc.text(`Eigenkapital: €${down}`, 20, 50);
    doc.text(`Jahreszins: ${rate}%`, 20, 60);
    doc.text(`Laufzeit: ${years} Jahre`, 20, 70);

    if (monthly !== null) {
      doc.text(`Monatliche Zahlung: €${monthly.toFixed(2)}`, 20, 90);
    } else {
      doc.text(`Bitte zuerst berechnen`, 20, 90);
    }

    doc.save('Finanzierung_Berechnung.pdf');
  };

  return (
    <div className={styles.calculatorWrapper}>
      <h2>🧮 Immobilien Finanzierung Rechner</h2>

      <label>Immobilienpreis (€):</label>
      <input
        value={price}
        type="number"
        onChange={e => setPrice(+e.target.value)}
      />

      <label>Eigenkapital (€):</label>
      <input
        value={down}
        type="number"
        onChange={e => setDown(+e.target.value)}
      />

      <label>Jahreszins (%):</label>

      <select value={rate} onChange={e => setRate(+e.target.value)}>
        <option value={3.5}>3.5%</option>
        <option value={3.8}>3.8%</option>
        <option value={4.0}>4.0%</option>
        <option value={4.5}>4.5%</option>
        <option value={5.0}>5.0%</option>
      </select>

      <label>Laufzeit (Jahre)</label>
      <input
        value={years}
        type="number"
        onChange={e => setYears(+e.target.value)}
      />

      <Button
        initialText="Berechnen"
        clickedText="im Prozess"
        onClick={handleCalc}
      />

      {monthly && (
        <p className={styles.result}>
          Monatliche Zahlung: <strong>{monthly.toFixed(2)} € / Monat</strong>
        </p>
      )}

      <Button
        className={styles.exportBtn}
        initialText="Export als PDF"
        clickedText="im Prozess"
        onClick={exportPDF}
      />
    </div>
  );
};

export default MortgageCalculator;
