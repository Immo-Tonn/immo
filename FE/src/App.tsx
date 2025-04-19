import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Wertermittlung from "./pages/Wertermittlung";
import Immobilien from "./pages/Immobilien";
import Finanzierung from "./pages/Finanzierung";
import Kontakt from "./pages/Kontakt";
import KontaktForm from "./pages/KontaktForm";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wertermittlung" element={<Wertermittlung />} />
          <Route path="/immobilien" element={<Immobilien />} />
          <Route path="/finanzierung" element={<Finanzierung />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/kontakt/form" element={<KontaktForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
