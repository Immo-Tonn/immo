import { useEffect, useState } from 'react';
import axios from 'axios';
import { RealEstateObject, Image } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const objectRes = await axios.get<RealEstateObject>(
          `http://localhost:3000/api/objects/${id}`,
        );
        const data = objectRes.data;
        setObjectData(data);

        if (data.images && data.images?.length > 0) {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/by-object?objectId=${id}`,
          );
          setImages(imagesRes.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { objectData, images, loading };
};
