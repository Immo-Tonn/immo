import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Wertermittlung from "./pages/Wertermittlung";
import Immobilien from "./pages/Immobilien";
import Finanzierung from "./pages/Finanzierung";
import Kontakt from "./pages/Kontakt";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wertermittlung" element={<Wertermittlung />} />
        <Route path="/immobilien" element={<Immobilien />} />
        <Route path="/finanzierung" element={<Finanzierung />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
