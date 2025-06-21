import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  DragEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ObjectType } from '../../../features/utils/types';
import {
  createCompleteRealEstateObject,
  updateCompleteRealEstateObject,
  fetchObjectForEdit,
} from '../../../features/utils/realEstateService';
import VideoManager from '@shared/ui/VideoManager/VideoManager';
import styles from './CreateObject.module.css';
import { updateImageOrder } from '../../../features/utils/realEstateService';
import Button from '@shared/ui/Button/Button';

interface ObjectData {
  type: ObjectType;
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
}
const CreateObject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditMode);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
  });

  const [specificData, setSpecificData] = useState<Record<string, any>>({});

  const validateRequiredFields = (): boolean => {
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

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    setIsFormValid(validateRequiredFields());
  }, [objectData, specificData]);

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

          setObjectData({
            type: loadedObjectData.type,
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
          });

          if (loadedSpecificData) {
            const { _id, realEstateObject, __v, ...cleanSpecificData } =
              loadedSpecificData;
            setSpecificData(cleanSpecificData);
          }

          setExistingImages(images || []);
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

  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

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

      if (!isEditMode) {
        setSpecificData({});
      }
    } else {
      setObjectData({
        ...objectData,
        [name]: value,
      } as ObjectData);
    }
  };

  const handleSpecificChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSpecificData({
      ...specificData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
  };

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

    if (error && error.includes('только файлы изображений')) {
      setError('');
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...imageFiles]);
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

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

  const removeExistingImage = (index: number) => {
    const confirmDelete = window.confirm(
      'Sind Sie sicher, dass Sie dieses Bild löschen möchten?',
    );
    if (!confirmDelete) return;

    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const setMainExistingImage = async (index: number) => {
    const newImages = [...existingImages];
    const mainImage = newImages.splice(index, 1)[0];

    if (mainImage) {
      newImages.unshift(mainImage);
      setExistingImages(newImages);

      if (isEditMode && id) {
        try {
          console.log('Сохраняем новый порядок изображений в БД:', newImages);
          await updateImageOrder(id, newImages);
          console.log('Порядок изображений успешно сохранен в БД');
        } catch (error) {
          console.error('Ошибка при сохранении порядка изображений:', error);
          setError('Ошибка при обновлении порядка изображений');

          setExistingImages(existingImages);
        }
      }
    }
  };

  const setMainNewImage = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];

    const mainFile = newFiles.splice(index, 1)[0];
    const mainPreview = newPreviews.splice(index, 1)[0];

    if (mainFile && mainPreview) {
      newFiles.unshift(mainFile);
      newPreviews.unshift(mainPreview);

      setSelectedFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isFormValid) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      setLoading(false);
      return;
    }

    try {
      const realEstateObjectData = {
        ...objectData,
        price: parseFloat(objectData.price),
        address: {
          ...objectData.address,
          zip: parseInt(objectData.address.zip),
        },
      };

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
        console.log('Обновляем объект с ID:', id);
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
        console.log('Create a new object');
        objectId = await createCompleteRealEstateObject(
          realEstateObjectData,
          processedSpecificData,
          selectedFiles,
          progress => setUploadProgress(progress),
        );
      }

      console.log('Operation completed successfully, objectId:', objectId);

      setSuccess(true);
      setTimeout(() => {
        navigate(
          `/preview-object/${objectId}?action=${isEditMode ? 'updated' : 'created'}`,
        );
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
                Haustyp *
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={specificData.type || ''}
                onChange={handleSpecificChange}
                placeholder="Например, коттедж, дуплекс, таунхаус"
                required
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
                placeholder="Например, офисное здание, склад, магазин"
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
        {renderSpecificFields()}

        <h3 className={styles.sectionTitle}>Bilder</h3>

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
                  <Button
                    className={styles.removeImageBtn}
                    onClick={() => removeExistingImage(index)}
                    initialText="✕"
                    clickedText="✕"
                  />

                  <button
                    type="button"
                    className={styles.setMainImageBtn}
                    onClick={() => setMainExistingImage(index)}
                    title="Als Hauptbild festlegen"
                  >
                    ⭐
                  </button>
                  {index === 0 && (
                    <span className={styles.mainImageLabel}>Главное</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div
          ref={dropZoneRef}
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.dropZoneContent}>
            <p>
              <span className={styles.dropZoneIcon}>📁</span>
              {isEditMode
                ? 'Neue Bilder hierher ziehen oder vom Computer auswählen'
                : 'Bilder hierher ziehen oder vom Computer auswählen'}
            </p>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,image/webp"
              multiple
              className={styles.fileInput}
            />
            <p className={styles.dropZoneHint}>
              {isEditMode
                ? 'Falls keine Bilder vorhanden sind, wird das erste neue Bild automatisch als Hauptbild verwendet.'
                : 'Das erste hochgeladene Bild ist das Hauptbild des Objekts.'}
            </p>
          </div>
        </div>

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
        <VideoManager
          realEstateObjectId={id || 'new-object'}
          existingVideos={existingVideos}
          onVideosChange={setExistingVideos}
          isEditMode={isEditMode}
        />

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
