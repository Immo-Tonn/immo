// immo/FE/src/pages/CreateMainObject/CreateObject/ObjectPreview.tsx
// Импорт и использование модального окна в ObjectPreview.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';
import styles from './ObjectPrewiew.module.css';
import { ObjectType } from '@features/utils/types';
import { formatObjectNumber } from '@shared/objectNumberUtils';
import ImageGalleryModal from '@widgets/ImageGalleryModal/ImageGalleryModal'; // ИСПРАВЛЕНО: правильный импорт

const ObjectPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [objectData, setObjectData] = useState<any>(null);
  const [specificData, setSpecificData] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // ИСПРАВЛЕНО: добавлен индекс

  const getSuccessMessage = () => {
    if (action === 'updated') {
      return 'Das Object wurde erfolgreich aktuakisiert! Überprüfen Sie die folgende Daten..';
    } else if (action === 'created') {
      return 'Das Object wurde erfolgreich erstellt! Überprüfen Sie die folgende Daten..';
    }
    return '';
  }

  // Функция для открытия модального окна с изображением
  const openImageModal = (index: number) => { 
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeImageModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(0);
  };

  // Функции навигации в модальном окне
  const handlePrev = () => {
    const allMedia = [...images, ...videos];
    setCurrentImageIndex(prev => 
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    const allMedia = [...images, ...videos];
    setCurrentImageIndex(prev => 
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Загрузка данных объекта
  useEffect(() => {
    const fetchObjectData = async () => {
      if (!id) {
        setError('ID объекта не найден в URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Загружаем данные для объекта с ID:', id);       
        
        // основные данные объекта
        const objectResponse = await axios.get(`/objects/${id}`);
        const mainObjectData = objectResponse.data;
        setObjectData(mainObjectData);
        console.log('Основные данные объекта загружены:', mainObjectData);

        // изображения объекта
        try {
          console.log('Загружаем изображения для объекта:', id);
          const imagesResponse = await axios.get(`/images/by-object?objectId=${id}`);
          if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
            setImages(imagesResponse.data); 
            console.log('Изображения загружены:', imagesResponse.data);
          } else {
            console.log('Изображения не найдены или неверный формат данных');
            setImages([]);
          }
        } catch (imageError: any) {
          console.warn('Ошибка при загрузке изображений:', imageError);
          setImages([]);
        }

        // видео объекта
        try {
          console.log('Загружаем видео для объекта:', id);
          const videosResponse = await axios.get(`/videos/by-object?objectId=${id}`);
          if (videosResponse.data && Array.isArray(videosResponse.data)) {
            // Преобразуем видео в формат, совместимый с галереей
            const processedVideos = videosResponse.data.map(video => ({
              ...video,
              url: `https://iframe.mediadelivery.net/embed/430278/${video.videoId}`, // iframe URL
              thumbnailUrl: video.thumbnailUrl || `https://vz-973fa28c-a7d.b-cdn.net/${video.videoId}/preview.webp`
            }));
            setVideos(processedVideos);
            console.log('Видео загружены на странице preview:', processedVideos);
          } else {
            console.log('Видео не найдены на странице preview');
            setVideos([]);
          }
        } catch (videoError: any) {
          console.warn('Ошибка при загрузке видео на preview:', videoError);
          setVideos([]);
        }

        // специфические данные
        try {
          console.log('Пытаемся загрузить специфические данные для типа:', mainObjectData.type);
          let specificEndpoint = '';
          let specificId = null;

          switch (mainObjectData.type) {
            case ObjectType.APARTMENT:
              if (mainObjectData.apartments) {
                if (typeof mainObjectData.apartments === 'object' && mainObjectData.apartments._id) {
                  specificId = mainObjectData.apartments._id;
                  setSpecificData(mainObjectData.apartments);
                  console.log('Specific data already populated:', mainObjectData.apartments);
                  return;
                } else if (typeof mainObjectData.apartments === 'string') {
                  specificId = mainObjectData.apartments;
                }
              }
              specificEndpoint = '/apartments';
              break;                          
            
            case ObjectType.HOUSE:
              if (mainObjectData.residentialHouses) {
                if (typeof mainObjectData.residentialHouses === 'object' && mainObjectData.residentialHouses._id) {
                  specificId = mainObjectData.residentialHouses._id;
                  setSpecificData(mainObjectData.residentialHouses);
                  console.log('Specific data already populated:', mainObjectData.residentialHouses);
                  return;
                } else if (typeof mainObjectData.residentialHouses === 'string') {
                  specificId = mainObjectData.residentialHouses;
                }
              }
              specificEndpoint = '/residentialHouses';
              break;                          
            
            case ObjectType.LAND:
              if (mainObjectData.landPlots) {
                if (typeof mainObjectData.landPlots === 'object' && mainObjectData.landPlots._id) {
                  specificId = mainObjectData.landPlots._id;
                  setSpecificData(mainObjectData.landPlots);
                  console.log('Specific data already populated:', mainObjectData.landPlots);
                  return;
                } else if (typeof mainObjectData.landPlots === 'string') {
                  specificId = mainObjectData.landPlots;
                }
              }
              specificEndpoint = '/landPlots';
              break;              
            
            case ObjectType.COMMERCIAL:
              if (mainObjectData.commercial_NonResidentialBuildings) {
                if (typeof mainObjectData.commercial_NonResidentialBuildings === 'object' && mainObjectData.commercial_NonResidentialBuildings._id) {
                  specificId = mainObjectData.commercial_NonResidentialBuildings._id;
                  setSpecificData(mainObjectData.commercial_NonResidentialBuildings);
                  console.log('Specific data already populated:', mainObjectData.commercial_NonResidentialBuildings);
                  return;
                } else if (typeof mainObjectData.commercial_NonResidentialBuildings === 'string') {
                  specificId = mainObjectData.commercial_NonResidentialBuildings;
                }
              }
              specificEndpoint = '/commercial_NonResidentialBuildings';
              break;              
            
            default:
              console.warn('Unknown object type:', mainObjectData.type);
          }

          console.log('Specific ID:', specificId, 'Endpoint:', specificEndpoint);
          if (specificId && specificEndpoint) {
            console.log(`Loading specific data: ${specificEndpoint}/${specificId}`);
            const specificResponse = await axios.get(`${specificEndpoint}/${specificId}`);
            setSpecificData(specificResponse.data);
            console.log('Specific data loaded:', specificResponse.data);
          } else {
            console.warn('Specific ID not found for object type:', mainObjectData.type);
            console.warn('Object mainObjectData:', mainObjectData);
          }
        } catch (specificError: any) {
          console.error('Specific data error details:', specificError);
          console.error('Specific data error details:', specificError.response?.data);
          console.error('Request URL:', specificError.config?.url);
        }
      } catch (err: any) {
        console.error('Error loading core object data:', err);
        console.error('Error details:', err.response?.data);
        setError(err.response?.data?.message || 'Error loading object data');
      } finally {
        setLoading(false);
      }
    };

    fetchObjectData();
  }, [id]);

  // Обработчик подтверждения - создание карточки на странице Immobilien
  const handleConfirm = () => {
    // Сохраняем флаг о том, что объект подтвержден (для отображения на странице Immobilien)
    if (objectData && objectData._id) {
      const confirmedObjects = JSON.parse(sessionStorage.getItem('confirmedObjects') || '[]');
      if (!confirmedObjects.includes(objectData._id)) {
        confirmedObjects.push(objectData._id);
        sessionStorage.setItem('confirmedObjects', JSON.stringify(confirmedObjects));
      }
    }
    navigate('/immobilien');
  };

  // Обработчик редактирования
  const handleEdit = () => {
    navigate(`/edit-object/${id}`);
  };

  // Отображение специфических данных в зависимости от типа объекта
  const renderSpecificData = () => {
    if (!specificData) {
      return (
        <div className={styles.specificDataSection}>
          <h3>Spezifische Daten</h3>
          <p>Spezifische Daten für diesen Objekttyp wurden nicht gefunden oder geladen.</p>
        </div>
      );
    }

    switch (objectData?.type) {
      case ObjectType.APARTMENT:
        return (
          <div className={styles.specificDataSection}>
            <h3>Wohnungsdetails</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Wohnungstyp:</span>
                <span className={styles.dataValue}>{specificData.type || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Stockwerk:</span>
                <span className={styles.dataValue}>{specificData.floor || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Anzahl der Stockwerke des Gebäudes:</span>
                <span className={styles.dataValue}>{specificData.totalFloors || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Wohnfläche:</span>
                <span className={styles.dataValue}>{specificData.livingArea} м²</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Anzahl der Zimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfRooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Schlafzimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfBedrooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Badezimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfBathrooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Baujahr:</span>
                <span className={styles.dataValue}>{specificData.yearBuilt || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Jahr der Renovierung:</span>
                <span className={styles.dataValue}>{specificData.yearRenovated || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Heizungsart:</span>
                <span className={styles.dataValue}>{specificData.heatingType || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Energiequelle:</span>
                <span className={styles.dataValue}>{specificData.energySource || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Energieeffizienzklasse:</span>
                <span className={styles.dataValue}>{specificData.energyEfficiencyClass || '-'}</span>
              </div>
            </div>
            {specificData.additionalFeatures && (
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Zusätsliche Merkmale:</span>
                <p className={styles.dataValue}>{specificData.additionalFeatures}</p>
              </div>
            )}
          </div>
        );
      
      case ObjectType.HOUSE:
        return (
          <div className={styles.specificDataSection}>
            <h3>Wohngebäudedetails</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Haustyp:</span>
                <span className={styles.dataValue}>{specificData.type || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Anzahl der Stockwerke:</span>
                <span className={styles.dataValue}>{specificData.numberOfFloors || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Wohnfläche:</span>
                <span className={styles.dataValue}>{specificData.livingArea} м²</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Nutzfläche:</span>
                <span className={styles.dataValue}>{specificData.usableArea ? `${specificData.usableArea} м²` : '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Grundstücksfläche:</span>
                <span className={styles.dataValue}>{specificData.plotArea ? `${specificData.plotArea} м²` : '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Anzahl der Zimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfRooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Schlafzimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfBedrooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Badezimmer:</span>
                <span className={styles.dataValue}>{specificData.numberOfBathrooms || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Parkplätze:</span>
                <span className={styles.dataValue}>{specificData.garageParkingSpaces || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Baujahr:</span>
                <span className={styles.dataValue}>{specificData.yearBuilt || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Heizungsart:</span>
                <span className={styles.dataValue}>{specificData.heatingType || '-'}</span>
              </div>             
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Energiequelle:</span>
                <span className={styles.dataValue}>{specificData.energySource || '-'}</span>
              </div>             
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Energieeffizienzklasse:</span>
                <span className={styles.dataValue}>{specificData.energyEfficiencyClass || '-'}</span>
              </div>
            </div>
            {specificData.additionalFeatures && (
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Zusätsliche Merkmale:</span>
                <p className={styles.dataValue}>{specificData.additionalFeatures}</p>
              </div>
            )}
          </div>
        );
      
      case ObjectType.LAND:
        return (
          <div className={styles.specificDataSection}>
            <h3>Grundstücksdetails</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Grundstücksfläche:</span>
                <span className={styles.dataValue}>{specificData.plotArea} м²</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Technische Kommunikation:</span>
                <span className={styles.dataValue}>{specificData.infrastructureConnection || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Bauvorschriften:</span>
                <span className={styles.dataValue}>{specificData.buildingRegulations || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Empfohlener Gebrauch:</span>
                <span className={styles.dataValue}>{specificData.recommendedUsage || '-'}</span>
              </div>
            </div>
          </div>
        );
      
      case ObjectType.COMMERCIAL:
        return (
          <div className={styles.specificDataSection}>
            <h3>Daten zur gewerblichen oder nicht wohnlichen Immobilie</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Gebäudetyp:</span>
                <span className={styles.dataValue}>{specificData.buildingType || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Fläche:</span>
                <span className={styles.dataValue}>{specificData.area ? `${specificData.area} м²` : '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Baujahr:</span>
                <span className={styles.dataValue}>{specificData.yearBuilt || '-'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Zweck:</span>
                <span className={styles.dataValue}>{specificData.purpose || '-'}</span>
              </div>
            </div>
            {specificData.additionalFeatures && (
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Zusätsliche Merkmale:</span>
                <p className={styles.dataValue}>{specificData.additionalFeatures}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Objektdaten werden geladen...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!objectData) {
    return <div className={styles.error}>Objekt nicht gefunden</div>;
  }

  // Получаем номер объекта
  const objectNumber = formatObjectNumber(objectData._id);

  // Объединяем изображения и видео для галереи
  const allMedia = [...images, ...videos];

  return (
    <div className={styles.previewContainer}>
      <h2 className={styles.title}>Vorschau des Objekts</h2> 

   {action && (
      <div className={styles.successMessage}>
       {getSuccessMessage()}
      </div>
   )}   

      {/* Номер объекта */}
      <div className={styles.objectNumberSection}>
        <div className={styles.objectNumber}>
          <span className={styles.objectNumberLabel}>Objektnummer::</span>
          <span className={styles.objectNumberValue}>{objectNumber}</span>
        </div>
      </div>

      <div className={styles.imagesSection}>
        <h3>Bilder</h3>
        <div className={styles.imagesGrid}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={image._id || `image-${index}`} 
                className={styles.imageContainer}
                onClick={() => openImageModal(index)}
              >
                <img 
                  src={image.url} 
                  alt={`image ${index + 1}`} 
                  className={styles.objectImage} 
                />
                {index === 0 && <span className={styles.mainImageLabel}>Главное</span>}
              </div>
            ))
          ) : (
            <p>Keine Bilder hochgeladen</p>
          )}
        </div>
      </div>

      <div className={styles.videosSection}>
        <h3>Videos</h3>
        {videos.length > 0 ? (
          <div className={styles.videosGrid}>
            {videos.map((video, index) => (
              <div key={`video-${video._id || index}`} className={styles.videoContainer}>
                <h4>{video.title || `Video ${index + 1}`}</h4>
                <div 
                  className={styles.videoThumbnailContainer}
                  onClick={() => openImageModal(images.length + index)} // ИСПРАВЛЕНО: правильный индекс
                >
                  <img 
                    src={video.thumbnailUrl}
                    alt={video.title || 'Video preview'}
                    className={styles.videoThumbnail}
                  />
                  <div className={styles.playIcon}>▶</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Keine Videos vorhanden</p>
        )}
      </div>

      <div className={styles.basicDataSection}>
        <h3>Grundlegende Informationen</h3>
        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Objektname:</span>
            <span className={styles.dataValue}>{objectData.title}</span>
          </div>
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Objekttyp:</span>
            <span className={styles.dataValue}>{objectData.type}</span>
          </div>
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Preis:</span>
            <span className={styles.dataValue}>{objectData.price.toLocaleString()} €</span>
          </div>
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Lage:</span>
            <span className={styles.dataValue}>{objectData.location}</span>
          </div>
        </div>
        
        <div className={styles.dataItem}>
          <span className={styles.dataLabel}>Adresse:</span>
          <span className={styles.dataValue}>
            {`${objectData.address.street} ${objectData.address.houseNumber || ''}, ${objectData.address.zip} ${objectData.address.city}, ${objectData.address.country}`}
          </span>
        </div>        
        
        <div className={styles.dataItem}>
          <span className={styles.dataLabel}>Beschreibung:</span>
          <p className={styles.dataValue}>{objectData.description}</p>
        </div>        
        
        {objectData.features && (
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Besonderheiten des Objektes:</span>
            <p className={styles.dataValue}>{objectData.features}</p>
          </div>
        )}        
        
        {objectData.miscellaneous && (
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Zusätzliche Information:</span>
            <p className={styles.dataValue}>{objectData.miscellaneous}</p>
          </div>
        )}
      </div>

      {/* Специфические данные объекта */}
      {renderSpecificData()}

      <div className={styles.actionButtons}>
        <button className={styles.editButton} onClick={handleEdit}>
          Bearbeiten
        </button>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          OK
        </button>
      </div>

      {isModalOpen && allMedia.length > 0 && (
        <ImageGalleryModal
          images={allMedia}
          currentIndex={currentImageIndex}
          onClose={closeImageModal}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

export default ObjectPreview;

