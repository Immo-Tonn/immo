import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  // Function for updating data
  const fetchData = useCallback(async () => {
    if (!id) {
      console.warn('usePropertyData: ID is undefined, skipping request');
      setLoading(false);
      return;
    }

    if (isDeleted) {
      console.log('usePropertyData: Объект помечен как удаленный, пропускаем запрос');
      setLoading(false);
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
      setIsDeleted(false);
    } catch (err: any) {
      console.error('Fehler beim Laden der Daten:', err);
      setErr(err?.message || 'Unbekannter Fehler');
          if (err?.response?.status === 404) {
        console.log('Объект не найден (возможно удален), помечаем как удаленный');
        setIsDeleted(true);
        setObjectData(null);
        setImages([]);
        setVideos([]);
        setErr('Objekt nicht gefunden oder wurde gelöscht');
      } else {
        setErr(err?.message || 'Unbekannter Fehler');
      }
    

    } finally {
      setLoading(false);
    }    
  }, [id, isDeleted]);

  // Initial data loading
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id && !isDeleted) {
        console.log('Вкладка активна, обновляем данные');
        fetchData
        fetchData();
      } else if (!document.hidden && isDeleted){
        console.log('Вкладка активна, но объект удален - пропускаем обновление');        
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, fetchData, isDeleted]);

  const markAsDeleted = useCallback(()=>{
    setIsDeleted(true);
    setObjectData(null);
    setImages([]);
    setVideos([])
    setErr('Object wurde gelöscht')
  }, [])

  return { objectData, images, videos, loading, err, refreshData: fetchData, isDeleted, markAsDeleted };
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
        console.log('Loading list of all objects');
        
        const objectRes = await axios.get<RealEstateObject[]>(
          `http://localhost:3000/api/objects/`,
        );
        const data = objectRes.data;
        setObjectData(data);

        // Loading all images
        try {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/`,
          );
          setImages(imagesRes.data || []); // Добавлена проверка на null/undefined
          console.log('Geladene Bilder:', imagesRes.data?.length || 0);
        } catch (imageError: any) {
          // ДОБАВЛЕНО: Обработка случая когда изображений нет (404)
          if (imageError?.response?.status === 404) {
            console.log('Изображения не найдены (пустая база) - устанавливаем пустой массив');
            setImages([]); // Устанавливаем пустой массив вместо ошибки
          } else {
            console.warn('Ошибка при загрузке изображений:', imageError);
            setImages([]); // Устанавливаем пустой массив при любых других ошибках
          }
        }

        setErr(null);
        console.log('Geladene Objekte:', data.length, 'Bilder:', images.length);
      } catch (err: any) {
        console.error('Fehler beim Laden der Daten:', err);


        if (err?.response?.status === 404) {
          // Если объекты не найдены
          setObjectData([]);
          setImages([]);
          setErr(null); // Не показываем ошибку для пустой базы
          console.log('Объекты не найдены - показываем пустое состояние');
        } else {
          // Другие ошибки (сеть, сервер и т.д.)
          setErr(err?.message || 'Unbekannter Fehler');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return { objectData, images, loading, err };
};