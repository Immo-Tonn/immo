import React, { useState } from "react";
import jsPDF from "jspdf";
import styles from "../styles/MortgageCalculator.module.css";

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
    doc.text(
      `Monatliche Zahlung: €${
        monthlyPayment?.toFixed(2) || "Bitte zuerst berechnen"
      }`,
      20,
      90
    );
    doc.save("Finanzierung_Berechnung.pdf");
  };

  return (
    <div className={styles.calculatorWrapper}>
      <h2>Immobilien Finanzierung Rechner</h2>

      <label>Immobilienpreis (€):</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
      />

      <label>Eigenkapital (€):</label>
      <input
        type="number"
        value={downPayment}
        onChange={(e) => setDownPayment(+e.target.value)}
      />

      <label>Jahreszins (%):</label>
      <select
        value={interestRate}
        onChange={(e) => setInterestRate(+e.target.value)}
      >
        <option value={3.5}>3.5%</option>
        <option value={3.8}>3.8%</option>
        <option value={4.0}>4.0%</option>
        <option value={4.5}>4.5%</option>
        <option value={5.0}>5.0%</option>
      </select>

      <label>Laufzeit (Jahre):</label>
      <input
        type="number"
        value={loanTerm}
        onChange={(e) => setLoanTerm(+e.target.value)}
      />

      <button onClick={calculatePayment}>Rate berechnen</button>

      {monthlyPayment !== null && (
        <p className={styles.result}>
          Monatliche Zahlung: <strong>{monthlyPayment.toFixed(2)} €</strong>
        </p>
      )}

      <button className={styles.exportBtn} onClick={exportToPDF}>
        Export als PDF
      </button>
    </div>
  );
};

export default MortgageCalculator;
