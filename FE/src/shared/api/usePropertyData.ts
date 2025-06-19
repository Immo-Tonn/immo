import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

export const usePropertyData = (id?: string) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  // Функция для обновления данных
  const fetchData = useCallback(async () => {
    if (!id) {
      console.warn('usePropertyData: ID is undefined, skipping request');
      return;
    }

    try {
      console.log('Загружаем данные объекта:', id);
      
      const objectRes = await axios.get<RealEstateObject>(
        `http://localhost:3000/api/objects/${id}`,
      );
      const data = objectRes.data;
      setObjectData(data);

      // ВАЖНО: Всегда загружаем изображения заново
      if (data._id) {
        try {
          const imagesRes = await axios.get<Image[]>(
            `http://localhost:3000/api/images/by-object?objectId=${data._id}`,
          );
          console.log('Изображения загружены:', imagesRes.data);
          setImages(imagesRes.data);
        } catch (imgError) {
          console.warn('Ошибка при загрузке изображений:', imgError);
          setImages([]);
        }

        // Загружаем видео
        try {
          const videosRes = await axios.get<Video[]>(
            `http://localhost:3000/api/videos/by-object?objectId=${data._id}`,
          );
          setVideos(videosRes.data);
        } catch (videoError) {
          console.warn('Ошибка при загрузке видео:', videoError);
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

  // Первоначальная загрузка данных
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Обновление при возвращении на вкладку
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

// Хук для списка объектов (без ID)
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

        // Загружаем все изображения
        const imagesRes = await axios.get<Image[]>(
          `http://localhost:3000/api/images/`,
        );
        setImages(imagesRes.data);

        setErr(null);
        console.log('Загружены объекты:', data.length, 'изображения:', imagesRes.data.length);
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

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';

// export const usePropertyData = (id?: string) => {
//   const [objectData, setObjectData] = useState<RealEstateObject | null>(null);
//   const [err, setErr] = useState<RealEstateObject | null>(null);
//   const [images, setImages] = useState<Image[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [videos, setVideos] = useState<Video[]>([]);

//   useEffect(() => {
//     if (!id) {
//       console.warn('usePropertyData: ID is undefined, skipping request');
//       return
//     } 

//     const fetchData = async () => {
//       try {
//         const objectRes = await axios.get<RealEstateObject>(
//           `http://localhost:3000/api/objects/${id}`,
//         );
//         const data = objectRes.data;
//         setObjectData(data);

//         if (data.images && data.images?.length > 0) {
//           const imagesRes = await axios.get<Image[]>(
//             `http://localhost:3000/api/images/by-object?objectId=${id}`,
//           );
//           setImages(imagesRes.data);
//         }
//         setErr(null);
//         const videosRes = await axios.get<Video[]>(
//           `http://localhost:3000/api/videos/by-object?objectId=${id}`,
//         );
//         setVideos(videosRes.data);
//       } catch (err: any) {
//         console.error('Fehler beim Laden der Daten:', err);
//         setErr(err?.message || 'Unbekannter Fehler');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   return { objectData, images, videos, loading, err };
// };

// export const usePropertysData = () => {
//   const [objectData, setObjectData] = useState<RealEstateObject[]>([]);
//   const [err, setErr] = useState<string | null>(null);
//   const [images, setImages] = useState<Image[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const objectRes = await axios.get<RealEstateObject[]>(
//           `http://localhost:3000/api/objects/`,
//         );
//         const data = objectRes.data;
//         setObjectData(data);

//         const imagesRes = await axios.get<Image[]>(
//           `http://localhost:3000/api/images/`,
//         );
//         setImages(imagesRes.data);

//         setErr(null);
//       } catch (err: any) {
//         console.error('Fehler beim Laden der Daten:', err);
//         setErr(err?.message || 'Unbekannter Fehler');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { objectData, images, loading, err };
// };
