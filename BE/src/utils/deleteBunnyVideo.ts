import https from "https";
import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "../config/bunny";

const BUNNY_HOST = "video.bunnycdn.com";

export const deleteFromBunnyVideo = async (videoId: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const options = {
      hostname: BUNNY_HOST,
      path: `/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      method: "DELETE",
      headers: {
        AccessKey: BUNNY_API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(
          new Error(`Failed to delete video. Status code: ${res.statusCode}`)
        );
      }
    });

    req.on("error", (err) => {
      reject(new Error(`Error deleting video: ${err.message}`));
    });

    req.end();
  });
};
