// immo\FE\src\pages\AdminObject\CreateObject\CreateObject.tsx
import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  DragEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';
import { ObjectType, ObjectStatus} from '@features/utils/types';
import {
  createCompleteRealEstateObject,
  updateCompleteRealEstateObject,
  fetchObjectForEdit,
   updateImageOrder
} from '@features/utils/realEstateService';
import VideoManager from '@shared/ui/VideoManager/VideoManager';
import styles from './CreateObject.module.css';
// import Button from '@shared/ui/Button/Button';

// Determine the type for objectData
interface ObjectData {
  type: ObjectType;
  // status: ObjectStatus;
  title: string;
  description: string;
  location: string;
  features?: string;
  miscellaneous?: string;
  address: {
    country: string;
    city: string;
    zip: string;
    district: string;
    street: string;
    houseNumber?: string;
  };
  price: string;
  status: ObjectStatus; // Поле для выбора status
}

const CreateObject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // ID for editing
  const isEditMode = !!id; // create or edit
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // For existing images
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditMode); // Loading data for editing
  const [isDragging, setIsDragging] = useState<boolean>(false); // State for drag & drop
  const dropZoneRef = useRef<HTMLDivElement>(null); // ref for drag & drop
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status for the main property
  const [objectData, setObjectData] = useState<ObjectData>({
    type: ObjectType.APARTMENT,
    title: '',
    description: '',
    location: '',
    features: '',
    miscellaneous: '',
    address: {
      country: 'Deutschland',
      city: '',
      zip: '',
      district: '',
      street: '',
      houseNumber: '',
    },
    price: '',
    status: ObjectStatus.ACTIVE, // Добавляем значение по умолчанию
  });

  // Status for specific data depending on the type
  const [specificData, setSpecificData] = useState<Record<string, any>>({});

  // Validation function for mandatory fields
  const validateRequiredFields = (): boolean => {
    // Check basic mandatory fields
    if (
      !objectData.title ||
      !objectData.description ||
      !objectData.location ||
      !objectData.address.city ||
      !objectData.address.zip ||
      !objectData.address.district ||
      !objectData.address.street ||
      !objectData.price
    ) {
      return false;
    }

    // Checking specific mandatory fields depending on the type
    switch (objectData.type) {
      case ObjectType.APARTMENT:
        return !!specificData.livingArea;
      case ObjectType.HOUSE:
        return !!(
          specificData.type &&
          specificData.livingArea &&
          specificData.numberOfRooms
        );
      case ObjectType.LAND:
        return !!specificData.plotArea;
      case ObjectType.COMMERCIAL:
        return !!specificData.buildingType;
      default:
        return false;
    }
  };

  // State for tracking form validity
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

const handleDropZoneClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

  // Validate the form when changing data
  useEffect(() => {
    setIsFormValid(validateRequiredFields());
  }, [objectData, specificData]);

  // Loading data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const loadObjectData = async () => {
        try {
          setInitialLoading(true);
          console.log('Loading data to edit the object:', id);
          const {
            objectData: loadedObjectData,
            specificData: loadedSpecificData,
            images,
            videos,
          } = await fetchObjectForEdit(id);
          console.log('Loaded basic data:', loadedObjectData);
          console.log('Loaded specific data:', loadedSpecificData);
          console.log('Loaded images:', images);
          console.log('Loaded videos:', videos);

          // Filling in the main data
          setObjectData({
            type: loadedObjectData.type,
            // status: loadedObjectData.status || ObjectStatus.ACTIVE,
            title: loadedObjectData.title,
            description: loadedObjectData.description,
            location: loadedObjectData.location,
            features: loadedObjectData.features || '',
            miscellaneous: loadedObjectData.miscellaneous || '',
            address: {
              country: loadedObjectData.address.country,
              city: loadedObjectData.address.city,
              zip: loadedObjectData.address.zip.toString(),
              district: loadedObjectData.address.district,
              street: loadedObjectData.address.street,
              houseNumber: loadedObjectData.address.houseNumber || '',
            },
            price: loadedObjectData.price.toString(),
            status: loadedObjectData.status || ObjectStatus.ACTIVE, // Add the status load
          });

          // Filling in specific data
          if (loadedSpecificData) {
            const { _id, realEstateObject, __v, ...cleanSpecificData } =
              loadedSpecificData;
            setSpecificData(cleanSpecificData);
          }

          // Installing existing images
          setExistingImages(images || []);
          // Installing existing video
          setExistingVideos(videos || []);
        } catch (err: any) {
          setError('Fehler beim Laden der Objektdaten zur Bearbeitung');
          console.error('Fehler beim Laden der Daten zur Bearbeitung:', err);
        } finally {
          setInitialLoading(false);
        }
      };
      loadObjectData();
    }
  }, [isEditMode, id]);

  // Clearing previews when unmounting a component
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  //Handler for changing the main object fields
  const handleObjectChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      const parentKey = parts[0];
      const childKey = parts[1] as string;
      if (parentKey === 'address') {
        setObjectData({
          ...objectData,
          address: {
            ...objectData.address,
            [childKey]: value,
          },
        });
      }
    } else if (name === 'type') {
      setObjectData({
        ...objectData,
        type: value as ObjectType,
      });
      // When changing the type in edit mode, save specific data
      if (!isEditMode) {
        setSpecificData({});
      }
      } else if (name === 'status') {
        setObjectData({
          ...objectData,
          status: value as ObjectStatus,
      });
    } else {
      setObjectData({
        ...objectData,
        [name]: value,
      } as ObjectData);
    }
  };

  // Handler for changing specific fields
  const handleSpecificChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSpecificData({
      ...specificData,
      [name]: value,
    });
  };

  // Image file selection handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  // Handlers for drag-and-drop events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
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
    const dt = e.dataTransfer;
    if (dt.files && dt.files.length > 0) {
      const files = Array.from(dt.files);
      processFiles(files);
    }
  };

  // General function for file handling
  const processFiles = (files: File[]) => {
    const imageFiles = files.filter(
      file =>
        file.type.startsWith('image/') ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp' ||
        file.type === 'image/jpg',
    );
    if (imageFiles.length === 0) {
      setError('Bitte wählen Sie nur Bilddateien aus (jpeg, jpg, png, webp)');
      return;
    }

    if (error && error.includes('nur Bilddateien')) {
      setError('');
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...imageFiles]);
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  //Delete selected image
  const removeImage = (index: number) => {
    const confirmDelete = window.confirm(
      'Sind Sie sicher, dass Sie dieses Bild löschen möchten?',
    );
    if (!confirmDelete) return;

    const previewUrl = previews[index];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // Deleting an existing image
  const removeExistingImage = (index: number) => {
    const confirmDelete = window.confirm(
      'Sind Sie sicher, dass Sie dieses Bild löschen möchten?',
    );
    if (!confirmDelete) return;

    setExistingImages(existingImages.filter((_, i) => i !== index));
  };
    const debugObjectState = async (objectId: string) => {
    try {
      console.log('🔍 Вызываем серверную отладку для объекта:', objectId);
      const response = await axios.get(`/objects/debug/${objectId}`);
      console.log('📊 Результат серверной отладки:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка при вызове серверной отладки:', error);
      return null;
    }
  };

    // Тестовая функция для проверки серверной отладки
  const testDebugEndpoint = async () => {
    if (!id) {
      console.log('❌ ID объекта не найден');
      return;
    }
    
    console.log('🧪 Тестируем серверную отладку...');
    try {
      const response = await axios.get(`/objects/debug/${id}`);
      console.log('✅ Серверная отладка работает:', response.data);
    } catch (error) {
      console.error('❌ Ошибка серверной отладки:', error);
      console.error('❌ Response:', (error as any)?.response?.data);
      console.error('❌ Status:', (error as any)?.response?.status);
    }
  };

  // 4. useEffect ПОСЛЕ СУЩЕСТВУЮЩИХ useEffect:

  // Autotest of server debugging when loading page
  useEffect(() => {
    if (isEditMode && id) {
      console.log('🧪 Автотест серверной отладки при загрузке страницы...');
      testDebugEndpoint();
    }
  }, [isEditMode, id]);

    //Function for setting the main image among existing ones
const setMainExistingImage = async (index: number): Promise<void> => {
  console.log('🔄 НАЧАЛО setMainExistingImage, index:', index);
  console.log('📋 Текущий порядок изображений:', existingImages);
  
  const newImages = [...existingImages];
  const mainImage = newImages.splice(index, 1)[0];
  
  if (!mainImage) {
    console.error('❌ Главное изображение не найдено по индексу:', index);
    return;
  }
  
  newImages.unshift(mainImage);
  console.log('📋 Новый порядок изображений (локально):', newImages);
  
  if (isEditMode && id) {
    try {
      console.log('🔄 Режим редактирования, ID объекта:', id);
      
      // ОТЛАДКА ДО изменений
      console.log('\n🔍 === СОСТОЯНИЕ ДО ИЗМЕНЕНИЙ ===');
      await debugObjectState(id);
      console.log('✅ Отладка ДО изменений завершена');
      
      console.log('🔄 Вызываем updateImageOrder...');
      await updateImageOrder(id, newImages);
      console.log('✅ updateImageOrder завершена');
      
      // КРИТИЧНО: Добавляем отладку здесь
      console.log('🔍 ТОЧКА ПРОВЕРКИ 1: updateImageOrder выполнена, переходим к отладке ПОСЛЕ');
      
      // ОТЛАДКА ПОСЛЕ изменений
      console.log('\n🔍 === СОСТОЯНИЕ ПОСЛЕ ИЗМЕНЕНИЙ ===');
      console.log('🔍 ТОЧКА ПРОВЕРКИ 2: Начинаем отладку ПОСЛЕ изменений');
      
      const debugResult = await debugObjectState(id);
      console.log('🔍 ТОЧКА ПРОВЕРКИ 3: debugObjectState завершен, результат:', debugResult);
      
      // Проверяем результат
      if (debugResult?.orderMatch) {
        console.log('✅ ТОЧКА ПРОВЕРКИ 4: orderMatch = true');
        console.log('✅ Порядок изображений в БД обновлен корректно!');
        setExistingImages(newImages);
        setSuccess('Главное изображение обновлено');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.log('❌ ТОЧКА ПРОВЕРКИ 4: orderMatch = false или debugResult пустой');
        console.log('❌ debugResult:', debugResult);
        console.error('❌ Порядок изображений в БД НЕ соответствует ожидаемому!');
        setError('Ошибка: порядок изображений не обновился в БД');
        return;
      }
      
      console.log('🔍 ТОЧКА ПРОВЕРКИ 5: Функция завершается успешно');
      
    } catch (error: unknown) {
      console.error('❌ ОШИБКА в setMainExistingImage:', error);
      console.error('❌ Стек ошибки:', error instanceof Error ? error.stack : 'No stack');
      
      // ОТЛАДКА ПРИ ОШИБКЕ
      console.log('\n🔍 === СОСТОЯНИЕ ПРИ ОШИБКЕ ===');
      try {
        await debugObjectState(id);
      } catch (debugError) {
        console.error('❌ Ошибка даже в отладке при ошибке:', debugError);
      }
      
      // Обработка ошибки
      let errorMessage = 'Неизвестная ошибка';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(`Ошибка при обновлении порядка изображений: ${errorMessage}`);
      return;
    }
  } else {
    console.log('📝 Режим создания - обновляем только локальное состояние');
    setExistingImages(newImages);
  }
  
  console.log('✅ ЗАВЕРШЕНИЕ setMainExistingImage');
};

    // Function for setting the main image among new ones
  const setMainNewImage = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];

    const mainFile = newFiles.splice(index, 1)[0];
    const mainPreview = newPreviews.splice(index, 1)[0];

    //Check that the elements were found
    if (mainFile && mainPreview) {
      newFiles.unshift(mainFile);
      newPreviews.unshift(mainPreview);

      setSelectedFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  // Submitting a form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Checking form validity
    if (!isFormValid) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      setLoading(false);
      return;
    }

    try {
      // Preparing the main object data
      const realEstateObjectData = {
        ...objectData,
        price: parseFloat(objectData.price),
        address: {
          ...objectData.address,
          zip: parseInt(objectData.address.zip),
        },
      };

      // Converting numeric fields from strings to numbers for specific data
      const processedSpecificData = { ...specificData };
      Object.keys(processedSpecificData).forEach(key => {
        if (
          key !== 'realEstateObject' &&
          key !== 'type' &&
          key !== 'additionalFeatures' &&
          key !== 'purpose' &&
          key !== 'heatingType' &&
          key !== 'energySource' &&
          key !== 'energyEfficiencyClass' &&
          key !== 'garageParkingSpaces' &&
          key !== 'infrastructureConnection' &&
          key !== 'buildingRegulations' &&
          key !== 'recommendedUsage' &&
          key !== 'buildingType' &&
          processedSpecificData[key] !== '' &&
          !isNaN(Number(processedSpecificData[key]))
        ) {
          processedSpecificData[key] = Number(processedSpecificData[key]);
        }
      });

      let objectId: string;
      if (isEditMode && id) {
        // Updating an existing object
        console.log('Aktualisieren des Objekts mit ID:', id);
        await updateCompleteRealEstateObject(
          id,
          realEstateObjectData,
          processedSpecificData,
          selectedFiles,
          existingImages,
          progress => setUploadProgress(progress),
        );
        objectId = id;
      } else {
        // Creating a new object
        console.log('Create a new object');
        objectId = await createCompleteRealEstateObject(
          realEstateObjectData,
          processedSpecificData,
          selectedFiles,
          progress => setUploadProgress(progress),
        );
      }

      console.log('Operation completed successfully, objectId:', objectId);
      setSuccess(isEditMode ? 'Objekt erfolgreich aktualisiert!' : 'Objekt erfolgreich erstellt!');
      // setSuccess(true);
      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
)}
      // Going to the preview page
    setTimeout(() => {
      navigate(`/preview-object/${objectId}?action=${isEditMode ? 'updated' : 'created'}`);
    }, 1000);
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
        `An error occurred while ${isEditMode ? 'updating' : 'creating'} object`,
    );
    console.error(
      `Error while ${isEditMode ? 'updating' : 'creating'} object:`,
      err,
    );
  } finally {
    setLoading(false);
  }
};
// ЗАМЕНИТЬ СУЩЕСТВУЮЩИЙ useEffect НА ЭТОТ:
useEffect(() => {
  if (isEditMode && id) {
    // Функция для ручной отладки через консоль браузера
    (window as any).debugCurrentObject = async () => {
      if (!id) {
        console.log('❌ ID объекта не найден');
        return;
      }
      
      console.log('🔧 === РУЧНАЯ ОТЛАДКА ТЕКУЩЕГО ОБЪЕКТА ===');
      console.log('📋 ID объекта:', id);
      console.log('📋 Текущее состояние existingImages:', existingImages);
      
      try {
        // 1. Серверная отладка
        console.log('\n🔍 1. СЕРВЕРНАЯ ОТЛАДКА:');
        const debugResult = await debugObjectState(id);
        console.log('📊 Результат серверной отладки:', debugResult);
        
        // 2. Состояние клиента
        console.log('\n📱 2. СОСТОЯНИЕ КЛИЕНТА:');
        console.log('📋 existingImages (клиент):', existingImages);
        console.log('📋 selectedFiles (новые файлы):', selectedFiles.length);
        console.log('📋 previews (превью новых):', previews.length);
        
        // 3. Сравнение клиент-сервер
        console.log('\n⚖️ 3. СРАВНЕНИЕ КЛИЕНТ-СЕРВЕР:');
        const serverImageCount = debugResult?.actualImagesCount || 0;
        const clientImageCount = existingImages.length;
        console.log(`📊 Изображений на сервере: ${serverImageCount}`);
        console.log(`📊 Изображений у клиента: ${clientImageCount}`);
        console.log(`📊 Совпадает: ${serverImageCount === clientImageCount ? '✅' : '❌'}`);
        
        if (serverImageCount !== clientImageCount) {
          console.log('⚠️ НЕСООТВЕТСТВИЕ! Возможные причины:');
          console.log('   - Изображения удалены локально, но не на сервере');
          console.log('   - Состояние не синхронизировано');
          console.log('   - Ошибка в логике обновления');
        }
        
        // 4. Рекомендации
        console.log('\n💡 4. РЕКОМЕНДАЦИИ:');
        if (clientImageCount === 0 && serverImageCount > 0) {
          console.log('🔧 Все изображения удалены локально - при сохранении объекта они должны быть удалены и с сервера');
        } else if (clientImageCount > 0 && serverImageCount === 0) {
          console.log('🔧 У клиента есть изображения, но сервер их не видит - возможна ошибка загрузки');
        } else if (clientImageCount === serverImageCount && serverImageCount > 0) {
          console.log('✅ Количество изображений совпадает');
        }
        
        console.log('\n🎯 Для тестирования удаления последнего изображения:');
        console.log('   1. Убедитесь, что остался только 1 файл');
        console.log('   2. Удалите его через интерфейс (кнопка ✕)');
        console.log('   3. Нажмите "Objekt aktualisieren"');
        console.log('   4. Проверьте, что на Preview изображения не отображаются');
        
      } catch (error) {
        console.error('❌ Ошибка при ручной отладке:', error);
      }
    };
    
    console.log('🔧 Для ручной отладки выполните в консоли: debugCurrentObject()');
    
    // Очищаем глобальную функцию при размонтировании компонента
    return () => {
      delete (window as any).debugCurrentObject;
    };
  }
}, [isEditMode, id, existingImages, selectedFiles, previews]);
  // Rendering form fields depending on the object type
  const renderSpecificFields = () => {
    switch (objectData.type) {
      case ObjectType.APARTMENT:
        return (
          <>
            <h3 className={styles.sectionTitle}>Wohnungsdetails</h3>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.formLabel}>
                Wohnungstyp
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={specificData.type || ''}
                onChange={handleSpecificChange}
                placeholder="Zum Beispiel Studio, 2-Zimmer"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="floor" className={styles.formLabel}>
                  Stockwerk
                </label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={specificData.floor || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="totalFloors" className={styles.formLabel}>
                  Anzahl der Stockwerke des Gebäudes
                </label>
                <input
                  type="number"
                  id="totalFloors"
                  name="totalFloors"
                  value={specificData.totalFloors || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="livingArea" className={styles.formLabel}>
                Wohnfläche (m²) *
              </label>
              <input
                type="number"
                id="livingArea"
                name="livingArea"
                value={specificData.livingArea || ''}
                onChange={handleSpecificChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfRooms" className={styles.formLabel}>
                  Anzahl der Zimmer
                </label>
                <input
                  type="number"
                  id="numberOfRooms"
                  name="numberOfRooms"
                  value={specificData.numberOfRooms || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfBedrooms" className={styles.formLabel}>
                  Schlafzimmer
                </label>
                <input
                  type="number"
                  id="numberOfBedrooms"
                  name="numberOfBedrooms"
                  value={specificData.numberOfBedrooms || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfBathrooms" className={styles.formLabel}>
                  Badezimmer
                </label>
                <input
                  type="number"
                  id="numberOfBathrooms"
                  name="numberOfBathrooms"
                  value={specificData.numberOfBathrooms || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="yearBuilt" className={styles.formLabel}>
                  Baujahr
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={specificData.yearBuilt || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="yearRenovated" className={styles.formLabel}>
                  Jahr der Renovierung
                </label>
                <input
                  type="number"
                  id="yearRenovated"
                  name="yearRenovated"
                  value={specificData.yearRenovated || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="heatingType" className={styles.formLabel}>
                  Heizungsart
                </label>
                <input
                  type="text"
                  id="heatingType"
                  name="heatingType"
                  value={specificData.heatingType || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="energySource" className={styles.formLabel}>
                  Energiequelle
                </label>
                <input
                  type="text"
                  id="energySource"
                  name="energySource"
                  value={specificData.energySource || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label
                  htmlFor="energyEfficiencyClass"
                  className={styles.formLabel}
                >
                  Energieeffizienzklasse
                </label>
                <input
                  type="text"
                  id="energyEfficiencyClass"
                  name="energyEfficiencyClass"
                  value={specificData.energyEfficiencyClass || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalFeatures" className={styles.formLabel}>
                Zusätsliche Merkmale
              </label>
              <textarea
                id="additionalFeatures"
                name="additionalFeatures"
                value={specificData.additionalFeatures || ''}
                onChange={handleSpecificChange}
                rows={4}
                className={styles.formTextarea}
              />
            </div>
          </>
        );
      case ObjectType.HOUSE:
        return (
          <>
            <h3 className={styles.sectionTitle}>Wohngebäudedetails</h3>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.formLabel}>
                Haustyp
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={specificData.type || ''}
                onChange={handleSpecificChange}
                placeholder="Zum Beispiel ein Ferienhaus, ein Doppelhaus, ein Stadthaus"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numberOfFloors" className={styles.formLabel}>
                Anzahl der Stockwerke
              </label>
              <input
                type="number"
                id="numberOfFloors"
                name="numberOfFloors"
                value={specificData.numberOfFloors || ''}
                onChange={handleSpecificChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="livingArea" className={styles.formLabel}>
                  Wohnfläche (m²) *
                </label>
                <input
                  type="number"
                  id="livingArea"
                  name="livingArea"
                  value={specificData.livingArea || ''}
                  onChange={handleSpecificChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="usableArea" className={styles.formLabel}>
                  Nutzfläche (m²)
                </label>
                <input
                  type="number"
                  id="usableArea"
                  name="usableArea"
                  value={specificData.usableArea || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="plotArea" className={styles.formLabel}>
                  Grundstücksfläche (m²)
                </label>
                <input
                  type="number"
                  id="plotArea"
                  name="plotArea"
                  value={specificData.plotArea || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfRooms" className={styles.formLabel}>
                  Anzahl der Zimmer *
                </label>
                <input
                  type="number"
                  id="numberOfRooms"
                  name="numberOfRooms"
                  value={specificData.numberOfRooms || ''}
                  onChange={handleSpecificChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfBedrooms" className={styles.formLabel}>
                  Schlafzimmer
                </label>
                <input
                  type="number"
                  id="numberOfBedrooms"
                  name="numberOfBedrooms"
                  value={specificData.numberOfBedrooms || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numberOfBathrooms" className={styles.formLabel}>
                  Badezimmer
                </label>
                <input
                  type="number"
                  id="numberOfBathrooms"
                  name="numberOfBathrooms"
                  value={specificData.numberOfBathrooms || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="garageParkingSpaces" className={styles.formLabel}>
                Parkplätze
              </label>
              <input
                type="text"
                id="garageParkingSpaces"
                name="garageParkingSpaces"
                value={specificData.garageParkingSpaces || ''}
                onChange={handleSpecificChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="yearBuilt" className={styles.formLabel}>
                  Baujahr
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={specificData.yearBuilt || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="heatingType" className={styles.formLabel}>
                  Heizungsart
                </label>
                <input
                  type="text"
                  id="heatingType"
                  name="heatingType"
                  value={specificData.heatingType || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="energySource" className={styles.formLabel}>
                  Energiequelle
                </label>
                <input
                  type="text"
                  id="energySource"
                  name="energySource"
                  value={specificData.energySource || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label
                  htmlFor="energyEfficiencyClass"
                  className={styles.formLabel}
                >
                  Energieeffizienzklasse
                </label>
                <input
                  type="text"
                  id="energyEfficiencyClass"
                  name="energyEfficiencyClass"
                  value={specificData.energyEfficiencyClass || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalFeatures" className={styles.formLabel}>
                Zusätsliche Merkmale
              </label>
              <textarea
                id="additionalFeatures"
                name="additionalFeatures"
                value={specificData.additionalFeatures || ''}
                onChange={handleSpecificChange}
                rows={4}
                className={styles.formTextarea}
              />
            </div>
          </>
        );
      case ObjectType.LAND:
        return (
          <>
            <h3 className={styles.sectionTitle}>Grundstücksdaten</h3>
            <div className={styles.formGroup}>
              <label htmlFor="plotArea" className={styles.formLabel}>
                Grundstücksfläche (m²) *
              </label>
              <input
                type="number"
                id="plotArea"
                name="plotArea"
                value={specificData.plotArea || ''}
                onChange={handleSpecificChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label
                htmlFor="infrastructureConnection"
                className={styles.formLabel}
              >
                Technische Kommunikation
              </label>
              <input
                type="text"
                id="infrastructureConnection"
                name="infrastructureConnection"
                value={specificData.infrastructureConnection || ''}
                onChange={handleSpecificChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="buildingRegulations" className={styles.formLabel}>
                Bauvorschriften
              </label>
              <textarea
                id="buildingRegulations"
                name="buildingRegulations"
                value={specificData.buildingRegulations || ''}
                onChange={handleSpecificChange}
                rows={3}
                className={styles.formTextarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recommendedUsage" className={styles.formLabel}>
                Empfohlener Gebrauch
              </label>
              <textarea
                id="recommendedUsage"
                name="recommendedUsage"
                value={specificData.recommendedUsage || ''}
                onChange={handleSpecificChange}
                rows={3}
                className={styles.formTextarea}
              />
            </div>
          </>
        );
      case ObjectType.COMMERCIAL:
        return (
          <>
            <h3 className={styles.sectionTitle}>
              Daten zur gewerblichen oder nicht wohnlichen Immobilie
            </h3>
            <div className={styles.formGroup}>
              <label htmlFor="buildingType" className={styles.formLabel}>
                Gebäudetyp *
              </label>
              <input
                type="text"
                id="buildingType"
                name="buildingType"
                value={specificData.buildingType || ''}
                onChange={handleSpecificChange}
                required
                className={styles.formInput}
                placeholder="Zum Beispiel Bürogebäude, Lager, Geschäft"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="area" className={styles.formLabel}>
                  Fläche (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={specificData.area || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="yearBuilt" className={styles.formLabel}>
                  Baujahr
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={specificData.yearBuilt || ''}
                  onChange={handleSpecificChange}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="purpose" className={styles.formLabel}>
                Zweck
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={specificData.purpose || ''}
                onChange={handleSpecificChange}
                className={styles.formInput}
                placeholder="Zum Beispiel Handel, Produktion, Büros"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalFeatures" className={styles.formLabel}>
                Zusätsliche Merkmale
              </label>
              <textarea
                id="additionalFeatures"
                name="additionalFeatures"
                value={specificData.additionalFeatures || ''}
                onChange={handleSpecificChange}
                rows={4}
                className={styles.formTextarea}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.createObjectContainer}>
        <div className={styles.loading}>
          Objektdaten zur Bearbeitung laden...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createObjectContainer}>
      <h2 className={styles.title}>
        {isEditMode
          ? 'Bearbeiten des Immobilienobjekt'
          : 'Erstellen des Immobilienobjekt'}
      </h2>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && (
        <div className={styles.successMessage}>
          Objekt erfolgreich {isEditMode ? 'aktualisiert' : 'erstellt'}!
          Weiterleitung...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3 className={styles.sectionTitle}>Grundlegende Informationen</h3>

        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.formLabel}>
            Objekttyp *
          </label>
          <select
            id="type"
            name="type"
            value={objectData.type}
            onChange={handleObjectChange}
            required
            className={styles.formSelect}
          >
            <option value={ObjectType.APARTMENT}>Wohnung</option>
            <option value={ObjectType.HOUSE}>Wohnhaus</option>
            <option value={ObjectType.LAND}>Grundstück</option>
            <option value={ObjectType.COMMERCIAL}>
              Gewerbe-/Nichtwohnimmobilien
            </option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.formLabel}>
            Objectstatus
          </label>
          <select
            id="status"
            name="status"
            value={objectData.status}
            onChange={handleObjectChange}
            className={styles.formSelect}
          >
            <option value={ObjectStatus.ACTIVE}>aktiv</option>
            <option value={ObjectStatus.SOLD}>verkauft</option>
            <option value={ObjectStatus.ARCHIVED}>archiviert</option>
            <option value={ObjectStatus.RESERVED}>reserviert</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.formLabel}>
            Objektname *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={objectData.title}
            onChange={handleObjectChange}
            required
            className={styles.formInput}
            placeholder="Zum Beispiel: ein modernes Studio im Stadtzentrum"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>
            Beschreibung *
          </label>
          <textarea
            id="description"
            name="description"
            value={objectData.description}
            onChange={handleObjectChange}
            rows={4}
            required
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.formLabel}>
            Lage *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={objectData.location}
            onChange={handleObjectChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="address.country" className={styles.formLabel}>
              Land *
            </label>
            <input
              type="text"
              id="address.country"
              name="address.country"
              value={objectData.address.country}
              onChange={handleObjectChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="address.city" className={styles.formLabel}>
              Stadt *
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={objectData.address.city}
              onChange={handleObjectChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="address.zip" className={styles.formLabel}>
              Postleitzahl *
            </label>
            <input
              type="text"
              id="address.zip"
              name="address.zip"
              value={objectData.address.zip}
              onChange={handleObjectChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address.district" className={styles.formLabel}>
              Bezirk *
            </label>
            <input
              type="text"
              id="address.district"
              name="address.district"
              value={objectData.address.district}
              onChange={handleObjectChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="address.street" className={styles.formLabel}>
              Strasse *
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={objectData.address.street}
              onChange={handleObjectChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address.houseNumber" className={styles.formLabel}>
              Hausnummer
            </label>
            <input
              type="text"
              id="address.houseNumber"
              name="address.houseNumber"
              value={objectData.address.houseNumber}
              onChange={handleObjectChange}
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.formLabel}>
            Preis (€) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={objectData.price}
            onChange={handleObjectChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="features" className={styles.formLabel}>
            Besonderheiten des Objektes
          </label>
          <textarea
            id="features"
            name="features"
            value={objectData.features}
            onChange={handleObjectChange}
            rows={3}
            className={styles.formTextarea}
            placeholder="Merkmale, Vorteile und Annehmlichkeiten der Immobilie"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="miscellaneous" className={styles.formLabel}>
            Zusätzliche Information
          </label>
          <textarea
            id="miscellaneous"
            name="miscellaneous"
            value={objectData.miscellaneous}
            onChange={handleObjectChange}
            rows={3}
            className={styles.formTextarea}
            placeholder="Sonstige Informationen zum Objekt"
          />
        </div>

        {/* Rendering specific fields for the selected object type */}
        {renderSpecificFields()}

        <h3 className={styles.sectionTitle}>Bilder</h3>

        {/* Existing images (edit mode only) */}
        {isEditMode && existingImages.length > 0 && (
          <>
            <h4 className={styles.imageSection}>Aktuelle Bilder</h4>
            <div className={styles.imagePreviews}>
              {existingImages.map((imageUrl, index) => (
                <div
                  key={`existing-${index}`}
                  className={styles.imagePreviewItem}
                >
                  <img
                    src={imageUrl}
                    alt={`Vorhandenes Bild ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => removeExistingImage(index)}
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    className={styles.setMainImageBtn}
                    onClick={() => setMainExistingImage(index)}
                    title="Als Hauptbild festlegen"
                  >
                    ⭐
                  </button>
                  {index === 0 && (
                    <span className={styles.mainImageLabel}>Hauptbild</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* File drop area */}
<div
  ref={dropZoneRef}
  className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
  onDragEnter={handleDragEnter}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={handleDropZoneClick}
>
          <div className={styles.dropZoneContent}>
            <p>
              <span className={styles.dropZoneIcon}>📁</span>
              {isEditMode
                ? 'Neue Bilder hierher ziehen oder vom Computer auswählen'
                : 'Bilder hierher ziehen oder vom Computer auswählen'}
            </p>
<input
  ref={fileInputRef}
  type="file"
  onChange={handleFileChange}
  accept="image/jpeg,image/png,image/jpg,image/webp"
  multiple
  style={{ display: 'none' }}
/>
            <p className={styles.dropZoneHint}>
              {isEditMode
                ? 'Falls keine Bilder vorhanden sind, wird das erste neue Bild automatisch als Hauptbild verwendet.'
                : 'Das erste hochgeladene Bild ist das Hauptbild des Objekts.'}
            </p>
          </div>
        </div>

        {/* Preview of newly selected images */}
        {previews.length > 0 && (
          <>
            <h4 className={styles.imageSection}>
              {isEditMode ? 'Neue Bilder' : 'Ausgewählte Bilder'}
            </h4>
            <div className={styles.imagePreviews}>
              {previews.map((preview, index) => (
                <div key={`new-${index}`} className={styles.imagePreviewItem}>
                  <img
                    src={preview}
                    alt={`Vorschau ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    className={styles.setMainImageBtn}
                    onClick={() => setMainNewImage(index)}
                    title="Als Hauptbild festlegen"
                  >
                    ⭐
                  </button>
                  {index === 0 && existingImages.length === 0 && (
                    <span className={styles.mainImageLabel}>Главное</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {/* Video control section */}
        <VideoManager
          realEstateObjectId={id || 'new-object'}
          existingVideos={existingVideos}
          onVideosChange={setExistingVideos}
          isEditMode={isEditMode}
        />

        {/* Upload progress */}
        {loading && uploadProgress > 0 && (
          <div className={styles.uploadProgress}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span className={styles.progressPercentage}>{uploadProgress}%</span>
          </div>
        )}

        <div className={styles.formButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() =>
              navigate(isEditMode ? `/preview-object/${id}` : '/immobilien')
            }
            disabled={loading}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className={`${styles.submitButton} ${!isFormValid ? styles.submitButtonDisabled : ''}`}
            disabled={loading || !isFormValid}
          >
            {loading
              ? isEditMode
                ? 'Aktualisieren...'
                : 'Erstellen...'
              : isEditMode
                ? 'Objekt aktualisieren'
                : 'Objekt erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateObject;
