import fs from "fs";
import https from "https";
import {
  BUNNY_API_KEY,
  BUNNY_LIBRARY_ID,
  THUMBNAIL_PROJECT_ID,
} from "../config/bunny";

const BUNNY_HOST = "video.bunnycdn.com";

export const uploadToBunnyVideo = async (
  filePath: string,
  title: string,
  realEstateObjectId: string
): Promise<{
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
}> => {
  const fileBuffer = fs.readFileSync(filePath);

  const videoId = await new Promise<string>((resolve, reject) => {
    const data = JSON.stringify({ title });

    const req = https.request(
      {
        hostname: BUNNY_HOST,
        path: `/library/${BUNNY_LIBRARY_ID}/videos`,
        method: "POST",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.guid) resolve(parsed.guid);
            else reject(new Error(`Failed to create video entry: ${body}`));
          } catch {
            reject(new Error("Failed to parse video entry creation response"));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });

  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      {
        hostname: BUNNY_HOST,
        path: `/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
        method: "PUT",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/octet-stream",
          "Content-Length": fileBuffer.length,
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(
            new Error(`Video upload failed with status code ${res.statusCode}`)
          );
        }
      }
    );

    req.on("error", reject);
    req.write(fileBuffer);
    req.end();
  });

  fs.unlinkSync(filePath);

  const videoUrl = `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${videoId}`;
  const thumbnailUrl = `https://vz-${THUMBNAIL_PROJECT_ID}.b-cdn.net/${videoId}/preview.webp?v=${Math.floor(
    Date.now() / 1000
  )}`;

  return {
    videoId,
    videoUrl,
    thumbnailUrl,
  };
};
