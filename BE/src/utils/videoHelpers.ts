import { BUNNY_LIBRARY_ID, THUMBNAIL_PROJECT_ID } from "../config/bunny";

export const convertToIframeUrl = (originalUrl: string): string => {
  const regex = /^https:\/\/vz-(\d+)\.b-cdn\.net\/([a-f0-9\-]+)\/play$/;
  const match = originalUrl.match(regex);

  if (!match) throw new Error("Invalid video URL format");

  const [, projectId, uuid] = match;
  return `https://iframe.mediadelivery.net/play/${projectId}/${uuid}`;
};

// ИСПРАВЛЕННАЯ функция для получения thumbnail URL
export const getVideoThumbnailUrl = (originalUrl: string): string => {
  // Извлекаем UUID видео из iframe или direct play URL
  const iframeRegex =
    /^https:\/\/iframe\.mediadelivery\.net\/play\/\d+\/([a-f0-9\-]+)/;
  const directRegex =
    /^https:\/\/vz-[a-z0-9\-]+\.b-cdn\.net\/([a-f0-9\-]+)\/play/;
    
  const iframeMatch = originalUrl.match(iframeRegex);
  const directMatch = originalUrl.match(directRegex);
  
  const uuid = iframeMatch?.[1] || directMatch?.[1];
  
  if (!uuid) {
    console.warn("Invalid video URL format:", originalUrl);
    return "";
  }

  // ИСПРАВЛЕНИЕ: Используем thumbnail.jpg вместо preview.webp
  // Также убираем timestamp чтобы избежать проблем с кешированием
  return `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumbnail.jpg`;
};

// ДОПОЛНИТЕЛЬНАЯ функция для получения нескольких вариантов thumbnail
export const getVideoThumbnailUrls = (originalUrl: string): string[] => {
  const iframeRegex =
    /^https:\/\/iframe\.mediadelivery\.net\/play\/\d+\/([a-f0-9\-]+)/;
  const directRegex =
    /^https:\/\/vz-[a-z0-9\-]+\.b-cdn\.net\/([a-f0-9\-]+)\/play/;
    
  const iframeMatch = originalUrl.match(iframeRegex);
  const directMatch = originalUrl.match(directRegex);
  
  const uuid = iframeMatch?.[1] || directMatch?.[1];
  
  if (!uuid) {
    console.warn("Invalid video URL format:", originalUrl);
    return [];
  }

  // Возвращаем массив возможных thumbnail URL в порядке приоритета
  return [
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumbnail.jpg`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/poster.jpg`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/preview.webp`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumb.jpg`
  ];
};

// НОВАЯ функция для проверки доступности thumbnail
export const getAvailableThumbnailUrl = async (originalUrl: string): Promise<string> => {
  const thumbnailUrls = getVideoThumbnailUrls(originalUrl);
  
  // Простая функция для проверки доступности URL
  const checkUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Проверяем каждый URL и возвращаем первый доступный
  for (const url of thumbnailUrls) {
    if (await checkUrl(url)) {
      return url;
    }
  }

  // Если ничего не найдено, возвращаем основной URL
  return getVideoThumbnailUrl(originalUrl);
};
