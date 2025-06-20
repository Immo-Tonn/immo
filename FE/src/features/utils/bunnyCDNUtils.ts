// import axios from '@features/utils/axiosConfig';

// // Функция для получения временной ссылки для загрузки на сервер
// export const getUploadUrl = async (): Promise<string> => {
//   try {
//     const response = await axios.get('/images/upload-url');
//     return response.data.uploadUrl;
//   } catch (error) {
//     console.error('Ошибка при получении URL для загрузки:', error);
//     throw error;
//   }
// };

// // Функция для загрузки файла непосредственно в BunnyCDN
// export const uploadToBunnyCDN = async (
//   file: File,
//   onProgress?: (progress: number) => void,
// ): Promise<string> => {
//   try {
//     // 1. Получаем предварительно подписанный URL для загрузки
//     const uploadUrl = await getUploadUrl();

//     // 2. Загружаем файл по полученному URL
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await axios.put(uploadUrl, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: progressEvent => {
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / (progressEvent.total || 100),
//         );
//         if (onProgress) {
//           onProgress(percentCompleted);
//         }
//       },
//     });

//     // 3. Возвращаем публичный URL файла
//     return response.data.url;
//   } catch (error) {
//     console.error('Ошибка при загрузке файла в BunnyCDN:', error);
//     throw error;
//   }
// };

// // Функция для удаления файла из BunnyCDN
// export const deleteFromBunnyCDN = async (fileUrl: string): Promise<void> => {
//   try {
//     await axios.delete('/images/delete-cdn', {
//       data: { fileUrl },
//     });
//   } catch (error) {
//     console.error('Ошибка при удалении файла из BunnyCDN:', error);
//     throw error;
//   }
// };
