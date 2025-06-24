import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  const MIN_LOADING_TIME = 2000;

  const fetchData = useCallback(async () => {
    if (!id) {
      console.warn('usePropertyData: ID is undefined, skipping request');
      return;
    }

    const startTime = Date.now();
    setLoading(true);

    try {
      console.log('Loading object data:', id);

      const objectRes = await axios.get<RealEstateObject>(
        `http://localhost:3000/api/objects/${id}`,
      );
      const data = objectRes.data;
      setObjectData(data);

      if (data._id) {
        try {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/by-object?objectId=${data._id}`,
          );
          console.log('Images loaded:', imagesRes.data);
          setImages(imagesRes.data);
        } catch (imgError) {
          console.warn('Error loading images:', imgError);
          setImages([]);
        }
        try {
          const videosRes = await axios.get<Video[]>(
            `http://localhost:3000/api/videos/by-object?objectId=${data._id}`,
          );
          setVideos(videosRes.data);
        } catch (videoError) {
          console.warn('Error loading video:', videoError);
          setVideos([]);
        }
      }

      setErr(null);
    } catch (err: any) {
      console.error('Fehler beim Laden der Daten:', err);
      setErr(err?.message || 'Unbekannter Fehler');
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = MIN_LOADING_TIME - elapsed;
      if (delay > 0) {
        setTimeout(() => setLoading(false), delay);
      } else {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id) {
        console.log('Tab is active, refreshing data');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, fetchData]);

  return { objectData, images, videos, loading, err, refreshData: fetchData };
};

export const usePropertysData = () => {
  const [objectData, setObjectData] = useState<RealEstateObject[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 1000;
    const fetchData = async () => {
      const startTime = Date.now();

      try {
        console.log('Loading list of all objects');

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
        console.log(
          'Objects loaded:',
          data.length,
          'Images:',
          imagesRes.data.length,
        );
      } catch (err: any) {
        console.error('Error loading data:', err);
        setErr(err?.message || 'Unknown error');
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = MIN_LOADING_TIME - elapsed;

        if (delay > 0) {
          // Ждем остаток времени, чтобы суммарно загрузка длилась минимум 10 секунд
          setTimeout(() => setLoading(false), delay);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return { objectData, images, loading, err };
};
