import React, { useEffect, useRef } from 'react';
import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import { usePropertysData } from '@shared/api/usePropertyData';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
import { fadeInOnScroll } from '@shared/anim/animations';

const RealEstate = () => {
  const { objectData, err, loading, images } = usePropertysData();
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 0 } : { x: 100, y: -50 },
        );
    });
  }, [objectData]);

  return (
    <>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && objectData && (
        <section className={styles.container}>
          <h1 className={styles.title}>Immobilienangebote</h1>
          <ul className={styles.cardList}>
            {objectData.map((obj, i) => (
              <PropertyCard
                key={obj._id}
                object={obj}
                images={images}
                ref={el => (refs.current[i] = el)}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default RealEstate;
