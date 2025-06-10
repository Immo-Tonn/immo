import fs from "fs";
import https from "https";
import {
  BUNNY_STORAGE_ZONE,
  BUNNY_STORAGE_HOST,
  BUNNY_ACCESS_KEY,
} from "../config/bunny";

// Заменяет storage-ссылку на CDN-ссылку
const transformBunnyUrl = (url: string): string =>
  url.replace(
    "https://storage.bunnycdn.com/immobilien-media",
    "https://immobilien-cdn.b-cdn.net"
  );

export const uploadToBunny = async (
  localFilePath: string,
  originalName: string
): Promise<string> => {
  const fileName = `${Date.now()}-${originalName}`;
  const fullPath = `${BUNNY_STORAGE_ZONE}/${fileName}`;
  const uploadUrl = `https://${BUNNY_STORAGE_HOST}/${fullPath}`;

  const fileBuffer = fs.readFileSync(localFilePath);

  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.request(
        uploadUrl,
        {
          method: "PUT",
          headers: {
            AccessKey: BUNNY_ACCESS_KEY,
            "Content-Type": "application/octet-stream",
            "Content-Length": fileBuffer.length,
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(
              new Error(
                `Hochladen fehlgeschlagen. Statuscode: ${res.statusCode}`
              )
            );
          }
        }
      );

      req.on("error", (err) => {
        reject(new Error(`Fehler beim Hochladen: ${err.message}`));
      });

      req.write(fileBuffer);
      req.end();
    });

    fs.unlinkSync(localFilePath);

    const storageUrl = `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/${fileName}`;
    return transformBunnyUrl(storageUrl); // ✅ возвращаем сразу CDN-ссылку
  } catch (error: any) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new Error(`Upload zur BunnyCDN fehlgeschlagen: ${error.message}`);
  }
};
