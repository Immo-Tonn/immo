import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  // Function for updating data
  const fetchData = useCallback(async () => {
    if (!id) {
      console.warn('usePropertyData: ID is undefined, skipping request');
      return;
    }

    try {
      console.log('Loading object data:', id);
      
      const objectRes = await axios.get<RealEstateObject>(
        `http://localhost:3000/api/objects/${id}`,
      );
      const data = objectRes.data;
      setObjectData(data);

      // IMPORTANT: Always re-upload images
      if (data._id) {
        try {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/by-object?objectId=${data._id}`,
          );
          console.log('Images uploaded:', imagesRes.data);
          setImages(imagesRes.data);
        } catch (imgError) {
          console.warn('Ошибка при загрузке изображений:', imgError);
          setImages([]);
        }

        // Uploading video
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
      setLoading(false);
    }
  }, [id]);

  // Initial data loading
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id) {
        console.log('Вкладка активна, обновляем данные');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, fetchData]);

  return { objectData, images, videos, loading, err, refreshData: fetchData };
};

// Hook for list of objects (without ID)
export const usePropertysData = () => {
  const [objectData, setObjectData] = useState<RealEstateObject[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Загружаем список всех объектов');
        
        const objectRes = await axios.get<RealEstateObject[]>(
          `http://localhost:3000/api/objects/`,
        );
        const data = objectRes.data;
        setObjectData(data);

        // Loading all images
        const imagesRes = await axios.get<Image[]>(
          `http://localhost:3000/api/images/`,
        );
        setImages(imagesRes.data);

        setErr(null);
        console.log('Geladene Objekte:', data.length, 'Bilder:', imagesRes.data.length);
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