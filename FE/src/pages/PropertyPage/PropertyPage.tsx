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
  
  const { objectData, images, loading, err, videos, refreshData, isDeleted, markAsDeleted } = usePropertyData(id);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Checking admin authorization
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

    useEffect(() => {
    if (isDeleted) {
      console.log('Объект удален, показываем сообщение и редиректим через 3 секунды');
      const timer = setTimeout(() => {
        navigate('/immobilien');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDeleted, navigate]);

    // Edit handler (admin only)
  const handleEdit = () => {
    navigate(`/edit-object/${id}`);
  };

  // Forced data refresh function
  // const handleRefresh = async () => {
  //   setIsRefreshing(true);
  //   try {
  //     await refreshData();
  //     console.log('Данные обновлены вручную');
  //   } catch (error) {
  //     console.error('Ошибка при обновлении данных:', error);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

    // Delete handler (admin only)
  const handleDelete = async () => {
    if (!window.confirm('Wirklich löschen? Diese Aktion ist unwiderruflich.')) {
      return;
    }

    try {
      markAsDeleted();
      await axios.delete(`/objects/${id}`);
      
      // delete the object from confirmed
      const confirmedObjects = JSON.parse(sessionStorage.getItem('confirmedObjects') || '[]');
      const updatedConfirmed = confirmedObjects.filter((objId: string) => objId !== id);
      sessionStorage.setItem('confirmedObjects', JSON.stringify(updatedConfirmed));

      console.log('Объект успешно удален, -->> на /immobilien');
      
      // alert('Das Objekt ist erfolgreich gelöscht');
      navigate('/immobilien', {
        state: {
          message: 'Das Objekt wurde erfolgreich gelöscht',
          type:'success'
        }
      });
    } catch (err: any) {
      console.error('Error deleting object:', err);
      markAsDeleted();
      alert('Error deleting object: ' + (err.response?.data?.message || err.message));
    }
  };

    if (isDeleted) {
    return (
      <div className={styles.propertyPageContainer}>
        <div className={styles.deletedObjectMessage}>
          <h2>Objekt wurde gelöscht</h2>
          <p>Das angeforderte Objekt wurde erfolgreich gelöscht.</p>
          <p>Sie werden in wenigen Sekunden zur Objektübersicht weitergeleitet...</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/immobilien')}
          >
            Sofort zur Übersicht
          </button>
        </div>
      </div>
    );
  }

    if (loading) return <p>Laden...</p>;

      if (err && err.includes('nicht gefunden')) {
    return (
      <div className={styles.propertyPageContainer}>
        <div className={styles.notFoundMessage}>
          <h2>Objekt nicht gefunden</h2>
          <p>Das angeforderte Objekt konnte nicht gefunden werden.</p>
          <p>Möglicherweise wurde es gelöscht oder die URL ist ungültig.</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/immobilien')}
          >
            Zur Objektübersicht
          </button>
        </div>
      </div>
    );
  }

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
        </div>
      )}

          {/* Data refresh button */}
          {/* <button 
            className={styles.refreshButton} 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Aktualisieren...' : '🔄 Daten aktualisieren'}
          </button> */}
      

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
