// import { google } from "googleapis";
// import fs from "fs";
// import path from "path";

// // Настройка аутентификации
// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(process.cwd(), "credentials.json"), // Путь к файлу с учетными данными
//   scopes: ["https://www.googleapis.com/auth/drive"],
// });

// const drive = google.drive({ version: "v3", auth });

// // Загрузка файла на Google Drive
// export const uploadFileToDrive = async (
//   filePath: string,
//   mimeType: string,
//   fileName: string
// ): Promise<string> => {
//   try {
//     const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // ID папки на Google Drive

//     if (!folderId) {
//       throw new Error("GOOGLE_DRIVE_FOLDER_ID не указан в .env файле");
//     }

//     const fileMetadata = {
//       name: fileName,
//       parents: [folderId],
//     };

//     const media = {
//       mimeType,
//       body: fs.createReadStream(filePath),
//     };

//     const response = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id,webViewLink",
//     });

//     console.log("Файл успешно загружен:", response.data);

//     // Удаляем локальный файл после загрузки
//     fs.unlinkSync(filePath);

//     // Возвращаем URL или ID файла
//     return (
//       response.data.webViewLink ||
//       `https://drive.google.com/file/d/${response.data.id}/view`
//     );
//   } catch (error) {
//     console.error("Ошибка при загрузке файла на Google Drive:", error);
//     throw error;
//   }
// };

// // Удаление файла с Google Drive
// export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
//   try {
//     await drive.files.delete({
//       fileId,
//     });
//     console.log("Файл успешно удален с Google Drive:", fileId);
//   } catch (error) {
//     console.error("Ошибка при удалении файла с Google Drive:", error);
//     throw error;
//   }
// };

// // Получение ID файла из URL
// export const getFileIdFromUrl = (url: string): string | null => {
//   const regex = /\/d\/([^\/]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };
