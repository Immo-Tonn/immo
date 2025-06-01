import { useEffect, useRef } from 'react';
import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import { usePropertysData } from '@shared/api/usePropertyData';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
import { fadeInOnScroll } from '@shared/anim/animations';

const RealEstate = () => {
  const { objectData, err, loading, images } = usePropertysData();
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);

  const getScroller = () => {
    const isMobile = window.innerWidth <= 765;
    const list = listRef.current;
    const isScrollable = list && list.scrollHeight > list.clientHeight;

    return isMobile || !isScrollable ? undefined : list;
  };

  useEffect(() => {
    const scroller = getScroller();
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          {
            x: i % 2 === 0 ? -100 : 100,
            y: i % 2 === 0 ? 0 : -50,
            scroller,
          },
        );
    });
  }, [objectData]);

  return (
    <>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && !err && objectData && (
        <section className={styles.container}>
          <h1 className={styles.title}>Immobilienangebote</h1>
          <ul className={styles.cardList} ref={listRef}>
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
