import { BUNNY_LIBRARY_ID, THUMBNAIL_PROJECT_ID } from '../config/bunny';

export const convertToIframeUrl = (originalUrl: string): string => {
  const regex = /^https:\/\/vz-(\d+)\.b-cdn\.net\/([a-f0-9\-]+)\/play$/;
  const match = originalUrl.match(regex);

  if (!match) throw new Error('Invalid video URL format');

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
    console.warn('Invalid video URL format:', originalUrl);
    return '';
  }

  // FIX: Use thumbnail.jpg instead of preview.webp
  // Remove the timestamp to avoid caching problems.
  return `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumbnail.jpg`;
};

// OPTIONAL feature to get multiple thumbnail options
export const getVideoThumbnailUrls = (originalUrl: string): string[] => {
  const iframeRegex =
    /^https:\/\/iframe\.mediadelivery\.net\/play\/\d+\/([a-f0-9\-]+)/;
  const directRegex =
    /^https:\/\/vz-[a-z0-9\-]+\.b-cdn\.net\/([a-f0-9\-]+)\/play/;

  const iframeMatch = originalUrl.match(iframeRegex);
  const directMatch = originalUrl.match(directRegex);

  const uuid = iframeMatch?.[1] || directMatch?.[1];

  if (!uuid) {
    console.warn('Invalid video URL format:', originalUrl);
    return [];
  }

  // Return array of possible thumbnail URLs in order of priority
  return [
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumbnail.jpg`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/poster.jpg`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/preview.webp`,
    `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/thumb.jpg`,
  ];
};

// NEW feature to check thumbnail availability
export const getAvailableThumbnailUrl = async (
  originalUrl: string,
): Promise<string> => {
  const thumbnailUrls = getVideoThumbnailUrls(originalUrl);

  //Simple function to check URL availability
  const checkUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Check each URL and return the first available one
  for (const url of thumbnailUrls) {
    if (await checkUrl(url)) {
      return url;
    }
  }

  // If nothing found, return the base URL
  return getVideoThumbnailUrl(originalUrl);
};
