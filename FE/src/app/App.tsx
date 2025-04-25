import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../widgets/Layout/Layout';
import ScrollToTop from '../shared/ui/ScrollToTop';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import PropertyPage from '../pages/PropertyPage';
import Valuation from '../pages/Valuation';
import RealEstate from '../pages/RealEstate';
import Financing from '../pages/Financing';
import Contact from '../pages/Contact';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wertermittlung" element={<Valuation />} />
          <Route path="/immobilien" element={<RealEstate />} />
          <Route path="/immobilien/:id" element={<PropertyPage />} />
          <Route path="/finanzierung" element={<Financing />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
