import { useParams } from 'react-router-dom';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '@widgets/PropertyMap/PropertyMap';
import { usePropertyData } from '@shared/api/usePropertyData';
import ContactForm from './ContactForm';

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { objectData, images, videos, loading } = usePropertyData(id);

  if (loading) return <p>Laden...</p>;
  if (!objectData) return <p>Objekt nicht gefunden</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <PropertyHero
        object={objectData}
        images={images}
        videos={videos} 
        apartment={objectData.apartments}
        commercialBuilding={objectData.commercial_NonResidentialBuildings}
        landPlot={objectData.landPlots}
        residentialHouse={objectData.residentialHouses}
      />
      <PropertyDetails
        object={objectData}
        apartment={objectData.apartments}
        commercialBuilding={objectData.commercial_NonResidentialBuildings}
        landPlot={objectData.landPlots}
        residentialHouse={objectData.residentialHouses}
      />
      <PropertyMap address={objectData.address} />
      <ContactForm />
    </div>
  );
};

export default PropertyPage;
