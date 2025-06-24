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
import Button from '@shared/ui/Button/Button';

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { objectData, images, loading, err, videos, refreshData } =
    usePropertyData(id);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);
  const handleEdit = () => {
    navigate(`/edit-object/${id}`);
  };

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

  const handleDelete = async () => {
    if (!window.confirm('Wirklich löschen? Diese Aktion ist unwiderruflich.')) {
      return;
    }

    try {
      await axios.delete(`/objects/${id}`);
      const confirmedObjects = JSON.parse(
        localStorage.getItem('confirmedObjects') || '[]',
      );
      const updatedConfirmed = confirmedObjects.filter(
        (objId: string) => objId !== id,
      );
      localStorage.setItem(
        'confirmedObjects',
        JSON.stringify(updatedConfirmed),
      );

      alert('Das Objekt ist erfolgreich gelöscht');
      navigate('/immobilien');
    } catch (err: any) {
      console.error('Error deleting object:', err);
      alert(
        'Error deleting object: ' +
          (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <div className={styles.propertyPageContainer}>
      <LoadingErrorHandler loading={loading} error={err} />

      {isAdmin && (
        <div className={styles.adminActions}>
          <Button
            className={styles.editButton}
            initialText="Bearbeiten"
            clickedText="Im Prozess"
            onClick={handleEdit}
          />

          <Button
            className={styles.deleteButton}
            initialText="Löschen"
            clickedText="Im Prozess"
            onClick={handleDelete}
          />
        </div>
      )}

      {!loading && objectData && (
        <>
          <Button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isRefreshing}
            initialText="🔄 Daten aktualisieren"
            clickedText="Aktualisieren"
          />
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
