import { useParams } from 'react-router-dom';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '@widgets/PropertyMap/PropertyMap';
import { usePropertyData } from '@shared/api/usePropertyData';
import ContactForm from '@features/contact/ui/ContactForm';
import styles from './PropertyPage.module.css';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { objectData, images, loading, err } = usePropertyData(id);

  return (
    <div className={styles.propertyPageContainer}>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && objectData && (
        <>
          <PropertyHero
            object={objectData}
            images={images}
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
        </>
      )}
    </div>
  );
};

export default PropertyPage;
