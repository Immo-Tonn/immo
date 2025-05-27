import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import { usePropertysData } from '@shared/api/usePropertyData';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';

const RealEstate = () => {
  const { objectData, err, loading, images } = usePropertysData();

  return (
    <>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && objectData && (
        <section className={styles.container}>
          <h1 className={styles.title}>Immobilienangebote</h1>
          <div className={styles.cardList}>
            {objectData.map(obj => (
              <PropertyCard key={obj._id} object={obj} images={images} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default RealEstate;
