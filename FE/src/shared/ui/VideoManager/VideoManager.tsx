import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import axiosInstance from '@features/utils/axiosConfig';
import styles from './VideoManager.module.css';

interface Video {
  _id?: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  videoId?: string;
}

interface VideoFile extends File {
  title?: string;
}

interface TempVideo {
  tempId: string;
  originalName: string;
  title: string;
  size: number;
  path: string;
  mimetype: string;
}

interface VideoManagerProps {
  realEstateObjectId: string;
  existingVideos?: Video[];
  onVideosChange?: (videos: Video[]) => void;
  isEditMode?: boolean;
  tempVideos?: TempVideo[];
  onTempVideosChange?: (videos: TempVideo[]) => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({
  realEstateObjectId,
  existingVideos = [],
  onVideosChange,
  isEditMode = false,
  tempVideos = [],
  onTempVideosChange,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<VideoFile[]>([]);
  const [existingVideoList, setExistingVideoList] =
    useState<Video[]>(existingVideos);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    console.log('🔍 === VideoManager Props Debug ===');
    console.log('  realEstateObjectId:', realEstateObjectId);
    console.log('  realEstateObjectId type:', typeof realEstateObjectId);
    console.log('  isEditMode:', isEditMode);
    console.log('  tempVideos length:', tempVideos.length);
    console.log('  existingVideos length:', existingVideos.length);
    console.log('  onTempVideosChange defined:', typeof onTempVideosChange);
    console.log('================================');
  }, [
    realEstateObjectId,
    isEditMode,
    tempVideos.length,
    existingVideos.length,
  ]);

