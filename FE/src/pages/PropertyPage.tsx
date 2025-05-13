import { useParams } from 'react-router-dom';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '@widgets/PropertyMap/PropertyMap';
import InquiryForm from '@features/contact/ui/InquiryForm';
import MortgageCalculator from '@features/mortgage/ui/MortgageCalculator';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Address {
  city: string;
  zip: number;
}

interface Image {
  id: string;
  url: string;
  type: string;
}

interface Apartment {
  floor?: number;
  totalFloors?: number;
  livingArea: number;
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  yearBuilt?: number;
  yearRenovated?: number;
  heatingType?: string;
  energySource?: string;
  energyEfficiencyClass?: string;
  additionalFeatures?: string;
}

interface CommercialBuilding {
  buildingType: string;
  area?: number;
  yearBuilt?: number;
  purpose?: string;
  additionalFeatures?: string;
}

interface LandPlot {
  plotArea: number;
  infrastructureConnection?: string;
  buildingRegulations?: string;
  recommendedUsage?: string;
}

interface ResidentialHouse {
  numberOfFloors?: number;
  livingArea: number;
  usableArea?: number;
  plotArea?: number;
  numberOfRooms: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  garageParkingSpaces?: string;
  yearBuilt?: number;
  heatingType?: string;
  energySource?: string;
  energyEfficiencyClass?: string;
  additionalFeatures?: string;
}

interface RealEstateObject {
  id: string;
  type: string;
  description: string;
  location: string;
  additionalInfo: string;
  address: Address;
  price: number;
  dateAdded: string;
  status: string;
  images?: Image[];
  apartments?: Apartment;
  commercial_NonResidentialBuildings?: CommercialBuilding;
  landPlots?: LandPlot;
  residentialHouses?: ResidentialHouse;
}

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [objectRes, imagesRes] = await Promise.all([
          axios.get<RealEstateObject>(`http://localhost:3000/api/objects/${id}`),
          axios.get<Image[]>(`http://localhost:3000/api/images/by-object?objectId=${id}`)
        ]);

        setObjectData(objectRes.data);
        setImages(imagesRes.data);
      } catch (err) {
        console.error('Fehler beim Laden des Objekts oder der Bilder:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Lädt...</p>;
  if (!objectData) return <p>Objekt nicht gefunden</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <PropertyHero 
      object={objectData} 
      images={images}  
      apartment={objectData.apartments}
      commercialBuilding={objectData.commercial_NonResidentialBuildings}
      landPlot={objectData.landPlots}
      residentialHouse={objectData.residentialHouses}/>
      <PropertyDetails
        object={objectData}
        apartment={objectData.apartments}
        commercialBuilding={objectData.commercial_NonResidentialBuildings}
        landPlot={objectData.landPlots}
        residentialHouse={objectData.residentialHouses}
      />
      <PropertyMap address={objectData.address} />
      <InquiryForm />
      <MortgageCalculator />
    </div>
  );
};

export default PropertyPage;
