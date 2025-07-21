// immo/FE/src/shared/ui/VideoManager/VideoManager.tsx
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

interface VideoManagerProps {
  realEstateObjectId: string;
  existingVideos?: Video[];
  onVideosChange?: (videos: Video[]) => void;
  isEditMode?: boolean;
}

const VideoManager: React.FC<VideoManagerProps> = ({
  realEstateObjectId,
  existingVideos = [],
  onVideosChange,
  isEditMode = false,
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

  // update existing videos when props change
  React.useEffect(() => {
    setExistingVideoList(existingVideos);
    
    // Adding logging for diagnostics
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

  // Function to get the correct thumbnail URL
  const getCorrectThumbnailUrl = (video: Video): string => {
    // fixing incorrect thumbnail URL if it exists
    if (video.thumbnailUrl) {
      // Extract videoId from any URL
      const videoId = extractVideoId(video.url) || extractVideoId(video.thumbnailUrl);
      if (videoId) {
        // Forming the correct thumbnail URL
        return `https://vz-973fa28c-a7d.b-cdn.net/${videoId}/preview.webp?v=${Math.floor(Date.now() / 1000)}`;
      }
    }
    return video.thumbnailUrl || '';
  };

  // Function to extract videoId from URL
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
      // Если URL уже прямая ссылка на MP4, возвращаем как есть
      if (originalUrl.includes('.mp4') || originalUrl.includes('play_')) {
        return originalUrl;
      }

      // Processing URL format: https://iframe.mediadelivery.net/play/430278/{videoId}
      const playRegex = /iframe\.mediadelivery\.net\/play\/\d+\/([a-f0-9\-]+)/;
      const embedRegex =
        /iframe\.mediadelivery\.net\/embed\/\d+\/([a-f0-9\-]+)/;

      const playMatch = originalUrl.match(playRegex);
      const embedMatch = originalUrl.match(embedRegex);
      const videoId = playMatch?.[1] || embedMatch?.[1];

      if (videoId) {
        // Use THUMBNAIL_PROJECT_ID to form a direct link
        return `https://vz-973fa28c-a7d.b-cdn.net/${videoId}/play_480p.mp4`;
      }

      console.warn('Не удалось извлечь videoId из URL:', originalUrl);
      return originalUrl;
    } catch (error) {
      console.error('Ошибка при получении прямой ссылки:', error);
      return originalUrl;
    }
  };

  // get iframe URL for embedding
  const getIframeUrl = (originalUrl: string): string => {
    try {
      // If the URL is already iframe embed, return as is
      if (originalUrl.includes('iframe.mediadelivery.net/embed/')) {
        return originalUrl;
      }

      // Convert play URL to embed URL
      // From: https://iframe.mediadelivery.net/play/430278/{videoId}
      // In: https://iframe.mediadelivery.net/embed/430278/{videoId}
      const playRegex = /iframe\.mediadelivery\.net\/play\/(\d+)\/([a-f0-9\-]+)/;
      const match = originalUrl.match(playRegex);

      if (match) {
        const [, libraryId, videoId] = match;
        return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
      }
      
      // If it`s a direct BunnyCDN link, try to get the iframe URL
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

  // Drag & drop handlers
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

  // Processing file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  // Checking and processing files
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
    
    // Add files with basic names and correct typing
    const filesWithTitles: VideoFile[] = videoFiles.map(file => {
      const videoFile = file as VideoFile;
      videoFile.title = file.name.replace(/\.[^/.]+$/, ''); // убираем расширение
      return videoFile;
    });

    setSelectedFiles(prev => [...prev, ...filesWithTitles]);
  };

  // New video title update
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

  // Update title of existing video
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

  const removeNewVideo = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

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

  // Uploading new videos to the server
  const uploadVideos = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Check that the file exists
        if (!file) {
          console.warn(`Файл с индексом ${i} не найден`);
          continue;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('realEstateObjectId', realEstateObjectId);
        formData.append('title', file.title || file.name);

        await axiosInstance.post('/videos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000, // Увеличиваем timeout для видео файлов
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

      // Updating the list of existing videos
      const response = await axiosInstance.get(`/videos/by-object?objectId=${realEstateObjectId}`);
      const newVideos = response.data || [];
      setExistingVideoList(newVideos);

      if (onVideosChange) {
        onVideosChange(newVideos);
      }

      // Cleaning up new files
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

  // Click on the download area
  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.videoSection}>
      <h3 className={styles.sectionTitle}>Videos</h3>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Existing videos */}
      {isEditMode && existingVideoList.length > 0 && (
        <>
          <h4 className={styles.imageSection}>Aktuelle Videos</h4>
          <div className={styles.videoPreviews}>
            {existingVideoList.map((video, index) => (
              <div
                key={`existing-${video._id || index}`}
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
                
                {/* Add buttons to control the video */}
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
                
                {/* Show thumbnail with correct URL */}
                <div className={styles.videoPreview}>
                  {video.thumbnailUrl ? (
                    <img
                      src={getCorrectThumbnailUrl(video)}
                      alt={video.title || 'Video preview'}
                      className={styles.videoThumbnail}
                      onError={(e) => {
                        console.warn('Ошибка загрузки thumbnail:', getCorrectThumbnailUrl(video));
                        // If the thumbnail is not loaded, hide the image and show the placeholder
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

                  {/* PlaySholder for cases when no Thumbnail or not boot */}
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

      {/* Loading Zone */}
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

      {/* Preview new videos */}
      {selectedFiles.length > 0 && (
        <>
          <h4 className={styles.imageSection}>
            {isEditMode ? 'Neue Videos' : 'Ausgewählte Videos'}
          </h4>
          <div className={styles.videoPreviews}>
            {selectedFiles.map((file, index) => {
              // check that the file exists
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

      {/* Loading progress */}
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

      {/* Download button */}
      {selectedFiles.length > 0 && !uploading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={uploadVideos}
            className={styles.uploadButton}
          >
            {selectedFiles.length} Video{selectedFiles.length > 1 ? 's' : ''}{' '}
            hochladen
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
