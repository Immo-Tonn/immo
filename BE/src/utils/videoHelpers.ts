import { BUNNY_LIBRARY_ID, THUMBNAIL_PROJECT_ID } from "../config/bunny";

export const convertToIframeUrl = (originalUrl: string): string => {
  const regex = /^https:\/\/vz-(\d+)\.b-cdn\.net\/([a-f0-9\-]+)\/play$/;
  const match = originalUrl.match(regex);

  if (!match) throw new Error("Invalid video URL format");

  const [, projectId, uuid] = match;
  return `https://iframe.mediadelivery.net/play/${projectId}/${uuid}`;
};

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

  const timestamp = Math.floor(Date.now() / 1000);
  return `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${uuid}/preview.webp?v=${timestamp}`;
};
