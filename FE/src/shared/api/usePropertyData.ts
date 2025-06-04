import { useEffect, useState } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [err, setErr] = useState<RealEstateObject | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

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
        setErr(null);
        const videosRes = await axios.get<Video[]>(
          `http://localhost:3000/api/videos/by-object?objectId=${id}`,
        );
        setVideos(videosRes.data);
      } catch (err: any) {
        console.error('Fehler beim Laden der Daten:', err);
        setErr(err?.message || 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { objectData, images, videos, loading, err };
};

export const usePropertysData = () => {
  const [objectData, setObjectData] = useState<RealEstateObject[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const objectRes = await axios.get<RealEstateObject[]>(
          `http://localhost:3000/api/objects/`,
        );
        const data = objectRes.data;
        setObjectData(data);

        const imagesRes = await axios.get<Image[]>(
          `http://localhost:3000/api/images/`,
        );
        setImages(imagesRes.data);

        setErr(null);
      } catch (err: any) {
        console.error('Fehler beim Laden der Daten:', err);
        setErr(err?.message || 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { objectData, images, loading, err };
};
