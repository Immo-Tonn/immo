import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@widgets/Layout/Layout';
import ScrollToTop from '@shared/ui/ScrollToTop';
import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import PropertyPage from '@pages/PropertyPage';
import Valuation from '@pages/Valuation';
import RealEstate from '@pages/RealEstate';
import Financing from '@pages/Financing';
import Contact from '@pages/ContactForm';
import LegalNotice from '@pages/LegalNotice';
import CancellationPolicy from '@pages/CancellationPolicy';
import PrivacyPolicy from '@pages/PrivacyPolicy';
import 'leaflet/dist/leaflet.css';
import RechtUndRat from '@pages/RechtUndRat/RechtUndRat';


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
          <Route path="/legalnotice" element={<LegalNotice />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
          <Route path='/recht' element={<RechtUndRat/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
