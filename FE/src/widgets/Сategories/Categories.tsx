import { CategoriesData, CategoryItem } from './CategoriesData';
import styles from './Categories.module.css';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';

const Categories = () => {
  const refs = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 0 } : { x: 100, y: -50 },
        );
    });
  }, []);

  return (
    <section className={styles.categoriesSection}>
      <ul className={styles.categoriesList}>
        {CategoriesData.map((item: CategoryItem, i: number) => (
          <li
            key={item.id}
            className={styles.categoryItem}
            ref={el => (refs.current[i] = el)}
          >
            <NavLink to={item.link} className={styles.categoryLink}>
              <p
                className={styles.categoryTitle}
                style={item.id === 3 ? { color: '#160c20' } : {}}
              >
                {item.title}
              </p>
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.alt}
                  className={styles.categoryImage}
                />
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
