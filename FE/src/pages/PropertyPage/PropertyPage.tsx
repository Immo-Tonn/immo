import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@features/utils/axiosConfig';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
import PropertyMap from '@widgets/PropertyMap/PropertyMap';
import { usePropertyData } from '@shared/api/usePropertyData';
import ContactForm from '@features/contact/ui/ContactForm';
import styles from './PropertyPage.module.css';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { objectData, images, loading, err, videos, refreshData } = usePropertyData(id);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Проверка авторизации администратора
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

    // Обработчик редактирования (только для админа)
  const handleEdit = () => {
    navigate(`/edit-object/${id}`);
  };

  // Функция принудительного обновления данных
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      console.log('Данные обновлены вручную');
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

    // Обработчик удаления (только для админа)
  const handleDelete = async () => {
    if (!window.confirm('Wirklich löschen? Diese Aktion ist unwiderruflich.')) {
      return;
    }

    try {
      await axios.delete(`/objects/${id}`);
      
      // Удаляем объект из подтвержденных
      const confirmedObjects = JSON.parse(sessionStorage.getItem('confirmedObjects') || '[]');
      const updatedConfirmed = confirmedObjects.filter((objId: string) => objId !== id);
      sessionStorage.setItem('confirmedObjects', JSON.stringify(updatedConfirmed));
      
      alert('Das Objekt ist erfolgreich gelöscht');
      navigate('/immobilien');
    } catch (err: any) {
      console.error('Error deleting object:', err);
      alert('Error deleting object: ' + (err.response?.data?.message || err.message));
    }
  };

    if (loading) return <p>Laden...</p>;
    if (!objectData) return <p>Objekt nicht gefunden</p>;

  return (
    <div className={styles.propertyPageContainer}>
      <LoadingErrorHandler loading={loading} error={err} />
      
      
      {/* Admin buttons */}
      {isAdmin && (
        <div className={styles.adminActions}>
          <button className={styles.editButton} onClick={handleEdit}>
            Bearbeiten
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Löschen
          </button>
          {/* Data refresh button
          <button 
            className={styles.refreshButton} 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Aktualisieren...' : '🔄 Daten aktualisieren'}
          </button> */}
        </div>
      )}

          {/* Data refresh button */}
          <button 
            className={styles.refreshButton} 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Aktualisieren...' : '🔄 Daten aktualisieren'}
          </button>
      

      {!loading && objectData && (
        <>
          <PropertyHero
            object={objectData}
            images={images}
            videos={videos}
            apartment={objectData.apartments}
            commercialBuilding={objectData.commercial_NonResidentialBuildings}
            landPlot={objectData.landPlots}
            residentialHouse={objectData.residentialHouses}
            isAdmin={isAdmin}
          />
          <PropertyDetails
            object={objectData}
            apartment={objectData.apartments}
            commercialBuilding={objectData.commercial_NonResidentialBuildings}
            landPlot={objectData.landPlots}
            residentialHouse={objectData.residentialHouses}
          />
          <PropertyMap address={objectData.address} />
          <ContactForm />
        </>
      )}
    </div>
  );
};

export default PropertyPage;
