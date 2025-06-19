import https from 'https';
import { URL } from 'url';
import { BUNNY_ACCESS_KEY } from '../config/bunny';

export const deleteFromBunny = async (fileUrl: string): Promise<void> => {
  const parsedUrl = new URL(fileUrl);
  const pathToFile = parsedUrl.pathname;

  await new Promise<void>((resolve, reject) => {
    const options = {
      hostname: 'storage.bunnycdn.com',
      path: pathToFile,
      method: 'DELETE',
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
      },
    };

    const req = https.request(options, res => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Löschen von der BunnyCDN ist fehlgeschlagen. Statuscode: ${res.statusCode}`,
          ),
        );
      }
    });

    req.on('error', err => {
      reject(
        new Error(
          `Fehler beim Entfernen der Datei von BunnyCDN: ${err.message}`,
        ),
      );
    });

    req.end();
  });
};
