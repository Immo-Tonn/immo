import fs from "fs";
import https from "https";
import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "../config/bunny";

const BUNNY_HOST = "video.bunnycdn.com";

export const uploadToBunnyVideo = async (
  filePath: string,
  title: string
): Promise<{ videoId: string; videoUrl: string; thumbnailUrl: string }> => {
  const fileBuffer = fs.readFileSync(filePath);

  // 1. Create video entry
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
            if (parsed.guid) {
              resolve(parsed.guid);
            } else {
              reject(new Error(`Failed to create video entry: ${body}`));
            }
          } catch (e) {
            reject(new Error("Failed to parse video entry creation response"));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });

  // 2. Upload video binary
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

    req.on("error", (err) => reject(err));
    req.write(fileBuffer);
    req.end();
  });

  // Удаляем локальный файл после успешной загрузки
  fs.unlinkSync(filePath);

  // Формируем публичные URL для видео и превью
  return {
    videoId,
    videoUrl: `https://vz-${BUNNY_LIBRARY_ID}.b-cdn.net/${videoId}/play`,
    thumbnailUrl: `https://vz-${BUNNY_LIBRARY_ID}.b-cdn.net/${videoId}/thumbnail.jpg`,
  };
};