  // Обновляем существующие видео при изменении пропсов
  React.useEffect(() => {
    setExistingVideoList(existingVideos);

    // Добавляем логирование для диагностики
    if (existingVideos.length > 0) {
      console.log('=== VideoManager Debug ===');
      existingVideos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, {
          title: video.title,
          originalUrl: video.url,
          thumbnailUrl: video.thumbnailUrl,
          directUrl: getDirectVideoUrl(video.url),
          iframeUrl: getIframeUrl(video.url),
        });
      });
      console.log('========================');
    }
  }, [existingVideos]);

  // Cleanup при размонтировании компонента
  React.useEffect(() => {
    return () => {
      if (realEstateObjectId === 'new-object' && tempVideos.length > 0) {
        const tempIds = tempVideos.map(video => video.tempId);
        axiosInstance
          .post('/videos/cleanup-temp', { tempIds })
          .catch(err => console.warn('Cleanup error on unmount:', err));
      }
    };
  }, [realEstateObjectId, tempVideos]);

  // Предупреждение при закрытии страницы с несохраненными видео
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        selectedFiles.length > 0 ||
        (realEstateObjectId === 'new-object' && tempVideos.length > 0)
      ) {
        e.preventDefault();
        return true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedFiles, realEstateObjectId, tempVideos]);

  // Функция для получения правильного thumbnail URL
  const getCorrectThumbnailUrl = (video: Video): string => {
    if (video.thumbnailUrl) {
      const videoId =
        extractVideoId(video.url) || extractVideoId(video.thumbnailUrl);
      if (videoId) {
        return `https://vz-973fa28c-a7d.b-cdn.net/${videoId}/preview.webp?v=${Math.floor(Date.now() / 1000)}`;
      }
    }
    return video.thumbnailUrl || '';
  };

  // Функция для извлечения videoId из URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /\/([a-f0-9\-]+)\/play$/,
      /\/([a-f0-9\-]+)\/thumbnail/,
      /\/([a-f0-9\-]+)\/preview/,
      /play\/\d+\/([a-f0-9\-]+)/,
      /embed\/\d+\/([a-f0-9\-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const getDirectVideoUrl = (originalUrl: string): string => {
    try {
      if (originalUrl.includes('.mp4') || originalUrl.includes('play_')) {
        return originalUrl;
      }

      const playRegex = /iframe\.mediadelivery\.net\/play\/\d+\/([a-f0-9\-]+)/;
      const embedRegex =
        /iframe\.mediadelivery\.net\/embed\/\d+\/([a-f0-9\-]+)/;

      const playMatch = originalUrl.match(playRegex);
      const embedMatch = originalUrl.match(embedRegex);
      const videoId = playMatch?.[1] || embedMatch?.[1];

      if (videoId) {
        return `https://vz-973fa28c-a7d.b-cdn.net/${videoId}/play_480p.mp4`;
      }

      console.warn('Не удалось извлечь videoId из URL:', originalUrl);
      return originalUrl;
    } catch (error) {
      console.error('Ошибка при получении прямой ссылки:', error);
      return originalUrl;
    }
  };

  // Функция для получения iframe URL для встраивания
  const getIframeUrl = (originalUrl: string): string => {
    try {
      if (originalUrl.includes('iframe.mediadelivery.net/embed/')) {
        return originalUrl;
      }

      const playRegex =
        /iframe\.mediadelivery\.net\/play\/(\d+)\/([a-f0-9\-]+)/;
      const match = originalUrl.match(playRegex);

      if (match) {
        const [, libraryId, videoId] = match;
        return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
      }

      const directRegex = /vz-[\w\-]+\.b-cdn\.net\/([a-f0-9\-]+)/;
      const directMatch = originalUrl.match(directRegex);

      if (directMatch) {
        const [, videoId] = directMatch;
        return `https://iframe.mediadelivery.net/embed/430278/${videoId}`;
      }

      return originalUrl;
    } catch (error) {
      console.error('Ошибка при получении iframe URL:', error);
      return originalUrl;
    }
  };

  // 3. checkServerAvailability (возможная проблема):
  const checkServerAvailability = async (): Promise<boolean> => {
    try {
      console.log('🔍 Проверяем доступность сервера...');
      await axiosInstance.get('/videos', { timeout: 5000 });
      console.log('✅ Сервер доступен');
      return true;
    } catch (error) {
      console.error('❌ Сервер недоступен:', error);
      setError(
        'Server ist nicht verfügbar. Bitte versuchen Sie es später erneut.',
      );
      return false;
    }
  };

  // Новый метод для загрузки временных видео
  const uploadTempVideos = async () => {
    console.log('🎥 === НАЧАЛО uploadTempVideos ===');
    console.log('📁 selectedFiles.length:', selectedFiles.length);

    if (selectedFiles.length === 0) {
      console.log('❌ Нет файлов для временной загрузки');
      return;
    }

    console.log('🎥 НАЧИНАЕМ ВРЕМЕННУЮ ЗАГРУЗКУ для новых объектов');
    console.log('📁 Количество файлов:', selectedFiles.length);
    console.log('🔗 realEstateObjectId:', realEstateObjectId);

    // Проверяем общий размер всех файлов
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 500 * 1024 * 1024; // 500MB общий лимит

    if (totalSize > maxTotalSize) {
      console.log('❌ Превышен лимит размера файлов');
      setError(
        'Gesamtgröße aller Videos überschreitet 500MB. Bitte reduzieren Sie die Anzahl der Dateien.',
      );
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const newTempVideos: TempVideo[] = [];
    const failedUploads: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (!file) {
          console.warn(`Файл с индексом ${i} не найден`);
          continue;
        }

        try {
          console.log(
            `📤 Загружаем файл ${i + 1}/${selectedFiles.length}: ${file.name}`,
          );
          const formData = new FormData();
          formData.append('video', file);
          formData.append('title', file.title || file.name);

          console.log('🚀 Отправляем запрос на /videos/temp');
          console.log('📋 FormData содержит:', {
            video: file.name,
            title: file.title || file.name,
          });

          const response = await axiosInstance.post('/videos/temp', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 300000,
            onUploadProgress: progressEvent => {
              const total = progressEvent.total || 1;
              const current = progressEvent.loaded;
              const fileProgress = (current / total) * 100;
              const totalProgress =
                (i / selectedFiles.length) * 100 +
                fileProgress / selectedFiles.length;
              setUploadProgress(Math.round(totalProgress));
            },
          });

          console.log('✅ Ответ от сервера:', response.data);
          newTempVideos.push(response.data);
        } catch (fileError: any) {
          console.error(`❌ Ошибка загрузки файла ${file.name}:`, fileError);
          console.error('❌ URL запроса:', fileError.config?.url);
          console.error('❌ Метод запроса:', fileError.config?.method);
          console.error('❌ Детали ошибки:', fileError.response?.data);
          failedUploads.push(file.name);
        }
      }

      // Обновляем список временных видео
      if (onTempVideosChange) {
        console.log(
          '📋 Обновляем tempVideos, добавляем:',
          newTempVideos.length,
        );
        onTempVideosChange([...tempVideos, ...newTempVideos]);
      } else {
        console.log('⚠️ onTempVideosChange не определен!');
      }

      // Очищаем выбранные файлы
      setSelectedFiles([]);
      setUploadProgress(0);

      // Показываем результат
      if (failedUploads.length > 0) {
        setError(
          `${newTempVideos.length} Videos gespeichert, ${failedUploads.length} fehlgeschlagen: ${failedUploads.join(', ')}`,
        );
      } else if (newTempVideos.length > 0) {
        console.log(
          `✅ ${newTempVideos.length} Videos erfolgreich temporär gespeichert`,
        );
      }
    } catch (err: any) {
      console.error('❌ Общая ошибка uploadTempVideos:', err);
      console.error('❌ Детали общей ошибки:', err.response?.data);
      setError(
        'Fehler beim temporären Speichern der Videos: ' +
          (err.response?.data?.error || err.message),
      );
    } finally {
      setUploading(false);
    }
  };

  // Обработчики drag & drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Обработка выбора файлов
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  // Проверка и обработка файлов
  const processFiles = (files: File[]) => {
    const videoFiles = files.filter(
      file =>
        file.type.startsWith('video/') ||
        [
          'video/mp4',
          'video/avi',
          'video/mov',
          'video/wmv',
          'video/flv',
          'video/webm',
        ].includes(file.type),
    );

    if (videoFiles.length === 0) {
      setError(
        'Bitte wählen Sie nur Videodateien aus (mp4, avi, mov, wmv, flv, webm)',
      );
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    const oversizedFiles = videoFiles.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError('Einige Dateien überschreiten die maximale Größe von 100MB');
      return;
    }

    setError('');

    const filesWithTitles: VideoFile[] = videoFiles.map(file => {
      const videoFile = file as VideoFile;
      videoFile.title = file.name.replace(/\.[^/.]+$/, '');
      return videoFile;
    });

    setSelectedFiles(prev => [...prev, ...filesWithTitles]);
  };

  // Обновление названия нового видео
  const updateVideoTitle = (index: number, title: string) => {
    setSelectedFiles(prev =>
      prev.map((file, i) => {
        if (i === index && file) {
          const updatedFile = { ...file };
          updatedFile.title = title;
          return updatedFile;
        }
        return file;
      }),
    );
  };

  // Обновление названия существующего видео
  const updateExistingVideoTitle = async (videoId: string, title: string) => {
    try {
      await axiosInstance.put(`/videos/${videoId}`, { title });

      setExistingVideoList(prev =>
        prev.map(video =>
          video._id === videoId ? { ...video, title } : video,
        ),
      );

      if (onVideosChange) {
        const updatedVideos = existingVideoList.map(video =>
          video._id === videoId ? { ...video, title } : video,
        );
        onVideosChange(updatedVideos);
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Videotitels:', err);
      setError('Fehler beim Aktualisieren des Videotitels');
    }
  };

  // Удаление нового видео из списка
  const removeNewVideo = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Удаление существующего видео
  const removeExistingVideo = async (videoId: string) => {
    if (
      !window.confirm('Sind Sie sicher, dass Sie dieses Video löschen möchten?')
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/videos/${videoId}`);

      setExistingVideoList(prev => prev.filter(video => video._id !== videoId));

      if (onVideosChange) {
        const updatedVideos = existingVideoList.filter(
          video => video._id !== videoId,
        );
        onVideosChange(updatedVideos);
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Videos:', err);
      setError('Fehler beim Löschen des Videos');
    }
  };

  // Метод для удаления временного видео
  const removeTempVideo = (tempId: string) => {
    if (
      !window.confirm(
        'Sind Sie sicher, dass Sie dieses temporäre Video entfernen möchten?',
      )
    ) {
      return;
    }

    if (onTempVideosChange) {
      const updatedTempVideos = tempVideos.filter(
        video => video.tempId !== tempId,
      );
      onTempVideosChange(updatedTempVideos);

      // Отправляем запрос на удаление файла с сервера
      axiosInstance
        .post('/videos/cleanup-temp', { tempIds: [tempId] })
        .then(() => {
          console.log('Временный файл успешно удален с сервера');
        })
        .catch(err => {
          console.warn('Ошибка при удалении временного файла:', err);
          setError(
            'Warnung: Temporäre Datei konnte nicht vom Server gelöscht werden',
          );
          setTimeout(() => setError(''), 5000);
        });
    }
  };

  // Загрузка новых видео на сервер
  const uploadVideos = async () => {
    console.log('🚀 === НАЧАЛО uploadVideos ===');
    console.log('📁 selectedFiles.length:', selectedFiles.length);
    console.log('🔗 realEstateObjectId:', realEstateObjectId);
    console.log(
      '🔍 realEstateObjectId === "new-object":',
      realEstateObjectId === 'new-object',
    );
    console.log('📝 isEditMode:', isEditMode);

    if (selectedFiles.length === 0) {
      console.log('❌ Нет файлов для загрузки');
      return;
    }

    // Проверяем доступность сервера
    console.log('🔍 Проверяем доступность сервера...');
    const serverAvailable = await checkServerAvailability();
    if (!serverAvailable) {
      console.log('❌ Сервер недоступен');
      return;
    }
    console.log('✅ Сервер доступен');

    // КРИТИЧЕСКАЯ ПРОВЕРКА
    if (realEstateObjectId === 'new-object') {
      console.log('🎯 УСЛОВИЕ ВЫПОЛНЕНО: realEstateObjectId === "new-object"');
      console.log('🔄 Вызываем uploadTempVideos...');
      await uploadTempVideos();
      console.log('✅ uploadTempVideos завершен');
      return;
    } else {
      console.log(
        '🎯 УСЛОВИЕ НЕ ВЫПОЛНЕНО: realEstateObjectId НЕ РАВЕН "new-object"',
      );
      console.log('🔄 Продолжаем с обычной загрузкой...');
    }

    // Обычная загрузка для существующих объектов
    console.log('🔄 Существующий объект, используем обычную загрузку');
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (!file) {
          console.warn(`Файл с индексом ${i} не найден`);
          continue;
        }

        console.log(
          `📤 Загружаем файл ${i + 1}/${selectedFiles.length} через ОБЫЧНЫЙ роут /videos`,
        );

        const formData = new FormData();
        formData.append('video', file);
        formData.append('realEstateObjectId', realEstateObjectId);
        formData.append('title', file.title || file.name);

        await axiosInstance.post('/videos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
          onUploadProgress: progressEvent => {
            const total = progressEvent.total || 1;
            const current = progressEvent.loaded;
            const fileProgress = (current / total) * 100;
            const totalProgress =
              (i / selectedFiles.length) * 100 +
              fileProgress / selectedFiles.length;
            setUploadProgress(Math.round(totalProgress));
          },
        });
      }

      // Обновляем список существующих видео
      const response = await axiosInstance.get(
        `/videos/by-object?objectId=${realEstateObjectId}`,
      );
      const newVideos = response.data || [];
      setExistingVideoList(newVideos);

      if (onVideosChange) {
        onVideosChange(newVideos);
      }

      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (err: any) {
      console.error('Fehler beim Hochladen der Videos:', err);
      setError(
        'Fehler beim Hochladen der Videos: ' +
          (err.response?.data?.error || err.message),
      );
    } finally {
      setUploading(false);
    }
  };

  // Клик по зоне загрузки
  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.videoSection}>
      <h3 className={styles.sectionTitle}>Videos</h3>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Временные видео для новых объектов */}
      {realEstateObjectId === 'new-object' && tempVideos.length > 0 && (
        <>
          <h4 className={styles.imageSection}>
            Videos für Upload nach Erstellung
          </h4>
          <div className={styles.videoPreviews}>
            {tempVideos.map(video => (
              <div
                key={`temp-${video.tempId}`}
                className={`${styles.videoPreviewItem} ${styles.tempVideo}`}
              >
                <div className={styles.tempVideoLabel}>Wartend</div>
                <div className={styles.videoTitle}>
                  <input
                    type="text"
                    value={video.title}
                    onChange={e => {
                      if (onTempVideosChange) {
                        const updatedTempVideos = tempVideos.map(v =>
                          v.tempId === video.tempId
                            ? { ...v, title: e.target.value }
                            : v,
                        );
                        onTempVideosChange(updatedTempVideos);
                      }
                    }}
                    className={styles.videoTitleInput}
                    placeholder="Titel des Videos"
                  />
                </div>
                <div className={styles.videoFileName}>
                  📁 {video.originalName}
                </div>
                <div className={styles.videoFileName}>
                  📊 {(video.size / (1024 * 1024)).toFixed(1)} MB
                </div>
                <button
                  type="button"
                  className={styles.removeVideoBtn}
                  onClick={() => removeTempVideo(video.tempId)}
                  title="Video entfernen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Существующие видео */}
      {isEditMode && existingVideoList.length > 0 && (
        <>
          <h4 className={styles.imageSection}>Aktuelle Videos</h4>
          <div className={styles.videoPreviews}>
            {existingVideoList.map(video => (
              <div
                key={`existing-${video._id || Math.random()}`}
                className={`${styles.videoPreviewItem} ${styles.existingVideo}`}
              >
                <div className={styles.existingVideoLabel}>Vorhanden</div>
                <div className={styles.videoTitle}>
                  <input
                    type="text"
                    value={video.title || ''}
                    onChange={e => {
                      if (video._id) {
                        updateExistingVideoTitle(video._id, e.target.value);
                      }
                    }}
                    className={styles.videoTitleInput}
                    placeholder="Titel des Videos"
                  />
                </div>

                <div className={styles.videoControls}>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(getIframeUrl(video.url), '_blank')
                    }
                    className={styles.openVideoBtn}
                    title="Video im Browser testen"
                  >
                    🎥 Iframe öffnen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = getIframeUrl(video.url);
                      navigator.clipboard.writeText(url);
                      alert('Video URL wurde in die Zwischenablage kopiert');
                    }}
                    className={styles.openVideoBtn}
                    title="Video URL kopieren"
                  >
                    📋 URL kopieren
                  </button>
                </div>

                <div className={styles.videoPreview}>
                  {video.thumbnailUrl ? (
                    <img
                      src={getCorrectThumbnailUrl(video)}
                      alt={video.title || 'Video preview'}
                      className={styles.videoThumbnail}
                      onError={e => {
                        console.warn(
                          'Ошибка загрузки thumbnail:',
                          getCorrectThumbnailUrl(video),
                        );
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder =
                            parent.querySelector('.video-placeholder');
                          if (placeholder) {
                            (placeholder as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className={`${styles.videoPlaceholder} video-placeholder`}
                    style={{ display: video.thumbnailUrl ? 'none' : 'flex' }}
                  >
                    <span>🎥</span>
                    <p>{video.title || 'Video'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.removeVideoBtn}
                  onClick={() => video._id && removeExistingVideo(video._id)}
                  title="Video löschen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Зона загрузки */}
      <div
        ref={dropZoneRef}
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        <div className={styles.dropZoneContent}>
          <span className={styles.dropZoneIcon}>🎥</span>
          <p>
            {isEditMode
              ? 'Neue Videos hier ablegen oder Dateien auswählen'
              : 'Videos hier ablegen oder Dateien auswählen'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <p className={styles.dropZoneHint}>
            Unterstützte Formate: MP4, AVI, MOV, WMV, FLV, WebM (max 100MB pro
            Datei)
          </p>
        </div>
      </div>

      {/* Предпросмотр новых видео */}
      {selectedFiles.length > 0 && (
        <>
          <h4 className={styles.imageSection}>
            {isEditMode ? 'Neue Videos' : 'Ausgewählte Videos'}
          </h4>
          <div className={styles.videoPreviews}>
            {selectedFiles.map((file, index) => {
              if (!file) return null;

              return (
                <div
                  key={`new-${index}`}
                  className={`${styles.videoPreviewItem} ${styles.newVideo}`}
                >
                  <div className={styles.newVideoLabel}>Neu</div>
                  <div className={styles.videoTitle}>
                    <input
                      type="text"
                      value={file.title || ''}
                      onChange={e => updateVideoTitle(index, e.target.value)}
                      className={styles.videoTitleInput}
                      placeholder="Titel des Videos"
                    />
                  </div>
                  <div className={styles.videoFileName}>📁 {file.name}</div>
                  <div className={styles.videoFileName}>
                    📊 {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                  <button
                    type="button"
                    className={styles.removeVideoBtn}
                    onClick={() => removeNewVideo(index)}
                    title="Video entfernen"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Прогресс загрузки */}
      {uploading && uploadProgress > 0 && (
        <div className={styles.uploadProgress}>
          <div
            className={styles.progressBar}
            style={{ width: `${uploadProgress}%` }}
          />
          <span className={styles.progressPercentage}>
            {uploadProgress}% - Videos werden hochgeladen...
          </span>
        </div>
      )}

      {/* Кнопка загрузки */}
      {selectedFiles.length > 0 && !uploading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={uploadVideos}
            className={styles.uploadButton}
          >
            {selectedFiles.length} Video{selectedFiles.length > 1 ? 's' : ''}{' '}
            {realEstateObjectId === 'new-object'
              ? 'temporär speichern'
              : 'hochladen'}
          </button>

          {realEstateObjectId === 'new-object' && (
            <div className={styles.infoMessage} style={{ marginTop: '10px' }}>
              Videos werden nach dem Erstellen des Objekts automatisch
              hochgeladen.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoManager;
