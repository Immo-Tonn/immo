import { useParams } from 'react-router-dom';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '@widgets/PropertyMap/PropertyMap';
import MortgageCalculator from '@features/mortgage/ui/MortgageCalculator';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Address {
  country: string;
  city: string;
  zip: number;
  district: string;
  street: string;
  houseNumber: string;
}

interface Image {
  id: string;
  url: string;
  type: string;
}

export interface Apartment {
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

export interface CommercialBuilding {
  buildingType: string;
  area?: number;
  yearBuilt?: number;
  purpose?: string;
  additionalFeatures?: string;
}

export interface LandPlot {
  plotArea: number;
  infrastructureConnection?: string;
  buildingRegulations?: string;
  recommendedUsage?: string;
}

export interface ResidentialHouse {
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

export interface RealEstateObject {
  _id: string;
  type: string;
  title: string;
  description: string;
  features?: string;
  miscellaneous?: string;
  location: string;
  address: Address;
  price: number;
  dateAdded: string;
  status: string;
  images?: any[]; // Предположим, это просто индикатор наличия
  apartments?: Apartment;
  commercial_NonResidentialBuildings?: CommercialBuilding;
  landPlots?: LandPlot;
  residentialHouses?: ResidentialHouse;
  freeWith?: string;
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
        const objectRes = await axios.get<RealEstateObject>(
          `http://localhost:3000/api/objects/${id}`
        );

        const data = objectRes.data;
        setObjectData(data);

        // Запрос изображений только если есть данные в object.images
        if (data.images && data.images.length > 0) {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/by-object?objectId=${id}`
          );
          setImages(imagesRes.data);
        }

      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Laden...</p>;
  if (!objectData) return <p>Objekt nicht gefunden</p>;

  return (
    <div style={{ padding: '2rem' }}>
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
      <MortgageCalculator />
    </div>
  );
};

export default PropertyPage;