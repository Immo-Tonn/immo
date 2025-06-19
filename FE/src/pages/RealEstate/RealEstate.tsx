// ./src/pages/RealEstate/RealEstate.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import { usePropertysData } from '@shared/api/usePropertyData';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
import { fadeInOnScroll } from '@shared/anim/animations';

const RealEstate = () => {
  const navigate = useNavigate();
  const { objectData, err, loading, images } = usePropertysData();
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Проверка авторизации администратора
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          {
            x: i % 2 === 0 ? -100 : 100,
            y: i % 2 === 0 ? 0 : -50,
          },
        );
    });
  }, [objectData]);

  // Обработчик создания нового объекта (только для админа)
  const handleCreateNew = () => {
    navigate('/create-object');
  };

  return (
    <>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && !err && (
        <section className={styles.container}>
          {/* Заголовок страницы с кнопкой для админа */}
          <div className={styles.pageHeader}>
            {/* Статистика для админа */}
            {isAdmin && objectData && (
              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{objectData.length}</span>
                  <span className={styles.statLabel}>
                    {objectData.length === 1 ? 'Objekt' : 'Objekte'} verfügbar
                  </span>
                </div>
              </div>
            )}
            <h1 className={styles.title}>Immobilienangebote</h1>
            {/* Кнопка создания объекта для админа */}
            {isAdmin && (
              <button className={styles.createButton} onClick={handleCreateNew}>
                + Objekt erstellen
              </button>
            )}
          </div>

          {/* Сетка объектов или сообщение об отсутствии */}
          {objectData && objectData.length > 0 ? (
            <ul className={styles.cardList} ref={listRef}>
              {objectData.map((obj, i) => (
                <PropertyCard
                  key={obj._id}
                  object={obj}
                  images={images}
                  ref={el => {
                    refs.current[i] = el;
                  }}
                  residentialHouse={obj.residentialHouses}
                />
              ))}
            </ul>
          ) : (
            !loading &&
            !err && (
              <div className={styles.noProperties}>
                <div className={styles.noPropertiesIcon}>🏠</div>
                <h3>Immobilien objekte nicht gefunden</h3>
                <p>
                  {isAdmin
                    ? 'Es wurden noch keine Immobilien erstellt. Erstellen Sie Ihre erste Immobilie!'
                    : 'Derzeit sind keine Immobilien verfügbar.'}
                </p>
                {isAdmin && (
                  <button
                    className={styles.createFirstButton}
                    onClick={handleCreateNew}
                  >
                    Создать первый объект
                  </button>
                )}
              </div>
            )
          )}

          {/*admin info section */}
          {isAdmin && objectData && objectData.length > 0 && (
            <div className={styles.adminInfo}>
              <h4>Informationen für Administratoren</h4>
              <p>Alle Nutzer sehen alle erstellten Objekte auf der Website.</p>
              <p>
                Um Objekte zu verwalten, verwenden Sie die Schaltflächen
                „Bearbeiten" und „Löschen" in der Detailansicht oder erstellen
                Sie ein neues Objekt über die Schaltfläche „+ Objekt erstellen".
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default RealEstate;

