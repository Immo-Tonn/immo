import { useParams } from "react-router-dom";
import PropertyHero from "../components/property/PropertyHero";
import PropertyDetails from "../components/property/PropertyDetails";
import PropertyMap from "../components/property/PropertyMap";
import InquiryForm from "../components/property/InquiryForm";
import MortgageCalculator from "../components/MortgageCalculator";

const PropertyPage = () => {
  const { id } = useParams(); // ← получаем ID из URL

  return (
    <div style={{ padding: "2rem" }}>
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
