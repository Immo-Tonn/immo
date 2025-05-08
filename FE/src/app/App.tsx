import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@widgets/Layout/Layout';
import ScrollToTop from '@shared/ui/ScrollToTop/ScrollToTop';
import Home from '@pages/Home/Home';
import NotFound from '@pages/NotFound/NotFound';
import Valuation from '@pages/Valuation/Valuation';
import RealEstate from '@pages/RealEstate/RealEstate';
import Financing from '@pages/Financing/Financing';
import Contact from '@pages/ContactForm/ContactForm';
import LegalNotice from '@pages/LegalNotice/LegalNotice';
import CancellationPolicy from '@pages/CancellationPolicy/CancellationPolicy';
import PrivacyPolicy from '@pages/PrivacyPolicy/PrivacyPolicy';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wertermittlung" element={<Valuation />} />
          <Route path="/immobilien" element={<RealEstate />} />
          <Route path="/finanzierung" element={<Financing />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/legalnotice" element={<LegalNotice />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
