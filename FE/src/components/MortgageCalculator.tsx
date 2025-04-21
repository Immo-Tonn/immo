import React, { useState } from "react";
import jsPDF from "jspdf";

const MortgageCalculator = () => {
  const [price, setPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(4);
  const [loanTerm, setLoanTerm] = useState(25);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculatePayment = () => {
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    const payment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    setMonthlyPayment(payment);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("ImmoTonn Finanzierungsrechner", 20, 20);

    doc.setFontSize(12);
    doc.text(`Immobilienpreis: €${price}`, 20, 40);
    doc.text(`Eigenkapital: €${downPayment}`, 20, 50);
    doc.text(`Jahreszins: ${interestRate}%`, 20, 60);
    doc.text(`Laufzeit: ${loanTerm} Jahre`, 20, 70);

    if (monthlyPayment !== null) {
      doc.text(`Monatliche Zahlung: €${monthlyPayment.toFixed(2)}`, 20, 90);
    } else {
      doc.text(`Bitte zuerst berechnen`, 20, 90);
    }

    doc.save("Finanzierung_Berechnung.pdf");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>🧮 Immobilien Finanzierung Rechner</h2>

      <label>Immobilienpreis (€):</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <label>Eigenkapital (€):</label>
      <input
        type="number"
        value={downPayment}
        onChange={(e) => setDownPayment(Number(e.target.value))}
      />

      <label>Jahreszins (%):</label>
      <input
        type="number"
        value={interestRate}
        step="0.1"
        onChange={(e) => setInterestRate(Number(e.target.value))}
      />

      <label>Laufzeit (Jahre):</label>
      <input
        type="number"
        value={loanTerm}
        onChange={(e) => setLoanTerm(Number(e.target.value))}
      />

      <button onClick={calculatePayment} style={{ marginTop: "1rem" }}>
        Monatliche Rate berechnen
      </button>

      {monthlyPayment !== null && (
        <p style={{ marginTop: "1rem" }}>
          Monatliche Zahlung: <strong>{monthlyPayment.toFixed(2)} €</strong>
        </p>
      )}

      <button onClick={exportToPDF} style={{ marginTop: "1rem" }}>
        Export als PDF
      </button>
    </div>
  );
};

export default MortgageCalculator;
