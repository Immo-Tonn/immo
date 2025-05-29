export const convertToIframeUrl = (originalUrl: string): string => {
  const regex = /^https:\/\/vz-(\d+)\.b-cdn\.net\/([a-f0-9\-]+)\/play$/;
  const match = originalUrl.match(regex);

  if (!match) throw new Error("Invalid video URL format");

  const [, projectId, uuid] = match;
  return `https://iframe.mediadelivery.net/play/${projectId}/${uuid}`;
};

export const getVideoThumbnailUrl = (originalUrl: string): string => {
  const match = originalUrl.match(
    /^https:\/\/vz-\d+\.b-cdn\.net\/([a-f0-9\-]+)\/play$/
  );
  if (!match) return "";

  const uuid = match[1];
  return `https://vz-430278.b-cdn.net/${uuid}/thumbnail.jpg`;
};
