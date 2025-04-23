import { useParams } from 'react-router-dom';
import PropertyHero from '../widgets/PropertyHero/PropertyHero';
import PropertyDetails from '../widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '../widgets/PropertyMap/PropertyMap';
import InquiryForm from '../features/contact/InquiryForm';
import MortgageCalculator from '../features/mortgage/MortgageCalculator';

const PropertyPage = () => {
  const { id } = useParams(); // ← получаем ID из URL

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Заглушка: выбран объект с ID — {id}</h2>

      <PropertyHero />
      <PropertyDetails />
      <PropertyMap />
      <InquiryForm />
      <MortgageCalculator />
    </div>
  );
};

export default PropertyPage;
