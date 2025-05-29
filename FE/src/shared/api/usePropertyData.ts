import { useEffect, useState } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
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

        const videosRes = await axios.get<Video[]>(
          `http://localhost:3000/api/videos/by-object?objectId=${id}`,
        );
        setVideos(videosRes.data);
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { objectData, images, videos, loading };
};
