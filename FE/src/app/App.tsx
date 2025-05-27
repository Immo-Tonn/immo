import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@widgets/Layout/Layout';
import ScrollToTop from '@shared/ui/ScrollToTop/ScrollToTop';
import Home from '@pages/Home/Home';
import NotFound from '@pages/NotFound/NotFound';
import Valuation from '@pages/Valuation/Valuation';
import RealEstate from '@pages/RealEstate/RealEstate';
import Financing from '@pages/Financing/Financing';
import ContactForm from '@features/contact/ui/ContactForm';
import LegalNotice from '@pages/LegalNotice/LegalNotice';
import CancellationPolicy from '@pages/CancellationPolicy/CancellationPolicy';
import PrivacyPolicy from '@pages/PrivacyPolicy/PrivacyPolicy';
import DankePage from '@pages/DankePage/DankePage';
import ObjectStyling from '@pages/ObjectStyling/ObjectStyling';
import '@shared/styles/global.css';
import PropertyPage from '@pages/PropertyPage/PropertyPage';
import SalesSupport from '@pages/SalesSupport/SalesSupport';
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
          <Route path="/objectstyling" element={<ObjectStyling />} />
          <Route path="/finanzierung" element={<Financing />} />
          <Route path="/kontakt" element={<ContactForm />} />
          <Route path="/legalnotice" element={<LegalNotice />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/kontakt/danke" element={<DankePage />} />
          <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
          <Route path="/verkaufssupport" element={<SalesSupport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
