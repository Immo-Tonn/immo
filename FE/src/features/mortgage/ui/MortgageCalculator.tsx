import { useState } from 'react';
import jsPDF from 'jspdf';
import { calcMonthly } from '../model/model';
import Button from '@shared/ui/Button/Button';

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
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
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
      <input
        value={rate}
        type="number"
        step="0.1"
        onChange={e => setRate(+e.target.value)}
      />

      <label>Laufzeit (Jahre)</label>
      <input
        value={years}
        type="number"
        onChange={e => setYears(+e.target.value)}
      />

      <Button text="Berechnen" onClick={handleCalc} />

      {monthly && <p>Rate: {monthly.toFixed(2)} € / Monat</p>}

      <Button text="PDF" onClick={exportPDF} />
    </div>
  );
};

export default MortgageCalculator;
